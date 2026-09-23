import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Match,
  BetSelection,
  PlacedBet,
  UserProfile,
  ActiveTab,
  OddItem
} from '../types';
import {
  INITIAL_MATCHES,
  INITIAL_OPEN_BETS,
  INITIAL_BET_HISTORY,
  INITIAL_USER
} from '../data/mockData';
import { api } from '../services/api';
import { resolveApiUrl } from '../config/apiConfig';

interface BettingContextType {
  matches: Match[];
  betslip: BetSelection[];
  openBets: PlacedBet[];
  betHistory: PlacedBet[];
  user: UserProfile;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isBetslipOpen: boolean;
  setIsBetslipOpen: (open: boolean) => void;
  isDepositModalOpen: boolean;
  setIsDepositModalOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  selectedSport: string;
  setSelectedSport: (sport: string) => void;
  selectedLeagueFilter: string | null;
  setSelectedLeagueFilter: (league: string | null) => void;
  toggleSelection: (match: Match, marketName: string, odd: OddItem) => void;
  removeSelection: (matchId: string, marketName: string, selectionName: string) => void;
  clearBetslip: () => void;
  placeBet: (stake: number, type: 'Single' | 'Multiple') => Promise<{ success: boolean; error?: string }>;
  cashoutBet: (betId: string) => Promise<void>;
  deposit: (amount: number, provider: string) => Promise<void>;
  withdraw: (amount: number, provider: string) => Promise<{ success: boolean; error?: string }>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  updateUsername: (name: string) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  login: (phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  loadBookingCode: (code: string) => Promise<boolean>;
  generateBookingCode: () => Promise<string | null>;
  apiFootballConfigured: boolean;
  refreshLiveOdds: () => Promise<void>;
}

const BettingContext = createContext<BettingContextType | undefined>(undefined);

export const BettingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [matches, setMatches] = useState<Match[]>(() => {
    const saved = localStorage.getItem('sportybet_matches');
    return saved ? JSON.parse(saved) : INITIAL_MATCHES;
  });

  const [betslip, setBetslip] = useState<BetSelection[]>(() => {
    const saved = localStorage.getItem('sportybet_betslip');
    return saved ? JSON.parse(saved) : [];
  });

  const [openBets, setOpenBets] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem('sportybet_open_bets');
    return saved ? JSON.parse(saved) : INITIAL_OPEN_BETS;
  });

  const [betHistory, setBetHistory] = useState<PlacedBet[]>(() => {
    const saved = localStorage.getItem('sportybet_bet_history');
    return saved ? JSON.parse(saved) : INITIAL_BET_HISTORY;
  });

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sportybet_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('sports');
  const [isBetslipOpen, setIsBetslipOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [selectedSport, setSelectedSport] = useState('football');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [apiFootballConfigured, setApiFootballConfigured] = useState(false);

  // Check API-Football backend status and fetch live fixtures
  const refreshLiveOdds = async () => {
    try {
      const statusRes = await fetch(resolveApiUrl('/football/status'));
      if (statusRes.ok) {
        const statusData = await statusRes.json();
        setApiFootballConfigured(Boolean(statusData.configured));
        if (statusData.configured) {
          const liveRes = await fetch(resolveApiUrl('/football/live'));
          if (liveRes.ok) {
            const liveData = await liveRes.json();
            if (liveData.success && liveData.data && liveData.data.length > 0) {
              setMatches(prev => {
                // Merge API matches ahead of scheduled matches
                const scheduled = prev.filter(m => !m.isLive);
                return [...liveData.data, ...scheduled];
              });
              showToast('⚡ Live matches synced from API-Football');
            }
          }
        }
      }
    } catch {
      // Backend not reached or running in preview client mode
    }
  };

  useEffect(() => {
    refreshLiveOdds();
    // Poll every 30 seconds if key is configured
    const pollInterval = setInterval(() => {
      if (apiFootballConfigured) {
        refreshLiveOdds();
      }
    }, 30000);
    return () => clearInterval(pollInterval);
  }, [apiFootballConfigured]);

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem('sportybet_betslip', JSON.stringify(betslip));
  }, [betslip]);

  useEffect(() => {
    localStorage.setItem('sportybet_open_bets', JSON.stringify(openBets));
  }, [openBets]);

  useEffect(() => {
    localStorage.setItem('sportybet_bet_history', JSON.stringify(betHistory));
  }, [betHistory]);

  useEffect(() => {
    localStorage.setItem('sportybet_user', JSON.stringify(user));
  }, [user]);

  // Live match simulator: updates clock, scores and shifts live odds slightly
  useEffect(() => {
    const interval = setInterval(() => {
      setMatches(prevMatches =>
        prevMatches.map(match => {
          if (!match.isLive) return match;

          // Increment minutes realistically
          let nextMinute = match.minute;
          if (match.minute) {
            const parts = match.minute.split(':');
            let m = parseInt(parts[0], 10);
            let s = parseInt(parts[1], 10) + 5;
            if (s >= 60) {
              m += 1;
              s = s % 60;
            }
            if (m > 90) m = 90;
            nextMinute = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
          }

          // Random slight fluctuation in 1X2 odds for live games (5% chance per tick)
          if (Math.random() < 0.25) {
            const randomMarket = '1X2';
            const currentOdds = match.markets[randomMarket];
            if (currentOdds && currentOdds.length > 0) {
              const randomIndex = Math.floor(Math.random() * currentOdds.length);
              const target = currentOdds[randomIndex];
              const delta = (Math.random() * 0.08 - 0.04);
              const newVal = Math.max(1.02, parseFloat((target.value + delta).toFixed(2)));
              const trend: 'up' | 'down' | 'same' = newVal > target.value ? 'up' : newVal < target.value ? 'down' : 'same';

              const updatedMarkets = {
                ...match.markets,
                [randomMarket]: currentOdds.map((odd, idx) =>
                  idx === randomIndex
                    ? { ...odd, prevValue: target.value, value: newVal, trend }
                    : odd
                )
              };

              return {
                ...match,
                minute: nextMinute,
                markets: updatedMarkets
              };
            }
          }

          return { ...match, minute: nextMinute };
        })
      );
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(current => (current === msg ? null : current));
    }, 3000);
  };

  const toggleSelection = (match: Match, marketName: string, odd: OddItem) => {
    setBetslip(prev => {
      const existingIndex = prev.findIndex(
        s => s.matchId === match.id && s.marketName === marketName && s.selectionName === odd.name
      );

      if (existingIndex >= 0) {
        // Remove if clicking already selected odd
        return prev.filter((_, idx) => idx !== existingIndex);
      } else {
        // If clicking another selection in the same market for same match, replace it
        const filtered = prev.filter(
          s => !(s.matchId === match.id && s.marketName === marketName)
        );
        const newSelection: BetSelection = {
          matchId: match.id,
          gameId: match.gameId,
          matchTitle: `${match.homeTeam} vs ${match.awayTeam}`,
          marketName,
          selectionName: odd.name,
          odd: odd.value,
          isLive: match.isLive
        };
        showToast(`Added to Betslip: ${match.homeTeam} vs ${match.awayTeam} (${odd.name} @ ${odd.value})`);
        return [...filtered, newSelection];
      }
    });
  };

  const removeSelection = (matchId: string, marketName: string, selectionName: string) => {
    setBetslip(prev =>
      prev.filter(
        s => !(s.matchId === matchId && s.marketName === marketName && s.selectionName === selectionName)
      )
    );
  };

  const clearBetslip = () => {
    setBetslip([]);
  };

  const placeBet = async (stake: number, type: 'Single' | 'Multiple'): Promise<{ success: boolean; error?: string }> => {
    if (betslip.length === 0) {
      return { success: false, error: 'Your betslip is empty' };
    }
    if (stake <= 0) {
      return { success: false, error: 'Please enter a valid stake' };
    }
    if (user.balance < stake) {
      setIsDepositModalOpen(true);
      return { success: false, error: 'Insufficient balance. Please deposit to place bet.' };
    }

    const totalOdds = parseFloat(
      betslip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2)
    );
    const potentialWin = parseFloat((stake * totalOdds).toFixed(2));
    const isAnyLive = betslip.some(s => s.isLive);

    const now = new Date();
    const dateFormatted = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const newBet: PlacedBet = {
      id: `bet-${Date.now()}`,
      ticketId: `SBGH-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      type,
      date: dateFormatted,
      isLive: isAnyLive,
      selections: [...betslip],
      stake,
      totalOdds,
      potentialWin,
      status: 'open',
      cashoutAvailable: isAnyLive,
      cashoutAmount: parseFloat((stake * 0.95).toFixed(2))
    };

    // Optimistically deduct balance
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - stake).toFixed(2)),
      dailyStreak: prev.dailyStreak + 1
    }));

    setOpenBets(prev => [newBet, ...prev]);
    setBetslip([]);
    setIsBetslipOpen(false);

    // Call Server API
    try {
      const serverRes = await api.bets.placeBet(betslip, stake, type);
      if (serverRes.success && serverRes.bet) {
        setOpenBets(prev => [serverRes.bet!, ...prev.filter(b => b.id !== newBet.id)]);
        if (serverRes.remainingBalance !== undefined) {
          setUser(prev => ({ ...prev, balance: serverRes.remainingBalance! }));
        }
        showToast(`Bet placed! Ticket: ${serverRes.ticketId || newBet.ticketId}`);
        return { success: true };
      }
    } catch {
      // Keep optimistic bet
    }

    showToast(`Bet placed successfully! Ticket: ${newBet.ticketId}`);
    return { success: true };
  };

  const cashoutBet = async (betId: string) => {
    const bet = openBets.find(b => b.id === betId);
    if (!bet || !bet.cashoutAmount) return;

    const returnAmount = bet.cashoutAmount;
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance + returnAmount).toFixed(2))
    }));

    setOpenBets(prev => prev.filter(b => b.id !== betId));
    setBetHistory(prev => [
      {
        ...bet,
        status: 'cashed_out',
        potentialWin: returnAmount
      },
      ...prev
    ]);

    // Call Server API
    try {
      const res = await api.bets.cashout(betId);
      if (res.success && res.newBalance !== undefined) {
        setUser(prev => ({ ...prev, balance: res.newBalance! }));
      }
    } catch {
      // Already handled optimistically
    }

    showToast(`Cashed out GHS ${returnAmount.toFixed(2)} successfully!`);
  };

  const deposit = async (amount: number, provider: string) => {
    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance + amount).toFixed(2))
    }));
    setIsDepositModalOpen(false);

    // Call Server API
    try {
      const res = await api.wallet.deposit(amount, provider, user.phone);
      if (res.success && res.balance !== undefined) {
        setUser(prev => ({ ...prev, balance: res.balance! }));
      }
    } catch {
      // handled optimistically
    }

    showToast(`Deposited GHS ${amount.toFixed(2)} via ${provider}!`);
  };

  const withdraw = async (amount: number, provider: string): Promise<{ success: boolean; error?: string }> => {
    if (amount <= 0) return { success: false, error: 'Invalid amount' };
    if (user.balance < amount) return { success: false, error: 'Insufficient funds' };

    setUser(prev => ({
      ...prev,
      balance: parseFloat((prev.balance - amount).toFixed(2))
    }));

    // Call Server API
    try {
      const res = await api.wallet.withdraw(amount, provider, user.phone);
      if (res.success && res.balance !== undefined) {
        setUser(prev => ({ ...prev, balance: res.balance! }));
      }
    } catch {
      // handled optimistically
    }

    showToast(`Withdrawal of GHS ${amount.toFixed(2)} sent via ${provider}!`);
    return { success: true };
  };

  const updateUsername = async (name: string) => {
    setUser(prev => ({ ...prev, username: name }));
    try {
      await api.auth.updateProfile({ username: name });
    } catch {
      //
    }
    showToast('Username updated');
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updates }));
    try {
      await api.auth.updateProfile(updates);
    } catch {
      //
    }
    showToast('Profile updated');
  };

  const login = async (phone?: string) => {
    const phoneNumber = phone || user.phone || '20******5';
    try {
      const res = await api.auth.login(phoneNumber);
      if (res.success && res.user) {
        setUser(res.user);
        showToast('Logged in successfully');
        return;
      }
    } catch {
      //
    }
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      phone: phoneNumber
    }));
    showToast('Logged in successfully');
  };

  const logout = async () => {
    try {
      await api.auth.logout();
    } catch {
      //
    }
    setUser(prev => ({
      ...prev,
      isLoggedIn: false
    }));
    showToast('Logged out');
  };

  const generateBookingCode = async (): Promise<string | null> => {
    if (betslip.length === 0) {
      showToast('Add selections to betslip first');
      return null;
    }
    try {
      const res = await api.bets.generateBookingCode(betslip);
      if (res.success && res.bookingCode) {
        showToast(`Booking Code: ${res.bookingCode} generated!`);
        return res.bookingCode;
      }
    } catch {
      // Fallback
    }
    const fallbackCode = `BC${Math.floor(1000 + Math.random() * 9000)}`;
    showToast(`Booking Code: ${fallbackCode} generated!`);
    return fallbackCode;
  };

  const loadBookingCode = async (code: string): Promise<boolean> => {
    if (!code.trim()) return false;
    const cleanCode = code.trim().toUpperCase();

    // Try fetching from server API first
    try {
      const serverRes = await api.bets.loadBookingCode(cleanCode);
      if (serverRes.success && serverRes.selections && serverRes.selections.length > 0) {
        setBetslip(serverRes.selections);
        setIsBetslipOpen(true);
        showToast(`Booking Code ${cleanCode} loaded! (${serverRes.selections.length} events)`);
        return true;
      }
    } catch {
      // Fallback to local match resolution
    }

    // Fallback simulation
    const randomMatches = matches.slice(0, 3);
    const loadedSelections: BetSelection[] = randomMatches.map(m => {
      const odd = m.markets['1X2'] ? m.markets['1X2'][0] : { name: '1', value: 1.5 };
      return {
        matchId: m.id,
        gameId: m.gameId,
        matchTitle: `${m.homeTeam} vs ${m.awayTeam}`,
        marketName: '1X2',
        selectionName: odd.name,
        odd: odd.value,
        isLive: m.isLive
      };
    });
    setBetslip(loadedSelections);
    setIsBetslipOpen(true);
    showToast(`Booking Code ${cleanCode} loaded! (${loadedSelections.length} events)`);
    return true;
  };

  return (
    <BettingContext.Provider
      value={{
        matches,
        betslip,
        openBets,
        betHistory,
        user,
        activeTab,
        setActiveTab,
        isBetslipOpen,
        setIsBetslipOpen,
        isDepositModalOpen,
        setIsDepositModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        selectedSport,
        setSelectedSport,
        selectedLeagueFilter,
        setSelectedLeagueFilter,
        toggleSelection,
        removeSelection,
        clearBetslip,
        placeBet,
        cashoutBet,
        deposit,
        withdraw,
        toastMessage,
        showToast,
        updateUsername,
        updateProfile,
        login,
        logout,
        loadBookingCode,
        generateBookingCode,
        apiFootballConfigured,
        refreshLiveOdds
      }}
    >
      {children}
    </BettingContext.Provider>
  );
};

export const useBetting = () => {
  const context = useContext(BettingContext);
  if (!context) {
    throw new Error('useBetting must be used within a BettingProvider');
  }
  return context;
};
