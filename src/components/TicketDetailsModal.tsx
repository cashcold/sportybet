import React from 'react';
import {
  ArrowLeft,
  Share2,
  Check,
  Trophy,
  Sparkles,
  ExternalLink,
  RotateCcw,
  Zap,
  CheckCircle2
} from 'lucide-react';
import { PlacedBet } from '../types';
import { useBetting } from '../context/BettingContext';
import { resolveWinningPredictionDetails } from '../utils/predictionHelper';

interface TicketDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  bet: PlacedBet | null;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({
  isOpen,
  onClose,
  bet
}) => {
  const { showToast, addSelection, setIsBetslipOpen, markSingleBetGreen, isAllGreenTriggered } = useBetting();

  if (!isOpen || !bet) return null;

  const isGreen = bet.isAllGreen || isAllGreenTriggered || bet.status === 'won';

  const handleRemixBet = () => {
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
    onClose();
  };

  const handleAdminMarkGreen = () => {
    markSingleBetGreen(bet.id, false);
    showToast('Admin: All predictions on this ticket marked GREEN!');
  };

  const handleAdminSettleWon = () => {
    markSingleBetGreen(bet.id, true);
    showToast(`Admin: Ticket settled as WON! Payout credited.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col justify-start overflow-y-auto animate-in fade-in select-none">
      <div className="w-full max-w-lg mx-auto bg-[#141b24] min-h-screen text-white flex flex-col pb-16">
        {/* 1. Header (Sticky Top Bar) */}
        <div className="sticky top-0 z-30 bg-[#de1a22] text-white px-3.5 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              aria-label="Back"
            >
              <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
            </button>
            <h1 className="text-base font-bold tracking-tight">Ticket Details</h1>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => showToast('Ticket copied to clipboard')}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Share Ticket"
            >
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 2. Admin Quick Action Bar */}
        <div className="bg-[#1b2532] px-3.5 py-2 border-b border-[#253344] flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-[#00df59] font-bold">
            <Zap className="w-3.5 h-3.5 fill-[#00df59]" />
            <span>Admin Trigger:</span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={handleAdminMarkGreen}
              className="px-2.5 py-1 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-[11px] rounded shadow transition-all cursor-pointer flex items-center space-x-1"
            >
              <Check className="w-3 h-3 stroke-[3]" />
              <span>Mark All Green</span>
            </button>
            <button
              onClick={handleAdminSettleWon}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-extrabold text-[11px] rounded shadow transition-all cursor-pointer flex items-center space-x-1"
            >
              <Trophy className="w-3 h-3" />
              <span>Settle Won</span>
            </button>
          </div>
        </div>

        {/* 3. Top Banner: "Bounce back fast — remix and retry your bet!" (Exact Match to Screenshot) */}
        <div className="px-3.5 pt-3.5 pb-2">
          <div className="bg-[#182330] border border-[#27374b] rounded-lg p-3 flex items-center justify-between shadow-md">
            {/* Robot Avatar and Text */}
            <div className="flex items-center space-x-3 min-w-0 pr-2">
              {/* Blue robot icon */}
              <div className="w-10 h-10 rounded-full bg-[#1b3a57] border border-[#235682] flex items-center justify-center shrink-0 shadow-inner">
                <span className="text-xl">🤖</span>
              </div>
              <div className="text-[13px] font-bold text-white leading-snug">
                Bounce back fast —<br />
                <span className="text-neutral-200 font-medium text-xs">
                  remix and retry your bet!
                </span>
              </div>
            </div>

            {/* Green Remix Bet Button */}
            <button
              onClick={handleRemixBet}
              className="bg-[#00c853] hover:bg-[#00b34a] active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded-md shadow flex items-center space-x-1.5 shrink-0 transition-transform cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 fill-white stroke-none" />
              <span>Remix Bet</span>
            </button>
          </div>
        </div>

        {/* 4. Ticket Overview Bar */}
        <div className="px-3.5 py-2">
          <div className="bg-[#17202c] rounded-md border border-[#222d3d] p-3 text-xs flex items-center justify-between">
            <div>
              <div className="text-neutral-400">
                Ticket ID: <span className="text-white font-mono font-bold">{bet.ticketId}</span>
              </div>
              <div className="text-neutral-400 mt-0.5">
                Type: <span className="text-white font-bold">{bet.type}</span> ({bet.selections.length} Legs)
              </div>
            </div>
            <div className="text-right">
              <div className="text-neutral-400">
                Stake: <strong className="text-white">GHS {bet.stake.toFixed(2)}</strong>
              </div>
              <div className="text-neutral-400 mt-0.5">
                Pot. Win: <strong className="text-[#00df59] font-black text-sm">GHS {bet.potentialWin.toFixed(2)}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Match Legs List (Exact layout of Screenshot_20260927_102225_Chrome.jpg) */}
        <div className="px-3.5 divide-y divide-[#1e2a39] mt-1">
          {bet.selections.map((sel, idx) => {
            const details = resolveWinningPredictionDetails(sel);
            const isMatchWon = isGreen || sel.isWon;

            return (
              <div key={idx} className="py-4 flex items-start space-x-3.5">
                {/* Left Side: Green Circle with White Checkmark (Exact Match to Screenshot) */}
                <div className="pt-1 shrink-0">
                  {isMatchWon ? (
                    <div className="w-5 h-5 rounded-full bg-[#00df59] flex items-center justify-center shadow-md">
                      <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-neutral-500 flex items-center justify-center">
                      <div className="w-2 h-2 rounded-full bg-neutral-400" />
                    </div>
                  )}
                </div>

                {/* Right Side: Main Leg Content */}
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Row 1: Game ID | Date Time */}
                  <div className="text-neutral-400 text-xs">
                    Game ID: {details.gameId} | {details.gameDate}
                  </div>

                  {/* Row 2: Home v Away in Bold White */}
                  <div className="font-bold text-white text-[15px] tracking-tight leading-snug">
                    {details.formattedMatchTitle}
                  </div>

                  {/* Row 3: FT Score: 2:0 | 📗 Match Tracker */}
                  <div className="flex items-center space-x-2 text-xs">
                    <span className="text-neutral-300">
                      FT Score:{' '}
                      <strong className="text-white font-extrabold text-[13px] ml-1">
                        {isMatchWon ? details.ftScore : (sel.liveScore || '0:0')}
                      </strong>
                    </span>
                    <span className="text-neutral-600">|</span>
                    <button
                      onClick={() => showToast(`Match Tracker loaded for ${sel.matchTitle}`)}
                      className="text-[#00df59] hover:underline flex items-center space-x-1 font-bold text-xs cursor-pointer"
                    >
                      <span className="text-sm">📗</span>
                      <span>Match Tracker</span>
                    </button>
                  </div>

                  {/* Row 4: Inner Dark Card (Pick, Market, Outcome, Faint Trophy Watermark) */}
                  <div className="bg-[#192330] border border-[#243346] rounded-md p-3 relative overflow-hidden text-xs space-y-1.5 shadow-sm">
                    {/* Faint Trophy Watermark in the background right corner */}
                    <div className="absolute right-3 bottom-2 text-white/[0.08] pointer-events-none select-none">
                      <Trophy className="w-12 h-12 stroke-[1.2]" />
                    </div>

                    {/* Pick Row: Pick: Home @1.69 ✔ */}
                    <div className="flex items-center space-x-1.5 text-neutral-300">
                      <span className="text-neutral-400">Pick:</span>
                      <strong className="text-white font-bold tracking-tight">
                        {details.pickText}
                      </strong>
                      {isMatchWon && (
                        <Check className="w-3.5 h-3.5 text-[#00df59] stroke-[3] ml-0.5" />
                      )}
                    </div>

                    {/* Market Row: Market: 1X2 */}
                    <div className="flex items-center space-x-1.5 text-neutral-300">
                      <span className="text-neutral-400">Market:</span>
                      <span className="text-neutral-200 font-semibold">{sel.marketName || '1X2'}</span>
                    </div>

                    {/* Outcome Row: Outcome: Home */}
                    <div className="flex items-center space-x-1.5 text-neutral-300">
                      <span className="text-neutral-400">Outcome:</span>
                      <strong className="text-white font-bold">
                        {isMatchWon ? details.outcome : 'Pending'}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 6. Footer Summary */}
        <div className="px-3.5 pt-6 pb-4 border-t border-[#222f40] mt-4 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-400">
            <span>Booking Code</span>
            <span className="text-white font-mono font-bold">{bet.bookingCode || 'BD9812'}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Total Odds</span>
            <span className="text-white font-bold">{bet.totalOdds.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-neutral-400">
            <span>Status</span>
            <span className={`font-black uppercase ${isGreen ? 'text-[#00df59]' : 'text-neutral-300'}`}>
              {isGreen ? 'Won (All Predictions Correct)' : bet.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
