import { Router, Request, Response } from 'express';
import { sportsService, getSportsApiKey } from './sports/sportsService';
import { sportsCache } from './sports/cacheManager';

export const footballRouter = Router();

export function getApiKey() {
  return getSportsApiKey();
}

// 1. Status Check Endpoint: /status (mounted at /api/football/status and /football/status)
footballRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const statusData = await sportsService.getSportStatus('football');
    res.json({
      configured: statusData.configured,
      provider: statusData.provider,
      mode: statusData.mode,
      accountName: (statusData as any).accountName || 'Active',
      requestsUsed: statusData.requestsUsed,
      dailyLimit: statusData.dailyLimit,
      remainingRequests: statusData.remainingRequests,
      cacheHits: statusData.cacheHits,
      cacheMisses: statusData.cacheMisses,
      cached: (statusData as any).cached,
      stale: (statusData as any).stale,
      lastUpdated: (statusData as any).lastUpdated,
      message: `Connected to API-Football (${statusData.requestsUsed}/${statusData.dailyLimit} requests used today)`
    });
  } catch (err: any) {
    const stats = sportsCache.getOrCreateStats('football');
    res.json({
      configured: Boolean(getSportsApiKey()),
      provider: 'API-Football (api-sports.io)',
      mode: getSportsApiKey() ? 'live_real_data' : 'demo_simulation',
      requestsUsed: stats.requestsMade,
      dailyLimit: stats.dailyLimit,
      remainingRequests: stats.remainingRequests,
      message: 'Active'
    });
  }
});

// 2. Live Matches Endpoint: /live (mounted at /api/football/live and /football/live)
footballRouter.get('/live', async (req: Request, res: Response) => {
  const apiKey = getSportsApiKey();

  if (!apiKey) {
    return res.json({
      success: true,
      source: 'demo_simulation',
      configured: false,
      data: null
    });
  }

  try {
    const result = await sportsService.getLiveMatches('football');
    return res.json({
      success: true,
      source: result.source,
      configured: true,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      count: result.matches.length,
      data: result.matches
    });
  } catch (err: any) {
    console.error('[API-Football Live Route Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. Fixtures Endpoint: /fixtures (mounted at /api/football/fixtures and /football/fixtures)
footballRouter.get('/fixtures', async (req: Request, res: Response) => {
  const { date, league, season } = req.query;
  try {
    const result = await sportsService.getUpcomingFixtures('football', {
      date: typeof date === 'string' ? date : undefined,
      league: typeof league === 'string' ? league : undefined,
      season: typeof season === 'string' ? season : undefined
    });

    return res.json({
      success: true,
      source: result.source,
      cached: result.cached,
      stale: result.stale,
      lastUpdated: result.lastUpdated,
      count: result.matches.length,
      data: result.matches
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
