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
  Check
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface ProfileViewProps {
  onOpenWithdraw: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ onOpenWithdraw }) => {
  const { user, setIsDepositModalOpen, updateUsername, showToast, setActiveTab } = useBetting();
  const [hideBalance, setHideBalance] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(user.username);

  const handleSaveName = () => {
    if (tempName.trim()) {
      updateUsername(tempName.trim());
    }
    setIsEditingName(false);
  };

  return (
    <div className="pb-24 bg-[#141a22] text-white min-h-screen">
      {/* Top Profile Card (Screenshot 4) */}
      <div className="bg-gradient-to-b from-[#1b2532] to-[#161d27] px-4 pt-5 pb-4 border-b border-[#212b38] relative">
        <button 
          onClick={() => showToast('Account Settings')}
          className="absolute top-4 right-4 text-neutral-300 hover:text-white"
        >
          <Settings className="w-5 h-5 stroke-[2]" />
        </button>

        {/* User Info Row */}
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-amber-200 border-2 border-white/20 overflow-hidden flex items-center justify-center text-2xl shadow">
            👤
          </div>

          <div className="flex-1">
            {isEditingName ? (
              <div className="flex items-center space-x-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter username"
                  className="bg-[#242f3d] text-white text-xs px-2 py-1 rounded border border-neutral-600 focus:outline-none"
                  autoFocus
                />
                <button
                  onClick={handleSaveName}
                  className="p-1 bg-[#00a826] rounded text-white"
                >
                  <Check className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => setIsEditingName(true)}
                className="flex items-center space-x-1 cursor-pointer group"
              >
                <span className="font-bold text-sm text-neutral-100 group-hover:text-white">
                  {user.username || 'No username set'}
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-white" />
              </div>
            )}

            <div className="flex items-center space-x-2 text-[11px] text-neutral-400 mt-1">
              <span>Loyalty Tier :</span>
              <span className="bg-[#253243] text-sky-400 px-1.5 py-0.2 rounded font-bold border border-sky-500/30">
                {user.loyaltyTier}
              </span>
              <span className="ml-auto text-[10px] text-neutral-400">
                Next Update: {user.nextUpdate}
              </span>
            </div>
          </div>
        </div>

        {/* Green progress bar */}
        <div className="w-full bg-[#202936] h-1.5 rounded-full mt-3 overflow-hidden">
          <div
            className="bg-[#00df59] h-full rounded-full transition-all"
            style={{ width: `${user.loyaltyProgress}%` }}
          />
        </div>

        {/* Total Balance Row */}
        <div className="flex items-center justify-between mt-4 pt-2">
          <span className="text-xs text-neutral-300 font-medium">Total Balance</span>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-white tracking-tight">
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

        {/* Deposit & Withdraw Buttons (Solid green & outline green as in screenshot) */}
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

      {/* Sporty Loyalty Banner (Screenshot 4) */}
      <div className="p-3">
        <div 
          onClick={() => showToast('Opening Sporty Loyalty Club...')}
          className="bg-gradient-to-r from-[#222c3c] to-[#1c2432] border border-[#2b3749] rounded-lg p-3 flex items-center justify-between cursor-pointer hover:border-neutral-600 transition-colors shadow-sm"
        >
          <div>
            <div className="text-xs font-black italic text-white flex items-center space-x-1">
              <span>Sporty Loyalty</span>
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <span className="bg-[#ff4d4f]/20 text-[#ff4d4f] border border-[#ff4d4f]/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
                +1 Reward
              </span>
              <span className="bg-[#1890ff]/20 text-sky-400 border border-sky-400/30 text-[10px] font-bold px-1.5 py-0.2 rounded">
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

      {/* 3-Tile Grid: Sports Bet History | Transaction Records | Gifts (0) Lucky Wheel (0) */}
      <div className="px-3 grid grid-cols-3 gap-2 text-center">
        <button
          onClick={() => setActiveTab('open_bets')}
          className="bg-[#1b232e] hover:bg-[#202936] border border-[#242f3e] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <Receipt className="w-5 h-5 text-neutral-300 mb-1.5" />
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Sports Bet History
          </span>
        </button>

        <button
          onClick={() => showToast('Displaying recent deposit & bet transactions')}
          className="bg-[#1b232e] hover:bg-[#202936] border border-[#242f3e] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <div className="w-5 h-5 flex items-center justify-center text-neutral-300 mb-1.5">
            ⇄
          </div>
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Transaction Records
          </span>
        </button>

        <button
          onClick={() => showToast('Lucky Wheel spin available!')}
          className="bg-[#1b232e] hover:bg-[#202936] border border-[#242f3e] rounded-md p-3 flex flex-col items-center justify-center transition-colors"
        >
          <Gift className="w-5 h-5 text-neutral-300 mb-1.5" />
          <span className="text-[11px] font-medium text-neutral-200 leading-tight">
            Gifts (0)<br />Lucky Wheel (0)
          </span>
        </button>
      </div>

      {/* Menu List */}
      <div className="mt-4 border-t border-[#202936] divide-y divide-[#1e2733] bg-[#171f2a]">
        {/* My SportySocial */}
        <button
          onClick={() => showToast('SportySocial: Connect with other tipsters')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
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
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Flame className="w-4 h-4 text-[#ff4d4f] fill-current" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Daily Streak</span>
          </div>
          <div className="flex items-center space-x-1">
            <span className="w-5 h-5 rounded-full bg-[#526071] text-white text-[11px] font-bold flex items-center justify-center">
              {user.dailyStreak}
            </span>
            <ChevronRight className="w-4 h-4 text-neutral-400" />
          </div>
        </button>

        {/* Customer Service */}
        <button
          onClick={() => showToast('Connecting to 24/7 Live Agent in Accra...')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
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
          onClick={() => showToast('You have 2 unread promotions.')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Bell className="w-4 h-4 text-neutral-400" />
              <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-[#ff4d4f] rounded-full" />
            </div>
            <span className="text-xs font-semibold text-neutral-200">Notification Center</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        {/* How to play */}
        <button
          onClick={() => showToast('SportyBet Ghana Help & Betting Rules')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <HelpCircle className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">How to play</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>

        {/* Share an Idea */}
        <button
          onClick={() => showToast('Thank you for feedback on SportyBet Ghana!')}
          className="w-full px-4 py-3.5 flex items-center justify-between hover:bg-[#1d2634] transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Lightbulb className="w-4 h-4 text-neutral-400" />
            <span className="text-xs font-semibold text-neutral-200">Share an Idea</span>
          </div>
          <ChevronRight className="w-4 h-4 text-neutral-400" />
        </button>
      </div>

      {/* Ghana Gaming Commission License Footer */}
      <div className="p-5 text-center text-[10px] text-neutral-500 space-y-1">
        <p className="flex items-center justify-center space-x-1">
          <ShieldCheck className="w-3.5 h-3.5 text-[#00df59]" />
          <span>Licensed by the Gaming Commission of Ghana</span>
        </p>
        <p>18+ Play Responsibly. Betting is addictive and can be psychologically harmful.</p>
      </div>
    </div>
  );
};
