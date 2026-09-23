import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { AuthModal } from './AuthModal';

export const Header: React.FC = () => {
  const { user, setIsSearchOpen, setActiveTab } = useBetting();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'join'>('login');

  const openAuth = (mode: 'login' | 'join') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#de1a22] text-white px-3 py-2 flex items-center justify-between shadow-md select-none h-12">
        {/* SportyBet Brand Logo */}
        <div 
          className="flex items-center space-x-1 cursor-pointer"
          onClick={() => setActiveTab('sports')}
        >
          <span className="text-[23px] font-black italic tracking-tight font-sans">
            Sporty<span className="font-extrabold text-[#ffffff]">Bet</span>
          </span>
        </div>

        {/* Right controls */}
        <div className="flex items-center space-x-2">
          {/* Search button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="p-1 text-white/95 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            aria-label="Search games"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>

          {user.isLoggedIn ? (
            /* Logged-in State (Screenshot 1: Yellow Arrow Pointing Here) */
            <div className="flex items-center space-x-1.5">
              {/* Deposit Button: White rectangle with red text */}
              <button
                onClick={() => setActiveTab('deposit')}
                className="bg-white text-[#de1a22] hover:bg-neutral-100 font-bold text-xs px-2.5 py-1.5 rounded-[4px] shadow-sm transition-all active:scale-95 flex items-center justify-center tracking-tight h-[30px]"
              >
                Deposit
              </button>

              {/* User Avatar + Balance Box with solid white border and matching rounded-[4px] shape */}
              <button
                onClick={() => setActiveTab('me')}
                className="flex items-center bg-transparent hover:bg-white/10 px-2 py-1 rounded-[4px] cursor-pointer border border-white text-xs transition-all active:scale-95 h-[30px]"
                title="View Profile / Account"
              >
                <div className="w-5 h-5 rounded-full overflow-hidden mr-1.5 shrink-0 bg-neutral-800">
                  <img
                    src={user.avatarUrl || '/user_beach_avatar.jpg'}
                    alt="User"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image load fails
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                </div>
                <span className="font-bold text-xs text-white tracking-tight whitespace-nowrap">
                  {user.currency} {user.balance.toFixed(2)}
                </span>
              </button>
            </div>
          ) : (
            /* Logged-out State (Screenshot 5: Yellow Arrow Pointing Here) */
            <div className="flex items-center space-x-1.5">
              {/* Join Now Button */}
              <button
                onClick={() => openAuth('join')}
                className="bg-white text-[#de1a22] hover:bg-neutral-100 font-black text-xs px-2.5 py-1.5 rounded-[4px] shadow-sm transition-all active:scale-95"
              >
                Join Now
              </button>

              {/* Log in Button */}
              <button
                onClick={() => openAuth('login')}
                className="bg-[#de1a22] text-white hover:bg-red-700 font-bold text-xs px-2.5 py-1.5 rounded-[4px] border border-white/50 transition-all active:scale-95"
              >
                Log in
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Auth Modal for Log In / Join Now */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
      />
    </>
  );
};
