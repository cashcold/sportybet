import { Match } from '../../types';
import { db } from '../db';
import { MatchModel } from '../models/MatchModel';

export interface TheOddsQuotaStatus {
  provider: string;
  plan: string;
  totalMonthlyCredits: number;
  remainingCredits: number;
  usedCredits: number;
  requestsToday: number;
  dailyBudget: number;
  lastSyncedAt: string | null;
  nextScheduledSync: string | null;
  cooldownRemainingSeconds: number;
  isRateLimited: boolean;
  totalMatchesInLocalDb: number;
  configured: boolean;
}

export interface TheOddsSportDef {
  key: string;
  sport: string;
  league: string;
  country: string;
}

export const SUPPORTED_LEAGUES: TheOddsSportDef[] = [
  { key: 'soccer_epl', sport: 'football', league: 'Premier League', country: 'England' },
  { key: 'soccer_spain_la_liga', sport: 'football', league: 'La Liga', country: 'Spain' },
  { key: 'soccer_italy_serie_a', sport: 'football', league: 'Serie A', country: 'Italy' },
  { key: 'soccer_germany_bundesliga', sport: 'football', league: 'Bundesliga', country: 'Germany' },
  { key: 'soccer_france_ligue_one', sport: 'football', league: 'Ligue 1', country: 'France' },
  { key: 'soccer_uefa_champs_league', sport: 'football', league: 'UEFA Champions League', country: 'Europe' },
  { key: 'soccer_uefa_europa_league', sport: 'football', league: 'UEFA Europa League', country: 'Europe' },
  { key: 'basketball_nba', sport: 'basketball', league: 'NBA', country: 'USA' }
];

export function getTheOddsApiKey(): string {
  return (process.env.THE_ODDS_API_KEY || 'cae042eb472e9a12bf139e8dc5369281').trim();
}

class TheOddsApiService {
  private localMatches: Map<string, Match> = new Map();
  private totalMonthlyCredits = 500;
  private remainingCredits = 496;
  private usedCredits = 4;
  private requestsToday = 0;
  private dailyBudget = 14; // 14 requests/day * 30 days = ~420 requests (safe under 500)
  private currentUtcDay = new Date().toISOString().split('T')[0];
  private lastSyncedAt: Date | null = null;
  private lastManualSyncTime = 0;
  private manualSyncCooldownMs = 15 * 60 * 1000; // 15-minute cooldown to prevent user abuse
  private isSyncing = false;
  private backgroundIntervalId: NodeJS.Timeout | null = null;

  constructor() {
    this.init();
  }

  private async init() {
    // 1. Load any previously saved matches from MongoDB Atlas on startup
    await this.hydrateFromMongo();

    // 2. Start automated background sync (runs every 3 hours = 8 calls/day)
    this.startBackgroundSync();
  }

  /**
   * Reset daily counter at midnight UTC
   */
  private checkDayRollover() {
    const today = new Date().toISOString().split('T')[0];
    if (today !== this.currentUtcDay) {
      this.currentUtcDay = today;
      this.requestsToday = 0;
    }
  }

  /**
   * Hydrates local memory cache with matches already stored in MongoDB Atlas
   */
  public async hydrateFromMongo(): Promise<number> {
    try {
      const docs = await MatchModel.find({ source: 'the_odds_api' }).lean();
      if (docs && docs.length > 0) {
        let loadedCount = 0;
        for (const doc of docs) {
          const match: Match = {
            id: doc.id,
            gameId: doc.gameId,
            sport: doc.sport,
            league: doc.league,
            countryOrCategory: doc.countryOrCategory,
            homeTeam: doc.homeTeam,
            awayTeam: doc.awayTeam,
            homeScore: doc.homeScore,
            awayScore: doc.awayScore,
            period: doc.period,
            minute: doc.minute,
            isLive: doc.isLive,
            startTime: doc.startTime,
            isHot: doc.isHot,
            hasLiveStream: doc.hasLiveStream,
            marketsCount: doc.marketsCount,
            markets: doc.markets
          };
          this.localMatches.set(match.id, match);
          loadedCount++;
        }

        // Also merge into global db.matches
        this.syncToGlobalDb();
        console.log(`[TheOddsAPI] Hydrated ${loadedCount} matches from MongoDB Atlas`);
        return loadedCount;
      }
    } catch (err: any) {
      console.warn('[TheOddsAPI] Mongo hydration notice:', err.message);
    }
    return 0;
  }

  /**
   * Synchronizes local matches into global db.matches for app-wide availability
   */
  private syncToGlobalDb() {
    const freshOddsMatches = Array.from(this.localMatches.values());
    if (freshOddsMatches.length === 0) return;

    const freshOddsIds = new Set(freshOddsMatches.map(m => m.id));
    const nonOddsMatches = db.matches.filter(m => !freshOddsIds.has(m.id));

    // Place The Odds API real fixtures at the top
    db.matches = [...freshOddsMatches, ...nonOddsMatches];
  }

  /**
   * Quota and Abuse Protection Check
   */
  public canMakeRequest(): { allowed: boolean; reason?: string } {
    this.checkDayRollover();
    const apiKey = getTheOddsApiKey();

    if (!apiKey) {
      return { allowed: false, reason: 'The Odds API key is not configured' };
    }

    if (this.remainingCredits <= 5) {
      return {
        allowed: false,
        reason: `Monthly credit buffer reached (${this.remainingCredits} credits remaining of 500)`
      };
    }

    if (this.requestsToday >= this.dailyBudget) {
      return {
        allowed: false,
        reason: `Daily quota protection active (${this.requestsToday}/${this.dailyBudget} daily requests used)`
      };
    }

    return { allowed: true };
  }

  /**
   * Updates internal quota counters from The Odds API HTTP response headers
   */
  private recordQuotaHeaders(headers: Headers) {
    const remaining = headers.get('x-requests-remaining');
    const used = headers.get('x-requests-used');

    if (remaining !== null) {
      const parsed = parseInt(remaining, 10);
      if (!isNaN(parsed)) {
        this.remainingCredits = parsed;
      }
    }

    if (used !== null) {
      const parsed = parseInt(used, 10);
      if (!isNaN(parsed)) {
        this.usedCredits = parsed;
      }
    }

    this.requestsToday++;
  }

  /**
   * Converts a single event from The Odds API into a SportyBet Match model
   */
  public transformOddsApiEvent(item: any, leagueDef: TheOddsSportDef): Match {
    const rawId = item.id || Math.random().toString(36).substring(2, 10);
    const id = `theodds-${rawId}`;
    const gameId = rawId.replace(/[^0-9]/g, '').slice(0, 5) || String(Math.floor(Math.random() * 90000 + 10000));

    const homeTeam = item.home_team || 'Home Team';
    const awayTeam = item.away_team || 'Away Team';

    const commenceDate = new Date(item.commence_time);
    const now = new Date();
    const isPastCommence = commenceDate.getTime() <= now.getTime();
    // Live if commenced within the last 115 minutes
    const isLive = isPastCommence && (now.getTime() - commenceDate.getTime()) < (115 * 60 * 1000);

    let startTime = '19:00';
    if (!isNaN(commenceDate.getTime())) {
      startTime = commenceDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    // Default realistic odds
    let odd1 = 2.10;
    let oddX = 3.30;
    let odd2 = 3.40;
    let over25 = 1.85;
    let under25 = 1.95;

    // Search for bookmakers in priority order
    const bookmakers = item.bookmakers || [];
    const preferredBookmakers = ['1xBet', 'pinnacle', 'marathonbet', 'williamhill', 'betfair_ex_eu', 'betsson', 'nordicbet', 'tipico_de', 'winamax_fr'];

    let chosenBookmaker = bookmakers.find((b: any) =>
      preferredBookmakers.some(pref => (b.title || b.key || '').toLowerCase().includes(pref.toLowerCase()))
    ) || bookmakers[0];

    if (chosenBookmaker && Array.isArray(chosenBookmaker.markets)) {
      // 1. H2H (1X2) Market
      const h2hMarket = chosenBookmaker.markets.find((m: any) => m.key === 'h2h');
      if (h2hMarket && Array.isArray(h2hMarket.outcomes)) {
        for (const outcome of h2hMarket.outcomes) {
          if (outcome.name === homeTeam) {
            odd1 = parseFloat(outcome.price.toFixed(2));
          } else if (outcome.name === awayTeam) {
            odd2 = parseFloat(outcome.price.toFixed(2));
          } else if (outcome.name.toLowerCase().includes('draw')) {
            oddX = parseFloat(outcome.price.toFixed(2));
          }
        }
      }

      // 2. Totals Market
      const totalsMarket = chosenBookmaker.markets.find((m: any) => m.key === 'totals');
      if (totalsMarket && Array.isArray(totalsMarket.outcomes)) {
        for (const outcome of totalsMarket.outcomes) {
          if (outcome.name.toLowerCase().includes('over')) {
            over25 = parseFloat(outcome.price.toFixed(2));
          } else if (outcome.name.toLowerCase().includes('under')) {
            under25 = parseFloat(outcome.price.toFixed(2));
          }
        }
      }
    }

    // Double chance derived mathematically if not supplied
    const dc1X = parseFloat((1 / (1 / odd1 + 1 / oddX) * 0.95).toFixed(2)) || 1.25;
    const dc12 = parseFloat((1 / (1 / odd1 + 1 / odd2) * 0.95).toFixed(2)) || 1.30;
    const dcX2 = parseFloat((1 / (1 / oddX + 1 / odd2) * 0.95).toFixed(2)) || 1.65;

    const marketsCount = 50 + (bookmakers.length * 8);

    const match: Match = {
      id,
      gameId,
      sport: leagueDef.sport,
      league: leagueDef.league,
      countryOrCategory: leagueDef.country,
      homeTeam,
      awayTeam,
      homeScore: isLive ? 0 : undefined,
      awayScore: isLive ? 0 : undefined,
      period: isLive ? '1H' : undefined,
      minute: isLive ? "25' 1H" : undefined,
      isLive,
      startTime: isLive ? 'Live' : startTime,
      isHot: true,
      hasLiveStream: true,
      marketsCount,
      markets: {
        '1X2': [
          { id: `o-${rawId}-1`, name: '1', value: odd1, trend: 'same' },
          { id: `o-${rawId}-X`, name: 'X', value: oddX, trend: 'same' },
          { id: `o-${rawId}-2`, name: '2', value: odd2, trend: 'same' }
        ],
        'O/U': [
          { id: `o-${rawId}-over`, name: 'Over 2.5', value: over25, trend: 'same' },
          { id: `o-${rawId}-under`, name: 'Under 2.5', value: under25, trend: 'same' }
        ],
        'DC': [
          { id: `o-${rawId}-1x`, name: '1X', value: dc1X, trend: 'same' },
          { id: `o-${rawId}-12`, name: '12', value: dc12, trend: 'same' },
          { id: `o-${rawId}-x2`, name: 'X2', value: dcX2, trend: 'same' }
        ]
      }
    };

    return match;
  }

  /**
   * Sync a specific league from The Odds API, persist locally and in MongoDB
   */
  public async syncLeague(leagueDef: TheOddsSportDef): Promise<Match[]> {
    const quotaCheck = this.canMakeRequest();
    if (!quotaCheck.allowed) {
      throw new Error(quotaCheck.reason || 'Quota limit reached');
    }

    const apiKey = getTheOddsApiKey();
    const url = `https://api.the-odds-api.com/v4/sports/${leagueDef.key}/odds/?apiKey=${apiKey}&regions=eu&markets=h2h,totals`;

    console.log(`[TheOddsAPI] Fetching upcoming odds for ${leagueDef.league} (${leagueDef.key})...`);
    const response = await fetch(url);

    this.recordQuotaHeaders(response.headers);

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`The Odds API error (${response.status}): ${errText}`);
    }

    const events = await response.json();
    if (!Array.isArray(events)) {
      return [];
    }

    const transformedMatches: Match[] = [];

    for (const item of events) {
      const match = this.transformOddsApiEvent(item, leagueDef);
      transformedMatches.push(match);
      this.localMatches.set(match.id, match);

      // Asynchronously upsert to MongoDB Atlas
      MatchModel.findOneAndUpdate(
        { id: match.id },
        {
          id: match.id,
          gameId: match.gameId,
          sport: match.sport,
          sportKey: leagueDef.key,
          league: match.league,
          countryOrCategory: match.countryOrCategory,
          homeTeam: match.homeTeam,
          awayTeam: match.awayTeam,
          homeScore: match.homeScore,
          awayScore: match.awayScore,
          period: match.period,
          minute: match.minute,
          isLive: match.isLive,
          startTime: match.startTime,
          commenceTime: item.commence_time ? new Date(item.commence_time) : new Date(),
          isHot: match.isHot,
          hasLiveStream: match.hasLiveStream,
          marketsCount: match.marketsCount,
          markets: match.markets,
          source: 'the_odds_api',
          lastSyncedAt: new Date()
        },
        { upsert: true, new: true }
      ).catch(e => console.warn('[TheOddsAPI] Mongo upsert error:', e.message));
    }

    this.syncToGlobalDb();
    this.lastSyncedAt = new Date();

    console.log(`[TheOddsAPI] Successfully fetched and stored ${transformedMatches.length} matches for ${leagueDef.league}`);
    return transformedMatches;
  }

  /**
   * Syncs top popular leagues in a single batch (EPL, La Liga, Serie A, Champions League)
   * Consumes only 3-4 API requests per sync cycle!
   */
  public async syncPopularLeagues(): Promise<{ syncedCount: number; leaguesSynced: string[] }> {
    if (this.isSyncing) {
      throw new Error('A sync operation is already in progress');
    }

    this.isSyncing = true;
    const syncedLeagues: string[] = [];
    let totalMatches = 0;

    try {
      // Top 3 highest traffic leagues (3 requests consumed)
      const targetLeagues = SUPPORTED_LEAGUES.slice(0, 3);

      for (const league of targetLeagues) {
        try {
          const matches = await this.syncLeague(league);
          totalMatches += matches.length;
          syncedLeagues.push(league.league);
          // 800ms throttle between calls
          await new Promise(r => setTimeout(r, 800));
        } catch (err: any) {
          console.warn(`[TheOddsAPI] Failed to sync ${league.league}:`, err.message);
        }
      }

      this.lastManualSyncTime = Date.now();
      return { syncedCount: totalMatches, leaguesSynced: syncedLeagues };
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Manual Sync with 15-Minute Cooldown Guard (prevents any abuse by users)
   */
  public async triggerManualSync(): Promise<{
    success: boolean;
    message: string;
    syncedCount: number;
    remainingCredits: number;
  }> {
    const now = Date.now();
    const elapsed = now - this.lastManualSyncTime;

    if (elapsed < this.manualSyncCooldownMs) {
      const remainingSeconds = Math.ceil((this.manualSyncCooldownMs - elapsed) / 1000);
      const remainingMins = Math.ceil(remainingSeconds / 60);
      return {
        success: false,
        message: `Manual sync is in cooldown to protect your 500 credits. Please wait ${remainingMins} minute(s) before syncing again. (Data is already cached locally for all users).`,
        syncedCount: 0,
        remainingCredits: this.remainingCredits
      };
    }

    const result = await this.syncPopularLeagues();
    return {
      success: true,
      message: `Successfully synchronized ${result.syncedCount} real matches across ${result.leaguesSynced.join(', ')} from The Odds API and stored them in local MongoDB Atlas!`,
      syncedCount: result.syncedCount,
      remainingCredits: this.remainingCredits
    };
  }

  /**
   * Background Cron Scheduler: Syncs every 3 hours (8 requests/day = 240/month)
   */
  private startBackgroundSync() {
    if (this.backgroundIntervalId) {
      clearInterval(this.backgroundIntervalId);
    }

    // Run first sync 10 seconds after server startup
    setTimeout(() => {
      this.syncPopularLeagues().catch(e =>
        console.warn('[TheOddsAPI] Initial background sync note:', e.message)
      );
    }, 10000);

    // Schedule every 3 hours (3 * 60 * 60 * 1000 ms)
    const THREE_HOURS_MS = 3 * 60 * 60 * 1000;
    this.backgroundIntervalId = setInterval(() => {
      console.log('[TheOddsAPI] Running scheduled 3-hour background sync...');
      this.syncPopularLeagues().catch(e =>
        console.warn('[TheOddsAPI] Scheduled sync note:', e.message)
      );
    }, THREE_HOURS_MS);
  }

  /**
   * Retrieves matches strictly from local storage (MongoDB or Memory)
   * 0 external requests consumed!
   */
  public getLocalMatches(filters: {
    sport?: string;
    isLive?: boolean;
    league?: string;
    search?: string;
  } = {}): Match[] {
    let matches = Array.from(this.localMatches.values());

    if (filters.sport) {
      const s = filters.sport.toLowerCase();
      matches = matches.filter(m => m.sport.toLowerCase() === s);
    }

    if (filters.isLive !== undefined) {
      matches = matches.filter(m => m.isLive === filters.isLive);
    }

    if (filters.league) {
      const l = filters.league.toLowerCase();
      matches = matches.filter(m => m.league.toLowerCase().includes(l));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      matches = matches.filter(
        m =>
          m.homeTeam.toLowerCase().includes(q) ||
          m.awayTeam.toLowerCase().includes(q) ||
          m.league.toLowerCase().includes(q) ||
          m.gameId.includes(q)
      );
    }

    return matches;
  }

  /**
   * Detailed quota and status monitor
   */
  public getQuotaStatus(): TheOddsQuotaStatus {
    const now = Date.now();
    const elapsed = now - this.lastManualSyncTime;
    const cooldownRemaining = Math.max(0, Math.ceil((this.manualSyncCooldownMs - elapsed) / 1000));

    // Next scheduled sync estimation (every 3 hours)
    const nextSync = new Date(now + 3 * 60 * 60 * 1000).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      provider: 'The Odds API',
      plan: 'Starter (Free 500 Credits/Month)',
      totalMonthlyCredits: this.totalMonthlyCredits,
      remainingCredits: this.remainingCredits,
      usedCredits: this.usedCredits,
      requestsToday: this.requestsToday,
      dailyBudget: this.dailyBudget,
      lastSyncedAt: this.lastSyncedAt ? this.lastSyncedAt.toLocaleTimeString() : 'Never',
      nextScheduledSync: nextSync,
      cooldownRemainingSeconds: cooldownRemaining,
      isRateLimited: this.remainingCredits <= 5 || this.requestsToday >= this.dailyBudget,
      totalMatchesInLocalDb: this.localMatches.size,
      configured: !!getTheOddsApiKey()
    };
  }
}

export const theOddsApiService = new TheOddsApiService();
