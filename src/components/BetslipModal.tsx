import React, { useState } from 'react';
import {
  X,
  Trash2,
  Settings,
  ChevronDown,
  Pin,
  HelpCircle,
  Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';

export const BetslipModal: React.FC = () => {
  const {
    betslip,
    isBetslipOpen,
    setIsBetslipOpen,
    removeSelection,
    clearBetslip,
    placeBet,
    user,
    showToast,
    loadBookingCode
  } = useBetting();

  const [mode, setMode] = useState<'REAL' | 'SIM'>('REAL');
  const [tab, setTab] = useState<'Single' | 'Multiple' | 'System'>('Multiple');
  const [stake, setStake] = useState<number>(1.00);
  const [showSettings, setShowSettings] = useState(false);
  const [bookingCodeModalOpen, setBookingCodeModalOpen] = useState(false);
  const [bookingCodeInput, setBookingCodeInput] = useState('');

  if (!isBetslipOpen) return null;

  // Calculate total odds
  const totalOdds = betslip.length > 0
    ? parseFloat(betslip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2))
    : 0;

  const handlePlaceBet = () => {
    if (betslip.length === 0) {
      showToast('Betslip is empty');
      return;
    }
    const res = placeBet(stake, tab === 'Single' ? 'Single' : 'Multiple');
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setIsBetslipOpen(false);
    } else if (res.error) {
      showToast(res.error);
    }
  };

  const handleBookBet = () => {
    if (betslip.length === 0) {
      showToast('Select matches first to book');
      return;
    }
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let code = 'GH';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    navigator.clipboard?.writeText(code);
    showToast(`Booking Code: ${code} (Copied!) Share with friends.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-end justify-center select-none animate-in fade-in duration-150">
      <div className="w-full max-w-md bg-[#1a232f] text-white rounded-t-xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl border-t border-neutral-700 animate-in slide-in-from-bottom duration-200">
        {/* Top Header (Screenshot 2: Green count pill, REAL/SIM toggle, Down chevron, GHS 0.00) */}
        <div className="bg-[#242f3d] px-3 py-2.5 flex items-center justify-between border-b border-[#2d3a4b]">
          <div className="flex items-center space-x-2">
            {/* Green count badge */}
            <span className="w-6 h-6 rounded-full bg-[#00a826] text-white text-xs font-black flex items-center justify-center shadow">
              {betslip.length}
            </span>

            {/* REAL | SIM Pill Toggle */}
            <div className="bg-[#141b24] p-0.5 rounded-full flex items-center border border-white/10 text-[11px] font-bold">
              <button
                onClick={() => setMode('REAL')}
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  mode === 'REAL'
                    ? 'bg-[#00a826] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                REAL
              </button>
              <button
                onClick={() => {
                  setMode('SIM');
                  showToast('Switched to Simulation mode');
                }}
                className={`px-3 py-0.5 rounded-full transition-colors ${
                  mode === 'SIM'
                    ? 'bg-[#00a826] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                SIM
              </button>
            </div>
          </div>

          {/* Minimize Chevron button */}
          <button
            onClick={() => setIsBetslipOpen(false)}
            className="p-1 text-neutral-300 hover:text-white"
            title="Minimize betslip"
          >
            <ChevronDown className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* User Balance in bright gold (Screenshot 2) */}
          <div className="text-right">
            <span className="text-xs font-black text-[#ffdf00] tracking-wide">
              {user.currency} {user.balance.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Action icons row (Screenshot 2: 📢 My Pins, 🗑️, ⚙️ with red dot) */}
        <div className="px-4 py-2 bg-[#1b2533] border-b border-[#253243] flex items-center justify-between text-xs">
          <button
            onClick={() => showToast('My Pins allows pinning key selections in system bets')}
            className="flex items-center space-x-1.5 text-neutral-300 hover:text-white font-medium"
          >
            <span className="text-base">📢</span>
            <span>My Pins</span>
          </button>

          <div className="flex items-center space-x-4">
            {betslip.length > 0 && (
              <button
                onClick={clearBetslip}
                className="text-neutral-400 hover:text-red-400 transition-colors p-1"
                title="Clear all selections"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setShowSettings(!showSettings)}
              className="relative text-neutral-400 hover:text-white transition-colors p-1"
              title="Odds change settings"
            >
              <Settings className="w-4 h-4" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-[#ff4d4f] rounded-full" />
            </button>
          </div>
        </div>

        {/* Tab switch (Screenshot 2: Single | Multiple | System) */}
        <div className="grid grid-cols-3 bg-[#131b24] text-xs font-bold border-b border-[#253243]">
          <button
            onClick={() => setTab('Single')}
            className={`py-2.5 text-center transition-colors ${
              tab === 'Single'
                ? 'bg-[#222d3d] text-white font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Single
          </button>

          <button
            onClick={() => setTab('Multiple')}
            className={`py-2.5 text-center transition-colors ${
              tab === 'Multiple'
                ? 'bg-[#222d3d] text-white font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Multiple
          </button>

          <button
            onClick={() => setTab('System')}
            className={`py-2.5 text-center transition-colors ${
              tab === 'System'
                ? 'bg-[#222d3d] text-white font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            System
          </button>
        </div>

        {/* Selections List (Exact card layout from Screenshot 2) */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#202a38] p-0 max-h-[48vh]">
          {betslip.length === 0 ? (
            <div className="py-12 px-4 text-center text-neutral-400 text-xs">
              <div className="w-12 h-12 mx-auto mb-2 rounded-full bg-neutral-800 flex items-center justify-center text-xl">
                🎫
              </div>
              <p className="font-semibold text-white mb-1">Your betslip is empty</p>
              <p className="text-[11px] text-neutral-400">
                Tap on any odds to add matches to your slip.
              </p>
            </div>
          ) : (
            betslip.map((item, idx) => (
              <div
                key={`${item.matchId}-${item.marketName}-${item.selectionName}-${idx}`}
                className="px-4 py-3 flex items-start space-x-3 hover:bg-[#1f2a38] transition-colors"
              >
                {/* ✕ Remove Icon on the Left */}
                <button
                  onClick={() => removeSelection(item.matchId, item.marketName, item.selectionName)}
                  className="text-neutral-500 hover:text-red-400 mt-1 shrink-0 p-0.5"
                  title="Remove selection"
                >
                  <X className="w-4 h-4 stroke-[2.5]" />
                </button>

                {/* Match and Market Details */}
                <div className="flex-1 min-w-0">
                  {/* Selection row: ⚽ Draw (or Home/Away) with odd on the right */}
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center space-x-1.5 font-bold text-xs text-white">
                      <span>⚽</span>
                      <span>{item.selectionName}</span>
                    </div>
                    <span className="font-black text-sm text-[#00df59]">
                      {item.odd.toFixed(2)}
                    </span>
                  </div>

                  {/* Match Title & Live Badge */}
                  <div className="flex items-center space-x-1.5 text-[11px] text-neutral-300 truncate">
                    {item.isLive && (
                      <span className="bg-[#00a826] text-white text-[9px] font-black px-1 rounded shrink-0">
                        Live
                      </span>
                    )}
                    <span className="truncate">{item.matchTitle}</span>
                  </div>

                  {/* Market Title: 1X2 */}
                  <div className="text-[10px] text-neutral-400 mt-0.5 font-mono">
                    {item.marketName}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stake Bar */}
        {betslip.length > 0 && (
          <div className="px-4 py-2 bg-[#161f2a] border-t border-[#232e3d] flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-bold">Total Odds:</span>
            <span className="text-sm font-black text-[#00df59]">{totalOdds}</span>
          </div>
        )}

        {/* Sticky Bottom Action Bar (Screenshot 2: [ Book Bet ] | [ Place Bet / About to pay 1.00 ]) */}
        <div className="p-3 bg-[#1a232f] border-t border-[#242f3e] grid grid-cols-2 gap-2">
          {/* Book Bet: Green button */}
          <button
            onClick={handleBookBet}
            className="py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white text-xs font-black rounded uppercase tracking-wider shadow-lg flex items-center justify-center transition-all"
          >
            Book Bet
          </button>

          {/* Place Bet: Dark button with subtext "About to pay 1.00" */}
          <button
            onClick={handlePlaceBet}
            disabled={betslip.length === 0}
            className={`py-2 px-3 rounded flex flex-col items-center justify-center transition-all active:scale-[0.98] ${
              betslip.length === 0
                ? 'bg-[#2b3543] text-neutral-500 cursor-not-allowed'
                : 'bg-[#2b3748] hover:bg-[#344256] text-white shadow'
            }`}
          >
            <span className="text-xs font-black uppercase tracking-wider">Place Bet</span>
            <span className="text-[10px] text-neutral-300 font-medium">
              About to pay {stake.toFixed(2)}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
