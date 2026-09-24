export interface OddItem {
  id: string;
  name: string; // '1' | 'X' | '2' | 'Over' | 'Under' | '1X' | '12' | 'X2'
  value: number;
  prevValue?: number;
  trend?: 'up' | 'down' | 'same';
}

export interface MarketGroup {
  name: string; // '1X2' | 'O/U' | 'DC' | '1st Half O/U' | 'Handicap'
  odds: OddItem[];
  extraInfo?: string; // e.g. '2.5' for O/U
}

export interface Match {
  id: string;
  gameId: string;
  sport: string; // 'football' | 'basketball' | 'tennis'
  league: string;
  countryOrCategory: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  minute?: string;
  period?: string; // 'H1' | 'H2' | 'HT'
  isLive: boolean;
  isHot?: boolean;
  startTime?: string;
  date?: string; // YYYY-MM-DD
  dateLabel?: string; // e.g. 'Today 24/09', 'Friday 25/09'
  commenceTime?: string;
  hasLiveStream?: boolean;
  marketsCount: number; // e.g. +145
  markets: Record<string, OddItem[]>; // market type -> odds
}

export interface BetSelection {
  matchId: string;
  gameId: string;
  matchTitle: string;
  marketName: string;
  selectionName: string;
  odd: number;
  isLive?: boolean;
  liveOdds?: number;
  liveOddsTrend?: 'up' | 'down' | 'same';
  liveScore?: string;
  liveTime?: string;
  hasStream?: boolean;
  hasTracker?: boolean;
  hasStats?: boolean;
  handicapValue?: string;
}

export interface PlacedBet {
  id: string;
  ticketId: string;
  transactionId?: string;
  bookingCode?: string;
  type: 'Single' | 'Multiple';
  date: string;
  isLive: boolean;
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: 'open' | 'won' | 'lost' | 'cashed_out';
  cashoutAvailable: boolean;
  cashoutAmount?: number;
  canRebet?: boolean;
}

export type ActiveTab = 'sports' | 'az_menu' | 'games' | 'open_bets' | 'me' | 'deposit';

export interface UserProfile {
  username: string;
  balance: number;
  currency: string;
  loyaltyTier: string;
  loyaltyProgress: number;
  nextUpdate: string;
  dailyStreak: number;
  unreadNotifications: number;
  phone: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
  email: string;
  isEmailVerified: boolean;
  avatarUrl: string;
  isLoggedIn: boolean;
}
