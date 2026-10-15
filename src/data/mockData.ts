import { Match, PlacedBet, UserProfile } from '../types';
import { REAL_UPCOMING_FIXTURES } from './realFixtures';

// 100% Real Matches from The Odds API & today's official fixtures (no fake matches)
export const INITIAL_MATCHES: Match[] = REAL_UPCOMING_FIXTURES;

// Open Bets initial state: Real fixtures
export const INITIAL_OPEN_BETS: PlacedBet[] = [
  {
    id: 'bet-ucl-cs-lask-villa',
    ticketId: 'SBGH-9182-4411',
    transactionId: 'TX-GH-918244111',
    bookingCode: 'GH8419',
    type: 'Multiple',
    date: '14/10 18:30',
    isLive: false,
    selections: [
      {
        matchId: 'theodds-2903ee092f7e08c549b130a3d394ac3c',
        gameId: '29030',
        matchTitle: 'LASK v Liverpool',
        marketName: 'Correct Score',
        selectionName: '1:3',
        odd: 11.00,
        isLive: false,
        liveOdds: 11.00,
        liveOddsTrend: 'same',
        liveScore: '1:3',
        liveTime: 'Finished',
        ftScore: '1:3',
        outcome: '1:3',
        isWon: false,
        predictionStatus: 'pending',
        gameDate: '14/10 18:45',
        hasStream: true,
        hasTracker: true,
        hasStats: true
      },
      {
        matchId: 'theodds-aston-villa-fenerbahce-ucl',
        gameId: '33745',
        matchTitle: 'Aston Villa v Fenerbahce',
        marketName: 'Correct Score',
        selectionName: '2:1',
        odd: 8.50,
        isLive: false,
        liveOdds: 8.50,
        liveOddsTrend: 'same',
        liveScore: '2:1',
        liveTime: 'Finished',
        ftScore: '2:1',
        outcome: '2:1',
        isWon: false,
        predictionStatus: 'pending',
        gameDate: '14/10 20:00',
        hasStream: true,
        hasTracker: true,
        hasStats: true
      }
    ],
    stake: 10.00,
    totalOdds: 93.50,
    potentialWin: 935.00,
    status: 'open',
    cashoutAvailable: true,
    cashoutAmount: 9.50,
    canRebet: true
  }
];

// Bet History - Exact SportyBet Settled Clone Tickets
export const INITIAL_BET_HISTORY: PlacedBet[] = [];

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
