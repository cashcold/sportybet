import React from 'react';
import { Ticket, ChevronUp, ArrowRight } from 'lucide-react';
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
      {/* 1. FLOATING GREEN TICKET CIRCLE (Exact position from user screenshot) */}
      {/* Pinned to the right of the mobile container at top: 190px */}
      {/* ========================================================= */}
      <div className="fixed top-[188px] left-0 right-0 max-w-md mx-auto z-40 pointer-events-none px-2 flex justify-end">
        <button
          onClick={() => setIsBetslipOpen(true)}
          className="pointer-events-auto relative w-12 h-12 rounded-full bg-[#00a826] hover:bg-[#009221] active:scale-90 transition-all shadow-2xl flex items-center justify-center text-white border-2 border-[#121922] cursor-pointer group"
          aria-label="View Betslip"
          title="Open Betslip"
        >
          {betslip.length > 0 ? (
            <span className="text-[10px] font-black tracking-tighter leading-none px-0.5 truncate max-w-[42px]">
              {totalOdds >= 1000 ? `${totalOdds.toFixed(0)}...` : totalOdds >= 100 ? `${totalOdds.toFixed(0)}` : totalOdds.toFixed(2)}
            </span>
          ) : (
            <Ticket className="w-5 h-5 stroke-[2.4] group-hover:rotate-6 transition-transform" />
          )}

          {/* Exact white circle badge with black count number (0, 1, 7...) */}
          <span className="absolute -top-1 -right-1 bg-white text-black font-black text-[11px] min-w-[20px] h-5 rounded-full flex items-center justify-center px-1 shadow border border-neutral-300">
            {betslip.length}
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 2. STICKY QUICK BETSLIP BOTTOM BAR (Visible when items added) */}
      {/* Docked directly above bottom navigation (bottom: 54px) */}
      {/* ========================================================= */}
      {betslip.length > 0 && (
        <div className="fixed bottom-[54px] left-0 right-0 max-w-md mx-auto z-40 px-3 pb-1 animate-in slide-in-from-bottom-3 duration-200">
          <div
            onClick={() => setIsBetslipOpen(true)}
            className="bg-[#00a826] hover:bg-[#009221] active:scale-[0.99] text-white rounded-lg px-3 py-2.5 shadow-2xl flex items-center justify-between cursor-pointer border border-[#00df59]/40 transition-all"
          >
            <div className="flex items-center space-x-2.5">
              {/* White badge */}
              <div className="w-7 h-7 rounded-full bg-white text-neutral-950 font-black text-xs flex items-center justify-center shadow">
                {betslip.length}
              </div>

              <div className="flex flex-col text-left">
                <div className="flex items-center space-x-1.5">
                  <span className="text-xs font-black tracking-wide leading-tight">
                    Betslip ({betslip.length})
                  </span>
                  <span className="text-[9px] bg-black/25 px-1.5 py-0.5 rounded font-extrabold uppercase text-emerald-100">
                    {betslip.length === 1 ? 'Single' : 'Multi-Bet'}
                  </span>
                </div>
                <div className="text-[11px] text-emerald-100 font-medium">
                  Total Odds: <strong className="text-white text-xs font-black">{totalOdds.toFixed(2)}</strong>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-1.5 bg-[#121922] text-[#00df59] px-3 py-1.5 rounded-md font-black text-xs shadow-md hover:bg-black transition-colors">
              <span>View Betslip</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
