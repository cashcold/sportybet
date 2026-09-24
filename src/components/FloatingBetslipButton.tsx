import React from 'react';
import { Ticket } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export const FloatingBetslipButton: React.FC = () => {
  const { betslip, setIsBetslipOpen, isBetslipOpen } = useBetting();

  if (isBetslipOpen) return null;

  // Calculate total odds
  const totalOdds = betslip.length > 0
    ? betslip.reduce((acc, curr) => acc * curr.odd, 1)
    : 0;

  return (
    <>
      {/* ========================================================= */}
      {/* FLOATING GREEN TICKET CIRCLE                              */}
      {/* Pinned cleanly to the right side at top: 188px            */}
      {/* ========================================================= */}
      <div className="fixed top-[188px] left-0 right-0 max-w-md mx-auto z-40 pointer-events-none px-2 flex justify-end">
        <button
          onClick={() => setIsBetslipOpen(true)}
          className="pointer-events-auto relative w-12 h-12 rounded-full bg-[#00a826] hover:bg-[#009221] active:scale-90 transition-all shadow-2xl flex items-center justify-center text-white border-2 border-[#121922] cursor-pointer group"
          aria-label="Open Betslip"
          title="Open Betslip"
        >
          {betslip.length > 0 ? (
            <span className="text-[10px] font-black tracking-tighter leading-none px-0.5 truncate max-w-[42px]">
              {totalOdds >= 1000 ? `${totalOdds.toFixed(0)}...` : totalOdds >= 100 ? `${totalOdds.toFixed(0)}` : totalOdds.toFixed(2)}
            </span>
          ) : (
            <Ticket className="w-5 h-5 stroke-[2.4] group-hover:rotate-6 transition-transform" />
          )}

          {/* White circle badge with count number (0, 1, 3...) */}
          <span className="absolute -top-1 -right-1 bg-white text-black font-black text-[11px] min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow border border-neutral-300">
            {betslip.length}
          </span>
        </button>
      </div>

      {/* Note: The bottom sticky "Betslip (3) Multi-Bet Total Odds: 3.39 View Betslip" bar has been removed as requested */}
    </>
  );
};
