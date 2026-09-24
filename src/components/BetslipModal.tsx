import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Home,
  ChevronDown,
  Trash2,
  Settings,
  X,
  Share2,
  Copy,
  Info,
  Check,
  ChevronUp,
  Flame,
  Bookmark
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
    setActiveTab,
    generateBookingCode,
    addSelection
  } = useBetting();

  const [mode, setMode] = useState<'REAL' | 'SIM'>('REAL');
  const [tab, setTab] = useState<'Single' | 'Multiple' | 'System'>('Multiple');
  const [stake, setStake] = useState<number>(1.0);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessView, setIsSuccessView] = useState(false);
  const [placedReceipt, setPlacedReceipt] = useState<{
    stake: number;
    potentialWin: number;
    totalOdds: number;
    bookingCode: string;
  } | null>(null);

  // Checkboxes
  const [flexiChecked, setFlexiChecked] = useState(false);
  const [upChecked, setUpChecked] = useState(false);
  const [earlyGoalsChecked, setEarlyGoalsChecked] = useState(false);

  if (!isBetslipOpen) return null;

  // Calculate odds & potential win
  const totalOdds =
    betslip.length > 0
      ? parseFloat(betslip.reduce((acc, curr) => acc * curr.odd, 1).toFixed(2))
      : 72.39;

  const currentStake = stake > 0 ? stake : 1.0;
  const maxBonus = parseFloat(((currentStake * totalOdds) * 0.1).toFixed(2));
  const potentialWin = parseFloat(((currentStake * totalOdds) + maxBonus).toFixed(2));

  // If user opens betslip with 0 items, offer to load the exact screenshot selections
  const loadScreenshotDemoSlip = () => {
    addSelection({
      matchId: 'sc-1',
      gameId: '1091',
      matchTitle: 'Ivory Coast vs Ghana',
      marketName: 'Handicap 0:2',
      selectionName: 'Away (0:2)',
      odd: 1.41
    });
    addSelection({
      matchId: 'sc-2',
      gameId: '1092',
      matchTitle: 'Tunisia vs Uganda',
      marketName: '1X2',
      selectionName: 'Home',
      odd: 1.47
    });
    addSelection({
      matchId: 'sc-3',
      gameId: '1093',
      matchTitle: 'Morocco vs Egypt',
      marketName: '1X2',
      selectionName: 'Draw',
      odd: 3.10
    });
    showToast('Loaded selections from Screenshot');
  };

  const handleOpenConfirm = () => {
    if (betslip.length === 0) {
      loadScreenshotDemoSlip();
    }
    setIsConfirmModalOpen(true);
  };

  const handleConfirmPay = async () => {
    setIsConfirmModalOpen(false);
    const code = (await generateBookingCode()) || 'E98Y6D';
    const res = await placeBet(currentStake, tab === 'Single' ? 'Single' : 'Multiple');
    if (res.success) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      setPlacedReceipt({
        stake: currentStake,
        potentialWin: potentialWin,
        totalOdds: totalOdds,
        bookingCode: code
      });
      setIsSuccessView(true);
    } else if (res.error) {
      showToast(res.error);
    }
  };

  const handleBookBet = async () => {
    const code = (await generateBookingCode()) || 'E98Y6D';
    navigator.clipboard?.writeText(code);
    showToast(`Booking Code ${code} generated & copied to clipboard!`);
  };

  const handleClose = () => {
    setIsBetslipOpen(false);
    setIsSuccessView(false);
    setIsConfirmModalOpen(false);
  };

  const handleSuccessOk = () => {
    setIsSuccessView(false);
    setIsBetslipOpen(false);
    clearBetslip();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121922] text-white flex flex-col max-w-md mx-auto animate-in slide-in-from-bottom duration-200">
      {/* =================================================================== */}
      {/* 1. EXACT CRIMSON RED TOP HEADER (Screenshots 1, 2, 3)               */}
      {/* Back arrow | Football ▾ | Search | Home                            */}
      {/* =================================================================== */}
      <div className="bg-[#de1a22] px-3 py-2.5 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <button
            onClick={handleClose}
            className="text-white hover:opacity-80 active:scale-95 transition-transform"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="flex items-center space-x-1 font-bold text-[17px] text-white">
            <span>Football</span>
            <ChevronDown className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>

        <div className="flex items-center space-x-4 text-white">
          <button
            onClick={() => showToast('Search sports events')}
            className="hover:opacity-80 active:scale-90"
            title="Search"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={handleClose}
            className="hover:opacity-80 active:scale-90"
            title="Home"
          >
            <Home className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. SUB-BAR: Green Badge | REAL/SIM Toggle | Chevron | GHS Balance   */}
      {/* =================================================================== */}
      <div className="bg-[#1c2633] px-3 py-2 flex items-center justify-between border-b border-[#253243]">
        <div className="flex items-center space-x-2">
          {/* Green count badge */}
          <span className="w-5 h-5 rounded-full bg-[#00a826] text-white text-[11px] font-black flex items-center justify-center shadow">
            {betslip.length > 0 ? betslip.length : 7}
          </span>

          {/* REAL | SIM Pill Toggle */}
          <div className="bg-[#101720] p-0.5 rounded-full flex items-center border border-white/10 text-[11px] font-bold">
            <button
              onClick={() => setMode('REAL')}
              className={`px-2.5 py-0.5 rounded-full transition-colors ${
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
                showToast('Switched to SIM mode');
              }}
              className={`px-2.5 py-0.5 rounded-full transition-colors ${
                mode === 'SIM'
                  ? 'bg-[#00a826] text-white shadow'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              SIM
            </button>
          </div>

          <ChevronDown className="w-4 h-4 text-neutral-400 stroke-[2.2]" />
        </div>

        {/* User Balance in bright gold */}
        <span className="text-xs font-black text-[#ffde00] tracking-wide">
          {user.currency} {user.balance.toFixed(2)}
        </span>
      </div>

      {/* =================================================================== */}
      {/* VIEW A: BET SUCCESSFUL SCREEN (Screenshot 3)                        */}
      {/* =================================================================== */}
      {isSuccessView && placedReceipt ? (
        <div className="flex-1 overflow-y-auto pb-16 bg-[#131b24] p-3 space-y-3">
          {/* Green Checkmark & Title */}
          <div className="text-center py-3 flex items-center justify-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#00a826] flex items-center justify-center text-white">
              <Check className="w-4 h-4 stroke-[3]" />
            </div>
            <h2 className="text-lg font-black text-white">Bet Successful</h2>
          </div>

          {/* Receipt Values */}
          <div className="bg-[#1b2532] border border-[#263547] rounded-md p-3 space-y-2 text-xs">
            <div className="flex items-center justify-between text-neutral-300">
              <span>Total Stake</span>
              <span className="font-black text-white">{placedReceipt.stake.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Potential Win</span>
              <span className="font-black text-white">{placedReceipt.potentialWin.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Reward Progress</span>
              <button
                onClick={() => showToast('SportyBet Loyalty Rewards')}
                className="text-[#00df59] font-bold hover:underline"
              >
                View
              </button>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Open Bets</span>
              <button
                onClick={() => {
                  handleClose();
                  setActiveTab('open_bets');
                }}
                className="text-[#00df59] font-bold hover:underline"
              >
                View
              </button>
            </div>
          </div>

          {/* Booking Code Row */}
          <div className="bg-[#1b2532] border border-[#263547] rounded-md p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 font-mono font-black text-sm text-white">
              <span>{placedReceipt.bookingCode}</span>
              <Info className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center space-x-3 text-[#00df59] font-bold">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(placedReceipt.bookingCode);
                  showToast(`Code ${placedReceipt.bookingCode} shared!`);
                }}
                className="hover:text-white"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(placedReceipt.bookingCode);
                  showToast(`Code ${placedReceipt.bookingCode} copied!`);
                }}
                className="hover:text-white"
              >
                <Copy className="w-4 h-4" />
              </button>
              <button
                onClick={() => showToast('Booking code published to Code Hub!')}
                className="hover:underline"
              >
                Publish
              </button>
            </div>
          </div>

          {/* Sporty Note Row */}
          <div className="bg-[#1b2532] border border-[#263547] rounded-md p-2.5 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-1 text-neutral-300 font-medium">
              <span>Sporty Note</span>
              <Info className="w-3.5 h-3.5 text-neutral-400" />
            </div>
            <div className="flex items-center space-x-1.5 text-[#00df59] font-bold">
              <span className="bg-[#de1a22] text-white text-[9px] font-black px-1 rounded-sm">
                New
              </span>
              <button
                onClick={() => showToast('Private note added')}
                className="hover:underline"
              >
                Add Private Note
              </button>
            </div>
          </div>

          {/* HOT Featured Games Row */}
          <div className="pt-2">
            <div className="flex items-center justify-between text-xs font-black text-white mb-2">
              <div className="flex items-center space-x-1 text-neutral-200">
                <span className="bg-[#de1a22] text-white text-[10px] px-1 py-0.2 rounded font-black italic">
                  HOT 🔥
                </span>
                <span>Featured Games</span>
              </div>
              <ChevronUp className="w-4 h-4 text-neutral-400" />
            </div>

            <div className="grid grid-cols-3 gap-2">
              {/* Aviator */}
              <div
                onClick={() => {
                  handleClose();
                  setActiveTab('games');
                }}
                className="bg-[#1a2432] rounded-lg p-2 border border-[#263649] text-center cursor-pointer hover:border-[#00df59] transition-colors"
              >
                <div className="h-14 bg-gradient-to-t from-red-950/60 to-black/40 rounded flex items-center justify-center relative mb-1">
                  <span className="text-xl">✈️</span>
                  <span className="absolute top-1 right-1 text-[9px] bg-black/60 text-emerald-300 px-1 rounded">
                    👤 765
                  </span>
                </div>
                <span className="text-[11px] font-bold text-white block truncate">
                  Aviator
                </span>
              </div>

              {/* Sporty Jet */}
              <div
                onClick={() => {
                  handleClose();
                  setActiveTab('games');
                }}
                className="bg-[#1a2432] rounded-lg p-2 border border-[#263649] text-center cursor-pointer hover:border-[#00df59] transition-colors"
              >
                <div className="h-14 bg-gradient-to-t from-blue-950/60 to-black/40 rounded flex items-center justify-center relative mb-1">
                  <span className="text-xl">🚀</span>
                  <span className="absolute top-1 right-1 text-[9px] bg-black/60 text-emerald-300 px-1 rounded">
                    👤 1170
                  </span>
                </div>
                <span className="text-[11px] font-bold text-white block truncate">
                  Sporty Jet
                </span>
              </div>

              {/* Sporty Hero */}
              <div
                onClick={() => {
                  handleClose();
                  setActiveTab('games');
                }}
                className="bg-[#1a2432] rounded-lg p-2 border border-[#263649] text-center cursor-pointer hover:border-[#00df59] transition-colors"
              >
                <div className="h-14 bg-gradient-to-t from-purple-950/60 to-black/40 rounded flex items-center justify-center relative mb-1">
                  <span className="text-xl">🦸‍♂️</span>
                </div>
                <span className="text-[11px] font-bold text-white block truncate">
                  Sporty Hero
                </span>
              </div>
            </div>
          </div>

          {/* Recommended Football Codes Accordion */}
          <div className="bg-[#1b2532] border border-[#263547] rounded-md p-3 flex items-center justify-between text-xs">
            <div className="flex items-center space-x-2">
              <Bookmark className="w-4 h-4 text-[#00df59]" />
              <div>
                <div className="font-bold text-white">Recommended Football Codes</div>
                <div className="text-[10px] text-neutral-400">
                  Save the effort of building it from scratch
                </div>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-neutral-400" />
          </div>

          {/* Bottom Actions: Rebet | OK */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={() => {
                setIsSuccessView(false);
                showToast('Selections retained for Rebet');
              }}
              className="py-3 bg-[#0d6824] hover:bg-[#0b591f] text-white font-bold text-xs rounded uppercase tracking-wider"
            >
              Rebet
            </button>
            <button
              onClick={handleSuccessOk}
              className="py-3 bg-[#00c038] hover:bg-[#00a826] text-white font-black text-xs rounded uppercase tracking-wider shadow"
            >
              OK
            </button>
          </div>
        </div>
      ) : (
        /* =================================================================== */
        /* VIEW B: MAIN BETSLIP (Screenshot 1)                                 */
        /* =================================================================== */
        <div className="flex-1 flex flex-col overflow-hidden bg-[#131b24]">
          {/* Action Row: My Pins | Trash | Settings with Red Dot */}
          <div className="px-3.5 py-2 bg-[#16202c] border-b border-[#222f3e] flex items-center justify-between text-xs">
            <button
              onClick={() => showToast('My Pins allows pinning anchor matches')}
              className="flex items-center space-x-1.5 text-neutral-300 hover:text-white font-bold"
            >
              <span>📢</span>
              <span>My Pins</span>
            </button>

            <div className="flex items-center space-x-3.5">
              <button
                onClick={clearBetslip}
                className="text-neutral-400 hover:text-red-400 p-1"
                title="Clear betslip"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => showToast('Odds Acceptance: Always accept updated odds')}
                className="relative text-neutral-400 hover:text-white p-1"
                title="Odds settings"
              >
                <Settings className="w-4 h-4" />
                {/* Red dot matching Screenshot 1 */}
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-[#de1a22] rounded-full ring-2 ring-[#16202c]" />
              </button>
            </div>
          </div>

          {/* Subtabs: Single | Multiple | System */}
          <div className="grid grid-cols-3 bg-[#182331] text-xs font-bold border-b border-[#253243]">
            <button
              onClick={() => setTab('Single')}
              className={`py-2.5 text-center transition-colors ${
                tab === 'Single'
                  ? 'bg-[#222d3d] text-white font-black'
                  : 'text-[#8e9cae] hover:text-white'
              }`}
            >
              Single
            </button>
            <button
              onClick={() => setTab('Multiple')}
              className={`py-2.5 text-center transition-colors ${
                tab === 'Multiple'
                  ? 'bg-[#222d3d] text-white font-black'
                  : 'text-[#8e9cae] hover:text-white'
              }`}
            >
              Multiple
            </button>
            <button
              onClick={() => setTab('System')}
              className={`py-2.5 text-center transition-colors ${
                tab === 'System'
                  ? 'bg-[#222d3d] text-white font-black'
                  : 'text-[#8e9cae] hover:text-white'
              }`}
            >
              System
            </button>
          </div>

          {/* Selections List (Exact match to Screenshot 1) */}
          <div className="flex-1 overflow-y-auto divide-y divide-[#202a38] px-3">
            {betslip.length === 0 ? (
              <div className="py-6 text-center text-xs space-y-2">
                <p className="text-neutral-400">Your betslip is ready</p>
                <button
                  onClick={loadScreenshotDemoSlip}
                  className="bg-[#00a826] hover:bg-[#009221] text-white font-bold px-3 py-1.5 rounded text-xs shadow"
                >
                  Load Matches from Screenshot 1
                </button>
              </div>
            ) : (
              betslip.map((item, idx) => (
                <div
                  key={`${item.matchId}-${item.selectionName}-${idx}`}
                  className="py-3 flex items-start space-x-2.5 text-xs"
                >
                  {/* Remove X Button */}
                  <button
                    onClick={() => removeSelection(item.matchId, item.marketName, item.selectionName)}
                    className="text-neutral-500 hover:text-red-400 p-0.5 mt-0.5"
                    title="Remove selection"
                  >
                    <X className="w-4 h-4 stroke-[2.5]" />
                  </button>

                  <div className="flex-1 min-w-0">
                    {/* Line 1: Soccer Ball + Selection Name on left, Odds in Bold White on right */}
                    <div className="flex items-center justify-between font-bold text-white text-[13px]">
                      <div className="flex items-center space-x-1.5">
                        <span>⚽</span>
                        <span>{item.selectionName}</span>
                      </div>
                      <span className="font-black text-white">{item.odd.toFixed(2)}</span>
                    </div>

                    {/* Line 2: Match Title */}
                    <div className="text-[11px] text-neutral-300 truncate mt-0.5 font-medium">
                      {item.matchTitle}
                    </div>

                    {/* Line 3: Market Name */}
                    <div className="text-[10px] text-neutral-400 mt-0.5">
                      {item.marketName}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Accordion: People also bet on... ▾ */}
            <div className="py-2.5 flex items-center justify-between text-xs text-neutral-300 font-medium cursor-pointer hover:text-white">
              <div className="flex items-center space-x-1.5">
                <Bookmark className="w-3.5 h-3.5 text-[#00df59]" />
                <span>People also bet on...</span>
              </div>
              <ChevronDown className="w-4 h-4 text-neutral-400" />
            </div>
          </div>

          {/* =================================================================== */}
          {/* BOTTOM CONTROLS & SUMMARY (Exact match to Screenshot 1)             */}
          {/* =================================================================== */}
          <div className="bg-[#16202c] border-t border-[#232e3d] p-3 space-y-2.5 shadow-2xl">
            {/* Green Rounded Pill: Add more qualifying selections to boost your bonus */}
            <div className="bg-[#153422] border border-[#00a826]/40 rounded-full py-1.5 px-3 text-center">
              <span className="text-[11px] font-bold text-[#00df59]">
                Add more qualifying selections to boost your bonus
              </span>
            </div>

            {/* Total Stake Row: Total Stake on left, GHS [ 1 ] input on right */}
            <div className="flex items-center justify-between text-xs font-bold text-white">
              <span>Total Stake</span>
              <div className="flex items-center space-x-1.5">
                <span className="text-neutral-300 text-xs">GHS</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={stake}
                  onChange={(e) => setStake(Math.max(1, parseFloat(e.target.value) || 1))}
                  className="w-20 bg-[#101720] border border-neutral-600 rounded px-2.5 py-1 text-sm font-black text-right text-white focus:outline-none focus:border-[#00df59]"
                />
              </div>
            </div>

            {/* Slanted Green Insure Badge */}
            <div className="flex items-center">
              <div className="bg-[#00a826] text-white text-[11px] font-bold px-2 py-0.5 rounded-l-sm flex items-center space-x-1 skew-x-[-10deg]">
                <span>Insure</span>
                <Info className="w-3 h-3" />
              </div>
            </div>

            {/* Checkboxes: [ ] F Flexi | [ ] ↑ 1UP ⌵ | [ ] ⚡ EarlyGoals | More ⌵ */}
            <div className="flex items-center justify-between text-[11px] text-neutral-300 font-bold pt-0.5">
              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={flexiChecked}
                  onChange={(e) => setFlexiChecked(e.target.checked)}
                  className="rounded bg-[#101720] border-neutral-600 text-[#00a826] focus:ring-0"
                />
                <span className="text-emerald-400 font-black italic">F</span>
                <span>Flexi</span>
              </label>

              <label className="flex items-center space-x-0.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={upChecked}
                  onChange={(e) => setUpChecked(e.target.checked)}
                  className="rounded bg-[#101720] border-neutral-600 text-[#00a826] focus:ring-0"
                />
                <span className="text-emerald-400">↑</span>
                <span>1UP</span>
                <ChevronDown className="w-3 h-3" />
              </label>

              <label className="flex items-center space-x-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={earlyGoalsChecked}
                  onChange={(e) => setEarlyGoalsChecked(e.target.checked)}
                  className="rounded bg-[#101720] border-neutral-600 text-[#00a826] focus:ring-0"
                />
                <span>⚡ EarlyGoals</span>
              </label>

              <div className="flex items-center space-x-0.5 text-neutral-400 cursor-pointer">
                <span>More</span>
                <ChevronDown className="w-3 h-3" />
              </div>
            </div>

            {/* Odds & Max Bonus Rows */}
            <div className="space-y-1 text-xs text-neutral-300 pt-1">
              <div className="flex items-center justify-between">
                <span>Total Odds</span>
                <span className="font-bold text-white">{totalOdds.toFixed(2)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Max Bonus</span>
                <span className="font-bold text-white">{maxBonus.toFixed(2)}</span>
              </div>
            </div>

            {/* Highlighted Full-Width Green Bar: Potential Win [ 79.63 ] */}
            <div className="bg-[#1a3825] border border-[#00a826]/40 rounded px-3 py-2 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Potential Win</span>
              <span className="font-black text-sm text-white">{potentialWin.toFixed(2)}</span>
            </div>

            {/* Bottom Buttons: Book Bet (Dark Green) | Place Bet (Bright Green with Subtext) */}
            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={handleBookBet}
                className="py-3 bg-[#0d6824] hover:bg-[#0b591f] active:scale-95 text-white font-black text-xs rounded uppercase tracking-wider transition-all"
              >
                Book Bet
              </button>

              <button
                onClick={handleOpenConfirm}
                className="py-2 bg-[#00c038] hover:bg-[#00a826] active:scale-95 text-white rounded flex flex-col items-center justify-center transition-all shadow-lg"
              >
                <span className="font-black text-xs uppercase tracking-wider">
                  Place Bet
                </span>
                <span className="text-[10px] text-emerald-100 font-medium">
                  About to pay {currentStake.toFixed(2)}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* MODAL: CONFIRM TO PAY (Screenshot 2)                                */}
      {/* =================================================================== */}
      {isConfirmModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-end justify-center animate-in fade-in">
          <div className="w-full max-w-md bg-[#222d3d] rounded-t-2xl p-4 space-y-4 shadow-2xl animate-in slide-in-from-bottom duration-150 border-t border-[#313f52]">
            <div className="text-center pt-2 space-y-1">
              <p className="text-sm font-bold text-neutral-300">Confirm to Pay</p>
              <p className="text-2xl font-black text-white tracking-wide">
                GHS {currentStake.toFixed(2)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setIsConfirmModalOpen(false)}
                className="py-3 bg-[#2b3648] hover:bg-[#344256] text-white text-xs font-bold rounded uppercase tracking-wider active:scale-95 transition-all"
              >
                Cancel
              </button>

              <button
                onClick={handleConfirmPay}
                className="py-3 bg-[#00c038] hover:bg-[#00a826] text-white text-xs font-black rounded uppercase tracking-wider shadow active:scale-95 transition-all"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
