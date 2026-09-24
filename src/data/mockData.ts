import { Match, PlacedBet, UserProfile } from '../types';

export const INITIAL_MATCHES: Match[] = [
  // --- LIVE MATCHES (Matches screenshot 1 & 2 & 3) ---
  {
    id: 'live-alloa-hib',
    gameId: '19482',
    sport: 'football',
    league: 'Scotland - Challenge Cup',
    countryOrCategory: 'Scotland',
    homeTeam: 'Alloa Athletic FC',
    awayTeam: 'Hibernian B',
    homeScore: 1,
    awayScore: 0,
    minute: '19:27',
    period: 'H1',
    isLive: true,
    isHot: false,
    marketsCount: 41,
    markets: {
      '1X2': [
        { id: 'lah-1', name: '1', value: 1.03, trend: 'same' },
        { id: 'lah-x', name: 'X', value: 11.50, trend: 'same' },
        { id: 'lah-2', name: '2', value: 24.00, trend: 'same' }
      ],
      'O/U': [
        { id: 'lah-o1.5', name: 'Over 1.5', value: 1.15, trend: 'same' },
        { id: 'lah-u1.5', name: 'Under 1.5', value: 4.80, trend: 'same' }
      ],
      'DC': [
        { id: 'lah-1x', name: '1X', value: 1.01, trend: 'same' },
        { id: 'lah-12', name: '12', value: 1.04, trend: 'same' },
        { id: 'lah-x2', name: 'X2', value: 9.00, trend: 'same' }
      ],
      '1st Half O/U': [
        { id: 'lah-h-o', name: 'Over 1.5', value: 1.95, trend: 'same' },
        { id: 'lah-h-u', name: 'Under 1.5', value: 1.75, trend: 'same' }
      ],
      'Handicap': [
        { id: 'lah-h1', name: '(-1.5) 1', value: 1.35, trend: 'same' },
        { id: 'lah-h2', name: '(+1.5) 2', value: 2.85, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-1',
    gameId: '29811',
    sport: 'football',
    league: 'UEFA Women\'s Champions League',
    countryOrCategory: 'International Clubs',
    homeTeam: 'Bayern Munich W',
    awayTeam: 'Manchester City W',
    homeScore: 2,
    awayScore: 0,
    minute: '34:12',
    period: 'H1',
    isLive: true,
    isHot: true,
    marketsCount: 140,
    markets: {
      '1X2': [
        { id: 'l1-1', name: '1', value: 1.05, trend: 'same' },
        { id: 'l1-x', name: 'X', value: 9.25, trend: 'down' },
        { id: 'l1-2', name: '2', value: 23.00, trend: 'down' }
      ],
      'O/U': [
        { id: 'l1-o2.5', name: 'Over 2.5', value: 1.38, trend: 'same' },
        { id: 'l1-u2.5', name: 'Under 2.5', value: 2.85, trend: 'up' }
      ],
      'DC': [
        { id: 'l1-1x', name: '1X', value: 1.01, trend: 'same' },
        { id: 'l1-12', name: '12', value: 1.06, trend: 'same' },
        { id: 'l1-x2', name: 'X2', value: 8.50, trend: 'down' }
      ],
      '1st Half O/U': [
        { id: 'l1-h-o', name: 'Over 2.5', value: 2.10, trend: 'up' },
        { id: 'l1-h-u', name: 'Under 2.5', value: 1.65, trend: 'down' }
      ],
      'Handicap': [
        { id: 'l1-h1', name: '(-1.5) 1', value: 1.48, trend: 'same' },
        { id: 'l1-h2', name: '(+1.5) 2', value: 2.55, trend: 'up' }
      ]
    }
  },
  {
    id: 'live-2',
    gameId: '38192',
    sport: 'football',
    league: 'UEFA Champions League Qualifiers',
    countryOrCategory: 'International Clubs',
    homeTeam: 'Inter Milano',
    awayTeam: 'Hacken Gothenburg',
    homeScore: 1,
    awayScore: 0,
    minute: '29:18',
    period: 'H1',
    isLive: true,
    isHot: true,
    marketsCount: 145,
    markets: {
      '1X2': [
        { id: 'l2-1', name: '1', value: 1.37, trend: 'same' },
        { id: 'l2-x', name: 'X', value: 4.15, trend: 'same' },
        { id: 'l2-2', name: '2', value: 7.75, trend: 'up' }
      ],
      'O/U': [
        { id: 'l2-o2.5', name: 'Over 2.5', value: 1.62, trend: 'same' },
        { id: 'l2-u2.5', name: 'Under 2.5', value: 2.20, trend: 'same' }
      ],
      'DC': [
        { id: 'l2-1x', name: '1X', value: 1.08, trend: 'same' },
        { id: 'l2-12', name: '12', value: 1.18, trend: 'same' },
        { id: 'l2-x2', name: 'X2', value: 2.90, trend: 'up' }
      ],
      '1st Half O/U': [
        { id: 'l2-h-o', name: 'Over 1.5', value: 2.25, trend: 'up' },
        { id: 'l2-h-u', name: 'Under 1.5', value: 1.58, trend: 'down' }
      ],
      'Handicap': [
        { id: 'l2-h1', name: '(-1) 1', value: 1.95, trend: 'same' },
        { id: 'l2-h2', name: '(+1) 2', value: 1.82, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-3',
    gameId: '19041',
    sport: 'football',
    league: 'U21 Professional Development League',
    countryOrCategory: 'England Amateur',
    homeTeam: 'Bristol City U21',
    awayTeam: 'Hull City U21',
    homeScore: 0,
    awayScore: 0,
    minute: '14:19',
    period: 'H1',
    isLive: true,
    isHot: false,
    marketsCount: 105,
    markets: {
      '1X2': [
        { id: 'l3-1', name: '1', value: 1.36, trend: 'same' },
        { id: 'l3-x', name: 'X', value: 5.25, trend: 'up' },
        { id: 'l3-2', name: '2', value: 6.50, trend: 'down' }
      ],
      'O/U': [
        { id: 'l3-o2.5', name: 'Over 2.5', value: 1.45, trend: 'same' },
        { id: 'l3-u2.5', name: 'Under 2.5', value: 2.60, trend: 'same' }
      ],
      'DC': [
        { id: 'l3-1x', name: '1X', value: 1.10, trend: 'same' },
        { id: 'l3-12', name: '12', value: 1.14, trend: 'same' },
        { id: 'l3-x2', name: 'X2', value: 2.80, trend: 'down' }
      ],
      '1st Half O/U': [
        { id: 'l3-h-o', name: 'Over 0.5', value: 1.40, trend: 'same' },
        { id: 'l3-h-u', name: 'Under 0.5', value: 2.75, trend: 'same' }
      ],
      'Handicap': [
        { id: 'l3-h1', name: '(-1) 1', value: 1.90, trend: 'same' },
        { id: 'l3-h2', name: '(+1) 2', value: 1.85, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-4',
    gameId: '22871',
    sport: 'football',
    league: 'Cup',
    countryOrCategory: 'Estonia',
    homeTeam: 'FC Tallinn',
    awayTeam: 'Harju JK Laagri',
    homeScore: 0,
    awayScore: 0,
    minute: '14:17',
    period: 'H1',
    isLive: true,
    isHot: false,
    marketsCount: 60,
    markets: {
      '1X2': [
        { id: 'l4-1', name: '1', value: 1.25, trend: 'same' },
        { id: 'l4-x', name: 'X', value: 6.00, trend: 'same' },
        { id: 'l4-2', name: '2', value: 8.00, trend: 'up' }
      ],
      'O/U': [
        { id: 'l4-o2.5', name: 'Over 2.5', value: 1.35, trend: 'same' },
        { id: 'l4-u2.5', name: 'Under 2.5', value: 2.95, trend: 'same' }
      ],
      'DC': [
        { id: 'l4-1x', name: '1X', value: 1.05, trend: 'same' },
        { id: 'l4-12', name: '12', value: 1.10, trend: 'same' },
        { id: 'l4-x2', name: 'X2', value: 3.40, trend: 'same' }
      ],
      '1st Half O/U': [
        { id: 'l4-h-o', name: 'Over 1.5', value: 2.05, trend: 'same' },
        { id: 'l4-h-u', name: 'Under 1.5', value: 1.70, trend: 'same' }
      ],
      'Handicap': [
        { id: 'l4-h1', name: '(-1.5) 1', value: 1.75, trend: 'same' },
        { id: 'l4-h2', name: '(+1.5) 2', value: 2.05, trend: 'same' }
      ]
    }
  },
  {
    id: 'live-5',
    gameId: '16602',
    sport: 'football',
    league: 'Liga 2',
    countryOrCategory: 'Romania',
    homeTeam: 'Asa Targu Mures',
    awayTeam: 'CS Dinamo Bucuresti',
    homeScore: 0,
    awayScore: 0,
    minute: '14:41',
    period: 'H1',
    isLive: true,
    isHot: false,
    marketsCount: 106,
    markets: {
      '1X2': [
        { id: 'l5-1', name: '1', value: 1.22, trend: 'same' },
        { id: 'l5-x', name: 'X', value: 5.70, trend: 'same' },
        { id: 'l5-2', name: '2', value: 11.50, trend: 'same' }
      ],
      'O/U': [
        { id: 'l5-o2.5', name: 'Over 2.5', value: 1.50, trend: 'same' },
        { id: 'l5-u2.5', name: 'Under 2.5', value: 2.45, trend: 'same' }
      ],
      'DC': [
        { id: 'l5-1x', name: '1X', value: 1.04, trend: 'same' },
        { id: 'l5-12', name: '12', value: 1.12, trend: 'same' },
        { id: 'l5-x2', name: 'X2', value: 3.90, trend: 'same' }
      ],
      '1st Half O/U': [
        { id: 'l5-h-o', name: 'Over 0.5', value: 1.36, trend: 'same' },
        { id: 'l5-h-u', name: 'Under 0.5', value: 2.90, trend: 'same' }
      ],
      'Handicap': [
        { id: 'l5-h1', name: '(-1) 1', value: 1.65, trend: 'same' },
        { id: 'l5-h2', name: '(+1) 2', value: 2.20, trend: 'same' }
      ]
    }
  },

  // --- UPCOMING / TODAY / HIGHLIGHTS MATCHES (Screenshot 2) ---
  {
    id: 'up-1',
    gameId: '41392',
    sport: 'football',
    league: 'EFL Trophy',
    countryOrCategory: 'England',
    homeTeam: 'Barnsley FC',
    awayTeam: 'Leeds United U21',
    startTime: '18:00',
    isLive: false,
    isHot: true,
    marketsCount: 234,
    markets: {
      '1X2': [
        { id: 'u1-1', name: '1', value: 1.32 },
        { id: 'u1-x', name: 'X', value: 5.80 },
        { id: 'u1-2', name: '2', value: 7.00 }
      ],
      'O/U': [
        { id: 'u1-o2.5', name: 'Over 2.5', value: 1.40 },
        { id: 'u1-u2.5', name: 'Under 2.5', value: 2.75 }
      ],
      'DC': [
        { id: 'u1-1x', name: '1X', value: 1.09 },
        { id: 'u1-12', name: '12', value: 1.13 },
        { id: 'u1-x2', name: 'X2', value: 3.10 }
      ],
      '1st Half O/U': [
        { id: 'u1-h-o', name: 'Over 1.5', value: 2.15 },
        { id: 'u1-h-u', name: 'Under 1.5', value: 1.65 }
      ],
      'Handicap': [
        { id: 'u1-h1', name: '(-1) 1', value: 1.82 },
        { id: 'u1-h2', name: '(+1) 2', value: 1.95 }
      ]
    }
  },
  {
    id: 'up-2',
    gameId: '11643',
    sport: 'football',
    league: 'EFL Trophy',
    countryOrCategory: 'England',
    homeTeam: 'Leicester',
    awayTeam: 'Fulham U21',
    startTime: '18:00',
    isLive: false,
    isHot: true,
    marketsCount: 180,
    markets: {
      '1X2': [
        { id: 'u2-1', name: '1', value: 1.14 },
        { id: 'u2-x', name: 'X', value: 8.80 },
        { id: 'u2-2', name: '2', value: 13.00 }
      ],
      'O/U': [
        { id: 'u2-o2.5', name: 'Over 2.5', value: 1.30 },
        { id: 'u2-u2.5', name: 'Under 2.5', value: 3.30 }
      ],
      'DC': [
        { id: 'u2-1x', name: '1X', value: 1.03 },
        { id: 'u2-12', name: '12', value: 1.07 },
        { id: 'u2-x2', name: 'X2', value: 4.80 }
      ],
      '1st Half O/U': [
        { id: 'u2-h-o', name: 'Over 1.5', value: 1.85 },
        { id: 'u2-h-u', name: 'Under 1.5', value: 1.90 }
      ],
      'Handicap': [
        { id: 'u2-h1', name: '(-2) 1', value: 2.05 },
        { id: 'u2-h2', name: '(+2) 2', value: 1.70 }
      ]
    }
  },
  {
    id: 'up-3',
    gameId: '48079',
    sport: 'football',
    league: 'EFL Trophy',
    countryOrCategory: 'England',
    homeTeam: 'Luton Town',
    awayTeam: 'Ipswich Town U21',
    startTime: '18:00',
    isLive: false,
    isHot: true,
    marketsCount: 195,
    markets: {
      '1X2': [
        { id: 'u3-1', name: '1', value: 1.20 },
        { id: 'u3-x', name: 'X', value: 7.20 },
        { id: 'u3-2', name: '2', value: 9.90 }
      ],
      'O/U': [
        { id: 'u3-o2.5', name: 'Over 2.5', value: 1.35 },
        { id: 'u3-u2.5', name: 'Under 2.5', value: 3.00 }
      ],
      'DC': [
        { id: 'u3-1x', name: '1X', value: 1.04 },
        { id: 'u3-12', name: '12', value: 1.08 },
        { id: 'u3-x2', name: 'X2', value: 4.10 }
      ],
      '1st Half O/U': [
        { id: 'u3-h-o', name: 'Over 1.5', value: 1.95 },
        { id: 'u3-h-u', name: 'Under 1.5', value: 1.80 }
      ],
      'Handicap': [
        { id: 'u3-h1', name: '(-1.5) 1', value: 1.62 },
        { id: 'u3-h2', name: '(+1.5) 2', value: 2.25 }
      ]
    }
  },
  {
    id: 'up-4',
    gameId: '54201',
    sport: 'football',
    league: 'Premier League',
    countryOrCategory: 'England',
    homeTeam: 'Arsenal FC',
    awayTeam: 'Chelsea FC',
    startTime: '20:00',
    isLive: false,
    isHot: true,
    marketsCount: 420,
    markets: {
      '1X2': [
        { id: 'u4-1', name: '1', value: 1.85 },
        { id: 'u4-x', name: 'X', value: 3.75 },
        { id: 'u4-2', name: '2', value: 4.20 }
      ],
      'O/U': [
        { id: 'u4-o2.5', name: 'Over 2.5', value: 1.75 },
        { id: 'u4-u2.5', name: 'Under 2.5', value: 2.05 }
      ],
      'DC': [
        { id: 'u4-1x', name: '1X', value: 1.22 },
        { id: 'u4-12', name: '12', value: 1.25 },
        { id: 'u4-x2', name: 'X2', value: 1.95 }
      ],
      '1st Half O/U': [
        { id: 'u4-h-o', name: 'Over 1.5', value: 2.50 },
        { id: 'u4-h-u', name: 'Under 1.5', value: 1.50 }
      ],
      'Handicap': [
        { id: 'u4-h1', name: '(-1) 1', value: 2.55 },
        { id: 'u4-h2', name: '(+1) 2', value: 1.52 }
      ]
    }
  },
  {
    id: 'up-5',
    gameId: '63124',
    sport: 'football',
    league: 'La Liga',
    countryOrCategory: 'Spain',
    homeTeam: 'Real Madrid',
    awayTeam: 'Atletico Madrid',
    startTime: '21:00',
    isLive: false,
    isHot: true,
    marketsCount: 388,
    markets: {
      '1X2': [
        { id: 'u5-1', name: '1', value: 1.92 },
        { id: 'u5-x', name: 'X', value: 3.50 },
        { id: 'u5-2', name: '2', value: 3.95 }
      ],
      'O/U': [
        { id: 'u5-o2.5', name: 'Over 2.5', value: 1.82 },
        { id: 'u5-u2.5', name: 'Under 2.5', value: 1.98 }
      ],
      'DC': [
        { id: 'u5-1x', name: '1X', value: 1.25 },
        { id: 'u5-12', name: '12', value: 1.28 },
        { id: 'u5-x2', name: 'X2', value: 1.85 }
      ],
      '1st Half O/U': [
        { id: 'u5-h-o', name: 'Over 1.5', value: 2.60 },
        { id: 'u5-h-u', name: 'Under 1.5', value: 1.45 }
      ],
      'Handicap': [
        { id: 'u5-h1', name: '(-1) 1', value: 2.65 },
        { id: 'u5-h2', name: '(+1) 2', value: 1.48 }
      ]
    }
  },
  {
    id: 'up-6',
    gameId: '77218',
    sport: 'basketball',
    league: 'NBA',
    countryOrCategory: 'USA',
    homeTeam: 'Boston Celtics',
    awayTeam: 'LA Lakers',
    startTime: '23:30',
    isLive: false,
    isHot: true,
    marketsCount: 160,
    markets: {
      '1X2': [
        { id: 'b1-1', name: '1', value: 1.55 },
        { id: 'b1-x', name: 'X', value: 15.00 },
        { id: 'b1-2', name: '2', value: 2.45 }
      ],
      'O/U': [
        { id: 'b1-o220', name: 'Over 224.5', value: 1.90 },
        { id: 'b1-u220', name: 'Under 224.5', value: 1.90 }
      ],
      'Handicap': [
        { id: 'b1-h1', name: '(-4.5) 1', value: 1.90 },
        { id: 'b1-h2', name: '(+4.5) 2', value: 1.90 }
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
