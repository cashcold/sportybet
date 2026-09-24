import { Router, Request, Response } from 'express';
import { sportsService } from '../sports/sportsService';
import { sportsCache } from '../sports/cacheManager';
import { SPORTS_CONFIG } from '../sports/sportsConfig';

export const sportsRouter = Router();

// 1. GET /api/sports/usage - Admin & System Monitoring of API-Sports Quotas
sportsRouter.get('/usage', (req: Request, res: Response) => {
  const allStats = sportsCache.getAllUsageStats();
  res.json({
    success: true,
    provider: 'API-Sports Multi-Sport Centralized Hub',
    timestamp: new Date().toISOString(),
    totalSportsSubscribed: Object.keys(SPORTS_CONFIG).length,
    stats: allStats
  });
});

// 2. GET /api/sports/:sport/status - Status check for a sport
sportsRouter.get('/:sport/status', async (req: Request, res: Response) => {
  const { sport } = req.params;
  try {
    const statusData = await sportsService.getSportStatus(sport);
    res.json({
      success: true,
      ...statusData
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 3. GET /api/sports/:sport/live - Live Matches (30–60s cache, single-flight deduplication)
sportsRouter.get('/:sport/live', async (req: Request, res: Response) => {
  const { sport } = req.params;
  try {
    const result = await sportsService.getLiveMatches(sport);
    res.json({
      success: true,
      sport,
      count: result.matches.length,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      source: result.source,
      data: result.matches
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 4. GET /api/sports/:sport/fixtures - Fixtures (15-minute / 900s cache)
sportsRouter.get('/:sport/fixtures', async (req: Request, res: Response) => {
  const { sport } = req.params;
  const { date, league, season } = req.query;

  try {
    const result = await sportsService.getUpcomingFixtures(sport, {
      date: typeof date === 'string' ? date : undefined,
      league: typeof league === 'string' ? league : undefined,
      season: typeof season === 'string' ? season : undefined
    });

    res.json({
      success: true,
      sport,
      count: result.matches.length,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      source: result.source,
      data: result.matches
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 5. GET /api/sports/:sport/standings - Standings (45-minute cache)
sportsRouter.get('/:sport/standings', async (req: Request, res: Response) => {
  const { sport } = req.params;
  const { league, season } = req.query;

  try {
    const result = await sportsService.fetchSportEndpoint(
      sport,
      'standings',
      { league, season: season || new Date().getFullYear() },
      2700 // 45 mins
    );

    res.json({
      success: true,
      sport,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      data: result.data
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 6. GET /api/sports/:sport/query - Generic cached query for teams, leagues, players, venues, etc.
sportsRouter.get('/:sport/query', async (req: Request, res: Response) => {
  const { sport } = req.params;
  const { endpoint, ttl, ...params } = req.query;

  if (!endpoint || typeof endpoint !== 'string') {
    return res.status(400).json({ success: false, error: 'Query parameter "endpoint" is required' });
  }

  const customTTL = ttl ? parseInt(String(ttl), 10) : undefined;

  try {
    const result = await sportsService.fetchSportEndpoint(
      sport,
      endpoint,
      params,
      customTTL
    );

    res.json({
      success: true,
      sport,
      endpoint,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      data: result.data
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 7. POST /api/sports/clear-cache - Admin tool to flush cache
sportsRouter.post('/clear-cache', (req: Request, res: Response) => {
  sportsCache.clearCache();
  res.json({
    success: true,
    message: 'Central sports cache successfully cleared'
  });
});
