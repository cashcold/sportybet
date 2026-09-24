import { SPORTS_CONFIG, SportApiConfig, getTTLForEndpoint } from './sportsConfig';
import { sportsCache } from './cacheManager';
import { Match } from '../../types';
import { INITIAL_MATCHES } from '../../data/mockData';

export function getSportsApiKey(): string {
  return (
    process.env.API_SPORTS_KEY ||
    process.env.API_FOOTBALL_KEY ||
    process.env.RAPIDAPI_KEY ||
    ''
  ).trim();
}

export class SportsService {
  /**
   * Generic call to external API-Sports with timeout, rate-limit header parsing,
   * error checking, and single-flight cached execution.
   */
  public async fetchSportEndpoint<T = any>(
    sportId: string,
    endpoint: string,
    params: Record<string, any> = {},
    customTTLSeconds?: number
  ): Promise<{ data: T; cached: boolean; stale: boolean; lastUpdated: string; cacheKey: string }> {
    const config = SPORTS_CONFIG[sportId.toLowerCase()] || SPORTS_CONFIG.football;
    const apiKey = getSportsApiKey();

    const fetcher = async (): Promise<T> => {
      if (!apiKey) {
        throw new Error(`API-Sports key not configured on backend. Set API_SPORTS_KEY or API_FOOTBALL_KEY in .env.`);
      }

      // Check if sport has reached daily or safety limit
      const check = sportsCache.canMakeRequest(config.id);
      if (!check.allowed) {
        throw new Error(check.reason || `Rate limit protection active for ${config.name}`);
      }

      const isRapidApi = apiKey.length > 40 && !apiKey.startsWith('v3.');
      const queryString = new URLSearchParams();
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          queryString.append(k, String(v));
        }
      });

      const cleanEndpoint = endpoint.replace(/^\/+/, '');
      const qs = queryString.toString();
      const pathWithQuery = qs ? `${cleanEndpoint}?${qs}` : cleanEndpoint;

      const url = isRapidApi
        ? `https://${config.host}/${pathWithQuery}`
        : `https://${config.host}/${pathWithQuery}`;

      const headers: Record<string, string> = isRapidApi
        ? {
            'x-rapidapi-key': apiKey,
            'x-rapidapi-host': config.host
          }
        : {
            'x-apisports-key': apiKey
          };

      // AbortController for 5.5s timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5500);

      try {
        const response = await fetch(url, {
          headers,
          signal: controller.signal
        });

        // Record any rate-limit headers from upstream API
        sportsCache.recordApiSportsHeaders(config.id, response.headers);

        if (!response.ok) {
          if (response.status === 429) {
            throw new Error(`API-Sports 429 Rate Limit exceeded on ${config.name}`);
          }
          throw new Error(`API-Sports HTTP error: ${response.status} ${response.statusText}`);
        }

        const json = await response.json();

        // Check if API-Sports returned error messages inside 200 payload
        if (json.errors) {
          if (Array.isArray(json.errors) && json.errors.length > 0) {
            throw new Error(`API-Sports Error: ${json.errors.join(', ')}`);
          } else if (typeof json.errors === 'object' && Object.keys(json.errors).length > 0) {
            const errStr = JSON.stringify(json.errors);
            if (errStr.includes('rate') || errStr.includes('Requests') || errStr.includes('limit')) {
              throw new Error(`API-Sports Quota Error: ${errStr}`);
            }
          }
        }

        return json;
      } catch (err: any) {
        if (err.name === 'AbortError') {
          throw new Error(`API-Sports request timed out for ${config.name} (${cleanEndpoint})`);
        }
        throw err;
      } finally {
        clearTimeout(timeoutId);
      }
    };

    return await sportsCache.executeWithCache<T>(
      config.id,
      endpoint,
      params,
      fetcher,
      customTTLSeconds
    );
  }

  /**
   * Status check for a sport or provider
   */
  public async getSportStatus(sportId: string = 'football') {
    const config = SPORTS_CONFIG[sportId.toLowerCase()] || SPORTS_CONFIG.football;
    const apiKey = getSportsApiKey();
    const stats = sportsCache.getOrCreateStats(config.id);

    if (!apiKey) {
      return {
        configured: false,
        sport: config.name,
        host: config.host,
        status: 'Unconfigured (Missing API_SPORTS_KEY)',
        requestsUsed: stats.requestsMade,
        dailyLimit: config.dailyLimit,
        remainingRequests: stats.remainingRequests,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        mode: 'demo_simulation'
      };
    }

    try {
      // Use cached status check (TTL 60s) to avoid consuming quota
      const result = await this.fetchSportEndpoint(config.id, 'status', {}, 60);
      const apiResp = (result.data as any)?.response || {};
      const requests = apiResp.requests || { current: stats.requestsMade, limit_day: config.dailyLimit };
      const account = apiResp.account || {};

      return {
        configured: true,
        sport: config.name,
        host: config.host,
        status: stats.status,
        provider: `API-Sports (${config.host})`,
        accountName: account.firstname ? `${account.firstname} ${account.lastname || ''}`.trim() : 'Active Subscriber',
        requestsUsed: requests.current ?? stats.requestsMade,
        dailyLimit: requests.limit_day ?? config.dailyLimit,
        remainingRequests: (requests.limit_day ?? config.dailyLimit) - (requests.current ?? stats.requestsMade),
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        cached: result.cached,
        stale: result.stale,
        lastUpdated: result.lastUpdated,
        mode: 'live_real_data'
      };
    } catch (err: any) {
      return {
        configured: true,
        sport: config.name,
        host: config.host,
        status: stats.status,
        provider: `API-Sports (${config.host})`,
        requestsUsed: stats.requestsMade,
        dailyLimit: config.dailyLimit,
        remainingRequests: stats.remainingRequests,
        cacheHits: stats.cacheHits,
        cacheMisses: stats.cacheMisses,
        mode: 'cached_fallback',
        error: err.message
      };
    }
  }

  /**
   * Get Live Matches for a specific sport (Live cache: 30–60s)
   */
  public async getLiveMatches(sportId: string = 'football'): Promise<{
    matches: Match[];
    cached: boolean;
    stale: boolean;
    lastUpdated: string;
    source: string;
  }> {
    const config = SPORTS_CONFIG[sportId.toLowerCase()] || SPORTS_CONFIG.football;
    const apiKey = getSportsApiKey();

    if (!apiKey) {
      const fallback = this.getCuratedMatches(config.id, 'live');
      return {
        matches: fallback,
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'curated_active'
      };
    }

    try {
      // 1. Fetch live fixtures (TTL: 60s)
      const liveResult = await this.fetchSportEndpoint(
        config.id,
        config.id === 'football' ? 'fixtures' : 'games',
        { live: 'all' },
        60 // 60s live TTL
      );

      const responseList = (liveResult.data as any)?.response || [];
      if (Array.isArray(responseList) && responseList.length > 0) {
        const matches = responseList.slice(0, 30).map((item: any) =>
          this.transformToMatch(item, config.id)
        );

        return {
          matches,
          cached: liveResult.cached,
          stale: liveResult.stale,
          lastUpdated: liveResult.lastUpdated,
          source: liveResult.stale ? 'api_sports_stale' : liveResult.cached ? 'api_sports_cache' : 'api_sports_live'
        };
      }

      // If no live matches right now on upstream API, serve curated live simulation so betting never freezes
      const fallback = this.getCuratedMatches(config.id, 'live');
      return {
        matches: fallback,
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'curated_active'
      };
    } catch (err: any) {
      console.warn(`[SportsService Live Error] ${config.name}:`, err.message);
      const isQuota = err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('request limit');
      const fallback = this.getCuratedMatches(config.id, 'live');
      return {
        matches: fallback,
        cached: true,
        stale: true,
        lastUpdated: new Date().toLocaleTimeString(),
        source: isQuota ? 'quota_protection_simulation' : 'error_fallback'
      };
    }
  }

  /**
   * Get upcoming fixtures with 15-minute (900s) cache
   */
  public async getUpcomingFixtures(
    sportId: string = 'football',
    params: { date?: string; league?: number | string; season?: number | string } = {}
  ): Promise<{
    matches: Match[];
    cached: boolean;
    stale: boolean;
    lastUpdated: string;
    source: string;
  }> {
    const config = SPORTS_CONFIG[sportId.toLowerCase()] || SPORTS_CONFIG.football;
    const apiKey = getSportsApiKey();

    if (!apiKey) {
      const fallback = this.getCuratedMatches(config.id, 'upcoming');
      return {
        matches: fallback,
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'curated_active'
      };
    }

    // Default to today's date in YYYY-MM-DD
    const today = new Date().toISOString().split('T')[0];
    const queryParams: Record<string, any> = {
      date: params.date || today,
      ...(params.league ? { league: params.league } : {}),
      ...(params.season ? { season: params.season } : {})
    };

    try {
      // 15-minute cache (900 seconds)
      const fixturesResult = await this.fetchSportEndpoint(
        config.id,
        config.id === 'football' ? 'fixtures' : 'games',
        queryParams,
        config.defaultFixtureTTL // 900 seconds
      );

      const responseList = (fixturesResult.data as any)?.response || [];
      if (Array.isArray(responseList) && responseList.length > 0) {
        const matches = responseList.slice(0, 35).map((item: any) =>
          this.transformToMatch(item, config.id)
        );

        return {
          matches,
          cached: fixturesResult.cached,
          stale: fixturesResult.stale,
          lastUpdated: fixturesResult.lastUpdated,
          source: fixturesResult.stale
            ? 'api_sports_stale'
            : fixturesResult.cached
            ? 'api_sports_cache'
            : 'api_sports_fresh'
        };
      }

      const fallback = this.getCuratedMatches(config.id, 'upcoming');
      return {
        matches: fallback,
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'curated_active'
      };
    } catch (err: any) {
      console.warn(`[SportsService Fixtures Error] ${config.name}:`, err.message);
      const isQuota = err.message?.toLowerCase().includes('quota') || err.message?.toLowerCase().includes('request limit');
      const fallback = this.getCuratedMatches(config.id, 'upcoming');
      return {
        matches: fallback,
        cached: true,
        stale: true,
        lastUpdated: new Date().toLocaleTimeString(),
        source: isQuota ? 'quota_protection_simulation' : 'error_fallback'
      };
    }
  }

  /**
   * Helper to normalize various API-Sports entities (football, basketball, etc.) into Match interface
   */
  private transformToMatch(item: any, sportId: string): Match {
    const fixture = item.fixture || item.game || item || {};
    const league = item.league || {};
    const teams = item.teams || {};
    const goals = item.goals || item.scores || {};
    const status = fixture.status || {};

    const homeName = teams.home?.name || 'Home Team';
    const awayName = teams.away?.name || 'Away Team';

    const parseScore = (val: any): number => {
      if (val === null || val === undefined) return 0;
      if (typeof val === 'number') return isNaN(val) ? 0 : val;
      if (typeof val === 'string') {
        const num = parseInt(val, 10);
        return isNaN(num) ? 0 : num;
      }
      if (typeof val === 'object') {
        if (typeof val.total === 'number') return val.total;
        if (typeof val.score === 'number') return val.score;
        if (typeof val.current === 'number') return val.current;
        if (typeof val.total === 'string') {
          const num = parseInt(val.total, 10);
          return isNaN(num) ? 0 : num;
        }
      }
      return 0;
    };

    const homeScore = parseScore(goals.home);
    const awayScore = parseScore(goals.away);
    const elapsed = status.elapsed || 1;
    const diff = homeScore - awayScore;

    // Determine if live
    const shortStatus = (status.short || '').toUpperCase();
    const isLive = ['1H', '2H', 'HT', 'ET', 'P', 'LIVE', 'Q1', 'Q2', 'Q3', 'Q4', 'OT'].includes(shortStatus);

    // Realistic market odds estimation
    let homeOdd = 2.15;
    let drawOdd = 3.20;
    let awayOdd = 3.10;

    if (diff > 0) {
      homeOdd = Math.max(1.05, parseFloat((1.35 - (elapsed / 200) * 0.25).toFixed(2)));
      drawOdd = parseFloat((3.8 + diff * 1.4).toFixed(2));
      awayOdd = parseFloat((6.5 + diff * 2.8).toFixed(2));
    } else if (diff < 0) {
      awayOdd = Math.max(1.05, parseFloat((1.35 - (elapsed / 200) * 0.25).toFixed(2)));
      drawOdd = parseFloat((3.8 + Math.abs(diff) * 1.4).toFixed(2));
      homeOdd = parseFloat((6.5 + Math.abs(diff) * 2.8).toFixed(2));
    }

    const fid = fixture.id || Math.floor(Math.random() * 900000 + 100000);
    const totalGoals = homeScore + awayScore;

    // Appropriate over/under line per sport
    let ouLine: number;
    if (sportId === 'basketball' || sportId === 'nba') {
      ouLine = totalGoals > 0 ? totalGoals + 0.5 : 218.5;
    } else if (sportId === 'baseball') {
      ouLine = totalGoals > 0 ? totalGoals + 0.5 : 8.5;
    } else if (sportId === 'hockey') {
      ouLine = totalGoals > 0 ? totalGoals + 0.5 : 5.5;
    } else if (sportId === 'american-football' || sportId === 'nfl') {
      ouLine = totalGoals > 0 ? totalGoals + 0.5 : 44.5;
    } else {
      ouLine = totalGoals > 0 ? totalGoals + 0.5 : 2.5;
    }

    let formattedStartTime = '18:00';
    let fixtureDateStr: string | undefined;
    let fixtureDateLabel: string | undefined;

    if (isLive) {
      formattedStartTime = 'Live';
      fixtureDateStr = new Date().toISOString().split('T')[0];
      fixtureDateLabel = 'Today 24/09';
    } else if (fixture.date) {
      const d = new Date(fixture.date);
      if (!isNaN(d.getTime())) {
        formattedStartTime = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        fixtureDateStr = d.toISOString().split('T')[0];
        const weekday = d.toLocaleDateString('en-GB', { weekday: 'long' });
        const dayMonth = d.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
        fixtureDateLabel = `${weekday} ${dayMonth}`;
      }
    }

    return {
      id: `${sportId}-${fid}`,
      gameId: String(fid).slice(-5),
      sport: sportId,
      league: league.name || (sportId === 'nba' ? 'NBA' : 'Major League'),
      countryOrCategory: league.country || 'International',
      homeTeam: homeName,
      awayTeam: awayName,
      homeScore: isLive ? homeScore : undefined,
      awayScore: isLive ? awayScore : undefined,
      period: shortStatus || (isLive ? '1H' : 'FT'),
      minute: isLive ? `${elapsed}' ${shortStatus || 'LIVE'}` : undefined,
      isLive,
      startTime: formattedStartTime,
      date: fixtureDateStr,
      dateLabel: fixtureDateLabel,
      isHot: diff === 0 || elapsed > 75,
      hasLiveStream: fid % 2 === 0,
      marketsCount: 45 + (fid % 40),
      markets: {
        '1X2': [
          { id: `o-${fid}-1`, name: '1', value: homeOdd, trend: 'same' },
          { id: `o-${fid}-X`, name: 'X', value: drawOdd, trend: 'same' },
          { id: `o-${fid}-2`, name: '2', value: awayOdd, trend: 'same' }
        ],
        'O/U': [
          { id: `o-${fid}-over`, name: `Over ${ouLine}`, value: 1.85, trend: 'same' },
          { id: `o-${fid}-under`, name: `Under ${ouLine}`, value: 1.95, trend: 'same' }
        ],
        'DC': [
          { id: `o-${fid}-1x`, name: '1X', value: parseFloat((homeOdd / 1.65).toFixed(2)) || 1.18, trend: 'same' },
          { id: `o-${fid}-12`, name: '12', value: 1.28, trend: 'same' },
          { id: `o-${fid}-x2`, name: 'X2', value: parseFloat((awayOdd / 1.65).toFixed(2)) || 1.55, trend: 'same' }
        ]
      }
    };
  }

  /**
   * Curated high-profile modern matches for fallback/simulation when API quota is exhausted
   */
  public getCuratedMatches(sportId: string, type: 'live' | 'upcoming'): Match[] {
    const s = sportId.toLowerCase();
    const targetSport = s === 'nba' ? 'basketball' : s;

    const matches = INITIAL_MATCHES.filter(m => {
      const matchSport = (m.sport || '').toLowerCase();
      const sportMatches =
        targetSport === 'football'
          ? matchSport === 'football'
          : targetSport === 'basketball'
          ? matchSport === 'basketball'
          : matchSport === targetSport;

      return type === 'live' ? m.isLive && sportMatches : !m.isLive && sportMatches;
    });

    return JSON.parse(JSON.stringify(matches));
  }

  private _legacyGetCuratedMatches(sportId: string, type: 'live' | 'upcoming'): Match[] {
    const sport = sportId.toLowerCase();

    if (sport === 'football') {
      if (type === 'live') {
        return [
          {
            id: 'football-cur-1',
            gameId: '84920',
            sport: 'football',
            league: 'Premier League',
            countryOrCategory: 'England',
            homeTeam: 'Arsenal FC',
            awayTeam: 'Manchester City',
            homeScore: 1,
            awayScore: 1,
            minute: "68' 2H",
            period: '2H',
            isLive: true,
            isHot: true,
            hasLiveStream: true,
            marketsCount: 142,
            markets: {
              '1X2': [
                { id: 'f1-1', name: '1', value: 2.85, trend: 'same' },
                { id: 'f1-X', name: 'X', value: 2.30, trend: 'same' },
                { id: 'f1-2', name: '2', value: 3.10, trend: 'up' }
              ],
              'O/U': [
                { id: 'f1-o2.5', name: 'Over 2.5', value: 1.88, trend: 'same' },
                { id: 'f1-u2.5', name: 'Under 2.5', value: 1.92, trend: 'same' }
              ],
              'DC': [
                { id: 'f1-1x', name: '1X', value: 1.35, trend: 'same' },
                { id: 'f1-12', name: '12', value: 1.45, trend: 'same' },
                { id: 'f1-x2', name: 'X2', value: 1.40, trend: 'same' }
              ]
            }
          },
          {
            id: 'football-cur-2',
            gameId: '91832',
            sport: 'football',
            league: 'UEFA Champions League',
            countryOrCategory: 'Europe',
            homeTeam: 'Real Madrid',
            awayTeam: 'Bayern Munich',
            homeScore: 2,
            awayScore: 1,
            minute: "74' 2H",
            period: '2H',
            isLive: true,
            isHot: true,
            hasLiveStream: true,
            marketsCount: 156,
            markets: {
              '1X2': [
                { id: 'f2-1', name: '1', value: 1.25, trend: 'same' },
                { id: 'f2-X', name: 'X', value: 4.80, trend: 'same' },
                { id: 'f2-2', name: '2', value: 11.50, trend: 'down' }
              ],
              'O/U': [
                { id: 'f2-o3.5', name: 'Over 3.5', value: 1.95, trend: 'same' },
                { id: 'f2-u3.5', name: 'Under 3.5', value: 1.80, trend: 'same' }
              ],
              'DC': [
                { id: 'f2-1x', name: '1X', value: 1.05, trend: 'same' },
                { id: 'f2-12', name: '12', value: 1.15, trend: 'same' },
                { id: 'f2-x2', name: 'X2', value: 3.60, trend: 'down' }
              ]
            }
          },
          {
            id: 'football-cur-3',
            gameId: '73910',
            sport: 'football',
            league: 'La Liga',
            countryOrCategory: 'Spain',
            homeTeam: 'Barcelona',
            awayTeam: 'Atletico Madrid',
            homeScore: 0,
            awayScore: 0,
            minute: "32' 1H",
            period: '1H',
            isLive: true,
            isHot: true,
            hasLiveStream: false,
            marketsCount: 118,
            markets: {
              '1X2': [
                { id: 'f3-1', name: '1', value: 2.10, trend: 'same' },
                { id: 'f3-X', name: 'X', value: 3.10, trend: 'same' },
                { id: 'f3-2', name: '2', value: 3.60, trend: 'same' }
              ],
              'O/U': [
                { id: 'f3-o2.5', name: 'Over 2.5', value: 1.90, trend: 'same' },
                { id: 'f3-u2.5', name: 'Under 2.5', value: 1.85, trend: 'same' }
              ],
              'DC': [
                { id: 'f3-1x', name: '1X', value: 1.28, trend: 'same' },
                { id: 'f3-12', name: '12', value: 1.34, trend: 'same' },
                { id: 'f3-x2', name: 'X2', value: 1.68, trend: 'same' }
              ]
            }
          },
          {
            id: 'football-cur-4',
            gameId: '62841',
            sport: 'football',
            league: 'Serie A',
            countryOrCategory: 'Italy',
            homeTeam: 'Inter Milan',
            awayTeam: 'Juventus',
            homeScore: 1,
            awayScore: 0,
            minute: "54' 2H",
            period: '2H',
            isLive: true,
            isHot: false,
            hasLiveStream: true,
            marketsCount: 124,
            markets: {
              '1X2': [
                { id: 'f4-1', name: '1', value: 1.45, trend: 'same' },
                { id: 'f4-X', name: 'X', value: 3.80, trend: 'same' },
                { id: 'f4-2', name: '2', value: 7.20, trend: 'same' }
              ],
              'O/U': [
                { id: 'f4-o1.5', name: 'Over 1.5', value: 1.40, trend: 'same' },
                { id: 'f4-u1.5', name: 'Under 1.5', value: 2.70, trend: 'same' }
              ],
              'DC': [
                { id: 'f4-1x', name: '1X', value: 1.10, trend: 'same' },
                { id: 'f4-12', name: '12', value: 1.22, trend: 'same' },
                { id: 'f4-x2', name: 'X2', value: 2.60, trend: 'same' }
              ]
            }
          }
        ];
      } else {
        return [
          {
            id: 'football-up-1',
            gameId: '10928',
            sport: 'football',
            league: 'Premier League',
            countryOrCategory: 'England',
            homeTeam: 'Liverpool FC',
            awayTeam: 'Chelsea FC',
            startTime: '18:30',
            isLive: false,
            isHot: true,
            marketsCount: 220,
            markets: {
              '1X2': [
                { id: 'fu1-1', name: '1', value: 1.72 },
                { id: 'fu1-X', name: 'X', value: 3.90 },
                { id: 'fu1-2', name: '2', value: 4.60 }
              ],
              'O/U': [
                { id: 'fu1-o2.5', name: 'Over 2.5', value: 1.65 },
                { id: 'fu1-u2.5', name: 'Under 2.5', value: 2.20 }
              ],
              'DC': [
                { id: 'fu1-1x', name: '1X', value: 1.20 },
                { id: 'fu1-12', name: '12', value: 1.25 },
                { id: 'fu1-x2', name: 'X2', value: 2.05 }
              ]
            }
          },
          {
            id: 'football-up-2',
            gameId: '21938',
            sport: 'football',
            league: 'Premier League',
            countryOrCategory: 'England',
            homeTeam: 'Manchester United',
            awayTeam: 'Tottenham Hotspur',
            startTime: '20:00',
            isLive: false,
            isHot: true,
            marketsCount: 210,
            markets: {
              '1X2': [
                { id: 'fu2-1', name: '1', value: 2.15 },
                { id: 'fu2-X', name: 'X', value: 3.60 },
                { id: 'fu2-2', name: '2', value: 3.20 }
              ],
              'O/U': [
                { id: 'fu2-o2.5', name: 'Over 2.5', value: 1.60 },
                { id: 'fu2-u2.5', name: 'Under 2.5', value: 2.30 }
              ],
              'DC': [
                { id: 'fu2-1x', name: '1X', value: 1.33 },
                { id: 'fu2-12', name: '12', value: 1.28 },
                { id: 'fu2-x2', name: 'X2', value: 1.68 }
              ]
            }
          },
          {
            id: 'football-up-3',
            gameId: '32948',
            sport: 'football',
            league: 'Premier League',
            countryOrCategory: 'England',
            homeTeam: 'Aston Villa',
            awayTeam: 'Newcastle United',
            startTime: '20:45',
            isLive: false,
            isHot: true,
            marketsCount: 198,
            markets: {
              '1X2': [
                { id: 'fu3-1', name: '1', value: 2.05 },
                { id: 'fu3-X', name: 'X', value: 3.50 },
                { id: 'fu3-2', name: '2', value: 3.50 }
              ],
              'O/U': [
                { id: 'fu3-o2.5', name: 'Over 2.5', value: 1.70 },
                { id: 'fu3-u2.5', name: 'Under 2.5', value: 2.10 }
              ],
              'DC': [
                { id: 'fu3-1x', name: '1X', value: 1.29 },
                { id: 'fu3-12', name: '12', value: 1.30 },
                { id: 'fu3-x2', name: 'X2', value: 1.74 }
              ]
            }
          },
          {
            id: 'football-up-4',
            gameId: '43958',
            sport: 'football',
            league: 'UEFA Champions League',
            countryOrCategory: 'Europe',
            homeTeam: 'Paris Saint-Germain',
            awayTeam: 'AC Milan',
            startTime: '20:00',
            isLive: false,
            isHot: true,
            marketsCount: 240,
            markets: {
              '1X2': [
                { id: 'fu4-1', name: '1', value: 1.65 },
                { id: 'fu4-X', name: 'X', value: 4.10 },
                { id: 'fu4-2', name: '2', value: 4.80 }
              ],
              'O/U': [
                { id: 'fu4-o2.5', name: 'Over 2.5', value: 1.62 },
                { id: 'fu4-u2.5', name: 'Under 2.5', value: 2.25 }
              ],
              'DC': [
                { id: 'fu4-1x', name: '1X', value: 1.18 },
                { id: 'fu4-12', name: '12', value: 1.23 },
                { id: 'fu4-x2', name: 'X2', value: 2.18 }
              ]
            }
          },
          {
            id: 'football-up-5',
            gameId: '54968',
            sport: 'football',
            league: 'La Liga',
            countryOrCategory: 'Spain',
            homeTeam: 'Sevilla FC',
            awayTeam: 'Athletic Bilbao',
            startTime: '19:00',
            isLive: false,
            isHot: false,
            marketsCount: 185,
            markets: {
              '1X2': [
                { id: 'fu5-1', name: '1', value: 2.45 },
                { id: 'fu5-X', name: 'X', value: 3.20 },
                { id: 'fu5-2', name: '2', value: 3.00 }
              ],
              'O/U': [
                { id: 'fu5-o2.5', name: 'Over 2.5', value: 2.10 },
                { id: 'fu5-u2.5', name: 'Under 2.5', value: 1.70 }
              ],
              'DC': [
                { id: 'fu5-1x', name: '1X', value: 1.38 },
                { id: 'fu5-12', name: '12', value: 1.34 },
                { id: 'fu5-x2', name: 'X2', value: 1.54 }
              ]
            }
          },
          {
            id: 'football-up-6',
            gameId: '65978',
            sport: 'football',
            league: 'Serie A',
            countryOrCategory: 'Italy',
            homeTeam: 'Napoli',
            awayTeam: 'AS Roma',
            startTime: '19:45',
            isLive: false,
            isHot: true,
            marketsCount: 195,
            markets: {
              '1X2': [
                { id: 'fu6-1', name: '1', value: 1.95 },
                { id: 'fu6-X', name: 'X', value: 3.40 },
                { id: 'fu6-2', name: '2', value: 3.90 }
              ],
              'O/U': [
                { id: 'fu6-o2.5', name: 'Over 2.5', value: 1.85 },
                { id: 'fu6-u2.5', name: 'Under 2.5', value: 1.95 }
              ],
              'DC': [
                { id: 'fu6-1x', name: '1X', value: 1.25 },
                { id: 'fu6-12', name: '12', value: 1.30 },
                { id: 'fu6-x2', name: 'X2', value: 1.82 }
              ]
            }
          }
        ];
      }
    }

    if (sport === 'basketball' || sport === 'nba') {
      if (type === 'live') {
        return [
          {
            id: 'nba-cur-1',
            gameId: '77218',
            sport: 'basketball',
            league: 'NBA',
            countryOrCategory: 'USA',
            homeTeam: 'Boston Celtics',
            awayTeam: 'LA Lakers',
            homeScore: 84,
            awayScore: 81,
            minute: '7:42 Q3',
            period: 'Q3',
            isLive: true,
            isHot: true,
            hasLiveStream: true,
            marketsCount: 78,
            markets: {
              '1X2': [
                { id: 'b1-1', name: '1', value: 1.55, trend: 'same' },
                { id: 'b1-x', name: 'X', value: 14.00, trend: 'same' },
                { id: 'b1-2', name: '2', value: 2.45, trend: 'up' }
              ],
              'O/U': [
                { id: 'b1-o', name: 'Over 216.5', value: 1.85, trend: 'same' },
                { id: 'b1-u', name: 'Under 216.5', value: 1.95, trend: 'same' }
              ],
              'DC': [
                { id: 'b1-1x', name: '1X', value: 1.35, trend: 'same' },
                { id: 'b1-12', name: '12', value: 1.05, trend: 'same' },
                { id: 'b1-x2', name: 'X2', value: 1.95, trend: 'same' }
              ]
            }
          }
        ];
      } else {
        return [
          {
            id: 'nba-up-1',
            gameId: '77219',
            sport: 'basketball',
            league: 'NBA',
            countryOrCategory: 'USA',
            homeTeam: 'Golden State Warriors',
            awayTeam: 'Milwaukee Bucks',
            startTime: '23:30',
            isLive: false,
            isHot: true,
            marketsCount: 85,
            markets: {
              '1X2': [
                { id: 'bu1-1', name: '1', value: 1.80 },
                { id: 'bu1-X', name: 'X', value: 15.00 },
                { id: 'bu1-2', name: '2', value: 2.05 }
              ],
              'O/U': [
                { id: 'bu1-o', name: 'Over 224.5', value: 1.88 },
                { id: 'bu1-u', name: 'Under 224.5', value: 1.92 }
              ],
              'DC': [
                { id: 'bu1-1x', name: '1X', value: 1.50 },
                { id: 'bu1-12', name: '12', value: 1.05 },
                { id: 'bu1-x2', name: 'X2', value: 1.70 }
              ]
            }
          }
        ];
      }
    }

    return [];
  }
}

export const sportsService = new SportsService();
