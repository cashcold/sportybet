import React, { useState } from 'react';
import { X, Trash2, Share2, Download, Check, AlertCircle } from 'lucide-react';
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
    setIsDepositModalOpen,
    showToast,
    loadBookingCode
  } = useBetting();

  const [slipType, setSlipType] = useState<'Multiple' | 'Single'>('Multiple');
  const [stake, setStake] = useState<number>(20);
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [showBookingInput, setShowBookingInput] = useState(false);

  if (!isBetslipOpen) return null;

  const quickStakes = [5, 10, 20, 50, 100];

  // Total odds calculation
  const totalOdds = betslip.length > 0
    ? parseFloat(betslip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2))
    : 0;

  // SportyBet Accumulator Multi-Bet Bonus (starts at 3% for 2 picks, up to 1000% for 50 picks)
  const bonusMultiplier = betslip.length >= 2 ? Math.min(1 + (betslip.length * 0.05), 2.5) : 1.0;
  const potentialWin = parseFloat((stake * totalOdds * bonusMultiplier).toFixed(2));
  const bonusAmount = parseFloat((potentialWin - (stake * totalOdds)).toFixed(2));

  const handlePlaceBet = () => {
    const res = placeBet(stake, slipType);
    if (res.success) {
      confetti({
        particleCount: 70,
        spread: 70,
        origin: { y: 0.6 }
      });
    } else if (res.error) {
      showToast(res.error);
    }
  };

  const handleGenerateBookingCode = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'GH';
    for (let i = 0; i < 4; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    navigator.clipboard?.writeText(code);
    showToast(`Booking Code ${code} copied to clipboard!`);
  };

  const handleApplyBookingCode = () => {
    if (!bookingCodeInput.trim()) return;
    const ok = loadBookingCode(bookingCodeInput.trim());
    if (ok) {
      setBookingCodeInput('');
      setShowBookingInput(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-[#161e27] text-white rounded-t-2xl sm:rounded-2xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="bg-[#1e2733] px-4 py-3 flex items-center justify-between border-b border-neutral-700/60">
          <div className="flex items-center space-x-2">
            <span className="font-extrabold text-sm text-white">
              Betslip ({betslip.length})
            </span>
            {betslip.length > 0 && (
              <button
                onClick={clearBetslip}
                className="text-[11px] text-neutral-400 hover:text-red-400 flex items-center space-x-1 ml-2 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowBookingInput(!showBookingInput)}
              className="text-[11px] text-[#00df59] hover:underline font-bold px-2 py-1 rounded bg-[#00a826]/10 border border-[#00a826]/30"
            >
              {showBookingInput ? 'Hide Code' : 'Load Code'}
            </button>
            <button
              onClick={() => setIsBetslipOpen(false)}
              className="p-1 rounded-full text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Booking Code Bar (if toggled) */}
        {showBookingInput && (
          <div className="p-3 bg-[#131a22] border-b border-neutral-800 flex items-center space-x-2">
            <input
              type="text"
              value={bookingCodeInput}
              onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
              placeholder="Enter Booking Code (e.g. GH8X2)"
              className="flex-1 bg-[#1e2733] text-white text-xs px-3 py-2 rounded border border-neutral-700 focus:outline-none uppercase font-bold"
            />
            <button
              onClick={handleApplyBookingCode}
              className="px-3 py-2 bg-[#00a826] hover:bg-[#009221] text-white text-xs font-bold rounded"
            >
              Load
            </button>
          </div>
        )}

        {/* Slip Type Tabs: Multiple | Single */}
        <div className="flex border-b border-neutral-800 bg-[#141b24] text-xs font-bold">
          <button
            onClick={() => setSlipType('Multiple')}
            className={`flex-1 py-2.5 transition-colors border-b-2 ${
              slipType === 'Multiple'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Multiple {betslip.length > 1 && `(${betslip.length})`}
          </button>
          <button
            onClick={() => setSlipType('Single')}
            className={`flex-1 py-2.5 transition-colors border-b-2 ${
              slipType === 'Single'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Single
          </button>
        </div>

        {/* Selections List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 max-h-[42vh]">
          {betslip.length === 0 ? (
            <div className="py-12 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-300">Your Betslip is Empty</p>
              <p className="text-xs text-neutral-500 mt-1">
                Click on the odds to add selections from any match
              </p>
            </div>
          ) : (
            betslip.map((item, idx) => (
              <div
                key={`${item.matchId}-${item.marketName}-${item.selectionName}`}
                className="bg-[#1b232e] border border-neutral-800 rounded-lg p-3 relative shadow-sm"
              >
                {/* Remove button */}
                <button
                  onClick={() => removeSelection(item.matchId, item.marketName, item.selectionName)}
                  className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="pr-6">
                  <div className="text-xs font-bold text-neutral-100 truncate">
                    {item.matchTitle}
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-[11px] text-neutral-400 font-medium">
                      {item.marketName}
                    </span>
                    <span className="text-xs font-black text-white bg-[#263140] px-1.5 py-0.2 rounded">
                      {item.selectionName}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-neutral-800/80">
                  <span className="text-[11px] text-neutral-400">
                    {item.isLive ? '🔴 Live Event' : 'Scheduled'}
                  </span>
                  <span className="text-sm font-black text-[#00df59]">
                    {item.odd.toFixed(2)}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Stake & Calculation Footer */}
        {betslip.length > 0 && (
          <div className="p-3.5 bg-[#141b24] border-t border-neutral-800 space-y-3">
            {/* Quick Stake Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-neutral-400 shrink-0">Stake:</span>
              {quickStakes.map(amt => (
                <button
                  key={amt}
                  onClick={() => setStake(amt)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                    stake === amt
                      ? 'bg-[#00a826] text-white shadow'
                      : 'bg-[#222b37] text-neutral-300 hover:bg-[#2b3746]'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Custom Stake Input */}
            <div className="flex items-center bg-[#1e2733] rounded-md border border-neutral-700 px-3 py-1.5">
              <span className="text-xs font-bold text-neutral-400 mr-2">GHS</span>
              <input
                type="number"
                min="0.5"
                step="0.5"
                value={stake || ''}
                onChange={(e) => setStake(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full bg-transparent text-sm font-bold text-white focus:outline-none"
              />
            </div>

            {/* Odds & Returns Summary */}
            <div className="space-y-1 text-xs">
              <div className="flex justify-between text-neutral-400">
                <span>Total Odds:</span>
                <span className="font-bold text-white">{totalOdds.toFixed(2)}</span>
              </div>

              {bonusAmount > 0 && (
                <div className="flex justify-between text-neutral-400">
                  <span className="text-amber-400 font-semibold flex items-center space-x-1">
                    <span>Multi-Bet Bonus ({((bonusMultiplier - 1) * 100).toFixed(0)}%):</span>
                  </span>
                  <span className="font-bold text-amber-400">+GHS {bonusAmount.toFixed(2)}</span>
                </div>
              )}

              <div className="flex justify-between items-baseline pt-1 border-t border-neutral-800">
                <span className="font-bold text-neutral-200">Potential Return:</span>
                <span className="text-base font-black text-[#00df59]">
                  GHS {potentialWin.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Booking Code Button */}
            <button
              onClick={handleGenerateBookingCode}
              className="w-full text-center text-xs text-neutral-400 hover:text-white flex items-center justify-center space-x-1 py-0.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Generate / Share Booking Code</span>
            </button>

            {/* Place Bet Button */}
            <button
              onClick={handlePlaceBet}
              className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-black text-sm rounded-lg shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <span>PLACE BET (GHS {stake.toFixed(2)})</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
