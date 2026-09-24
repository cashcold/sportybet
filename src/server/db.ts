import { Match, PlacedBet, UserProfile, BetSelection } from '../types';
import { INITIAL_MATCHES, INITIAL_OPEN_BETS, INITIAL_BET_HISTORY, DEMO_USER } from '../data/mockData';

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_won' | 'cashout';
  amount: number;
  currency: string;
  provider?: string;
  accountNumber?: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
}

export interface BookingCodeRecord {
  code: string;
  createdAt: string;
  expiresAt: string;
  selections: BetSelection[];
  totalOdds: number;
}

// In-Memory Database store with mock persistence
class Database {
  public matches: Match[] = [];
  public users: Map<string, UserProfile> = new Map();
  public userSessions: Map<string, string> = new Map(); // token -> phone
  public openBets: Map<string, PlacedBet[]> = new Map(); // phone -> bets
  public betHistory: Map<string, PlacedBet[]> = new Map(); // phone -> bets
  public transactions: Map<string, WalletTransaction[]> = new Map(); // phone -> transactions
  public bookingCodes: Map<string, BookingCodeRecord> = new Map();

  constructor() {
    this.init();
  }

  private init() {
    // 1. Initialize matches
    this.matches = JSON.parse(JSON.stringify(INITIAL_MATCHES));

    // 2. Initialize default demo user (Charles Asumah) for demo testing
    const demoUser: UserProfile = JSON.parse(JSON.stringify(DEMO_USER));
    const demoPhone = demoUser.phone || '0204891235';
    this.users.set(demoPhone, demoUser);
    this.users.set('20******5', demoUser);
    this.users.set('0204891235', demoUser);

    // 3. Initialize default bets for demo account
    this.openBets.set(demoPhone, JSON.parse(JSON.stringify(INITIAL_OPEN_BETS)));
    this.betHistory.set(demoPhone, JSON.parse(JSON.stringify(INITIAL_BET_HISTORY)));
    this.openBets.set('20******5', JSON.parse(JSON.stringify(INITIAL_OPEN_BETS)));
    this.betHistory.set('20******5', JSON.parse(JSON.stringify(INITIAL_BET_HISTORY)));

    // 4. Initialize default transactions
    this.transactions.set(demoPhone, [
      {
        id: 'tx-001',
        type: 'deposit',
        amount: 50.00,
        currency: 'GHC',
        provider: 'MTN Mobile Money',
        accountNumber: '024****892',
        reference: 'GH2609228912',
        status: 'completed',
        date: new Date(Date.now() - 3600000 * 24).toISOString(),
        description: 'MoMo Deposit via *711*222#'
      },
      {
        id: 'tx-002',
        type: 'bet_placed',
        amount: 10.00,
        currency: 'GHC',
        reference: 'TKT-GH-99120',
        status: 'completed',
        date: new Date(Date.now() - 3600000 * 5).toISOString(),
        description: 'Single Bet - Arsenal FC'
      }
    ]);

    // 5. Initialize sample booking code
    this.bookingCodes.set('BC72A9', {
      code: 'BC72A9',
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(),
      selections: INITIAL_OPEN_BETS[0]?.selections || [],
      totalOdds: INITIAL_OPEN_BETS[0]?.totalOdds || 2.15
    });
  }

  public getUserByToken(token?: string): UserProfile | null {
    if (!token) return null;
    const cleanToken = token.replace('Bearer ', '').trim();
    if (!cleanToken) return null;
    const phone = this.userSessions.get(cleanToken);
    if (!phone) return null;
    return this.users.get(phone) || null;
  }
}

export const db = new Database();
