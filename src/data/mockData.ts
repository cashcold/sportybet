import { Match, PlacedBet, UserProfile } from '../types';
import { REAL_UPCOMING_FIXTURES } from './realFixtures';

export const INITIAL_MATCHES: Match[] = [
  // --- LIVE MATCHES (Active, Top Tier, Realistic Live Clocks & Odds) ---
  {
    id: 'live-ars-mci',
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
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 142,
    markets: {
      '1X2': [
        { id: 'lam-1', name: '1', value: 2.85, trend: 'same' },
        { id: 'lam-x', name: 'X', value: 2.30, trend: 'same' },
        { id: 'lam-2', name: '2', value: 3.10, trend: 'up' }
      ],
      'O/U': [
        { id: 'lam-o2.5', name: 'Over 2.5', value: 1.88, trend: 'same' },
        { id: 'lam-u2.5', name: 'Under 2.5', value: 1.92, trend: 'same' }
      ],
      'DC': [
        { id: 'lam-1x', name: '1X', value: 1.35, trend: 'same' },
        { id: 'lam-12', name: '12', value: 1.45, trend: 'same' },
        { id: 'lam-x2', name: 'X2', value: 1.40, trend: 'same' }
      ],
      '1st Half O/U': [
        { id: 'lam-h-o', name: 'Over 1.5', value: 2.10, trend: 'same' },
        { id: 'lam-h-u', name: 'Under 1.5', value: 1.68, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lam-h1', name: '(0) 1', value: 1.90, trend: 'same' },
        { id: 'lam-h2', name: '(0) 2', value: 1.90, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-rma-bar',
    gameId: '91832',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Real Madrid',
    awayTeam: 'FC Barcelona',
    homeScore: 2,
    awayScore: 1,
    minute: "74' 2H",
    period: '2H',
    isLive: true,
    isHot: true,
    hasLiveStream: true,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 156,
    markets: {
      '1X2': [
        { id: 'lrb-1', name: '1', value: 1.25, trend: 'same' },
        { id: 'lrb-x', name: 'X', value: 4.80, trend: 'same' },
        { id: 'lrb-2', name: '2', value: 11.50, trend: 'down' }
      ],
      'O/U': [
        { id: 'lrb-o3.5', name: 'Over 3.5', value: 1.95, trend: 'same' },
        { id: 'lrb-u3.5', name: 'Under 3.5', value: 1.80, trend: 'same' }
      ],
      'DC': [
        { id: 'lrb-1x', name: '1X', value: 1.05, trend: 'same' },
        { id: 'lrb-12', name: '12', value: 1.15, trend: 'same' },
        { id: 'lrb-x2', name: 'X2', value: 3.60, trend: 'down' }
      ],
      '1st Half O/U': [
        { id: 'lrb-h-o', name: 'Over 2.5', value: 2.30, trend: 'up' },
        { id: 'lrb-h-u', name: 'Under 2.5', value: 1.55, trend: 'down' }
      ],
      'Handicap': [
        { id: 'lrb-h1', name: '(-1) 1', value: 2.15, trend: 'same' },
        { id: 'lrb-h2', name: '(+1) 2', value: 1.70, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-liv-che',
    gameId: '73910',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Liverpool FC',
    awayTeam: 'Chelsea FC',
    homeScore: 0,
    awayScore: 0,
    minute: "32' 1H",
    period: '1H',
    isLive: true,
    isHot: true,
    hasLiveStream: false,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 118,
    markets: {
      '1X2': [
        { id: 'llc-1', name: '1', value: 2.10, trend: 'same' },
        { id: 'llc-x', name: 'X', value: 3.20, trend: 'same' },
        { id: 'llc-2', name: '2', value: 3.40, trend: 'same' }
      ],
      'O/U': [
        { id: 'llc-o2.5', name: 'Over 2.5', value: 2.05, trend: 'same' },
        { id: 'llc-u2.5', name: 'Under 2.5', value: 1.75, trend: 'same' }
      ],
      'DC': [
        { id: 'llc-1x', name: '1X', value: 1.30, trend: 'same' },
        { id: 'llc-12', name: '12', value: 1.32, trend: 'same' },
        { id: 'llc-x2', name: 'X2', value: 1.65, trend: 'same' }
      ],
      '1st Half O/U': [
        { id: 'llc-h-o', name: 'Over 0.5', value: 1.55, trend: 'same' },
        { id: 'llc-h-u', name: 'Under 0.5', value: 2.30, trend: 'same' }
      ],
      'Handicap': [
        { id: 'llc-h1', name: '(-1) 1', value: 3.20, trend: 'same' },
        { id: 'llc-h2', name: '(+1) 2', value: 1.35, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-bay-dor',
    gameId: '62104',
    sport: 'football',
    league: 'Bundesliga',
    countryOrCategory: 'Germany',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Borussia Dortmund',
    homeScore: 3,
    awayScore: 2,
    minute: "81' 2H",
    period: '2H',
    isLive: true,
    isHot: true,
    hasLiveStream: true,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 164,
    markets: {
      '1X2': [
        { id: 'lbd-1', name: '1', value: 1.15, trend: 'same' },
        { id: 'lbd-x', name: 'X', value: 6.00, trend: 'up' },
        { id: 'lbd-2', name: '2', value: 16.00, trend: 'down' }
      ],
      'O/U': [
        { id: 'lbd-o5.5', name: 'Over 5.5', value: 2.10, trend: 'same' },
        { id: 'lbd-u5.5', name: 'Under 5.5', value: 1.70, trend: 'same' }
      ],
      'DC': [
        { id: 'lbd-1x', name: '1X', value: 1.02, trend: 'same' },
        { id: 'lbd-12', name: '12', value: 1.10, trend: 'same' },
        { id: 'lbd-x2', name: 'X2', value: 4.50, trend: 'down' }
      ],
      '1st Half O/U': [
        { id: 'lbd-h-o', name: 'Over 1.5', value: 1.40, trend: 'same' },
        { id: 'lbd-h-u', name: 'Under 1.5', value: 2.80, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lbd-h1', name: '(-1) 1', value: 2.80, trend: 'same' },
        { id: 'lbd-h2', name: '(+1) 2', value: 1.42, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-int-mil',
    gameId: '45981',
    sport: 'football',
    league: 'Serie A',
    countryOrCategory: 'Italy',
    homeTeam: 'Inter Milan',
    awayTeam: 'AC Milan',
    homeScore: 1,
    awayScore: 0,
    minute: "41' 1H",
    period: '1H',
    isLive: true,
    isHot: true,
    hasLiveStream: true,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 130,
    markets: {
      '1X2': [
        { id: 'lim-1', name: '1', value: 1.60, trend: 'same' },
        { id: 'lim-x', name: 'X', value: 3.60, trend: 'same' },
        { id: 'lim-2', name: '2', value: 5.20, trend: 'up' }
      ],
      'O/U': [
        { id: 'lim-o2.5', name: 'Over 2.5', value: 1.75, trend: 'same' },
        { id: 'lim-u2.5', name: 'Under 2.5', value: 2.05, trend: 'same' }
      ],
      'DC': [
        { id: 'lim-1x', name: '1X', value: 1.14, trend: 'same' },
        { id: 'lim-12', name: '12', value: 1.25, trend: 'same' },
        { id: 'lim-x2', name: 'X2', value: 2.20, trend: 'up' }
      ],
      '1st Half O/U': [
        { id: 'lim-h-o', name: 'Over 1.5', value: 2.80, trend: 'same' },
        { id: 'lim-h-u', name: 'Under 1.5', value: 1.40, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lim-h1', name: '(-1) 1', value: 2.45, trend: 'same' },
        { id: 'lim-h2', name: '(+1) 2', value: 1.55, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-psg-om',
    gameId: '57312',
    sport: 'football',
    league: 'Ligue 1',
    countryOrCategory: 'France',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Olympique Marseille',
    homeScore: 2,
    awayScore: 0,
    minute: "56' 2H",
    period: '2H',
    isLive: true,
    isHot: false,
    hasLiveStream: true,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 124,
    markets: {
      '1X2': [
        { id: 'lpo-1', name: '1', value: 1.08, trend: 'same' },
        { id: 'lpo-x', name: 'X', value: 8.50, trend: 'same' },
        { id: 'lpo-2', name: '2', value: 18.00, trend: 'down' }
      ],
      'O/U': [
        { id: 'lpo-o2.5', name: 'Over 2.5', value: 1.30, trend: 'same' },
        { id: 'lpo-u2.5', name: 'Under 2.5', value: 3.20, trend: 'same' }
      ],
      'DC': [
        { id: 'lpo-1x', name: '1X', value: 1.01, trend: 'same' },
        { id: 'lpo-12', name: '12', value: 1.05, trend: 'same' },
        { id: 'lpo-x2', name: 'X2', value: 6.50, trend: 'down' }
      ],
      '1st Half O/U': [
        { id: 'lpo-h-o', name: 'Over 2.5', value: 1.95, trend: 'same' },
        { id: 'lpo-h-u', name: 'Under 2.5', value: 1.80, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lpo-h1', name: '(-2) 1', value: 2.10, trend: 'same' },
        { id: 'lpo-h2', name: '(+2) 2', value: 1.68, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-lal-gsw',
    gameId: '88201',
    sport: 'basketball',
    league: 'NBA',
    countryOrCategory: 'USA',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeScore: 88,
    awayScore: 84,
    minute: "04:15 Q3",
    period: 'Q3',
    isLive: true,
    isHot: true,
    hasLiveStream: true,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 85,
    markets: {
      '1X2': [
        { id: 'llg-1', name: '1', value: 1.65, trend: 'same' },
        { id: 'llg-x', name: 'X', value: 14.00, trend: 'same' },
        { id: 'llg-2', name: '2', value: 2.25, trend: 'up' }
      ],
      'O/U': [
        { id: 'llg-o215', name: 'Over 215.5', value: 1.85, trend: 'same' },
        { id: 'llg-u215', name: 'Under 215.5', value: 1.95, trend: 'same' }
      ],
      'DC': [
        { id: 'llg-1x', name: '1X', value: 1.25, trend: 'same' },
        { id: 'llg-12', name: '12', value: 1.05, trend: 'same' },
        { id: 'llg-x2', name: 'X2', value: 1.60, trend: 'same' }
      ],
      'Handicap': [
        { id: 'llg-h1', name: '(-3.5) 1', value: 1.90, trend: 'same' },
        { id: 'llg-h2', name: '(+3.5) 2', value: 1.90, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-bos-mia',
    gameId: '88202',
    sport: 'basketball',
    league: 'NBA',
    countryOrCategory: 'USA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'Miami Heat',
    homeScore: 62,
    awayScore: 58,
    minute: "01:30 Q2",
    period: 'Q2',
    isLive: true,
    isHot: false,
    hasLiveStream: false,
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    marketsCount: 72,
    markets: {
      '1X2': [
        { id: 'lbm-1', name: '1', value: 1.45, trend: 'same' },
        { id: 'lbm-x', name: 'X', value: 15.00, trend: 'same' },
        { id: 'lbm-2', name: '2', value: 2.75, trend: 'same' }
      ],
      'O/U': [
        { id: 'lbm-o210', name: 'Over 210.5', value: 1.88, trend: 'same' },
        { id: 'lbm-u210', name: 'Under 210.5', value: 1.92, trend: 'same' }
      ],
      'DC': [
        { id: 'lbm-1x', name: '1X', value: 1.18, trend: 'same' },
        { id: 'lbm-12', name: '12', value: 1.04, trend: 'same' },
        { id: 'lbm-x2', name: 'X2', value: 1.95, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lbm-h1', name: '(-5.5) 1', value: 1.90, trend: 'same' },
        { id: 'lbm-h2', name: '(+5.5) 2', value: 1.90, trend: 'same' }
      ]
    }
  },

  // --- UPCOMING / TODAY / HIGHLIGHTS MATCHES FOR TODAY & FOLLOWING DAYS ---
  ...REAL_UPCOMING_FIXTURES,
  // Additional Evening Europa League & International Fixtures
  {
    id: 'up-today-1',
    gameId: '41392',
    sport: 'football',
    league: 'UEFA Europa League',
    countryOrCategory: 'Europe',
    homeTeam: 'Tottenham Hotspur',
    awayTeam: 'Qarabağ FK',
    startTime: '19:00',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 234,
    markets: {
      '1X2': [
        { id: 'ut1-1', name: '1', value: 1.18, trend: 'same' },
        { id: 'ut1-x', name: 'X', value: 7.20, trend: 'same' },
        { id: 'ut1-2', name: '2', value: 13.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut1-o2.5', name: 'Over 2.5', value: 1.40, trend: 'same' },
        { id: 'ut1-u2.5', name: 'Under 2.5', value: 2.85, trend: 'same' }
      ],
      'DC': [
        { id: 'ut1-1x', name: '1X', value: 1.02, trend: 'same' },
        { id: 'ut1-12', name: '12', value: 1.08, trend: 'same' },
        { id: 'ut1-x2', name: 'X2', value: 4.50, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-today-2',
    gameId: '54968',
    sport: 'football',
    league: 'UEFA Europa League',
    countryOrCategory: 'Europe',
    homeTeam: 'AS Roma',
    awayTeam: 'Athletic Bilbao',
    startTime: '19:00',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 195,
    markets: {
      '1X2': [
        { id: 'ut2-1', name: '1', value: 2.05, trend: 'same' },
        { id: 'ut2-x', name: 'X', value: 3.35, trend: 'same' },
        { id: 'ut2-2', name: '2', value: 3.65, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut2-o2.5', name: 'Over 2.5', value: 1.95, trend: 'same' },
        { id: 'ut2-u2.5', name: 'Under 2.5', value: 1.82, trend: 'same' }
      ],
      'DC': [
        { id: 'ut2-1x', name: '1X', value: 1.28, trend: 'same' },
        { id: 'ut2-12', name: '12', value: 1.31, trend: 'same' },
        { id: 'ut2-x2', name: 'X2', value: 1.74, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-today-3',
    gameId: '31849',
    sport: 'football',
    league: 'UEFA Europa League',
    countryOrCategory: 'Europe',
    homeTeam: 'Ajax Amsterdam',
    awayTeam: 'Beşiktaş',
    startTime: '19:00',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: true,
    marketsCount: 188,
    markets: {
      '1X2': [
        { id: 'ut3-1', name: '1', value: 1.90, trend: 'same' },
        { id: 'ut3-x', name: 'X', value: 3.70, trend: 'same' },
        { id: 'ut3-2', name: '2', value: 3.80, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut3-o2.5', name: 'Over 2.5', value: 1.62, trend: 'same' },
        { id: 'ut3-u2.5', name: 'Under 2.5', value: 2.25, trend: 'same' }
      ],
      'DC': [
        { id: 'ut3-1x', name: '1X', value: 1.25, trend: 'same' },
        { id: 'ut3-12', name: '12', value: 1.26, trend: 'same' },
        { id: 'ut3-x2', name: 'X2', value: 1.85, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-today-4',
    gameId: '63124',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Celta Vigo',
    awayTeam: 'Atletico Madrid',
    startTime: '20:00',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 388,
    markets: {
      '1X2': [
        { id: 'ut4-1', name: '1', value: 3.85, trend: 'same' },
        { id: 'ut4-x', name: 'X', value: 3.40, trend: 'same' },
        { id: 'ut4-2', name: '2', value: 1.95, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut4-o2.5', name: 'Over 2.5', value: 1.98, trend: 'same' },
        { id: 'ut4-u2.5', name: 'Under 2.5', value: 1.80, trend: 'same' }
      ],
      'DC': [
        { id: 'ut4-1x', name: '1X', value: 1.80, trend: 'same' },
        { id: 'ut4-12', name: '12', value: 1.30, trend: 'same' },
        { id: 'ut4-x2', name: 'X2', value: 1.24, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-today-5',
    gameId: '65978',
    sport: 'football',
    league: 'Coppa Italia',
    countryOrCategory: 'Italy',
    homeTeam: 'Napoli',
    awayTeam: 'Palermo',
    startTime: '19:00',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: false,
    marketsCount: 165,
    markets: {
      '1X2': [
        { id: 'ut5-1', name: '1', value: 1.25, trend: 'same' },
        { id: 'ut5-x', name: 'X', value: 5.80, trend: 'same' },
        { id: 'ut5-2', name: '2', value: 10.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut5-o2.5', name: 'Over 2.5', value: 1.55, trend: 'same' },
        { id: 'ut5-u2.5', name: 'Under 2.5', value: 2.38, trend: 'same' }
      ],
      'DC': [
        { id: 'ut5-1x', name: '1X', value: 1.04, trend: 'same' },
        { id: 'ut5-12', name: '12', value: 1.12, trend: 'same' },
        { id: 'ut5-x2', name: 'X2', value: 3.75, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-today-6',
    gameId: '77218',
    sport: 'basketball',
    league: 'NBA',
    countryOrCategory: 'USA',
    homeTeam: 'Denver Nuggets',
    awayTeam: 'Phoenix Suns',
    startTime: '23:30',
    date: '2026-09-24',
    dateLabel: 'Today 24/09',
    isLive: false,
    isHot: true,
    marketsCount: 160,
    markets: {
      '1X2': [
        { id: 'ut6-1', name: '1', value: 1.55, trend: 'same' },
        { id: 'ut6-x', name: 'X', value: 15.00, trend: 'same' },
        { id: 'ut6-2', name: '2', value: 2.45, trend: 'same' }
      ],
      'O/U': [
        { id: 'ut6-o220', name: 'Over 224.5', value: 1.90, trend: 'same' },
        { id: 'ut6-u220', name: 'Under 224.5', value: 1.90, trend: 'same' }
      ],
      'Handicap': [
        { id: 'ut6-h1', name: '(-4.5) 1', value: 1.90, trend: 'same' },
        { id: 'ut6-h2', name: '(+4.5) 2', value: 1.90, trend: 'same' }
      ]
    }
  },

  // 2. FRIDAY 25/09 FIXTURES
  {
    id: 'up-fri-1',
    gameId: '82914',
    sport: 'football',
    league: 'Serie A',
    countryOrCategory: 'Italy',
    homeTeam: 'AC Milan',
    awayTeam: 'Lecce',
    startTime: '18:45',
    date: '2026-09-25',
    dateLabel: 'Friday 25/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 215,
    markets: {
      '1X2': [
        { id: 'uf1-1', name: '1', value: 1.35, trend: 'same' },
        { id: 'uf1-x', name: 'X', value: 4.90, trend: 'same' },
        { id: 'uf1-2', name: '2', value: 8.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'uf1-o2.5', name: 'Over 2.5', value: 1.65, trend: 'same' },
        { id: 'uf1-u2.5', name: 'Under 2.5', value: 2.20, trend: 'same' }
      ],
      'DC': [
        { id: 'uf1-1x', name: '1X', value: 1.07, trend: 'same' },
        { id: 'uf1-12', name: '12', value: 1.16, trend: 'same' },
        { id: 'uf1-x2', name: 'X2', value: 3.10, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-fri-2',
    gameId: '49102',
    sport: 'football',
    league: 'Bundesliga',
    countryOrCategory: 'Germany',
    homeTeam: 'Borussia Dortmund',
    awayTeam: 'VfL Bochum',
    startTime: '18:30',
    date: '2026-09-25',
    dateLabel: 'Friday 25/09',
    isLive: false,
    isHot: true,
    marketsCount: 228,
    markets: {
      '1X2': [
        { id: 'uf2-1', name: '1', value: 1.28, trend: 'same' },
        { id: 'uf2-x', name: 'X', value: 5.75, trend: 'same' },
        { id: 'uf2-2', name: '2', value: 9.80, trend: 'same' }
      ],
      'O/U': [
        { id: 'uf2-o3.5', name: 'Over 3.5', value: 1.85, trend: 'same' },
        { id: 'uf2-u3.5', name: 'Under 3.5', value: 1.92, trend: 'same' }
      ],
      'DC': [
        { id: 'uf2-1x', name: '1X', value: 1.05, trend: 'same' },
        { id: 'uf2-12', name: '12', value: 1.12, trend: 'same' },
        { id: 'uf2-x2', name: 'X2', value: 3.55, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-fri-3',
    gameId: '93012',
    sport: 'football',
    league: 'Ligue 1',
    countryOrCategory: 'France',
    homeTeam: 'Paris Saint-Germain',
    awayTeam: 'Rennes',
    startTime: '19:00',
    date: '2026-09-25',
    dateLabel: 'Friday 25/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 245,
    markets: {
      '1X2': [
        { id: 'uf3-1', name: '1', value: 1.48, trend: 'same' },
        { id: 'uf3-x', name: 'X', value: 4.60, trend: 'same' },
        { id: 'uf3-2', name: '2', value: 6.20, trend: 'same' }
      ],
      'O/U': [
        { id: 'uf3-o2.5', name: 'Over 2.5', value: 1.58, trend: 'same' },
        { id: 'uf3-u2.5', name: 'Under 2.5', value: 2.30, trend: 'same' }
      ],
      'DC': [
        { id: 'uf3-1x', name: '1X', value: 1.11, trend: 'same' },
        { id: 'uf3-12', name: '12', value: 1.18, trend: 'same' },
        { id: 'uf3-x2', name: 'X2', value: 2.55, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-fri-4',
    gameId: '58210',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Real Valladolid',
    awayTeam: 'RCD Mallorca',
    startTime: '19:00',
    date: '2026-09-25',
    dateLabel: 'Friday 25/09',
    isLive: false,
    marketsCount: 174,
    markets: {
      '1X2': [
        { id: 'uf4-1', name: '1', value: 2.65, trend: 'same' },
        { id: 'uf4-x', name: 'X', value: 3.00, trend: 'same' },
        { id: 'uf4-2', name: '2', value: 2.90, trend: 'same' }
      ],
      'O/U': [
        { id: 'uf4-o1.5', name: 'Over 1.5', value: 1.48, trend: 'same' },
        { id: 'uf4-u1.5', name: 'Under 1.5', value: 2.55, trend: 'same' }
      ],
      'DC': [
        { id: 'uf4-1x', name: '1X', value: 1.40, trend: 'same' },
        { id: 'uf4-12', name: '12', value: 1.36, trend: 'same' },
        { id: 'uf4-x2', name: 'X2', value: 1.46, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-fri-5',
    gameId: '44102',
    sport: 'basketball',
    league: 'NBA',
    countryOrCategory: 'USA',
    homeTeam: 'Milwaukee Bucks',
    awayTeam: 'Philadelphia 76ers',
    startTime: '23:00',
    date: '2026-09-25',
    dateLabel: 'Friday 25/09',
    isLive: false,
    isHot: true,
    marketsCount: 155,
    markets: {
      '1X2': [
        { id: 'uf5-1', name: '1', value: 1.72, trend: 'same' },
        { id: 'uf5-x', name: 'X', value: 14.50, trend: 'same' },
        { id: 'uf5-2', name: '2', value: 2.15, trend: 'same' }
      ],
      'O/U': [
        { id: 'uf5-o228', name: 'Over 228.5', value: 1.90, trend: 'same' },
        { id: 'uf5-u228', name: 'Under 228.5', value: 1.90, trend: 'same' }
      ]
    }
  },

  // 3. SATURDAY 26/09 (Blockbuster Weekend Matchday)
  {
    id: 'up-sat-1',
    gameId: '19823',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Newcastle United',
    awayTeam: 'Manchester City',
    startTime: '11:30 AM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 320,
    markets: {
      '1X2': [
        { id: 'us1-1', name: '1', value: 4.80, trend: 'same' },
        { id: 'us1-x', name: 'X', value: 4.20, trend: 'same' },
        { id: 'us1-2', name: '2', value: 1.68, trend: 'same' }
      ],
      'O/U': [
        { id: 'us1-o2.5', name: 'Over 2.5', value: 1.60, trend: 'same' },
        { id: 'us1-u2.5', name: 'Under 2.5', value: 2.30, trend: 'same' }
      ],
      'DC': [
        { id: 'us1-1x', name: '1X', value: 2.15, trend: 'same' },
        { id: 'us1-12', name: '12', value: 1.22, trend: 'same' },
        { id: 'us1-x2', name: 'X2', value: 1.18, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-2',
    gameId: '87055',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Leicester City',
    startTime: '02:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 295,
    markets: {
      '1X2': [
        { id: 'us2-1', name: '1', value: 1.22, trend: 'same' },
        { id: 'us2-x', name: 'X', value: 6.80, trend: 'same' },
        { id: 'us2-2', name: '2', value: 11.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'us2-o2.5', name: 'Over 2.5', value: 1.45, trend: 'same' },
        { id: 'us2-u2.5', name: 'Under 2.5', value: 2.65, trend: 'same' }
      ],
      'DC': [
        { id: 'us2-1x', name: '1X', value: 1.04, trend: 'same' },
        { id: 'us2-12', name: '12', value: 1.10, trend: 'same' },
        { id: 'us2-x2', name: 'X2', value: 4.10, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-3',
    gameId: '45446',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Chelsea FC',
    awayTeam: 'Brighton and Hove Albion',
    startTime: '02:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 285,
    markets: {
      '1X2': [
        { id: 'us3-1', name: '1', value: 1.74, trend: 'same' },
        { id: 'us3-x', name: 'X', value: 4.05, trend: 'same' },
        { id: 'us3-2', name: '2', value: 4.35, trend: 'same' }
      ],
      'O/U': [
        { id: 'us3-o2.5', name: 'Over 2.5', value: 1.55, trend: 'same' },
        { id: 'us3-u2.5', name: 'Under 2.5', value: 2.40, trend: 'same' }
      ],
      'DC': [
        { id: 'us3-1x', name: '1X', value: 1.21, trend: 'same' },
        { id: 'us3-12', name: '12', value: 1.23, trend: 'same' },
        { id: 'us3-x2', name: 'X2', value: 2.05, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-4',
    gameId: '02601',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Brentford',
    awayTeam: 'West Ham United',
    startTime: '02:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    marketsCount: 218,
    markets: {
      '1X2': [
        { id: 'us4-1', name: '1', value: 2.20, trend: 'same' },
        { id: 'us4-x', name: 'X', value: 3.55, trend: 'same' },
        { id: 'us4-2', name: '2', value: 3.15, trend: 'same' }
      ],
      'O/U': [
        { id: 'us4-o2.5', name: 'Over 2.5', value: 1.72, trend: 'same' },
        { id: 'us4-u2.5', name: 'Under 2.5', value: 2.10, trend: 'same' }
      ],
      'DC': [
        { id: 'us4-1x', name: '1X', value: 1.35, trend: 'same' },
        { id: 'us4-12', name: '12', value: 1.28, trend: 'same' },
        { id: 'us4-x2', name: 'X2', value: 1.65, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-5',
    gameId: '86567',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Everton',
    awayTeam: 'Crystal Palace',
    startTime: '02:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    marketsCount: 210,
    markets: {
      '1X2': [
        { id: 'us5-1', name: '1', value: 2.70, trend: 'same' },
        { id: 'us5-x', name: 'X', value: 3.30, trend: 'same' },
        { id: 'us5-2', name: '2', value: 2.65, trend: 'same' }
      ],
      'O/U': [
        { id: 'us5-o2.5', name: 'Over 2.5', value: 1.95, trend: 'same' },
        { id: 'us5-u2.5', name: 'Under 2.5', value: 1.82, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-6',
    gameId: '28840',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Nottingham Forest',
    awayTeam: 'Fulham',
    startTime: '02:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    marketsCount: 204,
    markets: {
      '1X2': [
        { id: 'us6-1', name: '1', value: 2.35, trend: 'same' },
        { id: 'us6-x', name: 'X', value: 3.35, trend: 'same' },
        { id: 'us6-2', name: '2', value: 3.10, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-7',
    gameId: '62328',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Wolverhampton Wanderers',
    awayTeam: 'Liverpool FC',
    startTime: '04:30 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 310,
    markets: {
      '1X2': [
        { id: 'us7-1', name: '1', value: 7.20, trend: 'same' },
        { id: 'us7-x', name: 'X', value: 5.20, trend: 'same' },
        { id: 'us7-2', name: '2', value: 1.38, trend: 'same' }
      ],
      'O/U': [
        { id: 'us7-o2.5', name: 'Over 2.5', value: 1.50, trend: 'same' },
        { id: 'us7-u2.5', name: 'Under 2.5', value: 2.55, trend: 'same' }
      ],
      'DC': [
        { id: 'us7-1x', name: '1X', value: 3.00, trend: 'same' },
        { id: 'us7-12', name: '12', value: 1.15, trend: 'same' },
        { id: 'us7-x2', name: 'X2', value: 1.09, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-8',
    gameId: '99281',
    sport: 'football',
    league: 'Bundesliga',
    countryOrCategory: 'Germany',
    homeTeam: 'Bayern Munich',
    awayTeam: 'Bayer Leverkusen',
    startTime: '04:30 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 350,
    markets: {
      '1X2': [
        { id: 'us8-1', name: '1', value: 1.70, trend: 'same' },
        { id: 'us8-x', name: 'X', value: 4.35, trend: 'same' },
        { id: 'us8-2', name: '2', value: 4.30, trend: 'same' }
      ],
      'O/U': [
        { id: 'us8-o3.5', name: 'Over 3.5', value: 2.05, trend: 'same' },
        { id: 'us8-u3.5', name: 'Under 3.5', value: 1.75, trend: 'same' }
      ],
      'DC': [
        { id: 'us8-1x', name: '1X', value: 1.22, trend: 'same' },
        { id: 'us8-12', name: '12', value: 1.20, trend: 'same' },
        { id: 'us8-x2', name: 'X2', value: 2.10, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sat-9',
    gameId: '80633',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'CA Osasuna',
    awayTeam: 'FC Barcelona',
    startTime: '07:00 PM',
    date: '2026-09-26',
    dateLabel: 'Saturday 26/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 298,
    markets: {
      '1X2': [
        { id: 'us9-1', name: '1', value: 6.00, trend: 'same' },
        { id: 'us9-x', name: 'X', value: 4.50, trend: 'same' },
        { id: 'us9-2', name: '2', value: 1.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'us9-o2.5', name: 'Over 2.5', value: 1.62, trend: 'same' },
        { id: 'us9-u2.5', name: 'Under 2.5', value: 2.25, trend: 'same' }
      ],
      'DC': [
        { id: 'us9-1x', name: '1X', value: 2.55, trend: 'same' },
        { id: 'us9-12', name: '12', value: 1.19, trend: 'same' },
        { id: 'us9-x2', name: 'X2', value: 1.12, trend: 'same' }
      ]
    }
  },

  // 4. SUNDAY 27/09 FIXTURES
  {
    id: 'up-sun-1',
    gameId: '21421',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Ipswich Town',
    awayTeam: 'Aston Villa',
    startTime: '01:00 PM',
    date: '2026-09-27',
    dateLabel: 'Sunday 27/09',
    isLive: false,
    marketsCount: 220,
    markets: {
      '1X2': [
        { id: 'usu1-1', name: '1', value: 4.20, trend: 'same' },
        { id: 'usu1-x', name: 'X', value: 3.80, trend: 'same' },
        { id: 'usu1-2', name: '2', value: 1.82, trend: 'same' }
      ],
      'O/U': [
        { id: 'usu1-o2.5', name: 'Over 2.5', value: 1.70, trend: 'same' },
        { id: 'usu1-u2.5', name: 'Under 2.5', value: 2.12, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sun-2',
    gameId: '22924',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Manchester United',
    awayTeam: 'Tottenham Hotspur',
    startTime: '03:30 PM',
    date: '2026-09-27',
    dateLabel: 'Sunday 27/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 380,
    markets: {
      '1X2': [
        { id: 'usu2-1', name: '1', value: 2.30, trend: 'same' },
        { id: 'usu2-x', name: 'X', value: 3.75, trend: 'same' },
        { id: 'usu2-2', name: '2', value: 2.90, trend: 'same' }
      ],
      'O/U': [
        { id: 'usu2-o2.5', name: 'Over 2.5', value: 1.52, trend: 'same' },
        { id: 'usu2-u2.5', name: 'Under 2.5', value: 2.45, trend: 'same' }
      ],
      'DC': [
        { id: 'usu2-1x', name: '1X', value: 1.40, trend: 'same' },
        { id: 'usu2-12', name: '12', value: 1.25, trend: 'same' },
        { id: 'usu2-x2', name: 'X2', value: 1.62, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sun-3',
    gameId: '55124',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Atletico Madrid',
    awayTeam: 'Real Madrid',
    startTime: '07:00 PM',
    date: '2026-09-27',
    dateLabel: 'Sunday 27/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 420,
    markets: {
      '1X2': [
        { id: 'usu3-1', name: '1', value: 2.80, trend: 'same' },
        { id: 'usu3-x', name: 'X', value: 3.45, trend: 'same' },
        { id: 'usu3-2', name: '2', value: 2.45, trend: 'same' }
      ],
      'O/U': [
        { id: 'usu3-o2.5', name: 'Over 2.5', value: 1.82, trend: 'same' },
        { id: 'usu3-u2.5', name: 'Under 2.5', value: 1.98, trend: 'same' }
      ],
      'DC': [
        { id: 'usu3-1x', name: '1X', value: 1.55, trend: 'same' },
        { id: 'usu3-12', name: '12', value: 1.30, trend: 'same' },
        { id: 'usu3-x2', name: 'X2', value: 1.42, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sun-4',
    gameId: '38693',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Athletic Bilbao',
    awayTeam: 'Sevilla FC',
    startTime: '02:15 PM',
    date: '2026-09-27',
    dateLabel: 'Sunday 27/09',
    isLive: false,
    marketsCount: 215,
    markets: {
      '1X2': [
        { id: 'usu4-1', name: '1', value: 1.78, trend: 'same' },
        { id: 'usu4-x', name: 'X', value: 3.65, trend: 'same' },
        { id: 'usu4-2', name: '2', value: 4.60, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-sun-5',
    gameId: '34947',
    sport: 'football',
    league: 'Serie A',
    countryOrCategory: 'Italy',
    homeTeam: 'Napoli',
    awayTeam: 'Monza',
    startTime: '06:45 PM',
    date: '2026-09-27',
    dateLabel: 'Sunday 27/09',
    isLive: false,
    isHot: true,
    marketsCount: 230,
    markets: {
      '1X2': [
        { id: 'usu5-1', name: '1', value: 1.38, trend: 'same' },
        { id: 'usu5-x', name: 'X', value: 4.80, trend: 'same' },
        { id: 'usu5-2', name: '2', value: 8.20, trend: 'same' }
      ]
    }
  },

  // 5. MONDAY 28/09 FIXTURES
  {
    id: 'up-mon-1',
    gameId: '56648',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Bournemouth',
    awayTeam: 'Southampton',
    startTime: '07:00 PM',
    date: '2026-09-28',
    dateLabel: 'Monday 28/09',
    isLive: false,
    isHot: true,
    hasLiveStream: true,
    marketsCount: 260,
    markets: {
      '1X2': [
        { id: 'um1-1', name: '1', value: 1.75, trend: 'same' },
        { id: 'um1-x', name: 'X', value: 3.90, trend: 'same' },
        { id: 'um1-2', name: '2', value: 4.40, trend: 'same' }
      ],
      'O/U': [
        { id: 'um1-o2.5', name: 'Over 2.5', value: 1.68, trend: 'same' },
        { id: 'um1-u2.5', name: 'Under 2.5', value: 2.15, trend: 'same' }
      ]
    }
  },
  {
    id: 'up-mon-2',
    gameId: '63768',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Villarreal',
    awayTeam: 'Las Palmas',
    startTime: '07:00 PM',
    date: '2026-09-28',
    dateLabel: 'Monday 28/09',
    isLive: false,
    marketsCount: 225,
    markets: {
      '1X2': [
        { id: 'um2-1', name: '1', value: 1.48, trend: 'same' },
        { id: 'um2-x', name: 'X', value: 4.60, trend: 'same' },
        { id: 'um2-2', name: '2', value: 6.20, trend: 'same' }
      ]
    }
  }
];

// Open Bets initial state from Screenshot 6 & 7:
// 1. Multiple: Borussia Dortmund vs Werder ... Stake 7.00, Cashout GHS 7.00, Pot Win 16503.17
// 2. Multiple: Austria vs Israel ... Stake 1.00, Cashout GHS 0.82
export const INITIAL_OPEN_BETS: PlacedBet[] = [
  {
    id: 'bet-dortmund-7',
    ticketId: 'SBGH-7819-2041',
    transactionId: 'TX-GH-892184912',
    bookingCode: 'DA2R3J',
    type: 'Multiple',
    date: '24/09 07:55',
    isLive: true,
    selections: [
      {
        matchId: 'live-dortmund',
        gameId: '10924',
        matchTitle: 'Borussia Dortmund vs Werder ...',
        marketName: 'Over/Under',
        selectionName: 'Over 1.5',
        odd: 1.32,
        isLive: true,
        liveOdds: 1.25,
        liveOddsTrend: 'same',
        liveScore: '1:0',
        liveTime: "68' H2",
        hasTracker: true,
        hasStats: true
      },
      {
        matchId: 'live-rayo',
        gameId: '29811',
        matchTitle: 'Rayo Vallecano vs Athletic Bilbao',
        marketName: 'Over/Under',
        selectionName: 'Over 1.5',
        odd: 1.26,
        isLive: true,
        liveOdds: 1.18,
        liveOddsTrend: 'down',
        liveScore: '2:1',
        liveTime: "83' H2",
        hasTracker: true,
        hasStats: true
      }
    ],
    stake: 7.00,
    totalOdds: 2357.6,
    potentialWin: 16503.17,
    status: 'open',
    cashoutAvailable: true,
    cashoutAmount: 7.00
  },
  {
    id: 'bet-austria-1',
    ticketId: 'SBGH-9812-3312',
    transactionId: 'TX-GH-312984921',
    bookingCode: 'DA2R1A',
    type: 'Multiple',
    date: '24/09 07:56',
    isLive: false,
    selections: [
      {
        matchId: 'pre-austria',
        gameId: '18492',
        matchTitle: 'Austria vs Israel',
        marketName: '1X2',
        selectionName: 'Home',
        odd: 1.22,
        isLive: false,
        hasTracker: false,
        hasStats: true
      }
    ],
    stake: 1.00,
    totalOdds: 1.22,
    potentialWin: 1.22,
    status: 'open',
    cashoutAvailable: true,
    cashoutAmount: 0.82
  }
];

// Bet History matching Screenshot 9:
// 24 Sep: Multiple Won > Total Stake(GHS) 7.00, Total Return 7.00
export const INITIAL_BET_HISTORY: PlacedBet[] = [
  {
    id: 'bet-hist-won-1',
    ticketId: 'SBGH-5512-9901',
    transactionId: 'TX-GH-559182391',
    bookingCode: 'DA2R3J',
    type: 'Multiple',
    date: '24 Sep',
    isLive: false,
    selections: [
      {
        matchId: 'h-1',
        gameId: '5501',
        matchTitle: 'Rayo Vallecano v Athletic Bilbao',
        marketName: '1X2',
        selectionName: 'Home',
        odd: 1.85,
        isLive: false
      },
      {
        matchId: 'h-2',
        gameId: '5502',
        matchTitle: 'Alaves v Atletico Madrid',
        marketName: '1X2',
        selectionName: 'Away',
        odd: 1.65,
        isLive: false
      },
      {
        matchId: 'h-3',
        gameId: '5503',
        matchTitle: 'Real Madrid v Villarreal',
        marketName: '1X2',
        selectionName: 'Home',
        odd: 1.40,
        isLive: false
      }
    ],
    stake: 7.00,
    totalOdds: 1.00,
    potentialWin: 7.00,
    status: 'won',
    cashoutAvailable: false
  }
];

export const GUEST_USER: UserProfile = {
  username: '',
  balance: 0.00,
  currency: 'GHC',
  loyaltyTier: 'Tier 1',
  loyaltyProgress: 0,
  nextUpdate: '01 Oct',
  dailyStreak: 0,
  unreadNotifications: 0,
  phone: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  location: 'Ghana',
  email: '',
  isEmailVerified: false,
  avatarUrl: '/user_beach_avatar.jpg',
  isLoggedIn: false
};

export const DEMO_USER: UserProfile = {
  username: 'charles_asumah',
  balance: 5000.00,
  currency: 'GHC',
  loyaltyTier: 'Tier 1',
  loyaltyProgress: 96,
  nextUpdate: '01 Oct',
  dailyStreak: 5,
  unreadNotifications: 1,
  phone: '0204891235',
  firstName: 'CHARLES',
  lastName: 'ASUMAH',
  dateOfBirth: '15/05/1998',
  location: 'Ghana',
  email: 'charles.asumah@sportybet.gh',
  isEmailVerified: true,
  avatarUrl: '/user_beach_avatar.jpg',
  isLoggedIn: true
};

export const INITIAL_USER: UserProfile = GUEST_USER;

export const SPORTS_LIST = [
  { id: 'popular', name: 'Popular', icon: 'Flame', count: 420 },
  { id: 'football', name: 'Football', icon: 'CircleDot', count: 350 },
  { id: 'vfootball', name: 'vFootball', icon: 'Gamepad2', count: 85 },
  { id: 'basketball', name: 'Basketball', icon: 'Circle', count: 120 },
  { id: 'tennis', name: 'Tennis', icon: 'Activity', count: 90 },
  { id: 'esoccer', name: 'eSoccer', icon: 'Gamepad', count: 45 },
  { id: 'tabletennis', name: 'Table Tennis', icon: 'CircleSlash', count: 64 },
  { id: 'ebasketball', name: 'eBasketball', icon: 'Cpu', count: 32 },
  { id: 'etennis', name: 'eTennis', icon: 'Tv', count: 18 },
  { id: 'icehockey', name: 'Ice Hockey', icon: 'Shield', count: 27 },
  { id: 'eicehockey', name: 'eIce Hockey', icon: 'Cpu', count: 14 },
  { id: 'handball', name: 'Handball', icon: 'Goal', count: 19 }
];

export const LEAGUES_LIST = [
  { id: 'today', name: "Today's Football", hot: true, sport: 'football' },
  { id: 'next3h', name: "Football In Next 3 Hours", hot: true, sport: 'football' },
  { id: 'afcon', name: "AFCON Qualifiers", hot: true, sport: 'football' },
  { id: 'uefa', name: "UEFA Nations League", hot: true, sport: 'football' },
  { id: 'friendly', name: "International Friendlies", hot: false, sport: 'football' },
  { id: 'epl', name: "ENGLAND PREMIER LEAGUE", hot: true, sport: 'football' },
  { id: 'laliga', name: "SPAIN LA LIGA", hot: true, sport: 'football' },
  { id: 'seriea', name: "ITALY SERIE A", hot: false, sport: 'football' },
  { id: 'bundesliga', name: "GERMANY BUNDESLIGA", hot: false, sport: 'football' },
  { id: 'ligue1', name: "FRANCE LIGUE 1", hot: false, sport: 'football' },
  { id: 'euroleague', name: "Euroleague", hot: false, sport: 'basketball' },
  { id: 'wnba', name: "WNBA", hot: false, sport: 'basketball' },
  { id: 'atp', name: "ATP/WTA", hot: false, sport: 'tennis' }
];

export const MINI_GAMES = [
  {
    id: 'sporty-hero',
    name: 'Sporty Hero (Crash)',
    category: 'Crash Game',
    tag: 'HOT🔥',
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80',
    minBet: 0.5,
    maxMultiplier: 1000
  },
  {
    id: 'spin-2-win',
    name: 'Spin 2 Win',
    category: 'Roulette',
    tag: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&w=400&q=80',
    minBet: 1.0,
    maxMultiplier: 36
  },
  {
    id: 'virtual-cup',
    name: 'Instant Virtuals',
    category: 'Football',
    tag: 'NEW',
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=400&q=80',
    minBet: 0.2,
    maxMultiplier: 250
  },
  {
    id: 'red-black',
    name: 'Red or Black',
    category: 'Card Game',
    tag: 'FAST',
    image: 'https://images.unsplash.com/photo-1511193311914-0346f16efe90?auto=format&fit=crop&w=400&q=80',
    minBet: 0.5,
    maxMultiplier: 2.0
  }
];
