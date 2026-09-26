import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface LeagueRow {
  id: string;
  name: string;
  count: number;
}

export const PopularLeaguesList: React.FC = () => {
  const { setSelectedLeagueFilter, showToast, setActiveTab } = useBetting();
  const [expanded, setExpanded] = useState(false);

  const initialLeagues: LeagueRow[] = [
    { id: 'epl', name: 'England - Premier League', count: 20 },
    { id: 'ucl', name: 'International Clubs - UEFA Champions League', count: 18 },
    { id: 'efl', name: 'England - EFL Cup', count: 8 },
    { id: 'laliga', name: 'Spain - LaLiga', count: 20 },
    { id: 'bundesliga', name: 'Germany - Bundesliga', count: 18 },
    { id: 'dfb', name: 'Germany - DFB Pokal', count: 16 },
    { id: 'seriea', name: 'Italy - Serie A', count: 20 },
    { id: 'nations', name: 'International - UEFA Nations League', count: 42 },
    { id: 'afcon', name: 'International - Africa Cup of Nations Qualifiers', count: 2 },
    { id: 'ligue1', name: 'France - Ligue 1', count: 18 }
  ];

  const additionalLeagues: LeagueRow[] = [
    { id: 'eredivisie', name: 'Netherlands - Eredivisie', count: 14 },
    { id: 'portugal', name: 'Portugal - Primeira Liga', count: 12 },
    { id: 'turkey', name: 'Turkey - Super Lig', count: 16 },
    { id: 'belgium', name: 'Belgium - Pro League', count: 10 },
    { id: 'saudi', name: 'Saudi Arabia - Pro League', count: 9 }
  ];

  const displayLeagues = expanded ? [...initialLeagues, ...additionalLeagues] : initialLeagues;

  const handleSelectLeague = (league: LeagueRow) => {
    setSelectedLeagueFilter(league.name);
    showToast(`Viewing: ${league.name}`);
  };

  return (
    <div className="bg-[#141a22] border-t border-[#1e2733] select-none">
      <div className="divide-y divide-[#1e2733]">
        {displayLeagues.map((league) => (
          <div
            key={league.id}
            onClick={() => handleSelectLeague(league)}
            className="flex items-center justify-between px-3 py-3 hover:bg-[#19232e] cursor-pointer transition-colors"
          >
            <div className="flex items-center space-x-2.5 truncate max-w-[85%]">
              <span className="text-sm">⚽</span>
              <span className="text-xs font-semibold text-neutral-200 truncate">
                {league.name}
              </span>
            </div>

            <div className="flex items-center space-x-1 text-xs text-neutral-400 font-semibold shrink-0">
              <span>{league.count}</span>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
            </div>
          </div>
        ))}
      </div>

      <div className="p-3 bg-[#121922] text-right border-t border-[#1e2733]">
        <button
          onClick={() => {
            if (!expanded) {
              setExpanded(true);
            } else {
              setActiveTab('az_menu');
            }
          }}
          className="text-xs text-[#00df59] font-bold hover:underline inline-flex items-center space-x-0.5 cursor-pointer"
        >
          <span>{expanded ? 'Open All A-Z Leagues' : 'View More'}</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
