import { Match, PlacedBet, UserProfile, BetSelection } from '../types';
import { getApiBaseUrl } from '../config/apiConfig';

const getBaseUrl = () => getApiBaseUrl();

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
        const res = await fetch(`${getBaseUrl()}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        let data: any = null;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { success: false, error: text || `Server returned error (${res.status})` };
        }
        if (data.token) {
          localStorage.setItem('sportybet_auth_token', data.token);
        }
        return data;
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async register(phone: string, password?: string, firstName?: string, lastName?: string): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, firstName, lastName })
        });
        let data: any = null;
        const text = await res.text();
        try {
          data = JSON.parse(text);
        } catch {
          data = { success: false, error: text || `Server returned error (${res.status})` };
        }
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
        const res = await fetch(`${getBaseUrl()}/auth/me`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/auth/profile`, {
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
        const res = await fetch(`${getBaseUrl()}/auth/daily-streak`, {
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
        await fetch(`${getBaseUrl()}/auth/logout`, {
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
        const res = await fetch(`${getBaseUrl()}/wallet/balance`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async deposit(amount: number, provider: string, accountNumber?: string): Promise<{ success: boolean; balance?: number; message?: string; transaction?: any; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/wallet/deposit`, {
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
        const res = await fetch(`${getBaseUrl()}/wallet/withdraw`, {
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
        const res = await fetch(`${getBaseUrl()}/wallet/transactions`, {
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
    async placeBet(selections: BetSelection[], stake: number, type: 'Single' | 'Multiple'): Promise<{ success: boolean; bet?: PlacedBet; remainingBalance?: number; ticketId?: string; transactionId?: string; bookingCode?: string; message?: string; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/bets/place`, {
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
        const res = await fetch(`${getBaseUrl()}/bets/open`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getBetHistory(): Promise<{ success: boolean; bets?: PlacedBet[]; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/bets/history`, {
          headers: getAuthHeader()
        });
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async cashout(betId: string): Promise<{ success: boolean; cashoutAmount?: number; newBalance?: number; message?: string; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/bets/cashout`, {
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
        const res = await fetch(`${getBaseUrl()}/bets/booking-code`, {
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
        const res = await fetch(`${getBaseUrl()}/bets/booking-code/${encodeURIComponent(code)}`);
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

        const res = await fetch(`${getBaseUrl()}/matches?${query.toString()}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getMatch(id: string): Promise<{ success: boolean; match?: Match; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/matches/${encodeURIComponent(id)}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  },

  // --- SPORTS API-SPORTS CENTRAL SERVICE ---
  sports: {
    async getUsage(): Promise<{ success: boolean; stats: any[]; provider?: string; error?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/sports/usage`);
        return await res.json();
      } catch (err: any) {
        return { success: false, stats: [], error: err.message };
      }
    },

    async getStatus(sport: string = 'football'): Promise<any> {
      try {
        const res = await fetch(`${getBaseUrl()}/sports/${encodeURIComponent(sport)}/status`);
        return await res.json();
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    },

    async getLive(sport: string = 'football'): Promise<{
      success: boolean;
      data?: Match[];
      count?: number;
      cached?: boolean;
      stale?: boolean;
      lastUpdated?: string;
      source?: string;
      error?: string;
    }> {
      try {
        const res = await fetch(`${getBaseUrl()}/sports/${encodeURIComponent(sport)}/live`);
        return await res.json();
      } catch (err: any) {
        return { success: false, data: [], error: err.message };
      }
    },

    async getFixtures(
      sport: string = 'football',
      params?: { date?: string; league?: string; season?: string }
    ): Promise<{
      success: boolean;
      data?: Match[];
      count?: number;
      cached?: boolean;
      stale?: boolean;
      lastUpdated?: string;
      source?: string;
      error?: string;
    }> {
      try {
        const query = new URLSearchParams();
        if (params?.date) query.append('date', params.date);
        if (params?.league) query.append('league', params.league);
        if (params?.season) query.append('season', params.season);

        const res = await fetch(`${getBaseUrl()}/sports/${encodeURIComponent(sport)}/fixtures?${query.toString()}`);
        return await res.json();
      } catch (err: any) {
        return { success: false, data: [], error: err.message };
      }
    },

    async clearCache(): Promise<{ success: boolean; message?: string }> {
      try {
        const res = await fetch(`${getBaseUrl()}/sports/clear-cache`, {
          method: 'POST'
        });
        return await res.json();
      } catch (err: any) {
        return { success: false };
      }
    }
  },

  // --- SYSTEM INFO ---
  system: {
    async getStatus(): Promise<any> {
      try {
        const res = await fetch(`${getBaseUrl()}`);
        return await res.json();
      } catch (err: any) {
        return { status: 'offline', error: err.message };
      }
    }
  }
};
