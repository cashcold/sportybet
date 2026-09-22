import React from 'react';
import { Search, Eye, EyeOff } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export const Header: React.FC = () => {
  const { user, setIsDepositModalOpen, setIsSearchOpen, setActiveTab } = useBetting();
  const [hideBalance, setHideBalance] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-[#de1a22] text-white px-3 py-2.5 flex items-center justify-between shadow-md select-none">
      {/* SportyBet Brand Logo */}
      <div 
        className="flex items-center space-x-1 cursor-pointer"
        onClick={() => setActiveTab('sports')}
      >
        <span className="text-[22px] font-black italic tracking-tight font-sans">
          Sporty<span className="font-extrabold text-[#ffffff]">Bet</span>
        </span>
      </div>

      {/* Right controls: Search, Deposit, Balance / Profile */}
      <div className="flex items-center space-x-2">
        {/* Search button */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="p-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Search games"
        >
          <Search className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Deposit Button (matching screenshot: White background with red text) */}
        <button
          onClick={() => setActiveTab('deposit')}
          className="bg-white text-[#de1a22] hover:bg-neutral-100 font-bold text-xs px-3 py-1.5 rounded-[4px] shadow-sm transition-all active:scale-95 flex items-center justify-center font-sans tracking-wide"
        >
          Deposit
        </button>

        {/* User Balance pill */}
        <div
          onClick={() => setActiveTab('me')}
          className="flex items-center bg-[#8f0e13]/80 hover:bg-[#8f0e13] px-2 py-1 rounded-[14px] cursor-pointer border border-white/15 text-xs transition-colors"
        >
          <div className="w-4 h-4 rounded-full bg-amber-200 overflow-hidden mr-1.5 shrink-0 flex items-center justify-center text-[10px] text-amber-900 font-bold">
            👤
          </div>
          <span className="font-semibold text-[11px] text-white">
            {user.currency}{' '}
            {hideBalance ? '****' : user.balance.toFixed(2)}
          </span>
        </div>
      </div>
    </header>
  );
};
