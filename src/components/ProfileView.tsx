import React, { useState } from 'react';
import {
  Settings,
  Eye,
  EyeOff,
  Wallet,
  ArrowDownToLine,
  Receipt,
  Gift,
  Users,
  Flame,
  Headphones,
  Bell,
  HelpCircle,
  Lightbulb,
  ChevronRight,
  ShieldCheck,
  Moon,
  Sun,
  Server
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { ProfileDetailsSubpage } from './ProfileDetailsSubpage';
import { AuthModal } from './AuthModal';
import { SportyBetLogo } from './SportyBetLogo';
import { ServerSettingsModal } from './ServerSettingsModal';

interface ProfileViewProps {
  onOpenWithdraw: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenWithdraw }) => {
  const { user, logout, showToast, setActiveTab } = useBetting();
  const [hideBalance, setHideBalance] = useState(false);
  const [showSubpage, setShowSubpage] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');
  const [serverSettingsOpen, setServerSettingsOpen] = useState(false);

  // If subpage is open, display Image 3
  if (showSubpage) {
    return <ProfileDetailsSubpage onBack={() => setShowSubpage(false)} />;
  }

  // Logged-out view (Exact clone of Screenshot_20260924_213109_Chrome.jpg)
  if (!user.isLoggedIn) {
    return (
      <div className="pb-24 bg-[#141b24] text-white min-h-screen select-none">
        {/* Top Header Card (Box 1: Login to View | Dark Mode | Total Balance GHS -- | Deposit | Withdraw) */}
        <div className="px-4 pt-3 pb-3">
          {/* Row 1: Login to View > on left, Dark Mode on right */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex items-center space-x-2.5 text-left group"
            >
              {/* Circular user avatar icon (white circle with silhouette cutout) */}
              <div className="w-8 h-8 rounded-full bg-white flex items-end justify-center overflow-hidden shrink-0 shadow-sm">
                <svg className="w-6 h-6 text-[#141b24]" viewBox="0 0 24 24" fill="currentColor">
                  <circle cx="12" cy="7.5" r="3.8" />
                  <path d="M4 19.5c0-3.5 3.5-5.8 8-5.8s8 2.3 8 5.8v0.5H4v-0.5z" />
                </svg>
              </div>
              <div className="flex items-center space-x-1">
                <span className="font-bold text-[17px] text-white tracking-tight group-hover:text-[#00df59] transition-colors">
                  Login to View
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white stroke-[2.5]" />
              </div>
            </button>

            {/* Dark Mode crescent moon */}
            <div className="flex items-center space-x-1.5 text-xs text-white">
              <span>Dark Mode</span>
              <svg className="w-4 h-4 text-white fill-white" viewBox="0 0 24 24">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            </div>
          </div>

          {/* Row 2: Total Balance on left, GHS -- on right */}
          <div className="flex items-baseline justify-between mt-3.5">
            <span className="text-xs text-neutral-300 font-normal">Total Balance</span>
            <span className="text-[22px] font-black tracking-tight text-white font-sans">
              GHS --
            </span>
          </div>

          {/* Row 3: Action Buttons (Deposit in green, Withdraw in dark with green border) */}
          <div className="grid grid-cols-2 gap-3 mt-3.5">
            {/* Deposit button */}
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-bold py-2.5 px-4 rounded-[4px] text-xs flex items-center justify-center space-x-2 shadow-sm transition-all"
            >
              {/* Wallet Card Icon */}
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M2 10h20" />
                <circle cx="16" cy="15" r="1.5" fill="currentColor" stroke="none" />
              </svg>
              <span className="text-sm font-bold">Deposit</span>
            </button>

            {/* Withdraw button */}
            <button
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="border border-[#00a826] bg-[#0c1813] hover:bg-[#00a826]/10 active:scale-[0.98] text-[#00df59] font-bold py-2.5 px-4 rounded-[4px] text-xs flex items-center justify-center space-x-2 transition-all"
            >
              {/* Banknote / ATM cash icon */}
              <svg className="w-4 h-4 text-[#00df59]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="6" width="20" height="12" rx="2" />
                <circle cx="12" cy="12" r="2.5" />
                <path d="M6 12h.01M18 12h.01" />
              </svg>
              <span className="text-sm font-bold">Withdraw</span>
            </button>
          </div>

          {/* Row 4: Sporty Loyalty Banner (Screenshot) */}
          <div
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="mt-3.5 relative overflow-hidden rounded-md h-[46px] flex items-center justify-between px-3.5 cursor-pointer bg-gradient-to-r from-[#172738] via-[#1a3044] to-[#12222e] border border-[#223548] shadow-sm hover:border-[#2d445c] transition-all"
          >
            {/* Watermark subtle graphic */}
            <div className="absolute left-0 top-0 bottom-0 w-32 pointer-events-none opacity-20 bg-gradient-to-r from-red-600/30 to-transparent" />
            <span className="text-sm font-black italic tracking-wide text-white drop-shadow-sm">
              Sporty Loyalty
            </span>
            <div className="flex items-center space-x-0.5 text-xs font-bold text-[#00df59]">
              <span>Log in to join</span>
              <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </div>
          </div>

          {/* Row 5: 3-Column Card (Sports Bet History | Transaction Records | Gifts (0) Lucky Wheel (0)) */}
          <div className="bg-[#19222d] rounded-md border border-[#212d3d] grid grid-cols-3 divide-x divide-[#212d3d] py-3.5 text-center mt-3.5 shadow-xs">
            {/* Column 1: Sports Bet History */}
            <div
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex flex-col items-center justify-center cursor-pointer group px-1"
            >
              <svg className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
                <path d="M8 7h8M8 11h8M8 15h5" />
              </svg>
              <span className="text-[11px] text-neutral-300 group-hover:text-white font-medium leading-tight mt-1.5 transition-colors">
                Sports Bet<br />History
              </span>
            </div>

            {/* Column 2: Transaction Records */}
            <div
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex flex-col items-center justify-center cursor-pointer group px-1"
            >
              <svg className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <polyline points="3 3 3 8 8 8" />
                <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
                <polyline points="16 21 21 21 21 16" />
                <text x="12" y="15.2" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="currentColor" stroke="none">$</text>
              </svg>
              <span className="text-[11px] text-neutral-300 group-hover:text-white font-medium leading-tight mt-1.5 transition-colors">
                Transaction<br />Records
              </span>
            </div>

            {/* Column 3: Gifts (0) Lucky Wheel (0) */}
            <div
              onClick={() => {
                setAuthMode('login');
                setAuthModalOpen(true);
              }}
              className="flex flex-col items-center justify-center cursor-pointer group px-1"
            >
              <svg className="w-5 h-5 text-neutral-300 group-hover:text-white transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 12 20 22 4 22 4 12" />
                <rect x="2" y="7" width="20" height="5" />
                <line x1="12" y1="22" x2="12" y2="7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
              </svg>
              <span className="text-[11px] text-neutral-300 group-hover:text-white font-medium leading-tight mt-1.5 transition-colors">
                Gifts (0)<br />Lucky Wheel (0)
              </span>
            </div>
          </div>

          {/* Row 6: Customer Service (Screenshot) */}
          <div className="mt-4 border-t border-[#212d3d]">
            <button
              onClick={() => showToast('Connecting to 24/7 Live Agent in Accra...')}
              className="w-full py-3.5 flex items-center justify-between border-b border-[#212d3d] hover:bg-[#16212e] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Headphones className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
                <span className="text-sm font-normal text-neutral-200">Customer Service</span>
              </div>
              <div className="flex items-center space-x-1 text-xs text-neutral-400">
                <span>Online 24/7</span>
                <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
              </div>
            </button>

            {/* Row 7: How to play (Box 2: Circled in red at bottom) */}
            <button
              onClick={() => showToast('SportyBet Ghana Rules & Guide')}
              className="w-full py-3.5 flex items-center justify-between border-b border-[#212d3d] hover:bg-[#16212e] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border border-neutral-300 flex items-center justify-center text-xs font-serif font-bold text-neutral-200">
                  i
                </div>
                <span className="text-sm font-normal text-neutral-200">How to play</span>
              </div>
              <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
            </button>
          </div>

          {/* Row 8: Footer (18+ | LaLiga Partner | Tagline as seen in Screenshot) */}
          <div className="mt-6 text-center text-xs text-neutral-400 space-y-3.5">
            {/* 18+ and Copyright */}
            <div className="flex items-center justify-between text-neutral-400 font-bold text-xs pt-1">
              <div className="flex items-center space-x-1.5 text-neutral-300">
                <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <polyline points="9 15 11 17 15 13" />
                </svg>
                <span className="text-base font-extrabold text-neutral-300">18+</span>
              </div>
              <span
                onClick={() => setServerSettingsOpen(true)}
                className="text-[11px] font-normal text-neutral-400 cursor-pointer"
                title="System Info"
              >
                © 2026 SportyBet. All rights reserved.
              </span>
            </div>

            {/* Official Sports Betting Partner: LaLiga */}
            <div className="flex items-center justify-center space-x-3 py-3 border-y border-[#1e2733]/80">
              <SportyBetLogo size="sm" variant="red" />
              <div className="h-5 w-px bg-neutral-600/70" />
              <span className="text-[9px] uppercase font-bold text-neutral-300 leading-tight text-left">
                Official Sports<br />Betting Partner
              </span>
              <div className="h-5 w-px bg-neutral-600/70" />
              <div className="flex flex-col items-center">
                <svg className="w-4 h-4 text-[#ff4d4f]" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M4 3h5l7 14h-5z M10 17l2 4h5l-2-4z" />
                </svg>
                <span className="text-[8px] font-black tracking-wider text-[#ff4d4f]">LALIGA</span>
              </div>
            </div>

            {/* The world's most visited betting platform */}
            <p className="text-xs text-neutral-400 font-normal">
              The world&apos;s most visited betting platform
            </p>
          </div>
        </div>

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
        <ServerSettingsModal
          isOpen={serverSettingsOpen}
          onClose={() => setServerSettingsOpen(false)}
        />
      </div>
    );
  }

  // Logged-in view (Screenshot 14: circled with yellow ink)
  return (
    <div className="pb-24 bg-[#121922] text-white min-h-screen select-none">
      {/* Top Profile Card (Screenshot 14) */}
      <div className="bg-[#19222d] px-4 pt-4 pb-4 border-b border-[#212d3d] relative overflow-hidden">
        {/* Faint Loyalty Watermark Graphic top-right (as seen in SportyBet screenshot) */}
        <div className="absolute -top-3 -right-3 w-32 h-32 pointer-events-none opacity-[0.07] text-white">
          <svg viewBox="0 0 100 100" fill="currentColor">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" stroke="currentColor" strokeWidth="3" fill="none" />
            <polygon points="50,15 80,30 80,70 50,85 20,70 20,30" stroke="currentColor" strokeWidth="2" fill="none" />
            <text x="50" y="65" textAnchor="middle" fontSize="38" fontWeight="bold" fontFamily="serif" fill="currentColor">
              I
            </text>
          </svg>
        </div>

        {/* Settings Gear icon top-right */}
        <button 
          onClick={() => setServerSettingsOpen(true)}
          className="absolute top-4 right-4 text-white hover:text-neutral-300 z-10 transition-colors"
          aria-label="Settings"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>

        {/* User Info Row: Avatar + Phone + Loyalty */}
        <div className="flex items-center space-x-3.5 relative z-10">
          {/* Avatar Photo (Beach soccer sunset image with crisp white/silver border) */}
          <div 
            onClick={() => setShowSubpage(true)}
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/60 shadow-md cursor-pointer bg-neutral-800 shrink-0"
          >
            <img
              src={user.avatarUrl || '/user_beach_avatar.jpg'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pr-8">
            {/* User Name & Phone clickable row */}
            <div 
              onClick={() => setShowSubpage(true)}
              className="cursor-pointer group"
            >
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-[16px] text-white tracking-wide group-hover:text-[#00df59] transition-colors uppercase truncate">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : (user.firstName || user.username || user.phone || 'User')}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-white stroke-[2.5] shrink-0" />
              </div>
              <div className="text-xs text-neutral-400 font-mono tracking-wider mt-0.5">
                {user.phone ? (user.phone.length > 7 ? `${user.phone.slice(0, 3)}****${user.phone.slice(-3)}` : user.phone) : 'No phone set'}
              </div>
            </div>

            {/* Loyalty Tier Row */}
            <div className="flex items-center justify-between text-xs text-neutral-400 mt-1">
              <div className="flex items-center space-x-1">
                <span>Loyalty Tier :</span>
                {/* Blue Hexagon / Shield Badge with 'I' */}
                <div className="inline-flex items-center justify-center w-3.5 h-3.5 bg-[#1890ff] text-white text-[9px] font-bold rounded-xs ml-0.5 shadow-xs">
                  I
                </div>
              </div>
              <span className="text-[11px] text-neutral-400 font-normal">
                Next Update: {user.nextUpdate || '01 Oct'}
              </span>
            </div>
          </div>
        </div>

        {/* Neon Green Progress Bar (Screenshot 14: spans ~96% width) */}
        <div className="w-full bg-[#1e2a38] h-1 rounded-full mt-3.5 overflow-hidden">
          <div
            className="bg-[#00df59] h-full rounded-full shadow-[0_0_8px_rgba(0,223,89,0.5)] transition-all"
            style={{ width: `${user.loyaltyProgress || 96}%` }}
          />
        </div>

        {/* Total Balance Row (Screenshot 14) */}
        <div className="flex items-center justify-between mt-3.5 pt-1">
          <span className="text-xs text-neutral-300 font-normal">Total Balance</span>
          <div className="flex items-center space-x-1.5">
            <span className="text-xl font-bold text-white tracking-tight font-sans">
              {user.currency} {hideBalance ? '****' : user.balance.toFixed(2)}
            </span>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="text-neutral-300 hover:text-white p-0.5 ml-0.5 transition-colors"
              title={hideBalance ? "Show balance" : "Hide balance"}
            >
              {hideBalance ? <EyeOff className="w-4 h-4 stroke-[2]" /> : <Eye className="w-4 h-4 stroke-[2]" />}
            </button>
          </div>
        </div>

        {/* Deposit & Withdraw Buttons (Solid green & outlined green - exact screenshot 14) */}
        <div className="grid grid-cols-2 gap-3 mt-3.5">
          {/* Deposit: Solid green with wallet icon */}
          <button
            onClick={() => setActiveTab('deposit')}
            className="bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-bold py-2.5 rounded-[4px] text-sm flex items-center justify-center space-x-2 shadow-sm transition-all"
          >
            <Wallet className="w-4 h-4 stroke-[2.2]" />
            <span>Deposit</span>
          </button>

          {/* Withdraw: Outlined green with cash icon */}
          <button
            onClick={onOpenWithdraw}
            className="bg-transparent border border-[#00a826] text-[#00df59] hover:bg-[#00a826]/10 active:scale-[0.98] font-bold py-2.5 rounded-[4px] text-sm flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowDownToLine className="w-4 h-4 text-[#00df59] stroke-[2.2]" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Sporty Loyalty Banner (Screenshot 14) */}
      <div className="p-3">
        <div 
          onClick={() => showToast('Opening Sporty Loyalty Club...')}
          className="bg-gradient-to-r from-[#1c293a] via-[#1a2534] to-[#17222f] border border-[#263548] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-neutral-500 transition-colors shadow-sm"
        >
          <div>
            <div className="text-sm font-black italic text-white flex items-center space-x-1 tracking-wide">
              <span>Sporty Loyalty</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1.5">
              <span className="bg-[#ff2d55] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                +1 Reward
              </span>
              <span className="bg-[#7030a0] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                +2 Challenges
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-0.5 text-xs font-bold text-[#00df59]">
            <span>Earn Rewards</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </div>
        </div>
      </div>

      {/* 3-Tile Unified Grid (Screenshot 14): Sports Bet History | Transaction Records | Gifts (0) Lucky Wheel (0) */}
      <div className="mx-3 bg-[#16212e] border border-[#212d3d] rounded-lg grid grid-cols-3 divide-x divide-[#212d3d]">
        {/* Column 1: Sports Bet History */}
        <button
          onClick={() => setActiveTab('open_bets')}
          className="py-3 px-1.5 flex flex-col items-center justify-center text-center hover:bg-[#1a2636] transition-colors group"
        >
          {/* Betting Ticket / Slip Icon */}
          <svg className="w-5 h-5 text-neutral-200 mb-1.5 group-hover:text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M4 4v16a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1z" />
            <line x1="8" y1="8" x2="16" y2="8" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="12" x2="16" y2="12" strokeWidth="2" strokeLinecap="round" />
            <line x1="8" y1="16" x2="12" y2="16" strokeWidth="2" strokeLinecap="round" />
            <circle cx="16" cy="16" r="1" fill="currentColor" />
          </svg>
          <span className="text-xs font-medium text-neutral-200 leading-tight">
            Sports Bet<br />History
          </span>
        </button>

        {/* Column 2: Transaction Records (with exact Cycle-$ icon from screenshot) */}
        <button
          onClick={() => showToast('Displaying recent deposit & bet transactions')}
          className="py-3 px-1.5 flex flex-col items-center justify-center text-center hover:bg-[#1a2636] transition-colors group"
        >
          <svg className="w-5 h-5 text-neutral-200 mb-1.5 group-hover:text-white" viewBox="0 0 24 24" fill="none">
            <path
              d="M20.5 10.5A8.5 8.5 0 0 0 6 5.5L3.5 8"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="3.5 3.5 3.5 8 8 8"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M3.5 13.5A8.5 8.5 0 0 0 18 18.5L20.5 16"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <polyline
              points="20.5 20.5 20.5 16 16 16"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="12"
              y="15.2"
              textAnchor="middle"
              fontSize="10"
              fontWeight="bold"
              fill="currentColor"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              $
            </text>
          </svg>
          <span className="text-xs font-medium text-neutral-200 leading-tight">
            Transaction<br />Records
          </span>
        </button>

        {/* Column 3: Gifts (0) Lucky Wheel (0) */}
        <button
          onClick={() => showToast('Lucky Wheel spin available!')}
          className="py-3 px-1.5 flex flex-col items-center justify-center text-center hover:bg-[#1a2636] transition-colors group"
        >
          <Gift className="w-5 h-5 text-neutral-200 mb-1.5 group-hover:text-white stroke-[1.8]" />
          <span className="text-xs font-medium text-neutral-200 leading-tight">
            Gifts (0)<br />Lucky Wheel (0)
          </span>
        </button>
      </div>

      {/* Menu List (Screenshot 14) */}
      <div className="mt-4 border-t border-[#1e2733] divide-y divide-[#1c2633] bg-[#121922]">
        {/* My SportySocial */}
        <button
          onClick={() => showToast('SportySocial: Connect with other tipsters')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
            <span className="text-sm font-medium text-neutral-200">My SportySocial</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-neutral-400">
            <span>Create</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
          </div>
        </button>

        {/* Daily Streak */}
        <button
          onClick={() => showToast(`Your daily streak is ${user.dailyStreak} days!`)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Flame className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff2d55] rounded-full ring-2 ring-[#121922]" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Daily Streak</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-5 h-5 rounded-full bg-[#4baaa0] text-white text-[11px] font-bold flex items-center justify-center shadow-xs">
              {user.dailyStreak || 5}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
          </div>
        </button>

        {/* Customer Service */}
        <button
          onClick={() => showToast('Connecting to 24/7 Live Agent in Accra...')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Headphones className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
            <span className="text-sm font-medium text-neutral-200">Customer Service</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-neutral-400">
            <span>Online 24/7</span>
            <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
          </div>
        </button>

        {/* Notification Center */}
        <button
          onClick={() => showToast('You have 1 new announcement.')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff2d55] rounded-full ring-2 ring-[#121922]" />
            </div>
            <span className="text-sm font-medium text-neutral-200">Notification Center</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
        </button>

        {/* Server & Network Settings (for Android APK & Web) */}
        <button
          onClick={() => setServerSettingsOpen(true)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Server className="w-5 h-5 text-[#00df59] stroke-[1.8]" />
            <div className="text-left">
              <span className="text-sm font-medium text-neutral-200 block">Server & Network Settings</span>
              <span className="text-[10px] text-neutral-400 font-mono">Configure API endpoint for APK / Web</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
        </button>

        {/* How to play */}
        <button
          onClick={() => showToast('SportyBet Ghana Rules & Guide')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
            <span className="text-sm font-medium text-neutral-200">How to play</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
        </button>

        {/* Share an Idea */}
        <button
          onClick={() => showToast('Share your suggestions with SportyBet team')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#16212e] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-5 h-5 text-neutral-300 stroke-[1.8]" />
            <span className="text-sm font-medium text-neutral-200">Share an Idea</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400 stroke-[2]" />
        </button>
      </div>

      {/* Footer Section (Screenshot 4 & 14) */}
      {renderFooter(true, logout, () => {}, showToast)}

      <ServerSettingsModal
        isOpen={serverSettingsOpen}
        onClose={() => setServerSettingsOpen(false)}
      />
    </div>
  );
};

function renderFooter(
  isLoggedIn: boolean,
  logout: () => void,
  openLogin: () => void,
  showToast: (m: string) => void
) {
  return (
    <div className="mt-8 px-4 pb-8 text-center text-xs text-neutral-400 space-y-4">
      {/* 18+ and Copyright (Screenshot 001042) */}
      <div className="flex items-center justify-between text-neutral-400 font-bold text-xs pt-2">
        <div className="flex items-center space-x-1.5 text-neutral-300">
          {/* Certificate / Document Checkmark icon */}
          <svg className="w-5 h-5 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <polyline points="9 15 11 17 15 13" />
          </svg>
          <span className="text-base font-extrabold text-neutral-300">18+</span>
        </div>
        <span className="text-[11px] font-normal text-neutral-400">© 2026 SportyBet. All rights reserved.</span>
      </div>

      {/* Official Sports Betting Partner: LaLiga */}
      <div className="flex items-center justify-center space-x-3 py-3 border-y border-[#1e2733]/80">
        <SportyBetLogo size="sm" variant="red" />
        <div className="h-5 w-px bg-neutral-600/70" />
        <span className="text-[9px] uppercase font-bold text-neutral-300 leading-tight text-left">
          Official Sports<br />Betting Partner
        </span>
        <div className="h-5 w-px bg-neutral-600/70" />
        <div className="flex flex-col items-center">
          <svg className="w-4 h-4 text-[#ff4d4f]" viewBox="0 0 24 24" fill="currentColor">
            <path d="M4 3h5l7 14h-5z M10 17l2 4h5l-2-4z" />
          </svg>
          <span className="text-[8px] font-black tracking-wider text-[#ff4d4f]">LALIGA</span>
        </div>
      </div>

      <p className="text-xs text-neutral-300 font-normal">
        The world&apos;s most visited betting platform
      </p>

      {/* Paybill */}
      <div className="space-y-0.5">
        <div className="text-[11px] text-neutral-400">Paybill:</div>
        <div className="text-2xl font-black text-white tracking-widest font-mono">
          *711*222#
        </div>
      </div>

      {/* Payment methods - Exact 2 rows of 3 columns from Screenshot 001042:
          Row 1: at | MTN | telecel
          Row 2: VISA | mastercard | GTBank
      */}
      <div className="space-y-2 pt-1">
        <div className="text-xs text-neutral-400 font-normal">Payment methods</div>
        <div className="grid grid-cols-3 gap-2 max-w-[340px] mx-auto">
          {/* Row 1, Col 1: at (AirtelTigo) */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex items-center justify-center px-2 shadow-xs">
            <span className="font-bold text-sm tracking-tight text-neutral-100 lowercase">
              at
            </span>
          </div>

          {/* Row 1, Col 2: MTN (Pill outline) */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex items-center justify-center px-2 shadow-xs">
            <div className="border border-neutral-400/80 px-2.5 py-0.5 rounded-full flex items-center justify-center">
              <span className="text-[10px] font-black text-white italic tracking-wider">
                MTN
              </span>
            </div>
          </div>

          {/* Row 1, Col 3: telecel (t inside circle + telecel) */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex items-center justify-center px-2 space-x-1 shadow-xs">
            <span className="w-3.5 h-3.5 rounded-full bg-white text-[#17222f] font-black text-[9px] flex items-center justify-center leading-none">
              t
            </span>
            <span className="font-bold text-xs text-neutral-100 lowercase tracking-tight">
              telecel
            </span>
          </div>

          {/* Row 2, Col 1: VISA */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex items-center justify-center px-2 shadow-xs">
            <span className="font-black italic text-xs tracking-wider text-neutral-100">
              VISA
            </span>
          </div>

          {/* Row 2, Col 2: mastercard (Overlapping circles + mastercard label) */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex flex-col items-center justify-center px-2 leading-none shadow-xs">
            <div className="flex -space-x-1.5 items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-full bg-[#eb001b]/90" />
              <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f00]/90" />
            </div>
            <span className="text-[7px] text-neutral-400 font-medium tracking-tight mt-0.5 lowercase">
              mastercard
            </span>
          </div>

          {/* Row 2, Col 3: GTBank */}
          <div className="bg-[#17222f] border border-[#222e3e] rounded-[4px] h-9 flex items-center justify-center px-2 shadow-xs">
            <span className="font-bold text-xs text-neutral-100 tracking-tight">
              GTBank
            </span>
          </div>
        </div>
      </div>

      {/* Country links */}
      <div className="flex items-center justify-center space-x-3 text-xs text-neutral-400 underline pt-1">
        <button onClick={() => showToast('Switch to SportyBet South Africa')} className="hover:text-neutral-200">
          SportyBet ZA
        </button>
        <span>|</span>
        <button onClick={() => showToast('Switch to SportyBet Brazil')} className="hover:text-neutral-200">
          SportyBet BR
        </button>
      </div>

      {/* License disclaimer */}
      <p className="text-[10px] text-neutral-400/90 leading-relaxed max-w-sm mx-auto px-1">
        Age 18 and above only. Play Responsibly. Betting is addictive and can be psychologically harmful. SportyBet Ghana is licensed by the Gaming Commission of Ghana under License No 0000237.
      </p>

      {/* Divider before bottom links */}
      <div className="border-t border-[#1e2733]/80 my-2" />

      {/* Links */}
      <div className="flex items-center justify-center space-x-3 text-[11px] text-neutral-400 underline">
        <button onClick={() => showToast('Terms & Conditions')} className="hover:text-neutral-200">
          Terms & Conditions
        </button>
        <span>|</span>
        <button onClick={() => showToast('About SportyBet')} className="hover:text-neutral-200">
          About Us
        </button>
        <span>|</span>
        <button 
          onClick={() => showToast('All Systems Operational - Real-time Sportsbook Online')} 
          className="hover:text-neutral-200"
        >
          System Status
        </button>
      </div>

      {/* Logout button (Screenshot 001042) */}
      {isLoggedIn && (
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3.5 bg-[#253140] hover:bg-[#2e3c4e] active:bg-[#1a232f] text-white font-bold text-sm rounded-[4px] transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
