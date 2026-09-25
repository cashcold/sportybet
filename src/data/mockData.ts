import { Match, PlacedBet, UserProfile } from '../types';
import { REAL_UPCOMING_FIXTURES } from './realFixtures';

// 100% Real Matches from The Odds API & today's official fixtures (no fake matches)
export const INITIAL_MATCHES: Match[] = REAL_UPCOMING_FIXTURES;

// Open Bets initial state: Real fixtures
export const INITIAL_OPEN_BETS: PlacedBet[] = [
  {
    id: 'bet-nations-1',
    ticketId: 'SBGH-7819-2041',
    transactionId: 'TX-GH-892184912',
    bookingCode: 'DA2R3J',
    type: 'Multiple',
    date: '25/09 07:55',
    isLive: true,
    selections: [
      {
        matchId: 'live-alg-tun-u20',
        gameId: '21094',
        matchTitle: 'Algeria U20 vs Tunisia U20',
        marketName: '1X2',
        selectionName: 'Draw (X)',
        odd: 1.85,
        isLive: true,
        liveOdds: 1.85,
        liveOddsTrend: 'same',
        liveScore: '1:1',
        liveTime: "76' 2H",
        hasTracker: true,
        hasStats: true
      },
      {
        matchId: 'theodds-95d5c8d1489bc284b68dc332fa1cb854',
        gameId: '95581',
        matchTitle: 'Italy vs Belgium',
        marketName: '1X2',
        selectionName: 'Italy (1)',
        odd: 2.27,
        isLive: false,
        liveOdds: 2.27,
        liveOddsTrend: 'same',
        hasTracker: true,
        hasStats: true
      }
    ],
    stake: 7.00,
    totalOdds: 4.20,
    potentialWin: 29.40,
    status: 'open',
    cashoutAvailable: true,
    cashoutAmount: 7.00
  },
  {
    id: 'bet-france-1',
    ticketId: 'SBGH-9812-3312',
    transactionId: 'TX-GH-312984921',
    bookingCode: 'DA2R1A',
    type: 'Single',
    date: '25/09 07:56',
    isLive: false,
    selections: [
      {
        matchId: 'theodds-2b7592be536420c10378dd7522466f6a',
        gameId: '27592',
        matchTitle: 'Turkey vs France',
        marketName: '1X2',
        selectionName: 'France (2)',
        odd: 1.62,
        isLive: false,
        hasTracker: false,
        hasStats: true
      }
    ],
    stake: 5.00,
    totalOdds: 1.62,
    potentialWin: 8.10,
    status: 'open',
    cashoutAvailable: true,
    cashoutAmount: 4.80
  }
];

// Bet History
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
        matchId: 'theodds-d559e0b2cc9b79504ad6d3e221ea050f',
        gameId: '55902',
        matchTitle: 'Armenia vs Latvia',
        marketName: '1X2',
        selectionName: 'Armenia (1)',
        odd: 1.85,
        isLive: false
      },
      {
        matchId: 'theodds-56e89688e8dcce4889162404c8290f50',
        gameId: '56898',
        matchTitle: 'Georgia vs Northern Ireland',
        marketName: '1X2',
        selectionName: 'Georgia (1)',
        odd: 1.90,
        isLive: false
      }
    ],
    stake: 7.00,
    totalOdds: 3.52,
    potentialWin: 24.64,
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
  { id: 'nba', name: "NBA", hot: true, sport: 'basketball' },
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
