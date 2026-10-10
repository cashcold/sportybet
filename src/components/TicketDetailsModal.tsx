import React from 'react';
import {
  ArrowLeft,
  Share2,
  Check,
  Trophy,
  Sparkles,
  Copy
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

  const formattedDate = bet.placedAt
    ? new Date(bet.placedAt).toLocaleString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(',', '')
    : `${bet.date || '26/09'} 17:20`;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex flex-col justify-start overflow-y-auto animate-in fade-in select-none">
      <div className="w-full max-w-lg mx-auto bg-[#141b24] min-h-screen text-white flex flex-col pb-20">
        {/* 1. Header (Sticky Top Bar - Exact Crimson Red) */}
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
              onClick={() => {
                navigator.clipboard?.writeText(bet.ticketId);
                showToast('Ticket copied to clipboard');
              }}
              className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
              title="Share Ticket"
            >
              <Share2 className="w-4 h-4 stroke-[2.2]" />
            </button>
          </div>
        </div>

        {/* 2. Top Overview Section (Exact SportyBet Clone - Circled in Yellow from Screenshot) */}
        <div className="p-3.5 space-y-3">
          {/* Unified Bet Won / Status Card */}
          <div className="bg-[#17222e] border border-[#233245] rounded-lg overflow-hidden shadow-md">
            {/* Top Ribbon: Bet Won badge + Return + Remix Bet Button */}
            <div className={`p-3.5 flex items-center justify-between ${
              isGreen || bet.status === 'won'
                ? 'bg-[#102717] border-b border-[#1b4329]'
                : 'bg-[#182330] border-b border-[#243346]'
            }`}>
              <div className="flex items-center space-x-3 min-w-0 pr-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  isGreen || bet.status === 'won'
                    ? 'bg-[#00df59]/20 border border-[#00df59]/40 text-[#00df59]'
                    : 'bg-[#1b3a57] border border-[#235682] text-white'
                }`}>
                  {isGreen || bet.status === 'won' ? (
                    <Trophy className="w-5 h-5 fill-current" />
                  ) : (
                    <span className="text-xl">🤖</span>
                  )}
                </div>
                <div className="text-[13px] font-bold text-white leading-snug">
                  {isGreen || bet.status === 'won' ? (
                    <>
                      <span className="text-[#00df59] font-black text-sm block">Bet Won</span>
                      <span className="text-neutral-300 font-medium text-xs">
                        Return: <strong className="text-white font-extrabold text-sm ml-0.5">GHS {bet.potentialWin.toFixed(2)}</strong>
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="text-white font-black text-sm block">Bounce back fast</span>
                      <span className="text-neutral-300 font-medium text-xs">
                        Remix and retry your bet!
                      </span>
                    </>
                  )}
                </div>
              </div>

              <button
                onClick={handleRemixBet}
                className="bg-[#00c853] hover:bg-[#00b34a] active:scale-95 text-white font-black text-xs px-3.5 py-2 rounded shadow flex items-center space-x-1.5 shrink-0 transition-transform cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 fill-white stroke-none" />
                <span>Remix Bet</span>
              </button>
            </div>

            {/* Ticket Metadata & Verify Code (Directly below the yellow circle from Screenshot) */}
            <div className="p-3.5 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <div className="text-neutral-400 flex items-center space-x-1">
                  <span>Ticket ID:</span>
                  <span className="text-white font-mono font-bold">{bet.ticketId}</span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(bet.ticketId);
                      showToast(`Copied Ticket ID: ${bet.ticketId}`);
                    }}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title="Copy Ticket ID"
                  >
                    <Copy className="w-3 h-3 inline" />
                  </button>
                </div>
                <div className="text-neutral-400">
                  Placed: <span className="text-neutral-200 font-medium">{formattedDate}</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="text-neutral-400 flex items-center space-x-1">
                  <span>Verify Code:</span>
                  <span className="text-[#00df59] font-mono font-bold tracking-wide">
                    {bet.bookingCode || 'BC8821'}
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard?.writeText(bet.bookingCode || 'BC8821');
                      showToast(`Copied Verify Code: ${bet.bookingCode || 'BC8821'}`);
                    }}
                    className="text-neutral-400 hover:text-white transition-colors cursor-pointer p-0.5"
                    title="Copy Verify Code"
                  >
                    <Copy className="w-3 h-3 inline" />
                  </button>
                </div>
                <div className="text-neutral-400">
                  Type: <span className="text-white font-bold">{bet.type}</span> ({bet.selections.length} Legs)
                </div>
              </div>

              {/* Stake & Return summary strip */}
              <div className="bg-[#121922] rounded border border-[#1f2b3a] p-2.5 flex justify-between items-center text-xs mt-1">
                <div>
                  <span className="text-neutral-400">Stake: </span>
                  <strong className="text-white font-bold">GHS {bet.stake.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-neutral-400">Total Odds: </span>
                  <strong className="text-white font-bold">{bet.totalOdds.toFixed(2)}</strong>
                </div>
                <div>
                  <span className="text-neutral-400">Total Return: </span>
                  <strong className="text-[#00df59] font-black text-sm">
                    GHS {bet.potentialWin.toFixed(2)}
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Match Legs List (Exact SportyBet layout with Green Circles & Checkmarks) */}
        <div className="px-3.5 divide-y divide-[#1e2a39]">
          {bet.selections.map((sel, idx) => {
            const details = resolveWinningPredictionDetails(sel);
            const isMatchWon = isGreen || sel.isWon;

            return (
              <div key={idx} className="py-4 flex items-start space-x-3.5">
                {/* Left Side: Solid Green Circle with White/Black Checkmark */}
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

        {/* 4. Footer Summary */}
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

        {/* 5. Sticky Bottom Action Bar */}
        <div className="sticky bottom-0 z-30 bg-[#121922] border-t border-[#1f2b3a] px-3.5 py-3 flex items-center justify-between shadow-2xl">
          <div>
            <div className="text-[11px] text-neutral-400">Total Return (GHS)</div>
            <div className="text-[#00df59] font-black text-lg leading-tight">
              GHS {bet.potentialWin.toFixed(2)}
            </div>
          </div>
          <button
            onClick={handleRemixBet}
            className="bg-[#00c853] hover:bg-[#00b34a] active:scale-95 text-white font-black text-xs px-5 py-2.5 rounded shadow-lg flex items-center space-x-1.5 transition-transform cursor-pointer"
          >
            <Sparkles className="w-4 h-4 fill-white stroke-none" />
            <span>Remix Bet</span>
          </button>
        </div>
      </div>
    </div>
  );
};
