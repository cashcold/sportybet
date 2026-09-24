import { Router, Request, Response } from 'express';
import { db } from '../db';
import { Match } from '../../types';
import { sportsService, getSportsApiKey } from '../sports/sportsService';
import { theOddsApiService } from '../sports/theOddsApiService';

export const matchesRouter = Router();

// GET /api/matches
matchesRouter.get('/', async (req: Request, res: Response) => {
  const { sport, live, league, search } = req.query;
  const activeSport = (typeof sport === 'string' && sport) ? sport : 'football';

  const seenIds = new Set<string>();
  let result: Match[] = [];

  // 1. Live matches first (active real games with live score & clock)
  try {
    const liveData = await sportsService.getLiveMatches(activeSport);
    if (liveData.matches && liveData.matches.length > 0) {
      for (const m of liveData.matches) {
        if (!seenIds.has(m.id)) {
          seenIds.add(m.id);
          result.push(m);
        }
      }
    }
  } catch {
    // Non-blocking
  }

  // 2. Upcoming matches scheduled for Today and following days (curated / db)
  for (const m of db.matches) {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id);
      result.push(m);
    }
  }

  // 3. Real matches stored locally from The Odds API
  const theOddsMatches = theOddsApiService.getLocalMatches();
  for (const m of theOddsMatches) {
    if (!seenIds.has(m.id)) {
      seenIds.add(m.id);
      result.push(m);
    }
  }

  if (sport && typeof sport === 'string') {
    result = result.filter(m => m.sport.toLowerCase() === sport.toLowerCase());
  }

  if (live !== undefined) {
    const isLive = live === 'true' || live === '1';
    result = result.filter(m => m.isLive === isLive);
  }

  if (league && typeof league === 'string') {
    result = result.filter(m => m.league.toLowerCase().includes(league.toLowerCase()));
  }

  if (search && typeof search === 'string') {
    const q = search.toLowerCase();
    result = result.filter(m =>
      m.homeTeam.toLowerCase().includes(q) ||
      m.awayTeam.toLowerCase().includes(q) ||
      m.league.toLowerCase().includes(q) ||
      m.gameId.includes(q)
    );
  }

  return res.json({
    success: true,
    total: result.length,
    matches: result
  });
});

// GET /api/matches/:id
matchesRouter.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const match =
    theOddsApiService.getLocalMatches().find(m => m.id === id || m.gameId === id) ||
    db.matches.find(m => m.id === id || m.gameId === id);

  if (!match) {
    return res.status(404).json({ success: false, error: 'Match not found' });
  }

  // Provide extended markets if not already present
  const extendedMarkets = {
    ...match.markets,
    'Both Teams To Score (GG/NG)': [
      { id: `${match.id}-btts-yes`, name: 'Yes (GG)', value: 1.74, trend: 'same' as const },
      { id: `${match.id}-btts-no`, name: 'No (NG)', value: 2.05, trend: 'same' as const }
    ],
    'Draw No Bet (DNB)': [
      { id: `${match.id}-dnb-1`, name: '1 (DNB)', value: 1.45, trend: 'same' as const },
      { id: `${match.id}-dnb-2`, name: '2 (DNB)', value: 2.65, trend: 'same' as const }
    ],
    'Exact Goals': [
      { id: `${match.id}-eg-0-1`, name: '0 - 1 Goal', value: 3.20, trend: 'same' as const },
      { id: `${match.id}-eg-2-3`, name: '2 - 3 Goals', value: 1.95, trend: 'same' as const },
      { id: `${match.id}-eg-4+`, name: '4+ Goals', value: 3.80, trend: 'same' as const }
    ]
  };

  return res.json({
    success: true,
    match: {
      ...match,
      markets: extendedMarkets
    }
  });
});

// POST /api/matches/simulate-live
matchesRouter.post('/simulate-live', (req: Request, res: Response) => {
  // Randomly tick live matches (increment minute, slight odds nudge)
  db.matches.forEach(m => {
    if (m.isLive) {
      const matchMinute = parseInt(m.minute || '45');
      if (!isNaN(matchMinute) && matchMinute < 90) {
        m.minute = `${matchMinute + 1}'`;
      }

      // Small odds fluctuation
      if (m.markets && m.markets['1X2']) {
        m.markets['1X2'].forEach(odd => {
          const delta = (Math.random() - 0.5) * 0.04;
          const oldVal = odd.value;
          odd.value = parseFloat(Math.max(1.01, oldVal + delta).toFixed(2));
          odd.trend = odd.value > oldVal ? 'up' : odd.value < oldVal ? 'down' : 'same';
        });
      }
    }
  });

  return res.json({
    success: true,
    message: 'Live match scores and odds updated',
    liveMatchesCount: db.matches.filter(m => m.isLive).length
  });
});
