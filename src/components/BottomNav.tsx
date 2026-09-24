import React from 'react';
import { useBetting } from '../context/BettingContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openBets, user } = useBetting();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0e151e] border-t border-[#1c2633] max-w-md mx-auto flex items-center justify-around h-[52px] select-none shadow-2xl">
      {/* 1. Sports / Home - Soccer Ball Icon with No Text underneath & Bottom Red Active Bar */}
      <button
        onClick={() => setActiveTab('sports')}
        className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-white group"
        title="Sports"
      >
        <div className="relative flex items-center justify-center">
          {/* Exact Telstar Soccer Ball Icon from Screenshot 2 */}
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9.5" fill="#ffffff" stroke="#121922" strokeWidth="0.5" />
            {/* Center Pentagon */}
            <polygon points="12,8.5 15,10.7 13.8,14.2 10.2,14.2 9,10.7" fill="#0e151e" />
            {/* Seams */}
            <path
              d="M12 8.5V2.5 M15 10.7l6.2-2 M13.8 14.2l3.8 5.2 M10.2 14.2l-3.8 5.2 M9 10.7l-6.2-2"
              stroke="#0e151e"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            {/* Edge partial pentagons */}
            <path d="M9.5 2.8c1.5-.4 3.5-.4 5 0l-2.5 3z" fill="#0e151e" />
            <path d="M21 9c.4 1.5.4 3.5 0 5l-3-2z" fill="#0e151e" />
            <path d="M3 9c-.4 1.5-.4 3.5 0 5l3-2z" fill="#0e151e" />
          </svg>
        </div>

        {/* Note: Screenshot 2 has NO text under the soccer ball, just the active red bar */}
        {activeTab === 'sports' && (
          <span className="absolute bottom-0 w-8 h-[3px] bg-[#de1a22] rounded-t-sm" />
        )}
      </button>

      {/* 2. AZ Menu */}
      <button
        onClick={() => setActiveTab('az_menu')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
          activeTab === 'az_menu' ? 'text-white' : 'text-[#8e9cae] hover:text-white'
        }`}
      >
        <div className="flex items-center justify-center">
          {/* 3 Horizontal Bars Menu Icon */}
          <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'az_menu' ? 'font-bold text-white' : 'text-[#8e9cae]'}`}>
          AZ Menu
        </span>

        {activeTab === 'az_menu' && (
          <span className="absolute bottom-0 w-8 h-[3px] bg-[#de1a22] rounded-t-sm" />
        )}
      </button>

      {/* 3. Games - Purple Gamepad Controller */}
      <button
        onClick={() => setActiveTab('games')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
          activeTab === 'games' ? 'text-white' : 'text-[#8e9cae] hover:text-white'
        }`}
      >
        <div className="flex items-center justify-center">
          {/* Exact Purple Rounded Gamepad from Screenshot 2 */}
          <svg className="w-6 h-5" viewBox="0 0 28 20" fill="none">
            {/* Purple controller body */}
            <rect x="1" y="2" width="26" height="16" rx="8" fill="#8e44ad" />
            {/* White D-Pad */}
            <path d="M7 7h2v2h2v2H9v2H7v-2H5V9h2V7z" fill="#ffffff" />
            {/* 4 White Action Buttons */}
            <circle cx="21" cy="7.5" r="1.1" fill="#ffffff" />
            <circle cx="19" cy="9.5" r="1.1" fill="#ffffff" />
            <circle cx="23" cy="9.5" r="1.1" fill="#ffffff" />
            <circle cx="21" cy="11.5" r="1.1" fill="#ffffff" />
          </svg>
        </div>

        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'games' ? 'font-bold text-white' : 'text-[#8e9cae]'}`}>
          Games
        </span>

        {activeTab === 'games' && (
          <span className="absolute bottom-0 w-8 h-[3px] bg-[#de1a22] rounded-t-sm" />
        )}
      </button>

      {/* 4. Open Bets - Circular Arrows with $ */}
      <button
        onClick={() => setActiveTab('open_bets')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
          activeTab === 'open_bets' ? 'text-white' : 'text-[#8e9cae] hover:text-white'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* Exact Circular Arrows with Currency $ symbol */}
          <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="none">
            <path
              d="M19.5 10.5A7.8 7.8 0 0 0 6.2 6.2L4 8.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <polyline
              points="4 4 4 8.5 8.5 8.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.5 13.5A7.8 7.8 0 0 0 17.8 17.8L20 15.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
            />
            <polyline
              points="20 20 20 15.5 15.5 15.5"
              stroke="currentColor"
              strokeWidth="2.1"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <text
              x="12"
              y="15.2"
              textAnchor="middle"
              fontSize="10.5"
              fontWeight="900"
              fill="currentColor"
              fontFamily="system-ui, -apple-system, sans-serif"
            >
              $
            </text>
          </svg>

          {/* Badge count if open bets exist and user is logged in */}
          {user.isLoggedIn && openBets.length > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-white text-neutral-950 font-black text-[9px] w-3.5 h-3.5 rounded-full flex items-center justify-center shadow">
              {openBets.length}
            </span>
          )}
        </div>

        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'open_bets' ? 'font-bold text-white' : 'text-[#8e9cae]'}`}>
          Open Bets
        </span>

        {activeTab === 'open_bets' && (
          <span className="absolute bottom-0 w-8 h-[3px] bg-[#de1a22] rounded-t-sm" />
        )}
      </button>

      {/* 5. Me - User Silhouette with Red Notification Dot */}
      <button
        onClick={() => setActiveTab('me')}
        className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 transition-colors ${
          activeTab === 'me' ? 'text-white' : 'text-[#8e9cae] hover:text-white'
        }`}
      >
        <div className="relative flex items-center justify-center">
          {/* User bust silhouette */}
          <svg className="w-5 h-5 text-current" viewBox="0 0 24 24" fill="currentColor">
            <circle cx="12" cy="7.5" r="4" />
            <path d="M4 19.5c0-3.5 3.5-6 8-6s8 2.5 8 6v1H4v-1z" />
          </svg>
          {/* Solid Red notification dot at top right */}
          <span className="absolute -top-1 -right-1.5 w-2 h-2 bg-[#de1a22] rounded-full ring-2 ring-[#0e151e]" />
        </div>

        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'me' ? 'font-bold text-white' : 'text-[#8e9cae]'}`}>
          Me
        </span>

        {activeTab === 'me' && (
          <span className="absolute bottom-0 w-8 h-[3px] bg-[#de1a22] rounded-t-sm" />
        )}
      </button>
    </nav>
  );
};
