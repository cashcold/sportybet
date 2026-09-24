export interface SportApiConfig {
  id: string;
  name: string;
  host: string;
  plan: string;
  dailyLimit: number;
  safetyLimit: number;
  defaultFixtureTTL: number; // in seconds
  defaultLiveTTL: number; // in seconds
  apiVersion?: string;
}

export const DEFAULT_FIXTURE_TTL = parseInt(process.env.API_CACHE_FIXTURES_TTL || '900', 10); // 15 mins (900s)
export const DEFAULT_LIVE_TTL = parseInt(process.env.API_CACHE_LIVE_TTL || '60', 10); // 60s
export const DEFAULT_RESULTS_TTL = parseInt(process.env.API_CACHE_RESULTS_TTL || '2700', 10); // 45 mins
export const DEFAULT_STANDINGS_TTL = parseInt(process.env.API_CACHE_STANDINGS_TTL || '2700', 10); // 45 mins
export const DEFAULT_STATIC_TTL = parseInt(process.env.API_CACHE_STATIC_TTL || '86400', 10); // 24 hours

export const SPORTS_CONFIG: Record<string, SportApiConfig> = {
  football: {
    id: 'football',
    name: 'Football',
    host: 'v3.football.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_FOOTBALL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_FOOTBALL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  afl: {
    id: 'afl',
    name: 'AFL',
    host: 'v1.afl.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_AFL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_AFL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  baseball: {
    id: 'baseball',
    name: 'Baseball',
    host: 'v1.baseball.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_BASEBALL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_BASEBALL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  basketball: {
    id: 'basketball',
    name: 'Basketball',
    host: 'v1.basketball.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_BASKETBALL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_BASKETBALL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  'formula-1': {
    id: 'formula-1',
    name: 'Formula 1',
    host: 'v1.formula-1.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_F1_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_F1_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  handball: {
    id: 'handball',
    name: 'Handball',
    host: 'v1.handball.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_HANDBALL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_HANDBALL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  hockey: {
    id: 'hockey',
    name: 'Hockey',
    host: 'v1.hockey.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_HOCKEY_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_HOCKEY_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  mma: {
    id: 'mma',
    name: 'MMA',
    host: 'v1.mma.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_MMA_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_MMA_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  nba: {
    id: 'nba',
    name: 'NBA',
    host: 'v2.nba.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_NBA_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_NBA_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  nfl: {
    id: 'nfl',
    name: 'NFL (American Football)',
    host: 'v1.american-football.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_NFL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_NFL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  rugby: {
    id: 'rugby',
    name: 'Rugby',
    host: 'v1.rugby.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_RUGBY_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_RUGBY_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  },
  volleyball: {
    id: 'volleyball',
    name: 'Volleyball',
    host: 'v1.volleyball.api-sports.io',
    plan: 'Free',
    dailyLimit: parseInt(process.env.API_VOLLEYBALL_DAILY_LIMIT || '100', 10),
    safetyLimit: parseInt(process.env.API_VOLLEYBALL_SAFETY_LIMIT || '80', 10),
    defaultFixtureTTL: DEFAULT_FIXTURE_TTL,
    defaultLiveTTL: DEFAULT_LIVE_TTL
  }
};

/**
 * Determine TTL in seconds based on endpoint / query intent
 */
export function getTTLForEndpoint(endpoint: string): number {
  const lower = endpoint.toLowerCase();
  if (lower.includes('live') || lower.includes('inplay') || lower.includes('status')) {
    return DEFAULT_LIVE_TTL; // 30–60s
  }
  if (lower.includes('standings')) {
    return DEFAULT_STANDINGS_TTL; // 30–60 mins
  }
  if (lower.includes('results') || lower.includes('h2h')) {
    return DEFAULT_RESULTS_TTL; // 30–60 mins
  }
  if (
    lower.includes('teams') ||
    lower.includes('leagues') ||
    lower.includes('players') ||
    lower.includes('venues') ||
    lower.includes('seasons') ||
    lower.includes('countries') ||
    lower.includes('timezone')
  ) {
    return DEFAULT_STATIC_TTL; // 24 hours
  }
  // Default for upcoming fixtures/matches
  return DEFAULT_FIXTURE_TTL; // 15 mins (900s)
}
