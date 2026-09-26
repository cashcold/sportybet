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
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';
import { PlacedBet } from '../types';
import { AuthModal } from './AuthModal';

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
    setActiveTab: setNavTab
  } = useBetting();

  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [filter, setFilter] = useState<'all' | 'cashout' | 'live'>('cashout');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');
  const [recommendedCodesOpen, setRecommendedCodesOpen] = useState(false);

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

          {/* Profile Avatar + GHS Balance OR Register | Login (screenshot style) */}
          {user.isLoggedIn ? (
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full overflow-hidden border border-white/20 bg-neutral-800">
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
                {user.currency} {user.balance.toFixed(2)}
              </span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-[14px]">
              <button
                onClick={() => {
                  setAuthMode('join');
                  setAuthModalOpen(true);
                }}
                className="text-white hover:text-neutral-200 transition-colors cursor-pointer font-medium"
              >
                Register
              </button>
              <span className="text-neutral-500 font-normal">|</span>
              <button
                onClick={() => {
                  setAuthMode('login');
                  setAuthModalOpen(true);
                }}
                className="text-white hover:text-neutral-200 transition-colors cursor-pointer font-medium"
              >
                Login
              </button>
            </div>
          )}
        </div>

        {/* =================================================================== */}
        {/* 2. SEGMENTED TABS: Open Bets | Bet History (Matches screenshot)      */}
        {/* =================================================================== */}
        <div className="flex text-[15px] font-bold">
          <button
            onClick={() => setActiveTab('open')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'open'
                ? 'bg-[#151c24] text-white font-black'
                : 'bg-[#434d5b] text-[#8e9aa9] hover:text-white'
            }`}
          >
            Open Bets {user.isLoggedIn && activeOpenBets.length > 0 ? `(${activeOpenBets.length})` : ''}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-center transition-colors cursor-pointer ${
              activeTab === 'history'
                ? 'bg-[#151c24] text-white font-black'
                : 'bg-[#434d5b] text-[#8e9aa9] hover:text-white'
            }`}
          >
            Bet History
          </button>
        </div>

        {/* =================================================================== */}
        {/* 3. MAIN CONTENT: GUEST PROMPT (Exact match to uploaded screenshot)   */}
        {/* =================================================================== */}
        {!user.isLoggedIn ? (
          <div className="flex-1 flex flex-col items-center justify-center px-4 py-28 text-center select-none">
            <p className="text-white text-[16px] leading-[1.6] font-normal max-w-sm">
              {activeTab === 'open' ? (
                <>
                  Please Log In to see your Open Bets<br />
                  and Cashout Bets
                </>
              ) : (
                <>
                  Please Log In to see your Bet History<br />
                  and Settled Bets
                </>
              )}
            </p>

            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="mt-6 px-8 py-1.5 rounded-[4px] border border-[#00df59] bg-transparent text-[#00df59] text-[15px] font-medium hover:bg-[#00df59]/10 active:scale-95 transition-all cursor-pointer"
            >
              Login
            </button>
          </div>
        ) : (
        <>
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

            <button
              onClick={() => showToast('Grid view toggle')}
              className="p-1 text-neutral-400 hover:text-white"
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4 stroke-[2]" />
            </button>
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
                    <div className="px-3.5 pt-3 pb-2 flex items-center justify-between text-xs select-none">
                      <div
                        onClick={() => toggleExpandBet(bet.id)}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <span className="font-bold text-white text-[15px] tracking-wide">
                          {bet.type}
                        </span>
                        {bet.isLive && (
                          <span className="bg-[#1b432a] text-[#00df59] font-bold text-[11px] px-1.5 py-0.5 rounded">
                            Live
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-3.5 font-bold text-[#00df59] text-[13px]">
                        <button
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
                          onClick={(e) => {
                            e.stopPropagation();
                            setEditingBet(bet);
                          }}
                          className="flex items-center space-x-1 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Edit Bet</span>
                        </button>
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
                        <div className="divide-y divide-[#202b3a]">
                          {bet.selections.map((sel, idx) => {
                            const isMatchLive = sel.isLive ?? bet.isLive;
                            const matchTimeStr = sel.liveTime || "16' H1";
                            const matchScoreStr = sel.liveScore || "0:1";

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
          {/* Dropdown Filters & Actions: Bet Status: Settled ▾ | Bet Result ▾ | 📅 | 🗑 */}
          <div className="px-3 py-2 bg-[#121922] border-b border-[#212b38] flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => showToast('Status: Settled')}
                className="bg-[#1b2532] text-neutral-200 py-1 px-2 rounded flex items-center space-x-1 border border-[#273648]"
              >
                <span>Bet Status: Settled</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              <button
                onClick={() => showToast('Filter Bet Result')}
                className="bg-[#1b2532] text-neutral-200 py-1 px-2 rounded flex items-center space-x-1 border border-[#273648]"
              >
                <span>Bet Result</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>

            <div className="flex items-center space-x-2 text-neutral-400">
              <button
                onClick={() => showToast('Filter by date range')}
                className="hover:text-white p-1"
                title="Calendar"
              >
                <Calendar className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Clear history filter')}
                className="hover:text-white p-1"
                title="Clear"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Settled Cards with Date Column (Exact match to Screenshot 9) */}
          <div className="p-3 space-y-4">
            {activeBetHistory.length === 0 ? (
              <div className="py-12 text-center text-xs text-neutral-400 space-y-3">
                <div className="w-12 h-12 rounded-full bg-[#1c2635] flex items-center justify-center mx-auto text-neutral-500">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <p className="font-bold text-white text-sm mb-1">No Bet History</p>
                  <p className="text-neutral-400">Your settled tickets and winning slips will appear here.</p>
                </div>
                <button
                  onClick={() => setNavTab('sports')}
                  className="inline-flex items-center space-x-1.5 px-4 py-2 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-xs rounded uppercase tracking-wide transition-all shadow"
                >
                  <span>Explore Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              activeBetHistory.map((item) => (
                <div key={item.id} className="flex items-start space-x-3">
                  {/* Left Date Column: 24 Sep */}
                  <div className="text-center shrink-0 w-10 pt-1">
                    <div className="text-2xl font-black text-white leading-none">24</div>
                    <div className="text-[11px] text-neutral-400 mt-0.5">Sep</div>
                  </div>

                  {/* Right Ticket Card */}
                  <div className="flex-1 bg-[#18222f] border border-[#243243] rounded-md overflow-hidden shadow">
                    {/* Top Dark Green Banner: Multiple | 🏆 Won > */}
                    <div className="bg-[#153a23] px-3 py-2 flex items-center justify-between border-b border-emerald-900/40 text-xs">
                      <span className="font-bold text-white">{item.type}</span>
                      <button
                        onClick={() => showToast('Viewing Ticket Details')}
                        className="flex items-center space-x-1 text-[#00df59] font-black hover:underline"
                      >
                        <Trophy className="w-3.5 h-3.5" />
                        <span>Won</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Stake & Return Row */}
                    <div className="px-3 py-2 border-b border-[#232f3e] flex items-center justify-between text-xs font-bold">
                      <div className="text-neutral-300">
                        <span>Total Stake(GHS): </span>
                        <strong className="text-white">{item.stake.toFixed(2)}</strong>
                      </div>
                      <div className="text-neutral-300">
                        <span>Total Return: </span>
                        <strong className="text-[#00df59]">{item.potentialWin.toFixed(2)}</strong>
                      </div>
                    </div>

                    {/* Matches Summary */}
                    <div className="p-3 space-y-1 text-xs text-neutral-300">
                      {item.selections.map((s, idx) => (
                        <p key={idx}>{s.matchTitle}</p>
                      ))}
                    </div>
                  </div>
                </div>
              ))
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
      {/* 4. RECOMMENDED FOOTBALL CODES (Exact match to uploaded screenshot)  */}
      {/* =================================================================== */}
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
    </div>
  );
};
