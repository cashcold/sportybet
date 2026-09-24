import { SPORTS_CONFIG, SportApiConfig, getTTLForEndpoint } from './sportsConfig';
import { sportsCache } from './cacheManager';
import { Match } from '../../types';

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
      return {
        matches: [],
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'unconfigured'
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
      if (!Array.isArray(responseList) || responseList.length === 0) {
        return {
          matches: [],
          cached: liveResult.cached,
          stale: liveResult.stale,
          lastUpdated: liveResult.lastUpdated,
          source: 'api_sports'
        };
      }

      // Transform raw response to standard SportyBet Match interface
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
    } catch (err: any) {
      console.warn(`[SportsService Live Error] ${config.name}:`, err.message);
      return {
        matches: [],
        cached: true,
        stale: true,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'error_fallback'
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
      return {
        matches: [],
        cached: true,
        stale: false,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'unconfigured'
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
      const matches = (Array.isArray(responseList) ? responseList : []).slice(0, 35).map((item: any) =>
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
    } catch (err: any) {
      console.warn(`[SportsService Fixtures Error] ${config.name}:`, err.message);
      return {
        matches: [],
        cached: true,
        stale: true,
        lastUpdated: new Date().toLocaleTimeString(),
        source: 'error_fallback'
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
    const homeScore = typeof goals.home?.total === 'number' ? goals.home.total : (goals.home ?? 0);
    const awayScore = typeof goals.away?.total === 'number' ? goals.away.total : (goals.away ?? 0);
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
    const ouLine = totalGoals + 0.5;

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
      period: shortStatus || 'FT',
      minute: isLive ? `${elapsed}' ${shortStatus}` : undefined,
      isLive,
      startTime: isLive ? 'Live' : (fixture.date ? new Date(fixture.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:00'),
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
}

export const sportsService = new SportsService();
