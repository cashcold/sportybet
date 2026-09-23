import React from 'react';
import { Menu, Gamepad2, User } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { ActiveTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, openBets } = useBetting();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string; dot?: boolean }[] = [
    {
      id: 'sports',
      label: 'Sports',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          <polygon points="12,7 15,10 14,14 10,14 9,10" fill="currentColor" />
          <path d="M12 2v5 M12 22v-5 M2 12h5 M22 12h-5 M4.93 4.93l3.54 3.54 M19.07 19.07l-3.54-3.54 M4.93 19.07l3.54-3.54 M19.07 4.93l-3.54 3.54" stroke="currentColor" strokeWidth="1.5" />
        </svg>
      )
    },
    {
      id: 'az_menu',
      label: 'AZ Menu',
      icon: <Menu className="w-5 h-5" />
    },
    {
      id: 'games',
      label: 'Games',
      icon: <Gamepad2 className="w-5 h-5" />
    },
    {
      id: 'open_bets',
      label: 'Open Bets',
      icon: (
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
          {/* Top-right curving clockwise arrow */}
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
          {/* Bottom-left curving clockwise arrow */}
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
          {/* Central currency $ symbol */}
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
      ),
      badge: openBets.length > 0 ? openBets.length : undefined
    },
    {
      id: 'me',
      label: 'Me',
      icon: <User className="w-5 h-5" />,
      dot: true
    }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#121922] border-t border-[#1f2835] max-w-md mx-auto flex items-center justify-around h-13 px-1 select-none">
      {navItems.map(item => {
        const isActive = activeTab === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 text-[11px] font-medium transition-colors ${
              isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <div className="relative flex items-center justify-center">
              {item.icon}

              {/* Exact white badge with black number for open bets */}
              {item.badge !== undefined && (
                <span className="absolute -top-1.5 -right-3 bg-white text-neutral-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {item.badge}
                </span>
              )}

              {/* Red dot for Me */}
              {item.dot && (
                <span className="absolute -top-0.5 -right-1 w-2 h-2 bg-[#de1a22] rounded-full ring-2 ring-[#121922]" />
              )}
            </div>

            <span className={`mt-0.5 text-[10px] ${isActive ? 'font-black text-white' : 'text-neutral-400'}`}>
              {item.label}
            </span>

            {/* Bottom red indicator bar on active tab (matching screenshot 1000038449.jpg) */}
            {isActive && (
              <span className="absolute bottom-0 left-3 right-3 h-[3px] bg-[#de1a22] rounded-t-sm" />
            )}
          </button>
        );
      })}
    </nav>
  );
};
