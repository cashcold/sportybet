import React, { useState } from 'react';
import {
  HelpCircle,
  RefreshCw,
  Play,
  Share2,
  LayoutGrid,
  ChevronDown,
  X,
  Check,
  Calendar,
  Trash2,
  Trophy,
  ChevronRight,
  Ticket,
  ArrowRight
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
    setActiveTab: setNavTab
  } = useBetting();

  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [filter, setFilter] = useState<'all' | 'cashout' | 'live'>('cashout');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');

  // Cashout drawer state (Screenshot 7 & 8)
  const [cashoutDrawerBet, setCashoutDrawerBet] = useState<PlacedBet | null>(null);
  const [cashoutSliderValue, setCashoutSliderValue] = useState<number>(7.0);
  const [cashoutTab, setCashoutTab] = useState<'now' | 'auto'>('now');
  const [cashoutSucceededBet, setCashoutSucceededBet] = useState<{
    bet: PlacedBet;
    amount: number;
  } | null>(null);
  const [cashedOutBetIds, setCashedOutBetIds] = useState<Record<string, boolean>>({});

  // Scoped to logged-in user: guests have 0 open bets
  const activeOpenBets = user.isLoggedIn ? openBets : [];
  const activeBetHistory = user.isLoggedIn ? betHistory : [];

  const filteredOpenBets = activeOpenBets.filter((bet) => {
    if (filter === 'cashout') return bet.cashoutAvailable;
    if (filter === 'live') return bet.isLive;
    return true;
  });

  const handleOpenCashoutDrawer = (bet: PlacedBet) => {
    if (cashedOutBetIds[bet.id]) return;
    const maxVal = bet.cashoutAmount || 7.0;
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
    <div className="pb-24 bg-[#121922] text-white min-h-screen">
      {/* =================================================================== */}
      {/* 1. TOP BAR (Screenshots 6, 7, 8, 9)                                */}
      {/* How to Cashout? | Avatar | GHS Balance in bright gold               */}
      {/* =================================================================== */}
      <div className="px-3.5 py-2.5 bg-[#141d27] border-b border-[#212b38] flex items-center justify-between">
        <button
          onClick={() => showToast('Cashout lets you lock in wins or minimize losses early!')}
          className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white font-medium"
        >
          <HelpCircle className="w-4 h-4 text-neutral-400 stroke-[2.2]" />
          <span>How to Cashout?</span>
        </button>

        {/* Profile Avatar + GHS Balance OR Log In / Join buttons */}
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
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-black bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white rounded-[4px] shadow-sm transition-all uppercase"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthMode('join');
                setAuthModalOpen(true);
              }}
              className="px-2.5 py-1 text-xs font-bold border border-white/30 text-white hover:bg-white/10 active:scale-95 rounded-[4px] transition-all uppercase"
            >
              Register
            </button>
          </div>
        )}
      </div>

      {/* =================================================================== */}
      {/* 2. SEGMENTED TABS: Open Bets (0) | Bet History                     */}
      {/* =================================================================== */}
      <div className="flex bg-[#141d27] text-xs font-bold border-b border-[#212b38]">
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-3 text-center transition-colors ${
            activeTab === 'open'
              ? 'bg-[#222d3d] text-white font-black'
              : 'bg-[#4c5768] text-neutral-300 hover:text-white'
          }`}
        >
          Open Bets ({activeOpenBets.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-center transition-colors ${
            activeTab === 'history'
              ? 'bg-[#222d3d] text-white font-black'
              : 'bg-[#4c5768] text-neutral-300 hover:text-white'
          }`}
        >
          Bet History
        </button>
      </div>

      {/* =================================================================== */}
      {/* 3. MAIN CONTENT: GUEST PROMPT OR AUTHENTICATED TABS                */}
      {/* =================================================================== */}
      {!user.isLoggedIn ? (
        <div className="px-4 py-12 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-[#1b2533] border border-[#2b3a4f] flex items-center justify-center mb-4 text-[#00df59] shadow-lg">
            <Ticket className="w-8 h-8" />
          </div>
          <h3 className="text-base font-black text-white uppercase tracking-wide mb-1.5">
            {activeTab === 'open' ? 'Log In to View Open Bets' : 'Log In to View Bet History'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-xs leading-relaxed mb-6">
            {activeTab === 'open'
              ? 'Log in to track your active slips, view live score updates, and use Real-Time Cashout.'
              : 'Log in to view your settled bets, winning tickets, and account transaction receipts.'}
          </p>

          <div className="w-full max-w-xs space-y-2.5">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.99] text-white font-black text-xs rounded-[4px] uppercase tracking-wider shadow-lg transition-all"
            >
              Log In
            </button>
            <button
              onClick={() => {
                setAuthMode('join');
                setAuthModalOpen(true);
              }}
              className="w-full py-3 bg-[#24303f] hover:bg-[#2c3b4e] active:scale-[0.99] text-white font-bold text-xs rounded-[4px] uppercase tracking-wider border border-[#37485e] transition-all"
            >
              Join Now / Register
            </button>
          </div>

          {/* Value highlights */}
          <div className="w-full max-w-xs mt-8 pt-6 border-t border-[#1e2a39] grid grid-cols-2 gap-3 text-left">
            <div className="bg-[#17202c] p-3 rounded border border-[#223042]">
              <div className="text-[#ffde00] font-black text-xs mb-1">⚡ Cashout</div>
              <div className="text-[11px] text-neutral-400 leading-snug">Lock in profits anytime before full-time</div>
            </div>
            <div className="bg-[#17202c] p-3 rounded border border-[#223042]">
              <div className="text-[#00df59] font-black text-xs mb-1">🔄 Rebet</div>
              <div className="text-[11px] text-neutral-400 leading-snug">Reload selections into your betslip with 1 tap</div>
            </div>
          </div>
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
                const cashoutVal = bet.cashoutAmount || 7.0;

                return (
                  <div
                    key={bet.id}
                    className="bg-[#18222f] border border-[#243243] rounded-md overflow-hidden shadow"
                  >
                    {/* Header: Multiple | Rebet | SIM | Edit Bet */}
                    <div className="px-3 py-2 bg-[#151e29] border-b border-[#232f3e] flex items-center justify-between text-xs">
                      <span className="font-black text-white text-sm">
                        {bet.type}
                      </span>

                      <div className="flex items-center space-x-3 font-bold text-[#00df59]">
                        <button
                          onClick={() => handleRebet(bet)}
                          className="flex items-center space-x-1 hover:text-emerald-300"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Rebet</span>
                        </button>

                        <button
                          onClick={() => showToast('Match Simulation active')}
                          className="flex items-center space-x-1 hover:text-emerald-300"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          <span>SIM</span>
                        </button>

                        <button
                          onClick={() => showToast('Edit Bet selections')}
                          className="flex items-center space-x-1 hover:text-emerald-300"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>Edit Bet</span>
                        </button>
                      </div>
                    </div>

                    {/* Match & Stake Row */}
                    <div className="p-3 flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-white">
                          {bet.selections[0]?.matchTitle || 'Match'}
                        </div>
                        <div className="text-xs text-neutral-300">
                          <span>Stake </span>
                          <strong className="font-black text-white">{bet.stake.toFixed(2)}</strong>
                        </div>
                      </div>

                      {/* Cashout Button (Bright Green, Two Lines) */}
                      {isCashed ? (
                        <div className="bg-[#2a3748] text-neutral-400 px-4 py-2 rounded text-xs font-bold text-center cursor-not-allowed">
                          Cashout succeeded!
                        </div>
                      ) : bet.cashoutAvailable ? (
                        <button
                          onClick={() => handleOpenCashoutDrawer(bet)}
                          className="bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white px-5 py-2 rounded flex flex-col items-center justify-center font-bold text-xs shadow-md transition-transform"
                        >
                          <span className="leading-tight">Cashout</span>
                          <span className="font-black leading-tight">
                            GHS {cashoutVal.toFixed(2)}
                          </span>
                        </button>
                      ) : (
                        <div className="bg-[#243040] text-neutral-500 px-3 py-2 rounded text-xs font-bold">
                          Cashout Unavailable
                        </div>
                      )}
                    </div>
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

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
};
