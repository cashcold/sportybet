import { Match, PlacedBet, UserProfile, BetSelection } from '../types';
import { resolveApiUrl, getApiBaseUrl } from '../config/apiConfig';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('sportybet_auth_token') || 'sporty-session-default';
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

/**
 * Safely parses response as JSON, detecting when an HTML page was returned (e.g. 404 SPA fallback or offline webview)
 */
async function parseJsonResponse<T = any>(res: Response, endpoint: string): Promise<T> {
  const text = await res.text();
  const trimmed = (text || '').trim();

  const isHtml =
    trimmed.startsWith('<!doctype') ||
    trimmed.startsWith('<html') ||
    trimmed.startsWith('<!DOCTYPE') ||
    trimmed.includes('<div id="root">') ||
    trimmed.includes('<head>');

  if (isHtml) {
    const targetUrl = resolveApiUrl(endpoint);
    throw new Error(
      `Server returned HTML instead of API JSON (HTTP ${res.status}). Target: ${targetUrl}. Please check backend server configuration.`
    );
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    throw new Error(`Invalid JSON received from ${resolveApiUrl(endpoint)} (HTTP ${res.status})`);
  }
}

function formatFetchError(err: any, endpoint: string): string {
  const msg = err?.message || 'Network request failed';
  if (msg.includes('<!doctype') || msg.includes('<html') || msg.includes('<!DOCTYPE')) {
    return `Server returned HTML page instead of API response. Target: ${resolveApiUrl(endpoint)}`;
  }
  if (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('Network request failed') ||
    err?.name === 'TypeError'
  ) {
    return `Failed to connect to backend server at ${resolveApiUrl(endpoint)}. Please check internet connection or server settings.`;
  }
  return msg;
}

export const api = {
  // --- AUTH ENDPOINTS ---
  auth: {
    async login(phone: string, password?: string): Promise<{ success: boolean; user?: UserProfile; token?: string; error?: string }> {
      const endpoint = '/auth/login';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password })
        });
        const data = await parseJsonResponse(res, endpoint);
        if (data.token) {
          localStorage.setItem('sportybet_auth_token', data.token);
        }
        return data;
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async register(phone: string, password?: string, firstName?: string, lastName?: string): Promise<{ success: boolean; user?: UserProfile; token?: string; message?: string; error?: string }> {
      const endpoint = '/auth/register';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone, password, firstName, lastName })
        });
        const data = await parseJsonResponse(res, endpoint);
        if (data.token) {
          localStorage.setItem('sportybet_auth_token', data.token);
        }
        return data;
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async getMe(): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      const endpoint = '/auth/me';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async updateProfile(updates: Partial<UserProfile>): Promise<{ success: boolean; user?: UserProfile; error?: string }> {
      const endpoint = '/auth/profile';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'PUT',
          headers: getAuthHeader(),
          body: JSON.stringify(updates)
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async claimDailyStreak(): Promise<{ success: boolean; dailyStreak?: number; balance?: number; message?: string; error?: string }> {
      const endpoint = '/auth/daily-streak';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async logout(): Promise<{ success: boolean }> {
      const endpoint = '/auth/logout';
      try {
        await fetch(resolveApiUrl(endpoint), {
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
      const endpoint = '/wallet/balance';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async deposit(amount: number, provider: string, accountNumber?: string): Promise<{ success: boolean; balance?: number; message?: string; transaction?: any; error?: string }> {
      const endpoint = '/wallet/deposit';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ amount, provider, accountNumber })
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async withdraw(amount: number, provider: string, accountNumber?: string): Promise<{ success: boolean; balance?: number; message?: string; transaction?: any; error?: string }> {
      const endpoint = '/wallet/withdraw';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ amount, provider, accountNumber })
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async getTransactions(): Promise<{ success: boolean; transactions?: any[]; error?: string }> {
      const endpoint = '/wallet/transactions';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    }
  },

  // --- BETS ENDPOINTS ---
  bets: {
    async placeBet(selections: BetSelection[], stake: number, type: 'Single' | 'Multiple'): Promise<{ success: boolean; bet?: PlacedBet; remainingBalance?: number; ticketId?: string; transactionId?: string; bookingCode?: string; message?: string; error?: string }> {
      const endpoint = '/bets/place';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ selections, stake, type })
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async getOpenBets(): Promise<{ success: boolean; bets?: PlacedBet[]; error?: string }> {
      const endpoint = '/bets/open';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async getBetHistory(): Promise<{ success: boolean; bets?: PlacedBet[]; error?: string }> {
      const endpoint = '/bets/history';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          headers: getAuthHeader()
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async cashout(betId: string): Promise<{ success: boolean; cashoutAmount?: number; newBalance?: number; message?: string; error?: string }> {
      const endpoint = '/bets/cashout';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: getAuthHeader(),
          body: JSON.stringify({ betId })
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async generateBookingCode(selections: BetSelection[]): Promise<{ success: boolean; bookingCode?: string; totalOdds?: number; expiresAt?: string; error?: string }> {
      const endpoint = '/bets/booking-code';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selections })
        });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async loadBookingCode(code: string): Promise<{ success: boolean; selections?: BetSelection[]; totalOdds?: number; bookingCode?: string; error?: string }> {
      const endpoint = `/bets/booking-code/${encodeURIComponent(code)}`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    }
  },

  // --- MATCHES ENDPOINTS ---
  matches: {
    async getMatches(params?: { sport?: string; live?: boolean; league?: string; search?: string }): Promise<{ success: boolean; matches?: Match[]; error?: string }> {
      const query = new URLSearchParams();
      if (params?.sport) query.append('sport', params.sport);
      if (params?.live !== undefined) query.append('live', String(params.live));
      if (params?.league) query.append('league', params.league);
      if (params?.search) query.append('search', params.search);

      const endpoint = `/matches?${query.toString()}`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    },

    async getMatch(id: string): Promise<{ success: boolean; match?: Match; error?: string }> {
      const endpoint = `/matches/${encodeURIComponent(id)}`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    }
  },

  // --- SPORTS API-SPORTS CENTRAL SERVICE ---
  sports: {
    async getUsage(): Promise<{ success: boolean; stats: any[]; provider?: string; error?: string }> {
      const endpoint = '/sports/usage';
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, stats: [], error: formatFetchError(err, endpoint) };
      }
    },

    async getStatus(sport: string = 'football'): Promise<any> {
      const endpoint = `/sports/${encodeURIComponent(sport)}/status`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
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
      const endpoint = `/sports/${encodeURIComponent(sport)}/live`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, data: [], error: formatFetchError(err, endpoint) };
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
      const query = new URLSearchParams();
      if (params?.date) query.append('date', params.date);
      if (params?.league) query.append('league', params.league);
      if (params?.season) query.append('season', params.season);

      const endpoint = `/sports/${encodeURIComponent(sport)}/fixtures?${query.toString()}`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, data: [], error: formatFetchError(err, endpoint) };
      }
    },

    async clearCache(): Promise<{ success: boolean; message?: string }> {
      const endpoint = '/sports/clear-cache';
      try {
        const res = await fetch(resolveApiUrl(endpoint), {
          method: 'POST'
        });
        return await parseJsonResponse(res, endpoint);
      } catch {
        return { success: false };
      }
    },

    async getTheOddsMatches(params?: { sport?: string; isLive?: boolean; league?: string; search?: string }): Promise<{
      success: boolean;
      count?: number;
      matches?: Match[];
      source?: string;
      error?: string;
    }> {
      const query = new URLSearchParams();
      if (params?.sport) query.append('sport', params.sport);
      if (params?.isLive !== undefined) query.append('isLive', String(params.isLive));
      if (params?.league) query.append('league', params.league);
      if (params?.search) query.append('search', params.search);

      const endpoint = `/sports/the-odds/matches?${query.toString()}`;
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, matches: [], error: formatFetchError(err, endpoint) };
      }
    },

    async triggerTheOddsSync(): Promise<{
      success: boolean;
      message?: string;
      syncedCount?: number;
      remainingCredits?: number;
    }> {
      const endpoint = '/sports/the-odds/sync';
      try {
        const res = await fetch(resolveApiUrl(endpoint), { method: 'POST' });
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, message: formatFetchError(err, endpoint) };
      }
    },

    async getTheOddsStatus(): Promise<any> {
      const endpoint = '/sports/the-odds/status';
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { success: false, error: formatFetchError(err, endpoint) };
      }
    }
  },

  // --- SYSTEM INFO ---
  system: {
    async getStatus(): Promise<any> {
      const endpoint = '/api';
      try {
        const res = await fetch(resolveApiUrl(endpoint));
        return await parseJsonResponse(res, endpoint);
      } catch (err: any) {
        return { status: 'offline', error: formatFetchError(err, endpoint) };
      }
    }
  }
};
