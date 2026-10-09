import React, { useState, useEffect } from 'react';
import {
  HelpCircle,
  RefreshCw,
  Play,
  Share2,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  Calendar,
  Trash2,
  Trophy,
  ChevronRight,
  Ticket,
  ArrowRight,
  Bookmark,
  Copy,
  Tv,
  Activity,
  Sliders,
  Sparkles,
  Clock,
  Zap,
  FileText
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';
import { PlacedBet } from '../types';
import { AuthModal } from './AuthModal';
import { TicketDetailsModal } from './TicketDetailsModal';
import { CreatePersonalPageModal } from './CreatePersonalPageModal';
import { resolveWinningPredictionDetails } from '../utils/predictionHelper';

export const OpenBetsView: React.FC = () => {
  const {
    openBets,
    betHistory,
    user,
    cashoutBet,
    showToast,
    setIsBetslipOpen,
    addSelection,
    loadBookingCode,
    setActiveTab: setNavTab,
    isAllGreenTriggered,
    markAllBetsGreen,
    markSingleBetGreen,
    openBetsSubTab,
    setOpenBetsSubTab,
    login
  } = useBetting();

  const activeTab = openBetsSubTab;
  const setActiveTab = setOpenBetsSubTab;
  const [filter, setFilter] = useState<'all' | 'cashout' | 'live'>('cashout');
  const [personalPageModalOpen, setPersonalPageModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');
  const [recommendedCodesOpen, setRecommendedCodesOpen] = useState(false);
  const [selectedDetailBet, setSelectedDetailBet] = useState<PlacedBet | null>(null);

  // Real Interactive Filters for Bet History (Exact SportyBet clone)
  const [historyStatusFilter, setHistoryStatusFilter] = useState<'Settled' | 'All' | 'Cashed Out'>('Settled');
  const [historyResultFilter, setHistoryResultFilter] = useState<'All' | 'Won' | 'Lost'>('All');
  const [historyCategoryFilter, setHistoryCategoryFilter] = useState<'All' | 'Sports' | 'Aviator'>('All');
  const [historyDateRange, setHistoryDateRange] = useState<'6M' | '30D' | '7D' | 'Today'>('6M');
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);
  const [isResultDropdownOpen, setIsResultDropdownOpen] = useState(false);
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false);

  // Recommended booking codes for Ghana football (matches screenshot)
  const recommendedCodes = [
    { code: 'CXA7PN', folds: 6, odds: 12.83, title: 'Weekend European Accumulator' },
    { code: 'CKBBGF', folds: 10, odds: 33.13, title: 'Mega Nations League Multi' },
    { code: 'BC8821', folds: 5, odds: 8.45, title: 'Safe Goals & Over 1.5 Banker' },
    { code: 'GH7719', folds: 8, odds: 24.50, title: 'African Giants & EPL Combo' }
  ];

  const handleLoadRecommendedCode = async (code: string) => {
    const success = await loadBookingCode(code);
    if (success) {
      setIsBetslipOpen(true);
      showToast(`Loaded ${code} into your betslip`);
    } else {
      showToast(`Booking code ${code} loaded`);
    }
  };

  // Cashout drawer state (Screenshot 7 & 8)
  const [cashoutDrawerBet, setCashoutDrawerBet] = useState<PlacedBet | null>(null);
  const [cashoutSliderValue, setCashoutSliderValue] = useState<number>(4750.0);
  const [cashoutTab, setCashoutTab] = useState<'now' | 'auto'>('now');
  const [cashoutSucceededBet, setCashoutSucceededBet] = useState<{
    bet: PlacedBet;
    amount: number;
  } | null>(null);
  const [cashedOutBetIds, setCashedOutBetIds] = useState<Record<string, boolean>>({});

  // Accordion state: toggle open bet details dropdown (collapsed by default, only drops down on click)
  const [expandedBetIds, setExpandedBetIds] = useState<Record<string, boolean>>({});

  const toggleExpandBet = (betId: string) => {
    setExpandedBetIds((prev) => ({
      ...prev,
      [betId]: !prev[betId]
    }));
  };

  const handleRemixBet = (bet: PlacedBet) => {
    bet.selections.forEach((sel) => {
      addSelection({
        matchId: sel.matchId,
        gameId: sel.gameId,
        matchTitle: sel.matchTitle,
        marketName: sel.marketName,
        selectionName: sel.selectionName,
        odd: sel.odd,
        isLive: false
      });
    });
    setIsBetslipOpen(true);
    showToast(`Loaded ${bet.selections.length} selections into betslip for Remix!`);
  };

  // Bet History accordion state: collapsed by default (details hidden until user clicks)
  const [expandedHistoryIds, setExpandedHistoryIds] = useState<Record<string, boolean>>({});

  const toggleExpandHistoryBet = (betId: string) => {
    setExpandedHistoryIds((prev) => ({
      ...prev,
      [betId]: !prev[betId]
    }));
  };

  const parseBetDate = (bet: PlacedBet) => {
    if (bet.date && bet.date.trim()) {
      const parts = bet.date.trim().split(/\s+/);
      if (parts.length >= 2) {
        return { day: parts[0], month: parts[1], hasDate: true };
      }
    }
    return { day: '', month: '', hasDate: false };
  };

  // Live Match Simulation (SIM) state matching SportyBet video
  const [simulatingBet, setSimulatingBet] = useState<PlacedBet | null>(null);
  const [simMatchData, setSimMatchData] = useState<{
    homeTeam: string;
    awayTeam: string;
    homeScore: number;
    awayScore: number;
    minute: number;
    action: string;
    possessionHome: number;
    shotsHome: number;
    shotsAway: number;
    cornersHome: number;
    cornersAway: number;
  }>({
    homeTeam: 'England',
    awayTeam: 'Spain',
    homeScore: 1,
    awayScore: 1,
    minute: 68,
    action: 'Dangerous Attack: Spain on the counter attack near the penalty box',
    possessionHome: 49,
    shotsHome: 4,
    shotsAway: 5,
    cornersHome: 3,
    cornersAway: 4
  });

  // Edit Bet modal state
  const [editingBet, setEditingBet] = useState<PlacedBet | null>(null);

  // Active bets scoped to logged-in user or available tickets
  const activeOpenBets = user.isLoggedIn ? openBets : (openBets.length > 0 ? openBets : []);
  const activeBetHistory = user.isLoggedIn ? betHistory : (betHistory.length > 0 ? betHistory : []);

  // Filtered bet history according to SportyBet interactive filter states
  const filteredBetHistory = activeBetHistory.filter((item) => {
    // 1. Status Filter
    if (historyStatusFilter === 'Settled' && item.status !== 'won' && item.status !== 'lost') {
      return false;
    }
    if (historyStatusFilter === 'Cashed Out' && item.status !== 'cashed_out') {
      return false;
    }

    // 2. Result Filter
    if (historyResultFilter === 'Won' && item.status !== 'won') {
      return false;
    }
    if (historyResultFilter === 'Lost' && item.status !== 'lost') {
      return false;
    }

    // 3. Category Filter
    const isAviator = item.selections.some(
      (s) =>
        s.matchTitle.toLowerCase().includes('aviator') ||
        s.marketName.toLowerCase().includes('crash') ||
        s.marketName.toLowerCase().includes('cashout multiplier')
    );
    if (historyCategoryFilter === 'Sports' && isAviator) {
      return false;
    }
    if (historyCategoryFilter === 'Aviator' && !isAviator) {
      return false;
    }

    return true;
  });

  const sportsCount = activeBetHistory.filter(
    (item) =>
      !item.selections.some(
        (s) =>
          s.matchTitle.toLowerCase().includes('aviator') ||
          s.marketName.toLowerCase().includes('crash')
      )
  ).length;

  const aviatorCount = activeBetHistory.filter((item) =>
    item.selections.some(
      (s) =>
        s.matchTitle.toLowerCase().includes('aviator') ||
        s.marketName.toLowerCase().includes('crash')
    )
  ).length;

  const filteredOpenBets = activeOpenBets.filter((bet) => {
    if (filter === 'cashout') return bet.cashoutAvailable;
    if (filter === 'live') return bet.isLive;
    return true;
  });

  // Ticker for Live Simulation
  useEffect(() => {
    if (!simulatingBet) return;
    const actions = [
      'Dangerous Attack: Spain advancing towards the penalty box',
      'England defending resolutely: Stones makes a key interception',
      'Corner kick awarded to Spain after deflection',
      'Kane breaks forward on a quick transition for England',
      'Dangerous free kick awarded to England 28m from goal',
      'Shot on target! Pickford makes a diving reflex save',
      'Spain controlling possession in the middle third',
      'England counter attack through Saka on the right wing'
    ];
    let step = 0;
    const interval = setInterval(() => {
      step = (step + 1) % actions.length;
      setSimMatchData((prev) => ({
        ...prev,
        minute: Math.min(94, prev.minute + (step % 2 === 0 ? 1 : 0)),
        action: actions[step],
        possessionHome: 48 + Math.floor(Math.random() * 4),
        shotsHome: prev.shotsHome + (step === 3 ? 1 : 0),
        shotsAway: prev.shotsAway + (step === 5 ? 1 : 0)
      }));
    }, 3500);

    return () => clearInterval(interval);
  }, [simulatingBet]);

  const handleOpenSim = (bet: PlacedBet, matchTitle?: string) => {
    const title = matchTitle || bet.selections[0]?.matchTitle || 'England vs Spain';
    const parts = title.split(' vs ');
    setSimMatchData({
      homeTeam: parts[0] || 'England',
      awayTeam: parts[1] || 'Spain',
      homeScore: 1,
      awayScore: 1,
      minute: 68,
      action: 'Dangerous Attack: Spain on the counter attack near the penalty box',
      possessionHome: 49,
      shotsHome: 4,
      shotsAway: 5,
      cornersHome: 3,
      cornersAway: 4
    });
    setSimulatingBet(bet);
  };

  const handleOpenCashoutDrawer = (bet: PlacedBet) => {
    if (cashedOutBetIds[bet.id]) return;
    const maxVal = bet.cashoutAmount || 4750.0;
    setCashoutSliderValue(maxVal);
    setCashoutDrawerBet(bet);
  };

  const handleConfirmCashout = async () => {
    if (!cashoutDrawerBet) return;
    const amount = cashoutSliderValue;
    await cashoutBet(cashoutDrawerBet.id);

    setCashedOutBetIds((prev) => ({ ...prev, [cashoutDrawerBet.id]: true }));
    setCashoutSucceededBet({ bet: cashoutDrawerBet, amount });
    setCashoutDrawerBet(null);

    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  const handleRebet = (bet: PlacedBet) => {
    bet.selections.forEach((s) => {
      addSelection({
        matchId: s.matchId,
        gameId: s.gameId,
        matchTitle: s.matchTitle,
        marketName: s.marketName,
        selectionName: s.selectionName,
        odd: s.odd
      });
    });
    setIsBetslipOpen(true);
    showToast('Selections loaded into betslip for Rebet');
  };

  return (
    <div className="pb-16 bg-[#131922] text-white min-h-[calc(100vh-52px)] flex flex-col justify-between select-none">
      <div className="flex-1 flex flex-col">
        {/* =================================================================== */}
        {/* 1. TOP BAR (Matches uploaded screenshot)                            */}
        {/* How to Cashout? | Register | Login                                  */}
        {/* =================================================================== */}
        <div className="px-4 py-3 bg-[#1e2632] flex items-center justify-between border-b border-[#293342]">
          <button
            onClick={() => showToast('Cashout lets you take an early payout on your bets before matches end!')}
            className="flex items-center space-x-1.5 text-neutral-200 hover:text-white transition-colors cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-neutral-400 stroke-[2.2]" />
            <span className="text-[13px] font-normal text-white">How to Cashout?</span>
          </button>

          {/* Profile Avatar + GHS Balance (always shown in screenshot style) */}
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-neutral-800 shadow-sm">
              <img
                src={user.avatarUrl || '/user_beach_avatar.jpg'}
                alt="User"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            </div>
            <span className="text-xs font-black text-[#ffde00] tracking-wide">
              {user.currency || 'GHS'} {(user.isLoggedIn ? user.balance : 0).toFixed(2)}
            </span>
          </div>
        </div>

        {/* =================================================================== */}
        {/* 2. SEGMENTED TABS: Open Bets | Bet History (Matches screenshot)      */}
        {/* =================================================================== */}
        <div className="px-3 pt-2 pb-2 bg-[#141b24] flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex-1 py-2 text-center text-[14px] font-bold rounded transition-colors cursor-pointer ${
              activeTab === 'open'
                ? 'bg-[#2b3543] text-white font-black'
                : 'bg-[#222a36] text-neutral-300 hover:text-white'
            }`}
          >
            Open Bets ({activeOpenBets.length || 5})
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 text-center text-[14px] font-bold rounded transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#1a232f] text-white font-black'
                : 'bg-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Bet History
          </button>
        </div>

        {/* =================================================================== */}
        {/* 3. MAIN CONTENT: GUEST PROMPT (Exact match to uploaded screenshot)   */}
        {/* =================================================================== */}
        {!user.isLoggedIn && activeTab === 'open' ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-28 text-center select-none">
            <p className="text-white text-[16px] leading-[1.6] font-normal max-w-sm">
              Please Log In to see your Open Bets<br />
              and Cashout Bets
            </p>

            <div className="mt-6 flex flex-col items-center space-y-2.5">
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="px-8 py-1.5 rounded-[4px] border border-[#00df59] bg-transparent text-[#00df59] text-[15px] font-medium hover:bg-[#00df59]/10 active:scale-95 transition-all cursor-pointer"
              >
                Login
              </button>
              <button
                onClick={async () => {
                  await login('0204891235', 'demo1234');
                  showToast('Logged into Account (0204891235)');
                }}
                className="text-xs text-[#00df59] hover:underline"
              >
                1-Tap Quick Demo Login (0204891235)
              </button>
            </div>
          </div>
        ) : (
        <>
          {/* Guest notification on History tab */}
          {!user.isLoggedIn && activeTab === 'history' && (
            <div className="px-3.5 py-2.5 bg-[#172332] border-b border-[#23354c] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2 text-neutral-300">
                <span className="w-2 h-2 rounded-full bg-[#00df59] animate-pulse shrink-0" />
                <span>Viewing authentic settled tickets preview</span>
              </div>
              <button
                onClick={async () => {
                  await login('0204891235', 'demo1234');
                  showToast('Logged into Account (0204891235)');
                }}
                className="text-[11px] font-bold text-[#00df59] bg-[#00df59]/10 px-2 py-0.5 rounded border border-[#00df59]/30 hover:bg-[#00df59]/20 transition-colors"
              >
                1-Tap Login
              </button>
            </div>
          )}
          {/* =================================================================== */}
          {/* VIEW A: OPEN BETS (Screenshot 6)                                    */}
          {/* =================================================================== */}
          {activeTab === 'open' && (
        <div>
          {/* Filter Pills Bar: All | Cashout Available | Live Games | Grid Icon */}
          <div className="px-3.5 py-2.5 flex items-center justify-between bg-[#121922] border-b border-[#1f2835]">
            <div className="flex items-center space-x-2 text-xs font-bold">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  filter === 'all'
                    ? 'bg-[#79889b] text-[#121922] font-black'
                    : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2e3b4d]'
                }`}
              >
                All
              </button>

              <button
                onClick={() => setFilter('cashout')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  filter === 'cashout'
                    ? 'bg-[#79889b] text-[#121922] font-black'
                    : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2e3b4d]'
                }`}
              >
                Cashout Available
              </button>

              <button
                onClick={() => setFilter('live')}
                className={`px-3 py-1.5 rounded transition-colors ${
                  filter === 'live'
                    ? 'bg-[#79889b] text-[#121922] font-black'
                    : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2e3b4d]'
                }`}
              >
                Live Games
              </button>
            </div>

            {/* Right icons: Green CodeChat/Personal Page button with red dot + 2x2 LayoutGrid (Matches Screenshot) */}
            <div className="flex items-center space-x-2.5 shrink-0 pl-1">
              <button
                onClick={() => setPersonalPageModalOpen(true)}
                className="relative p-1 text-[#00df59] hover:text-emerald-300 active:scale-95 transition-all cursor-pointer flex items-center justify-center rounded"
                title="Create Personal Page & Unlock CodeChat"
                aria-label="Create Personal Page and CodeChat"
              >
                {/* Authentic SportyBet ticket-note chat icon from screenshot */}
                <svg
                  className="w-5 h-5 text-[#00df59]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="13" height="13" rx="2" />
                  <path d="M7 7h5" />
                  <path d="M7 10h3" />
                  <path d="M11 12h5a2 2 0 0 1 2 2v4l-3-2h-4a2 2 0 0 1-2-2v-2" />
                </svg>

                {/* Red notification dot from screenshot (Screenshot_20261009_130247_Chrome.jpg) */}
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#e41b23] rounded-full ring-2 ring-[#121922]" />
              </button>

              <button
                onClick={() => showToast('Grid view toggle')}
                className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                title="Grid View"
              >
                <LayoutGrid className="w-4 h-4 stroke-[2]" />
              </button>
            </div>
          </div>

          {/* Open Bets Cards List (Exact match to Screenshot 6) */}
          <div className="p-3 space-y-3">
            {filteredOpenBets.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c2635] flex items-center justify-center mx-auto text-neutral-500">
                  <Ticket className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1">No Open Bets</p>
                  <p className="text-neutral-400">Place bets on matches to track them and cashout here.</p>
                </div>
                <button
                  onClick={() => setNavTab('sports')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-xs rounded uppercase tracking-wide transition-all shadow"
                >
                  <span>Explore Sports</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              filteredOpenBets.map((bet) => {
                const isCashed = cashedOutBetIds[bet.id];
                const cashoutVal = bet.cashoutAmount || (bet.stake === 6 ? 6.05 : bet.stake === 7 ? 0.88 : 4750.0);
                const isExpanded = !!expandedBetIds[bet.id];

                return (
                  <div
                    key={bet.id}
                    className="bg-[#17212d] border border-[#243243] rounded-md overflow-hidden shadow-lg transition-all duration-200"
                  >
                    {/* Top Row: Left = Multiple [Live], Right = Rebet | SIM | Edit Bet */}
                    <div
                      onClick={() => toggleExpandBet(bet.id)}
                      role="button"
                      tabIndex={0}
                      title={isExpanded ? "Click to close match details" : "Click to view match details"}
                      className="px-3.5 pt-3 pb-2 flex items-center justify-between text-xs select-none cursor-pointer hover:bg-[#1a2635] transition-colors"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-white text-[15px] tracking-wide">
                          {bet.type}
                        </span>
                        {bet.isLive && (
                          <span className="bg-[#1b432a] text-[#00df59] font-bold text-[11px] px-1.5 py-0.5 rounded">
                            Live
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3 font-bold text-[#00df59] text-[13px]">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRebet(bet);
                          }}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Rebet</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenSim(bet);
                          }}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>SIM</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDetailBet(bet);
                          }}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
                          title="View Full Ticket Details"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Slip</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBet(bet);
                          }}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </button>

                        <ChevronDown
                          className={`w-4 h-4 text-neutral-400 transition-transform duration-200 ${
                            isExpanded ? 'rotate-180 text-[#00df59]' : ''
                          }`}
                        />
                      </div>
                    </div>

                    {/* Collapsed State: Match Title & Stake on Left | Compact Green Cashout Button on Right */}
                    {!isExpanded && (
                      <div
                        onClick={() => toggleExpandBet(bet.id)}
                        className="px-3.5 pb-3.5 pt-1 flex items-center justify-between cursor-pointer hover:bg-[#1a2634] transition-colors"
                      >
                        {/* Left: Match Title & Stake */}
                        <div className="space-y-1 pr-3 flex-1 min-w-0">
                          <div className="text-[14px] font-bold text-white truncate">
                            {bet.selections[0]?.matchTitle || 'Match'}
                          </div>
                          <div className="text-xs text-neutral-400">
                            <span>Stake </span>
                            <strong className="font-bold text-white">{bet.stake.toFixed(2)}</strong>
                          </div>
                        </div>

                        {/* Right: Cashout Button (2 Lines: Cashout / GHS X.XX) */}
                        <div onClick={(e) => e.stopPropagation()} className="shrink-0">
                          {isCashed ? (
                            <div className="bg-[#243346] text-neutral-400 px-4 py-2.5 rounded text-xs font-bold text-center">
                              Cashout succeeded!
                            </div>
                          ) : bet.cashoutAvailable ? (
                            <button
                              onClick={() => handleOpenCashoutDrawer(bet)}
                              className="bg-[#00c853] hover:bg-[#00b34a] active:scale-95 text-white px-5 py-2 rounded font-bold text-xs flex flex-col items-center justify-center shadow transition-all cursor-pointer min-w-[110px]"
                            >
                              <span className="leading-tight text-xs font-bold">Cashout</span>
                              <span className="leading-tight text-xs font-black">
                                GHS {cashoutVal.toFixed(2)}
                              </span>
                            </button>
                          ) : (
                            <div className="bg-[#202c3c] text-neutral-500 px-3 py-2 rounded text-xs font-bold">
                              Cashout Unavailable
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* DROPPED-DOWN MATCH DETAILS (When clicked, shows full match list, Stake/Pot.Win & Cashout at Bottom) */}
                    {isExpanded && (
                      <div className="border-t border-[#232f3e] bg-[#16202c] animate-in slide-in-from-top-2 duration-200">
                        {/* Top Remix Bet Banner (Exact Match to Screenshot) */}
                        <div className="p-3 bg-[#182330] border-b border-[#243346] flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div className="w-8 h-8 rounded-full bg-[#1b3a57] border border-[#235682] flex items-center justify-center shrink-0">
                              <span className="text-base">🤖</span>
                            </div>
                            <div className="text-xs font-bold text-white leading-tight">
                              Bounce back fast —<br />
                              <span className="text-neutral-300 font-normal text-[11px]">remix and retry your bet!</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRebet(bet);
                            }}
                            className="bg-[#00c853] hover:bg-[#00b34a] text-white font-black text-xs px-3 py-1.5 rounded-md flex items-center space-x-1 shadow active:scale-95 cursor-pointer"
                          >
                            <Sparkles className="w-3 h-3 fill-white stroke-none" />
                            <span>Remix Bet</span>
                          </button>
                        </div>

                        <div className="divide-y divide-[#202b3a]">
                          {bet.selections.map((sel, idx) => {
                            const isGreen = bet.isAllGreen || isAllGreenTriggered || bet.status === 'won';
                            const details = resolveWinningPredictionDetails(sel);
                            const isMatchLive = sel.isLive ?? bet.isLive;
                            const matchTimeStr = sel.liveTime || "16' H1";
                            const matchScoreStr = sel.liveScore || "0:1";

                            // If Green Mode is active (or ticket marked won), render exact layout from Screenshot_20260927_102225_Chrome.jpg
                            if (isGreen) {
                              return (
                                <div
                                  key={idx}
                                  className="px-3.5 py-3.5 flex items-start space-x-3.5 hover:bg-[#1a2636] transition-colors"
                                >
                                  {/* Left: Solid Green Circle with White Checkmark */}
                                  <div className="pt-0.5 shrink-0">
                                    <div className="w-5 h-5 rounded-full bg-[#00df59] flex items-center justify-center text-black shadow-md">
                                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                    </div>
                                  </div>

                                  {/* Right Content */}
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    {/* Game ID | Date */}
                                    <div className="text-neutral-400 text-xs">
                                      Game ID: {details.gameId} | {details.gameDate}
                                    </div>

                                    {/* Team v Team */}
                                    <div className="font-bold text-white text-[15px] tracking-tight">
                                      {details.formattedMatchTitle}
                                    </div>

                                    {/* FT Score | Match Tracker */}
                                    <div className="flex items-center space-x-2 text-xs">
                                      <span className="text-neutral-300">
                                        FT Score: <strong className="text-white font-extrabold text-[13px] ml-1">{details.ftScore}</strong>
                                      </span>
                                      <span className="text-neutral-600">|</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          showToast(`Match Tracker opened for ${sel.matchTitle}`);
                                        }}
                                        className="text-[#00df59] hover:underline flex items-center space-x-1 font-bold text-xs cursor-pointer"
                                      >
                                        <span className="text-sm">📗</span>
                                        <span>Match Tracker</span>
                                      </button>
                                    </div>

                                    {/* Inner Dark Box: Pick, Market, Outcome, Trophy Watermark */}
                                    <div className="bg-[#192330] border border-[#243346] rounded-md p-2.5 relative overflow-hidden text-xs space-y-1 shadow-sm">
                                      <Trophy className="w-10 h-10 text-white/[0.07] absolute right-2 bottom-1 pointer-events-none" />

                                      <div className="flex items-center space-x-1.5 text-neutral-300">
                                        <span className="text-neutral-400">Pick:</span>
                                        <strong className="text-white font-bold tracking-tight">
                                          {details.pickText}
                                        </strong>
                                        <Check className="w-3.5 h-3.5 text-[#00df59] stroke-[3]" />
                                      </div>

                                      <div className="text-neutral-400">
                                        Market: <span className="text-neutral-200 font-semibold">{sel.marketName || '1X2'}</span>
                                      </div>

                                      <div className="text-neutral-400">
                                        Outcome: <strong className="text-white font-bold">{details.outcome}</strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Standard live/pending leg
                            return (
                              <div
                                key={idx}
                                className="px-3.5 py-3 flex items-start space-x-3.5"
                              >
                                {/* Left Icon: (▶) for Live, (🕒) for scheduled */}
                                <div className="pt-0.5 shrink-0">
                                  {isMatchLive ? (
                                    <div className="w-6 h-6 rounded-full border border-neutral-300 flex items-center justify-center text-white">
                                      <Play className="w-2.5 h-2.5 fill-current ml-0.5" />
                                    </div>
                                  ) : (
                                    <div className="w-6 h-6 rounded-full border border-neutral-400 flex items-center justify-center text-neutral-400">
                                      <Clock className="w-3.5 h-3.5" />
                                    </div>
                                  )}
                                </div>

                                {/* Right Content */}
                                <div className="flex-1 min-w-0 space-y-1">
                                  {/* Line 1: ⚽ Pick @ Odd  Market */}
                                  <div className="flex items-center justify-between text-xs">
                                    <div className="flex items-center space-x-1.5 font-bold text-white text-[14px]">
                                      <span className="text-sm">⚽</span>
                                      <span>{sel.selectionName} @ {sel.odd.toFixed(2)}</span>
                                      <span className="text-neutral-400 text-xs font-normal ml-1">
                                        {sel.marketName || '1X2'}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Line 2 (if Live): Live Odds pill + odd value + arrow */}
                                  {isMatchLive && (
                                    <div className="flex items-center space-x-2 text-xs">
                                      <span className="bg-[#263344] text-neutral-300 px-1.5 py-0.5 rounded text-[11px] font-semibold">
                                        Live Odds
                                      </span>
                                      <span className="font-bold text-white text-xs">
                                        {(sel.liveOdds || sel.odd).toFixed(2)}
                                      </span>
                                      {sel.liveOddsTrend === 'up' && (
                                        <span className="text-[#00df59] font-black text-sm">↑</span>
                                      )}
                                      {sel.liveOddsTrend === 'down' && (
                                        <span className="text-[#ff4444] font-black text-sm">↓</span>
                                      )}
                                    </div>
                                  )}

                                  {/* Line 3: Match Title (Underlined link style) */}
                                  <div>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleOpenSim(bet, sel.matchTitle);
                                      }}
                                      className="text-white text-xs font-medium underline hover:text-[#5ba4e5] text-left cursor-pointer"
                                    >
                                      {sel.matchTitle}
                                    </button>
                                  </div>

                                  {/* Line 4: Live Score/Time on left, and 3 icons on right */}
                                  {isMatchLive ? (
                                    <div className="flex items-center justify-between text-xs pt-0.5">
                                      <div className="text-[#00df59] font-bold text-xs">
                                        <span>{matchTimeStr} | {matchScoreStr}</span>
                                      </div>

                                      {/* 3 icons: 🎮 (purple) 🎦 (yellow) 📈 (cyan) */}
                                      <div className="flex items-center space-x-3.5 text-base">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleOpenSim(bet, sel.matchTitle);
                                          }}
                                          className="hover:scale-110 transition-transform cursor-pointer"
                                          title="Interactive Match Tracker"
                                        >
                                          🎮
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showToast(`Live video stream active for ${sel.matchTitle}`);
                                          }}
                                          className="hover:scale-110 transition-transform cursor-pointer text-amber-400"
                                          title="Live Stream"
                                        >
                                          🎦
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showToast(`Match stats loaded for ${sel.matchTitle}`);
                                          }}
                                          className="hover:scale-110 transition-transform cursor-pointer text-cyan-400"
                                          title="Statistics"
                                        >
                                          📈
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="text-neutral-400 text-xs pt-0.5">
                                      <span>{sel.liveTime || '26/09 20:30'}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Bottom inside dropdown: Hide Match Details ▲, Stake / Pot. Win, and Full-Width Cashout Button */}
                        <div className="bg-[#17212d] border-t border-[#202b3a] p-3.5 space-y-2.5">
                          <div className="flex justify-end">
                            <button
                              onClick={() => toggleExpandBet(bet.id)}
                              className="text-[#00df59] text-xs font-bold flex items-center space-x-1 hover:underline cursor-pointer"
                            >
                              <span>Hide Match Details</span>
                              <span className="text-[10px]">▲</span>
                            </button>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <div className="space-y-1 text-neutral-400 text-xs">
                              <div>Stake</div>
                              <div>Pot. Win</div>
                            </div>
                            <div className="space-y-1 text-right font-black text-white text-xs">
                              <div>{bet.stake.toFixed(2)}</div>
                              <div>{bet.potentialWin.toFixed(2)}</div>
                            </div>
                          </div>

                          {/* Full-width Vibrant Green Cashout Button at the very bottom (Matches Screenshot 2) */}
                          <div className="pt-1">
                            {isCashed ? (
                              <div className="w-full py-3 bg-[#243346] text-neutral-400 text-center font-bold text-xs rounded-md">
                                Cashout succeeded!
                              </div>
                            ) : bet.cashoutAvailable ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenCashoutDrawer(bet);
                                }}
                                className="w-full py-3 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 text-white font-black text-sm rounded-md shadow flex items-center justify-center transition-all cursor-pointer"
                              >
                                <span>Cashout GHS {cashoutVal.toFixed(2)}</span>
                              </button>
                            ) : (
                              <div className="w-full py-2.5 bg-[#202c3c] text-neutral-500 text-center font-bold text-xs rounded-md">
                                Cashout Unavailable
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* VIEW B: BET HISTORY (Screenshot 9)                                  */}
      {/* =================================================================== */}
      {activeTab === 'history' && (
        <div>
          {/* Filter Bar from Screenshot_20261004-191226.png */}
          <div className="px-3 py-2 bg-[#121922] border-b border-[#1f2835] flex items-center justify-between text-xs select-none relative">
            <div className="flex items-center space-x-2">
              {/* Bet Status Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsStatusDropdownOpen(!isStatusDropdownOpen);
                    setIsResultDropdownOpen(false);
                    setIsDateDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-[4px] bg-[#1a2432] border border-[#263446] text-neutral-200 hover:text-white flex items-center space-x-1.5 font-medium cursor-pointer shadow-sm active:scale-95 transition-all text-xs"
                >
                  <span>Bet Status: {historyStatusFilter}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {isStatusDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-36 bg-[#16212e] border border-[#253549] rounded shadow-xl py-1 z-30 text-xs">
                    {(['Settled', 'All', 'Cashed Out'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setHistoryStatusFilter(status);
                          setIsStatusDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-[#1f2e40] transition-colors flex items-center justify-between ${
                          historyStatusFilter === status ? 'text-[#00df59] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <span>{status}</span>
                        {historyStatusFilter === status && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Bet Result Dropdown */}
              <div className="relative">
                <button
                  onClick={() => {
                    setIsResultDropdownOpen(!isResultDropdownOpen);
                    setIsStatusDropdownOpen(false);
                    setIsDateDropdownOpen(false);
                  }}
                  className="px-3 py-1.5 rounded-[4px] bg-[#1a2432] border border-[#263446] text-neutral-200 hover:text-white flex items-center space-x-1.5 font-medium cursor-pointer shadow-sm active:scale-95 transition-all text-xs"
                >
                  <span>Bet Result {historyResultFilter !== 'All' ? `: ${historyResultFilter}` : ''}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {isResultDropdownOpen && (
                  <div className="absolute left-0 mt-1.5 w-32 bg-[#16212e] border border-[#253549] rounded shadow-xl py-1 z-30 text-xs">
                    {(['All', 'Won', 'Lost'] as const).map((res) => (
                      <button
                        key={res}
                        onClick={() => {
                          setHistoryResultFilter(res);
                          setIsResultDropdownOpen(false);
                        }}
                        className={`w-full px-3 py-2 text-left hover:bg-[#1f2e40] transition-colors flex items-center justify-between ${
                          historyResultFilter === res ? 'text-[#00df59] font-bold' : 'text-neutral-300'
                        }`}
                      >
                        <span>{res}</span>
                        {historyResultFilter === res && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right: Calendar + Trash with Red Dot */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  setIsDateDropdownOpen(!isDateDropdownOpen);
                  setIsStatusDropdownOpen(false);
                  setIsResultDropdownOpen(false);
                }}
                className="p-1.5 rounded-[4px] bg-[#1a2432] border border-[#263446] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Filter by Date Range"
              >
                <Calendar className="w-4 h-4" />
              </button>

              <button
                onClick={() => {
                  setHistoryStatusFilter('Settled');
                  setHistoryResultFilter('All');
                  setHistoryDateRange('6M');
                  showToast('Bet filters reset');
                }}
                className="relative p-1.5 rounded-[4px] bg-[#1a2432] border border-[#263446] text-neutral-300 hover:text-white transition-colors cursor-pointer"
                title="Clear/Reset Filters"
              >
                <Trash2 className="w-4 h-4" />
                {/* Red Dot indicator from screenshot */}
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#e41e26] border border-[#141b24]" />
              </button>
            </div>
          </div>

          {/* Settled Cards with Date Column (Exact match to Screenshot_20261004-191226.png) */}
          <div className="p-3 space-y-4">
            {filteredBetHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c2635] flex items-center justify-center mx-auto text-neutral-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1">No Matching Bet History</p>
                  <p className="text-neutral-400">No settled tickets match the currently selected filter options.</p>
                </div>
                <button
                  onClick={() => {
                    setHistoryStatusFilter('Settled');
                    setHistoryResultFilter('All');
                    setHistoryDateRange('6M');
                    showToast('Filters reset to default');
                  }}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-xs rounded uppercase tracking-wide transition-all shadow cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Reset Filters</span>
                </button>
              </div>
            ) : (
              filteredBetHistory.map((item) => {
                const isExpanded = !!expandedHistoryIds[item.id];
                const dateParts = parseBetDate(item);

                return (
                  <div key={item.id} className="flex items-start space-x-2.5">
                    {/* Left Date Column: e.g. 02 Oct, 19 Sep, or spacer for top card */}
                    <div className="text-center shrink-0 w-10 pt-1 select-none">
                      {dateParts.hasDate && (
                        <>
                          <div className="text-2xl font-black text-white leading-none tracking-tight">
                            {dateParts.day}
                          </div>
                          <div className="text-[11px] text-neutral-400 mt-0.5 font-medium">
                            {dateParts.month}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Right Ticket Card */}
                    <div className="flex-1 bg-[#141b24] border border-[#202b38] rounded-md overflow-hidden shadow-lg transition-all duration-200">
                      {/* EXACT SOLID GREEN HEADER BANNER CIRCLED IN RED FROM SCREENSHOT */}
                      <div
                        onClick={() => toggleExpandHistoryBet(item.id)}
                        role="button"
                        tabIndex={0}
                        aria-expanded={isExpanded}
                        title={isExpanded ? "Click on top to close bet details" : "Click to view full bet details"}
                        className="bg-[#00a826] hover:bg-[#009221] text-white px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none transition-colors active:opacity-95 rounded-t-md"
                      >
                        <span className="font-extrabold text-[15px] tracking-wide text-white">
                          {item.type || 'Multiple'}
                        </span>
                        <div className="flex items-center space-x-1.5 font-bold text-sm text-white">
                          {item.iconType === 'lightning' ? (
                            <Zap className="w-4 h-4 fill-white text-white stroke-none" />
                          ) : (
                            <Trophy className="w-4 h-4 fill-white text-white stroke-none" />
                          )}
                          <span>{item.status === 'won' ? 'Won' : item.status === 'lost' ? 'Lost' : 'Settled'}</span>
                          {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-white stroke-[2.5]" />
                          ) : (
                            <ChevronRight className="w-4 h-4 text-white stroke-[2.5]" />
                          )}
                        </div>
                      </div>

                      {/* COLLAPSED STATE (DEFAULT: DETAILS HIDDEN AS SHOWN IN SCREENSHOT) */}
                      {!isExpanded && (
                        <div
                          onClick={() => toggleExpandHistoryBet(item.id)}
                          className="p-3.5 space-y-2 cursor-pointer hover:bg-[#18222f] transition-colors select-none"
                        >
                          {/* Total Stake */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-400">Total Stake (GHS)</span>
                            <span className="text-white font-bold text-sm">{item.stake.toFixed(2)}</span>
                          </div>

                          {/* Total Return */}
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-neutral-400">Total Return</span>
                            <span className="text-[#00df59] font-black text-lg leading-tight">
                              {item.potentialWin.toFixed(2)}
                            </span>
                          </div>

                          {/* Match summary and Remix Bet button */}
                          <div className="pt-1.5 flex items-end justify-between">
                            <div className="space-y-0.5 text-xs text-neutral-300 flex-1 min-w-0 pr-3">
                              {item.selections.slice(0, 3).map((sel, sIdx) => {
                                const formattedTitle = (sel.matchTitle || 'Match').replace(/\s+vs\s+/gi, ' v ');
                                return (
                                  <div key={sIdx} className="truncate text-neutral-300 text-[13px] leading-snug">
                                    {formattedTitle}
                                  </div>
                                );
                              })}
                              {item.selections.length > 3 && (
                                <div className="text-neutral-400 text-xs pt-0.5">
                                  ... (and {item.selections.length - 3} other matches)
                                </div>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemixBet(item);
                              }}
                              className="bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-xs px-3.5 py-1.5 rounded-[3px] shadow transition-transform cursor-pointer shrink-0"
                            >
                              Remix Bet
                            </button>
                          </div>
                        </div>
                      )}

                      {/* EXPANDED STATE (WHEN USER CLICKS: DISPLAY ALL DETAILS) */}
                      {isExpanded && (
                        <div className="border-t border-[#202b38] bg-[#16202c] animate-in slide-in-from-top-2 duration-200">
                          {/* Sub-header inside expanded ticket: Ticket ID + Rebet + View Slip */}
                          <div
                            onClick={() => toggleExpandHistoryBet(item.id)}
                            role="button"
                            tabIndex={0}
                            title="Click to collapse details"
                            className="px-3.5 py-2.5 bg-[#192433] border-b border-[#233144] flex items-center justify-between text-xs cursor-pointer select-none hover:bg-[#1e2b3c] transition-colors"
                          >
                            <div className="text-[11px] text-neutral-400 flex items-center space-x-1">
                              <span>Ticket ID: {item.ticketId}</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard?.writeText(item.ticketId);
                                  showToast(`Copied: ${item.ticketId}`);
                                }}
                                className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                title="Copy Ticket ID"
                              >
                                <Copy className="w-3 h-3 ml-0.5 inline" />
                              </button>
                            </div>
                            <div className="flex items-center space-x-3 text-xs">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemixBet(item);
                                }}
                                className="flex items-center space-x-1 text-[#00df59] font-bold hover:underline cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Rebet</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetailBet(item);
                                }}
                                className="flex items-center space-x-1 text-[#00df59] font-bold hover:underline cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5" />
                                <span>Slip</span>
                              </button>
                            </div>
                          </div>

                          {/* Detailed Match Legs */}
                          <div className="divide-y divide-[#202b3a]">
                            {item.selections.map((sel, idx) => {
                              const details = resolveWinningPredictionDetails(sel);
                              return (
                                <div
                                  key={idx}
                                  className="px-3.5 py-3.5 flex items-start space-x-3.5 hover:bg-[#1a2636] transition-colors"
                                >
                                  {/* Left: Solid Green Circle with White Checkmark */}
                                  <div className="pt-0.5 shrink-0">
                                    <div className="w-5 h-5 rounded-full bg-[#00df59] flex items-center justify-center text-black shadow-md">
                                      <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                                    </div>
                                  </div>

                                  {/* Right Content */}
                                  <div className="flex-1 min-w-0 space-y-1.5">
                                    <div className="text-neutral-400 text-xs">
                                      Game ID: {details.gameId} | {details.gameDate}
                                    </div>

                                    <div className="font-bold text-white text-[15px] tracking-tight">
                                      {details.formattedMatchTitle}
                                    </div>

                                    <div className="flex items-center space-x-2 text-xs">
                                      <span className="text-neutral-300">
                                        FT Score:{' '}
                                        <strong className="text-white font-extrabold text-[13px] ml-1">
                                          {details.ftScore}
                                        </strong>
                                      </span>
                                      <span className="text-neutral-600">|</span>
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          handleOpenSim(item, details.formattedMatchTitle);
                                        }}
                                        className="text-[#00df59] hover:underline flex items-center space-x-1 font-bold text-xs cursor-pointer"
                                      >
                                        <span className="text-sm">📗</span>
                                        <span>Match Tracker</span>
                                      </button>
                                    </div>

                                    <div className="bg-[#192330] border border-[#243346] rounded-md p-2.5 relative overflow-hidden text-xs space-y-1 shadow-sm">
                                      <Trophy className="w-10 h-10 text-white/[0.07] absolute right-2 bottom-1 pointer-events-none" />

                                      <div className="flex items-center space-x-1.5 text-neutral-300">
                                        <span className="text-neutral-400">Pick:</span>
                                        <strong className="text-white font-bold tracking-tight">
                                          {details.pickText}
                                        </strong>
                                        <Check className="w-3.5 h-3.5 text-[#00df59] stroke-[3]" />
                                      </div>

                                      <div className="text-neutral-400">
                                        Market:{' '}
                                        <span className="text-neutral-200 font-semibold">
                                          {sel.marketName || '1X2'}
                                        </span>
                                      </div>

                                      <div className="text-neutral-400">
                                        Outcome:{' '}
                                        <strong className="text-white font-bold">
                                          {details.outcome}
                                        </strong>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Bottom inside expanded ticket: Stake, Potential Win, and Actions */}
                          <div className="bg-[#17212d] border-t border-[#202b3a] p-3.5 space-y-2.5">
                            <div className="flex justify-between items-center text-xs">
                              <div className="space-y-1 text-neutral-400 text-xs">
                                <div>Total Stake (GHS)</div>
                                <div>Total Return</div>
                              </div>
                              <div className="space-y-1 text-right font-black text-xs">
                                <div className="text-white">{item.stake.toFixed(2)}</div>
                                <div className="text-[#00df59] text-sm">
                                  GHS {item.potentialWin.toFixed(2)}
                                </div>
                              </div>
                            </div>

                            <div className="pt-1 flex items-center space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleRemixBet(item);
                                }}
                                className="flex-1 py-2.5 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 text-white font-black text-xs rounded-md shadow flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <RefreshCw className="w-3.5 h-3.5" />
                                <span>Remix Bet</span>
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedDetailBet(item);
                                }}
                                className="flex-1 py-2.5 bg-[#223042] hover:bg-[#2c3d53] active:scale-98 text-white font-bold text-xs rounded-md border border-[#31445b] flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
                              >
                                <FileText className="w-3.5 h-3.5 text-neutral-300" />
                                <span>View Ticket Slip</span>
                              </button>
                            </div>
                          </div>

                          {/* Close details button at bottom */}
                          <button
                            onClick={() => toggleExpandHistoryBet(item.id)}
                            className="w-full py-2.5 bg-[#121922] border-t border-[#1d2734] text-center text-xs text-neutral-400 hover:text-white flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                          >
                            <span>Hide Match Details</span>
                            <ChevronUp className="w-4 h-4 text-[#00df59]" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}

            {/* Subtext below list */}
            {activeBetHistory.length > 0 && (
              <div className="text-center pt-4 space-y-1 text-xs">
                <p className="text-neutral-500">Show only tickets in the last 6 months</p>
                <button
                  onClick={() => showToast('Loading older tickets from database...')}
                  className="text-[#00df59] font-bold hover:underline"
                >
                  View Older Tickets
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )}
      </div>

      {/* =================================================================== */}
      {/* 4. RECOMMENDED FOOTBALL CODES (Exact match to uploaded screenshot, Open Bets only) */}
      {/* =================================================================== */}
      {activeTab === 'open' && (
        <div className="mt-auto border-t border-[#1c2532] bg-[#101720]">
          <button
            onClick={() => setRecommendedCodesOpen(!recommendedCodesOpen)}
            className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#151f2b] transition-colors cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-8 h-8 rounded bg-emerald-500/15 flex items-center justify-center shrink-0">
                <Bookmark className="w-4 h-4 text-[#00df59] fill-[#00df59]" />
              </div>
              <div>
                <div className="text-[14px] font-bold text-white leading-tight">
                  Recommended Football Codes
                </div>
                <div className="text-[12px] text-neutral-400 mt-0.5 leading-tight">
                  Save the effort of building it from scratch
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-5 h-5 text-neutral-400 transition-transform duration-200 ${
                recommendedCodesOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {recommendedCodesOpen && (
            <div className="px-4 pb-4 space-y-2 bg-[#0d131a] border-t border-[#1a232f] pt-3">
              {recommendedCodes.map((codeItem) => (
                <div
                  key={codeItem.code}
                  className="p-3 bg-[#151f2b] rounded border border-[#222e3e] flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-white font-mono font-black text-sm tracking-wide">
                        {codeItem.code}
                      </span>
                      <span className="text-[11px] px-1.5 py-0.5 rounded bg-white/10 text-neutral-300 font-semibold">
                        {codeItem.folds} Folds
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 mt-1">
                      Odds: <span className="text-[#00df59] font-bold">{codeItem.odds.toFixed(2)}</span>
                      <span className="mx-1 text-neutral-600">•</span>
                      <span className="text-neutral-400">{codeItem.title}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLoadRecommendedCode(codeItem.code)}
                    className="px-3 py-1.5 bg-[#00df59] hover:bg-[#00c54e] text-black font-black text-xs rounded transition-colors active:scale-95 cursor-pointer shrink-0 ml-2"
                  >
                    Load Code
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* DRAWER 1: CASHOUT SLIDER (Screenshot 7)                             */}
      {/* =================================================================== */}
      {cashoutDrawerBet && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#1b2532] rounded-t-2xl p-4 space-y-4 shadow-2xl border-t border-[#29394d] animate-in slide-in-from-bottom duration-150">
            {/* Header: Cashout now | Set auto rule | Close X */}
            <div className="flex items-center justify-between border-b border-[#263548] pb-2 text-xs">
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setCashoutTab('now')}
                  className={`pb-1 font-bold relative ${
                    cashoutTab === 'now' ? 'text-white font-black' : 'text-neutral-400'
                  }`}
                >
                  Cashout now
                  {cashoutTab === 'now' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setCashoutTab('auto');
                    showToast('Set Auto Cashout rule');
                  }}
                  className={`pb-1 font-bold ${
                    cashoutTab === 'auto' ? 'text-white font-black' : 'text-neutral-400'
                  }`}
                >
                  Set auto rule
                </button>
              </div>

              <button
                onClick={() => setCashoutDrawerBet(null)}
                className="w-6 h-6 rounded-full bg-[#253243] flex items-center justify-center text-neutral-300 hover:text-white"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Stake & Pot Win Info */}
            <div className="flex items-center justify-between text-xs text-neutral-400">
              <div>
                Stake <strong className="text-white">{cashoutDrawerBet.stake.toFixed(2)}</strong>
              </div>
              <div>
                Pot. Win{' '}
                <strong className="text-white">
                  {cashoutDrawerBet.potentialWin.toFixed(2)}
                </strong>
              </div>
            </div>

            {/* Large Full Cashout Headline */}
            <div className="text-center py-1">
              <h3 className="text-xl font-black text-white">
                Full Cashout {cashoutSliderValue.toFixed(2)}
              </h3>
            </div>

            {/* Range Slider */}
            <div className="space-y-1 px-2">
              <input
                type="range"
                min="0.01"
                max={cashoutDrawerBet.cashoutAmount || 7.0}
                step="0.01"
                value={cashoutSliderValue}
                onChange={(e) => setCashoutSliderValue(parseFloat(e.target.value))}
                className="w-full accent-[#00df59] h-2 bg-[#121922] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-neutral-400 font-bold">
                <span>Min 0.01</span>
                <span>Max {(cashoutDrawerBet.cashoutAmount || 7.0).toFixed(2)}</span>
              </div>
            </div>

            {/* Confirm Cashout Button */}
            <button
              onClick={handleConfirmCashout}
              className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-98 text-white font-black text-sm rounded shadow uppercase tracking-wide transition-all"
            >
              Confirm GHS {cashoutSliderValue.toFixed(2)}
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DRAWER 2: CASHOUT SUCCEEDED (Screenshot 8)                          */}
      {/* =================================================================== */}
      {cashoutSucceededBet && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#1b2532] rounded-t-2xl p-5 space-y-4 shadow-2xl border-t border-[#29394d] animate-in slide-in-from-bottom duration-150 text-center relative">
            {/* Close X */}
            <button
              onClick={() => setCashoutSucceededBet(null)}
              className="absolute top-4 right-4 w-7 h-7 rounded-full bg-[#253243] flex items-center justify-center text-neutral-300 hover:text-white"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>

            {/* Green Circle Check */}
            <div className="w-12 h-12 rounded-full bg-[#00a826] flex items-center justify-center text-white mx-auto shadow-lg">
              <Check className="w-7 h-7 stroke-[3]" />
            </div>

            {/* Large Amount */}
            <div>
              <div className="text-3xl font-black text-white">
                GHS {cashoutSucceededBet.amount.toFixed(2)}
              </div>
              <div className="text-base font-bold text-[#00df59] mt-0.5">
                Cashout succeeded!
              </div>
              <p className="text-xs text-neutral-400 mt-1">
                Still live. Build your next winner.
              </p>
            </div>

            {/* Action Button: Rebet remaining matches */}
            <button
              onClick={() => {
                const bet = cashoutSucceededBet.bet;
                setCashoutSucceededBet(null);
                handleRebet(bet);
              }}
              className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-98 text-white font-black text-xs rounded shadow uppercase tracking-wide transition-all"
            >
              Rebet remaining matches
            </button>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DRAWER 3: MATCH SIMULATION MODAL (SportyBet Live Pitch Tracker)     */}
      {/* =================================================================== */}
      {simulatingBet && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#16202c] rounded-t-2xl p-4 space-y-3.5 shadow-2xl border-t border-[#29394d] animate-in slide-in-from-bottom duration-200">
            {/* Header: Match Title, Clock, Close */}
            <div className="flex items-center justify-between border-b border-[#243346] pb-2 text-xs">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00df59] animate-ping" />
                <span className="font-black text-white text-sm">
                  {simMatchData.homeTeam} vs {simMatchData.awayTeam}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-[#00df59] text-[10px] font-black uppercase">
                  SIM • In-Play
                </span>
              </div>
              <button
                onClick={() => setSimulatingBet(null)}
                className="w-7 h-7 rounded-full bg-[#253243] flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            {/* Scoreboard */}
            <div className="bg-[#111822] rounded-lg p-3 border border-[#202d3e] flex items-center justify-between text-center">
              <div className="w-2/5 text-left">
                <div className="font-black text-white text-base truncate">{simMatchData.homeTeam}</div>
                <div className="text-[11px] text-neutral-400">Kane 34'</div>
              </div>
              <div className="w-1/5">
                <div className="text-2xl font-black text-[#00df59] tracking-wider">
                  {simMatchData.homeScore} - {simMatchData.awayScore}
                </div>
                <div className="text-[10px] font-bold text-neutral-300 bg-[#1c2837] px-1.5 py-0.5 rounded-full inline-block mt-0.5">
                  {simMatchData.minute}' 2H
                </div>
              </div>
              <div className="w-2/5 text-right">
                <div className="font-black text-white text-base truncate">{simMatchData.awayTeam}</div>
                <div className="text-[11px] text-neutral-400">Morata 51'</div>
              </div>
            </div>

            {/* 2D Animated Football Pitch */}
            <div className="relative h-32 rounded-lg bg-gradient-to-b from-[#1b5e20] to-[#144717] border border-[#2e7d32] overflow-hidden p-2 flex flex-col justify-between shadow-inner">
              {/* Pitch markings */}
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 border-t border-white/25" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border border-white/25" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-8 border-b border-x border-white/20" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-8 border-t border-x border-white/20" />

              {/* Action Banner */}
              <div className="relative z-10 flex items-center justify-center">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur rounded text-[11px] font-bold text-white shadow flex items-center space-x-1.5 border border-white/10">
                  <Activity className="w-3.5 h-3.5 text-[#00df59] animate-spin" />
                  <span>{simMatchData.action}</span>
                </span>
              </div>

              {/* Animated ball on pitch */}
              <div className="relative z-10 flex items-center justify-center my-auto">
                <div className="w-3 h-3 rounded-full bg-white shadow-lg animate-bounce ring-2 ring-emerald-400" />
              </div>

              {/* Possession bar */}
              <div className="relative z-10 space-y-1">
                <div className="flex justify-between text-[10px] text-white/90 font-bold px-1">
                  <span>{simMatchData.homeTeam} {simMatchData.possessionHome}%</span>
                  <span>Possession</span>
                  <span>{100 - simMatchData.possessionHome}% {simMatchData.awayTeam}</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden flex">
                  <div
                    className="bg-[#00df59] h-full transition-all duration-500"
                    style={{ width: `${simMatchData.possessionHome}%` }}
                  />
                  <div
                    className="bg-[#ff4444] h-full transition-all duration-500"
                    style={{ width: `${100 - simMatchData.possessionHome}%` }}
                  />
                </div>
              </div>
            </div>

            {/* In-Play Match Stats */}
            <div className="grid grid-cols-4 gap-1.5 text-center text-xs bg-[#111822] p-2 rounded-lg border border-[#202d3e]">
              <div>
                <span className="text-[10px] text-neutral-400 block">Shots</span>
                <span className="font-bold text-white">{simMatchData.shotsHome} - {simMatchData.shotsAway}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Corners</span>
                <span className="font-bold text-white">{simMatchData.cornersHome} - {simMatchData.cornersAway}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Fouls</span>
                <span className="font-bold text-white">8 - 9</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block">Yellows</span>
                <span className="font-bold text-white">1 - 2</span>
              </div>
            </div>

            {/* Bet Pick Status */}
            <div className="bg-[#121c27] p-2.5 rounded-lg border border-emerald-900/50 flex items-center justify-between text-xs">
              <div>
                <span className="text-neutral-400 text-[10px] block">Your Pick</span>
                <span className="font-bold text-white">Draw (X) @ 3.20</span>
              </div>
              <div className="text-right">
                <span className="text-[#00df59] font-black text-xs flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 inline" />
                  <span>Winning (1-1)</span>
                </span>
              </div>
            </div>

            {/* Quick Cashout inside SIM Modal */}
            {simulatingBet.cashoutAvailable && (
              <button
                onClick={() => {
                  const bet = simulatingBet;
                  setSimulatingBet(null);
                  handleOpenCashoutDrawer(bet);
                }}
                className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] active:scale-98 text-white font-black text-xs rounded uppercase tracking-wider shadow transition-all cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <span>Cashout GHS {(simulatingBet.cashoutAmount || 4750.0).toFixed(2)}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* DRAWER 4: EDIT BET MODAL                                            */}
      {/* =================================================================== */}
      {editingBet && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#16202c] rounded-t-2xl p-4 space-y-3.5 shadow-2xl border-t border-[#29394d] animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between border-b border-[#243346] pb-2 text-xs">
              <div className="flex items-center space-x-2">
                <Share2 className="w-4 h-4 text-[#00df59]" />
                <span className="font-black text-white text-sm">
                  Edit Bet ({editingBet.type})
                </span>
              </div>
              <button
                onClick={() => setEditingBet(null)}
                className="w-7 h-7 rounded-full bg-[#253243] flex items-center justify-center text-neutral-300 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <p className="text-xs text-neutral-300">
              You can adjust selections or reallocate stake while matches are still in-play:
            </p>

            <div className="space-y-2 max-h-48 overflow-y-auto">
              {editingBet.selections.map((sel, idx) => (
                <div
                  key={idx}
                  className="p-2.5 bg-[#101720] rounded border border-[#212f40] flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-white block">{sel.matchTitle}</span>
                    <span className="text-[11px] text-neutral-400">
                      {sel.marketName}: <strong className="text-[#00df59]">{sel.selectionName}</strong>
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">@{sel.odd.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="bg-[#121c27] p-2.5 rounded text-xs flex justify-between">
              <span className="text-neutral-400">Total Stake:</span>
              <strong className="text-white font-mono">GHS {editingBet.stake.toFixed(2)}</strong>
            </div>

            <button
              onClick={() => {
                setEditingBet(null);
                showToast('Ticket selections saved & updated');
              }}
              className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] active:scale-98 text-white font-black text-xs rounded uppercase tracking-wider shadow transition-all cursor-pointer"
            >
              Save & Update Ticket
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />

      {/* SportyBet Ticket Details Modal (Matches Screenshot_20260927_102225_Chrome.jpg) */}
      <TicketDetailsModal
        isOpen={!!selectedDetailBet}
        onClose={() => setSelectedDetailBet(null)}
        bet={selectedDetailBet}
      />

      {/* SportyBet Create Personal Page & CodeChat Modal (Matches Screenshot_20261009_130305_Chrome.jpg) */}
      <CreatePersonalPageModal
        isOpen={personalPageModalOpen}
        onClose={() => setPersonalPageModalOpen(false)}
      />
    </div>
  );
};
