import { Match, PlacedBet, UserProfile, BetSelection } from '../types';

const BASE_URL = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sportybet_auth_token') || 'sporty-session-default';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

export const api = {
  // --- AUTH ENDPOINTS ---
  auth: {
    async login(phone: string, password?: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('sportybet_auth_token', data.token);
        }
        return data;
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async register(phone: string, password?: string): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        const data = await res.json();
        if (data.token) {
          localStorage.setItem('sportybet_auth_token', data.token);
        }
        return data;
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getMe(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/auth/me`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/auth/profile`, {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(updates)
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async claimDailyStreak(): Promise<{ success: boolean; dailyStreak?: number; balance?: number; message?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/auth/daily-streak`, {
          method: 'POST',
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async logout(): Promise<{ success: boolean }> {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: getAuthHeader()
        });
      } catch {
        // ignore network error on logout
      }
      localStorage.removeItem('sportybet_auth_token');
      return { success: true };
    }
  },

  // --- WALLET ENDPOINTS ---
  wallet: {
    async getBalance(): Promise<{ success: boolean; balance?: number; currency?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/wallet/balance`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async deposit(amount: number, provider: string, accountNumber?: string): Promise<{ success: boolean; balance?: number; message?: string; transaction?: any; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/wallet/deposit`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ amount, provider, accountNumber })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async withdraw(amount: number, provider: string, accountNumber?: string): Promise<{ success: boolean; balance?: number; message?: string; transaction?: any; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/wallet/withdraw`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ amount, provider, accountNumber })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getTransactions(): Promise<{ success: boolean; transactions?: any[]; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/wallet/transactions`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  },

  // --- BETS ENDPOINTS ---
  bets: {
    async placeBet(selections: BetSelection[], stake: number, type: 'Single' | 'Multiple'): Promise<{ success: boolean; bet?: PlacedBet; remainingBalance?: number; ticketId?: string; message?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/place`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ selections, stake, type })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getOpenBets(): Promise<{ success: boolean; bets?: PlacedBet[]; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/open`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getBetHistory(): Promise<{ success: boolean; bets?: PlacedBet[]; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/history`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async cashout(betId: string): Promise<{ success: boolean; cashoutAmount?: number; newBalance?: number; message?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/cashout`, {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ betId })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async generateBookingCode(selections: BetSelection[]): Promise<{ success: boolean; bookingCode?: string; totalOdds?: number; expiresAt?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/booking-code`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selections })
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async loadBookingCode(code: string): Promise<{ success: boolean; selections?: BetSelection[]; totalOdds?: number; bookingCode?: string; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/bets/booking-code/${encodeURIComponent(code)}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  },

  // --- MATCHES ENDPOINTS ---
  matches: {
    async getMatches(params?: { sport?: string; live?: boolean; league?: string; search?: string }): Promise<{ success: boolean; matches?: Match[]; error?: string }> {
      try {
        const query = new URLSearchParams();
        if (params?.sport) query.append('sport', params.sport);
        if (params?.live !== undefined) query.append('live', String(params.live));
        if (params?.league) query.append('league', params.league);
        if (params?.search) query.append('search', params.search);

        const res = await fetch(`${BASE_URL}/matches?${query.toString()}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getMatch(id: string): Promise<{ success: boolean; match?: Match; error?: string }> {
      try {
        const res = await fetch(`${BASE_URL}/matches/${encodeURIComponent(id)}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  },

  // --- SYSTEM INFO ---
  system: {
    async getStatus(): Promise<any> {
      try {
        const res = await fetch(`${BASE_URL}`);
        return await res.json();
      } catch (err: any) {
        return { status: 'offline', error: err.message };
      }
    }
  }
};
