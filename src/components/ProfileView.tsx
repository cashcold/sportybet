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
  Sun
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { ProfileDetailsSubpage } from './ProfileDetailsSubpage';
import { AuthModal } from './AuthModal';

interface ProfileViewProps {
  onOpenWithdraw: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenWithdraw }) => {
  const { user, logout, showToast, setActiveTab } = useBetting();
  const [hideBalance, setHideBalance] = useState(false);
  const [showSubpage, setShowSubpage] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');

  // If subpage is open, display Image 3
  if (showSubpage) {
    return <ProfileDetailsSubpage onBack={() => setShowSubpage(false)} />;
  }

  // Logged-out view (Screenshot 13)
  if (!user.isLoggedIn) {
    return (
      <div className="pb-24 bg-[#141b24] text-white min-h-screen select-none">
        {/* Logged-out Top Row */}
        <div className="bg-[#19222d] px-4 py-4 border-b border-[#232f3f] flex items-center justify-between">
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="flex items-center space-x-2 text-white font-bold text-sm hover:text-neutral-200"
          >
            <div className="w-8 h-8 rounded-full bg-neutral-700 flex items-center justify-center text-sm">
              👤
            </div>
            <span>Login to View</span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </button>

          <div className="flex items-center space-x-1.5 text-xs text-neutral-300">
            <span>Dark Mode</span>
            <Moon className="w-4 h-4 text-neutral-400" />
          </div>
        </div>

        {/* Balance Row */}
        <div className="px-4 py-3 bg-[#19222d] flex items-center justify-between border-b border-[#232f3f]">
          <span className="text-xs text-neutral-400 font-medium">Total Balance</span>
          <span className="text-base font-black text-white">GHS --</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 p-4 bg-[#141b24]">
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="bg-[#00a826] hover:bg-[#009221] text-white font-bold py-2.5 rounded-[4px] text-xs flex items-center justify-center space-x-2 shadow"
          >
            <Wallet className="w-4 h-4" />
            <span>Deposit</span>
          </button>
          <button
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="border border-[#00a826] text-[#00df59] hover:bg-[#00a826]/10 font-bold py-2.5 rounded-[4px] text-xs flex items-center justify-center space-x-2"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>

        {/* Sporty Loyalty Log in banner */}
        <div className="px-4 pb-2">
          <div
            onClick={() => {
              setAuthMode('login');
              setAuthModalOpen(true);
            }}
            className="bg-[#1c2533] border border-[#273445] rounded-lg p-3 flex items-center justify-between cursor-pointer"
          >
            <span className="text-xs font-black italic text-white">Sporty Loyalty</span>
            <span className="text-xs font-bold text-[#00df59] flex items-center space-x-1">
              <span>Log in to join</span>
              <ChevronRight className="w-4 h-4" />
            </span>
          </div>
        </div>

        {/* Common Footer */}
        {renderFooter(false, () => {}, () => {
          setAuthMode('login');
          setAuthModalOpen(true);
        }, showToast)}

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          initialMode={authMode}
        />
      </div>
    );
  }

  // Logged-in view (Screenshot 14: circled with yellow ink)
  return (
    <div className="pb-24 bg-[#141b24] text-white min-h-screen select-none">
      {/* Top Profile Card (Screenshot 14) */}
      <div className="bg-[#19222d] px-4 pt-4 pb-4 border-b border-[#232f3f] relative">
        {/* Settings Gear icon top-right */}
        <button 
          onClick={() => showToast('Settings')}
          className="absolute top-4 right-4 text-neutral-300 hover:text-white"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>

        {/* User Info Row: Avatar + Phone + Loyalty */}
        <div className="flex items-center space-x-3">
          {/* Avatar Photo (Beach soccer sunset image) */}
          <div 
            onClick={() => setShowSubpage(true)}
            className="w-14 h-14 rounded-full overflow-hidden border-2 border-white/20 shadow cursor-pointer bg-neutral-800 shrink-0"
          >
            <img
              src={user.avatarUrl || '/user_beach_avatar.jpg'}
              alt="Avatar"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0 pr-8">
            {/* Phone Number Clickable Row: 20******5 > (Screenshot 14 Arrow/Circle) */}
            <div 
              onClick={() => setShowSubpage(true)}
              className="flex items-center space-x-1 cursor-pointer group"
            >
              <span className="font-black text-base text-white tracking-wide group-hover:text-[#00df59] transition-colors">
                {user.phone || '20******5'}
              </span>
              <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
            </div>

            {/* Loyalty Tier */}
            <div className="flex items-center justify-between text-[11px] text-neutral-400 mt-1">
              <div className="flex items-center space-x-1.5">
                <span>Loyalty Tier :</span>
                <span className="inline-flex items-center text-sky-400 font-bold">
                  🛡️ {user.loyaltyTier || 'Tier 1'}
                </span>
              </div>
              <span className="text-[10px] text-neutral-400">
                Next Update: {user.nextUpdate || '01 Oct'}
              </span>
            </div>
          </div>
        </div>

        {/* Green progress bar */}
        <div className="w-full bg-[#273444] h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-[#00df59] h-full rounded-full transition-all"
            style={{ width: `${user.loyaltyProgress || 68}%` }}
          />
        </div>

        {/* Total Balance Row (Screenshot 14) */}
        <div className="flex items-center justify-between mt-4 pt-1">
          <span className="text-xs text-neutral-300 font-medium">Total Balance</span>
          <div className="flex items-center space-x-2">
            <span className="text-lg font-black text-white tracking-tight">
              {user.currency} {hideBalance ? '****' : user.balance.toFixed(2)}
            </span>
            <button
              onClick={() => setHideBalance(!hideBalance)}
              className="text-neutral-400 hover:text-white"
            >
              {hideBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Deposit & Withdraw Buttons (Solid green & outline green) */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <button
            onClick={() => setActiveTab('deposit')}
            className="bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-bold py-2.5 rounded-[4px] text-xs flex items-center justify-center space-x-2 shadow transition-all"
          >
            <Wallet className="w-4 h-4" />
            <span>Deposit</span>
          </button>

          <button
            onClick={onOpenWithdraw}
            className="border border-[#00a826] text-[#00df59] hover:bg-[#00a826]/10 active:scale-[0.98] font-bold py-2.5 rounded-[4px] text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Withdraw</span>
          </button>
        </div>
      </div>

      {/* Sporty Loyalty Banner (Screenshot 14) */}
      <div className="p-3">
        <div 
          onClick={() => showToast('Opening Sporty Loyalty Club...')}
          className="bg-gradient-to-r from-[#202936] to-[#1a222d] border border-[#2b394a] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-neutral-500 transition-colors shadow-sm"
        >
          <div>
            <div className="text-xs font-black italic text-white flex items-center space-x-1">
              <span>Sporty Loyalty</span>
            </div>
            <div className="flex items-center space-x-1.5 mt-1">
              <span className="bg-[#ff4d4f] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                +1 Reward
              </span>
              <span className="bg-[#722ed1] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                +2 Challenges
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1 text-xs font-bold text-[#00df59]">
            <span>Earn Rewards</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3-Tile Grid (Screenshot 14): Sports Bet History | Transaction Records | Gifts (0) Lucky Wheel (0) */}
      <div className="px-3 grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() => setActiveTab('open_bets')}
          className="bg-[#18212c] hover:bg-[#1f2b3a] border border-[#222e3d] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <Receipt className="w-5 h-5 text-neutral-300 mb-1.5" />
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Sports Bet History
          </span>
        </button>

        <button
          onClick={() => showToast('Displaying recent deposit & bet transactions')}
          className="bg-[#18212c] hover:bg-[#1f2b3a] border border-[#222e3d] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-neutral-300 mb-1.5 font-bold">
            ⇄
          </div>
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Transaction Records
          </span>
        </button>

        <button
          onClick={() => showToast('Lucky Wheel spin available!')}
          className="bg-[#18212c] hover:bg-[#1f2b3a] border border-[#222e3d] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <Gift className="w-5 h-5 text-neutral-300 mb-1.5" />
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Gifts (0)<br />Lucky Wheel (0)
          </span>
        </button>
      </div>

      {/* Menu List (Screenshot 14) */}
      <div className="mt-4 border-t border-[#202936] divide-y divide-[#1e2733] bg-[#161e29]">
        {/* My SportySocial */}
        <button
          onClick={() => showToast('SportySocial: Connect with other tipsters')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Users className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">My SportySocial</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-neutral-400">
            <span>Create</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Daily Streak */}
        <button
          onClick={() => showToast(`Your daily streak is ${user.dailyStreak} days!`)}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Flame className="w-4 h-4 text-neutral-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff4d4f] rounded-full" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Daily Streak</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-5 h-5 rounded-full bg-[#526071] text-white text-[11px] font-bold flex items-center justify-center">
              {user.dailyStreak || 5}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </button>

        {/* Customer Service */}
        <button
          onClick={() => showToast('Connecting to 24/7 Live Agent in Accra...')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Headphones className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">Customer Service</span>
          </div>
          <div className="flex items-center space-x-1 text-xs text-neutral-400">
            <span>Online 24/7</span>
            <ChevronRight className="w-4 h-4" />
          </div>
        </button>

        {/* Notification Center */}
        <button
          onClick={() => showToast('You have 1 new announcement.')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-4 h-4 text-neutral-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#ff4d4f] rounded-full" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Notification Center</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        {/* How to play */}
        <button
          onClick={() => showToast('SportyBet Ghana Rules & Guide')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">How to play</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        {/* Share an Idea */}
        <button
          onClick={() => showToast('Share your suggestions with SportyBet team')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2735] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">Share an Idea</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Footer Section (Screenshot 4 & 14) */}
      {renderFooter(true, logout, () => {}, showToast)}
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
    <div className="mt-6 px-4 pb-8 text-center text-xs text-neutral-400 space-y-4">
      {/* 18+ and Copyright */}
      <div className="flex items-center justify-center space-x-2 text-neutral-400 font-bold text-xs">
        <span className="border border-neutral-600 px-1 py-0.2 rounded text-[10px]">18+</span>
        <span>© 2026 SportyBet. All rights reserved.</span>
      </div>

      {/* Official Sports Betting Partner: LaLiga */}
      <div className="flex items-center justify-center space-x-3 py-2 border-y border-[#1e2733]">
        <span className="text-sm font-black italic text-[#de1a22]">SportyBet</span>
        <div className="h-4 w-px bg-neutral-600" />
        <span className="text-[10px] uppercase font-bold text-neutral-300">
          Official Sports Betting Partner
        </span>
        <div className="h-4 w-px bg-neutral-600" />
        <span className="text-sm font-black italic tracking-wider text-[#ff4d4f]">LALIGA</span>
      </div>

      <p className="text-xs text-neutral-300 font-medium">
        The world's most visited betting platform
      </p>

      {/* Paybill */}
      <div className="space-y-1">
        <div className="text-[11px] text-neutral-400">Paybill:</div>
        <div className="text-xl font-black text-white tracking-widest font-mono">
          *711*222#
        </div>
      </div>

      {/* Payment methods */}
      <div className="space-y-1.5">
        <div className="text-[11px] text-neutral-400">Payment methods</div>
        <div className="flex flex-wrap items-center justify-center gap-1.5 text-[10px] font-bold text-neutral-300">
          <span className="bg-[#1c2533] px-2.5 py-1 rounded border border-neutral-700/60 font-black">at</span>
          <span className="bg-[#ffcc00] text-black px-2 py-1 rounded font-black">MTN</span>
          <span className="bg-[#e60000] text-white px-2 py-1 rounded font-bold">telecel</span>
          <span className="bg-[#1c2533] px-2.5 py-1 rounded border border-neutral-700/60 font-bold">VISA</span>
          <span className="bg-[#1c2533] px-2.5 py-1 rounded border border-neutral-700/60 font-bold">Mastercard</span>
          <span className="bg-[#1c2533] px-2.5 py-1 rounded border border-neutral-700/60 font-bold">GTBank</span>
        </div>
      </div>

      {/* Country links */}
      <div className="flex items-center justify-center space-x-3 text-xs text-neutral-400 underline">
        <button onClick={() => showToast('Switch to SportyBet South Africa')}>SportyBet ZA</button>
        <span>|</span>
        <button onClick={() => showToast('Switch to SportyBet Brazil')}>SportyBet BR</button>
      </div>

      {/* License disclaimer */}
      <p className="text-[10px] text-neutral-500 leading-relaxed max-w-sm mx-auto">
        Age 18 and above only. Play Responsibly. Betting is addictive and can be psychologically harmful. SportyBet Ghana is licensed by the Gaming Commission of Ghana under License No 0000237.
      </p>

      {/* Links */}
      <div className="flex items-center justify-center space-x-3 text-[11px] text-neutral-400 underline">
        <button onClick={() => showToast('Terms & Conditions')}>Terms & Conditions</button>
        <span>|</span>
        <button onClick={() => showToast('About SportyBet')}>About Us</button>
        <span>|</span>
        <button onClick={() => showToast('All Systems Operational')}>System Status</button>
      </div>

      {/* Logout button (Screenshot 4) */}
      {isLoggedIn && (
        <div className="pt-2">
          <button
            onClick={logout}
            className="w-full py-3 bg-[#242f3d] hover:bg-[#2b3849] active:bg-[#1a232e] text-white font-bold text-xs rounded transition-colors"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
