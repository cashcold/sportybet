import React, { useState } from 'react';
import { Search, Trophy, Flame, Star, Flag, Gift, Calendar, ChevronRight } from 'lucide-react';
import { SPORTS_LIST, LEAGUES_LIST } from '../data/mockData';
import { useBetting } from '../context/BettingContext';

export const AZMenuView: React.FC = () => {
  const { setSelectedSport, setSelectedLeagueFilter, setActiveTab, showToast } = useBetting();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSportItem, setSelectedSportItem] = useState('popular');
  const [azSubTab, setAzSubTab] = useState<'sports' | 'live' | 'promotions' | 'fixtures'>('sports');

  const quickIcons = [
    { id: 'virtuals', label: 'Virtuals', icon: <span className="font-black italic text-lg">V</span>, color: 'text-white' },
    { id: 'jackpot', label: 'Jackpot', icon: <Trophy className="w-5 h-5 text-amber-300" />, color: 'text-amber-300' },
    { id: 'sportypicks', label: 'SportyPicks', icon: <Flame className="w-5 h-5 text-yellow-300" />, color: 'text-yellow-300' },
    { id: 'livescore', label: 'Livescore', icon: <Star className="w-5 h-5 text-sky-200" />, color: 'text-sky-200' },
    { id: 'results', label: 'Results', icon: <Flag className="w-5 h-5 text-emerald-300" />, color: 'text-emerald-300' }
  ];

  const handleLeagueClick = (leagueName: string) => {
    setSelectedLeagueFilter(leagueName);
    setActiveTab('sports');
    showToast(`Filtered by ${leagueName}`);
  };

  const filteredLeagues = LEAGUES_LIST.filter(l => {
    if (searchQuery.trim()) {
      return l.name.toLowerCase().includes(searchQuery.toLowerCase());
    }
    if (selectedSportItem === 'popular') return true;
    if (selectedSportItem === 'football') return l.sport === 'football';
    if (selectedSportItem === 'basketball') return l.sport === 'basketball';
    if (selectedSportItem === 'tennis') return l.sport === 'tennis';
    return true;
  });

  return (
    <div className="pb-20 bg-[#121922] text-white min-h-screen">
      {/* Top Search Bar & Red Banner (Screenshot 5) */}
      <div className="bg-[#de1a22] p-3 text-white">
        {/* Search input container */}
        <div className="relative flex items-center bg-white rounded-[4px] overflow-hidden shadow-sm">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Teams/Players, League, Game ID"
            className="w-full px-3 py-2 text-xs text-neutral-800 focus:outline-none placeholder-neutral-400 font-medium"
          />
          <button 
            onClick={() => {
              if (searchQuery.trim()) {
                showToast(`Searching for "${searchQuery}"...`);
              }
            }}
            className="px-3 py-2 text-[#de1a22] hover:bg-neutral-100 flex items-center justify-center"
          >
            <Search className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>

        {/* Quick Icons Row (Virtuals, Jackpot, SportyPicks, Livescore, Results) */}
        <div className="grid grid-cols-5 gap-1 mt-3 text-center">
          {quickIcons.map(item => (
            <button
              key={item.id}
              onClick={() => showToast(`Opening ${item.label}...`)}
              className="flex flex-col items-center justify-center p-1 hover:bg-white/10 rounded transition-colors"
            >
              <div className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center mb-1">
                {item.icon}
              </div>
              <span className="text-[11px] font-medium text-white/95 truncate w-full">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Subtabs: Sports | Live (201) | Promotions (13) | Fixtures */}
      <div className="flex items-center px-2 border-b border-[#222c3a] bg-[#151d27] text-xs font-bold">
        {[
          { id: 'sports', label: 'Sports' },
          { id: 'live', label: 'Live (201)' },
          { id: 'promotions', label: 'Promotions (13)' },
          { id: 'fixtures', label: 'Fixtures' }
        ].map(tab => {
          const isActive = azSubTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setAzSubTab(tab.id as any);
                if (tab.id === 'live') {
                  setActiveTab('sports');
                }
              }}
              className={`relative px-4 py-3 transition-colors ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-[#00df59] rounded-full" />
              )}
            </button>
          );
        })}
      </div>

      {/* Two-Column Layout */}
      <div className="flex h-[calc(100vh-190px)] overflow-hidden">
        {/* Left Column: Sports List */}
        <div className="w-[38%] bg-[#141b24] border-r border-[#222c3a] overflow-y-auto no-scrollbar">
          {SPORTS_LIST.map(sport => {
            const isSelected = selectedSportItem === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => setSelectedSportItem(sport.id)}
                className={`w-full text-left px-3.5 py-3 text-xs font-semibold flex items-center justify-between border-b border-[#1b232e] transition-colors ${
                  isSelected
                    ? 'text-[#00df59] bg-[#1a232f] font-bold border-l-2 border-l-[#00df59]'
                    : 'text-neutral-300 hover:bg-[#18202b]'
                }`}
              >
                <span className="truncate">{sport.name}</span>
              </button>
            );
          })}
        </div>

        {/* Right Column: Leagues & Categories List */}
        <div className="w-[62%] bg-[#18212c] overflow-y-auto no-scrollbar divide-y divide-[#202936]">
          {filteredLeagues.length === 0 ? (
            <div className="p-4 text-center text-neutral-400 text-xs">
              No categories found
            </div>
          ) : (
            filteredLeagues.map(league => (
              <button
                key={league.id}
                onClick={() => handleLeagueClick(league.name)}
                className="w-full text-left px-4 py-3.5 text-xs text-neutral-200 hover:text-white hover:bg-[#202936] font-medium flex items-center justify-between transition-colors group"
              >
                <span className="truncate pr-2">{league.name}</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-neutral-300 shrink-0" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
