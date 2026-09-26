import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Search,
  Home,
  SlidersHorizontal,
  Calendar,
  Clock,
  RotateCcw,
  Check,
  BarChart2,
  X
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { Match } from '../types';
import { OddButton } from './OddButton';
import { MatchDetailsModal } from './MatchDetailsModal';
import { SportyBetSpinner } from './SportyBetSpinner';

interface AllLiveViewProps {
  onBack: () => void;
}

export const AllLiveView: React.FC<AllLiveViewProps> = ({ onBack }) => {
  const { matches, selectedSport, setSelectedSport, setActiveTab, showToast } = useBetting();

  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTabMode] = useState<'Matches' | 'Outrights'>('Matches');
  const [activeMarket, setActiveMarket] = useState('1X2');
  const [pageToggle, setPageToggle] = useState<'1' | '2'>('1');
  const [detailMatch, setDetailMatch] = useState<Match | null>(null);

  // Filter Dropdowns State
  const [openFilter, setOpenFilter] = useState<'none' | 'today' | 'league' | 'odds' | 'sort'>('none');
  const [selectedTimeRange, setSelectedTimeRange] = useState('Today(693)');
  const [selectedLeagueFilter, setSelectedLeagueFilter] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('Top Leagues');
  const [oddsMax, setOddsMax] = useState<number>(100);
  const [sortOption, setSortOption] = useState<'Time' | 'League' | 'Popularity'>('Time');

  const liveMatches = useMemo(() => {
    return matches.filter(m => m.isLive);
  }, [matches]);

  const marketTabs = ['1X2', 'O/U', 'DC', 'Handicap', 'Home O/U', 'Away O/U'];

  const timeOptions = [
    { label: 'All(1734)', value: 'All' },
    { label: 'Today(693)', value: 'Today(693)' },
    { label: 'Tomorrow(506)', value: 'Tomorrow' },
    { label: 'Monday(28)', value: 'Monday' },
    { label: 'Tuesday(27)', value: 'Tuesday' },
    { label: 'Wednesday(7)', value: 'Wednesday' },
    { label: 'Thursday(9)', value: 'Thursday' },
    { label: 'Friday(11)', value: 'Friday' },
    { label: 'Weekend(1199)', value: 'Weekend' },
  ];

  const leagueCategories = [
    { name: 'Top Leagues', count: 22 },
    { name: 'International', count: 21 },
    { name: 'England', count: 26 },
    { name: 'Spain', count: 23 },
    { name: 'Italy', count: 16 },
    { name: 'France', count: 8 },
    { name: 'Algeria', count: 11 },
    { name: 'Argentina', count: 21 },
    { name: 'Austria', count: 24 },
    { name: 'Belarus', count: 3 },
    { name: 'Belgium', count: 6 },
    { name: 'Bolivia', count: 1 },
  ];

  const leagueSubItems: Record<string, { name: string; count: number }[]> = {
    'Top Leagues': [
      { name: 'All', count: 22 },
      { name: 'Africa Cup of Nations Qualifiers', count: 2 },
      { name: 'UEFA Nations League', count: 10 },
      { name: 'Int. Friendly Games', count: 2 },
      { name: 'MLS', count: 5 },
      { name: 'Liga MX', count: 2 },
      { name: 'U20 FIFA World Cup', count: 1 },
    ],
    'International': [
      { name: 'All', count: 21 },
      { name: 'UEFA Nations League', count: 10 },
      { name: 'Africa Cup of Nations', count: 2 },
      { name: 'CONCACAF Nations League', count: 9 },
    ],
    'England': [
      { name: 'All', count: 26 },
      { name: 'Premier League', count: 10 },
      { name: 'Championship', count: 12 },
      { name: 'EFL Cup', count: 4 },
    ],
  };

  const handleApplyFilter = (msg: string) => {
    setOpenFilter('none');
    showToast(msg);
  };

  return (
    <div className="min-h-screen bg-[#141a22] text-white pb-20 select-none">
      {/* 1. TOP RED HEADER (00:34 in video) */}
      <header className="sticky top-0 z-50 bg-[#de1a22] text-white px-3 py-2 flex items-center justify-between shadow-md h-12">
        <div className="flex items-center space-x-2">
          <button
            onClick={onBack}
            className="p-1 hover:bg-white/10 rounded-full transition-colors active:scale-95"
            title="Go back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>

          {/* Sport Selector Dropdown */}
          <div className="relative">
            <button
              onClick={() => showToast('Sport: Football')}
              className="flex items-center space-x-1 font-black text-sm bg-transparent hover:bg-white/10 px-2 py-1 rounded transition-colors"
            >
              <span>Football</span>
              <ChevronDown className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => showToast('Search live matches')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            title="Search"
          >
            <Search className="w-5 h-5 stroke-[2.5]" />
          </button>
          <button
            onClick={() => setActiveTab('sports')}
            className="p-1 hover:bg-white/10 rounded-full transition-colors"
            title="Home"
          >
            <Home className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>
      </header>

      {/* 2. SUB-BAR: ALL LIVE COUNT + RIGHT CHEVRON (00:35 in video) */}
      <div className="bg-[#1b2532] px-3 py-2 flex items-center justify-between border-b border-[#232e3d]">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-bold text-white tracking-wide">All Live</span>
          <span className="text-sm font-bold text-[#00df59]">{liveMatches.length || 271}</span>
          <ChevronDown className="w-4 h-4 text-neutral-400 rotate-[-90deg]" />
        </div>
      </div>

      {/* 3. TABS: MATCHES | OUTRIGHTS (00:35 in video) */}
      <div className="flex items-center border-b border-[#212b38] bg-[#161f2c] px-3 text-xs font-bold">
        <button
          onClick={() => setActiveTabMode('Matches')}
          className={`py-2.5 px-4 relative transition-colors ${
            activeTab === 'Matches' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Matches</span>
          {activeTab === 'Matches' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59]" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTabMode('Outrights');
            showToast('Outrights: Tournament Winner Markets');
          }}
          className={`py-2.5 px-4 relative transition-colors ${
            activeTab === 'Outrights' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <span>Outrights</span>
          {activeTab === 'Outrights' && (
            <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59]" />
          )}
        </button>
      </div>

      {/* 4. FILTER BUTTONS ROW: Today v | League v | Odds v | Sort v (00:37 in video) */}
      <div className="grid grid-cols-4 bg-[#18222d] border-b border-[#232e3d] text-xs font-semibold text-neutral-300">
        <button
          onClick={() => setOpenFilter(openFilter === 'today' ? 'none' : 'today')}
          className={`py-2.5 px-1 flex items-center justify-center space-x-1 border-r border-[#232e3d] transition-colors ${
            openFilter === 'today' ? 'text-[#00df59] bg-[#141b24]' : 'hover:text-white'
          }`}
        >
          <span className="truncate">Today</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFilter === 'today' ? 'rotate-180 text-[#00df59]' : ''}`} />
        </button>

        <button
          onClick={() => setOpenFilter(openFilter === 'league' ? 'none' : 'league')}
          className={`py-2.5 px-1 flex items-center justify-center space-x-1 border-r border-[#232e3d] transition-colors ${
            openFilter === 'league' ? 'text-[#00df59] bg-[#141b24]' : 'hover:text-white'
          }`}
        >
          <span className="truncate">League</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFilter === 'league' ? 'rotate-180 text-[#00df59]' : ''}`} />
        </button>

        <button
          onClick={() => setOpenFilter(openFilter === 'odds' ? 'none' : 'odds')}
          className={`py-2.5 px-1 flex items-center justify-center space-x-1 border-r border-[#232e3d] transition-colors ${
            openFilter === 'odds' ? 'text-[#00df59] bg-[#141b24]' : 'hover:text-white'
          }`}
        >
          <span className="truncate">Odds</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFilter === 'odds' ? 'rotate-180 text-[#00df59]' : ''}`} />
        </button>

        <button
          onClick={() => setOpenFilter(openFilter === 'sort' ? 'none' : 'sort')}
          className={`py-2.5 px-1 flex items-center justify-center space-x-1 transition-colors ${
            openFilter === 'sort' ? 'text-[#00df59] bg-[#141b24]' : 'hover:text-white'
          }`}
        >
          <span className="truncate">Sort</span>
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openFilter === 'sort' ? 'rotate-180 text-[#00df59]' : ''}`} />
        </button>
      </div>

      {/* ================================================================= */}
      {/* FILTER DRAWER 1: TODAY / TIME FILTER (00:39 - 00:43 in video)      */}
      {/* ================================================================= */}
      {openFilter === 'today' && (
        <div className="bg-[#121922] border-b border-[#253243] p-3 text-xs animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {timeOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setSelectedTimeRange(opt.label)}
                className={`py-2 px-3 rounded text-left font-semibold transition-all ${
                  selectedTimeRange === opt.label
                    ? 'bg-[#1e2a38] text-[#00df59] border border-[#00df59]/40'
                    : 'bg-[#18212c] text-neutral-300 hover:bg-[#1e2a38] border border-transparent'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <div className="flex items-center justify-between border-t border-[#212b38] pt-2 mb-2 text-neutral-400">
            <span className="flex items-center gap-1 font-semibold">
              <Calendar className="w-3.5 h-3.5" />
              <span>Custom date(0)</span>
            </span>
            <span className="flex items-center gap-1 font-semibold">
              <Clock className="w-3.5 h-3.5" />
              <span>Custom time(0)</span>
            </span>
          </div>

          {/* Time range slider (0h 1h 6h 12h 1d 1w) */}
          <div className="py-2">
            <div className="flex justify-between text-[10px] text-neutral-400 font-bold mb-1">
              <span>0h</span>
              <span>1h</span>
              <span>6h</span>
              <span>12h</span>
              <span>1d</span>
              <span>1w</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              defaultValue="1"
              className="w-full accent-[#00df59] h-1.5 bg-[#253243] rounded-lg cursor-pointer"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#212b38]">
            <button
              onClick={() => setSelectedTimeRange('All')}
              className="text-neutral-400 hover:text-white font-bold"
            >
              Clear all
            </button>
            <button
              onClick={() => handleApplyFilter(`Time Filter Applied: ${selectedTimeRange}`)}
              className="bg-[#00df59] hover:bg-[#00c54e] text-black font-black px-5 py-1.5 rounded transition-colors active:scale-95"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* FILTER DRAWER 2: LEAGUE SELECTOR (00:44 - 00:46 in video)         */}
      {/* Two columns: Category on left, sub-leagues with checkboxes on right*/}
      {/* ================================================================= */}
      {openFilter === 'league' && (
        <div className="bg-[#121922] border-b border-[#253243] text-xs animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="grid grid-cols-2 h-64 overflow-hidden border-b border-[#253243]">
            {/* Left Column: Categories */}
            <div className="overflow-y-auto no-scrollbar border-r border-[#212b38] bg-[#161f2c]">
              {leagueCategories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`w-full py-2.5 px-3 flex items-center justify-between font-semibold transition-colors text-left ${
                    selectedCategory === cat.name
                      ? 'bg-[#1b2532] text-[#00df59] font-bold border-l-2 border-[#00df59]'
                      : 'text-neutral-300 hover:bg-[#1a2330]'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[11px] text-neutral-400">{cat.count}</span>
                </button>
              ))}
            </div>

            {/* Right Column: Checkboxes */}
            <div className="overflow-y-auto no-scrollbar p-2 bg-[#121922]">
              {(leagueSubItems[selectedCategory] || [
                { name: 'All', count: 12 },
                { name: 'Division 1', count: 8 },
                { name: 'Cup', count: 4 },
              ]).map((sub) => (
                <label
                  key={sub.name}
                  className="flex items-center justify-between py-2 px-1 hover:bg-[#18222e] rounded cursor-pointer transition-colors"
                >
                  <span className="text-neutral-200 truncate pr-2 font-medium">{sub.name}</span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <span className="text-neutral-500 text-[11px]">{sub.count}</span>
                    <input
                      type="checkbox"
                      defaultChecked={sub.name === 'All'}
                      className="accent-[#00df59] w-4 h-4 rounded cursor-pointer"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Footer with Reset and View buttons (00:45 in video) */}
          <div className="p-2.5 flex items-center justify-between bg-[#161f2c]">
            <button
              onClick={() => {
                setSelectedLeagueFilter('All');
                showToast('League filter reset');
              }}
              className="border border-neutral-600 px-4 py-1.5 rounded font-bold text-neutral-300 hover:text-white"
            >
              Reset
            </button>
            <button
              onClick={() => handleApplyFilter(`Viewing leagues in ${selectedCategory}`)}
              className="bg-[#00df59] hover:bg-[#00c54e] text-black font-black px-6 py-1.5 rounded transition-colors active:scale-95"
            >
              View
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* FILTER DRAWER 3: ODDS RANGE (00:46 in video)                      */}
      {/* ================================================================= */}
      {openFilter === 'odds' && (
        <div className="bg-[#121922] border-b border-[#253243] p-4 text-xs animate-in slide-in-from-top-2 duration-150 shadow-xl">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-neutral-300">Custom</span>
            <span className="text-[#00df59] font-bold">1 - {oddsMax >= 100 ? 'Max' : oddsMax.toFixed(2)}</span>
          </div>
          <input
            type="range"
            min="1.1"
            max="100"
            value={oddsMax}
            onChange={(e) => setOddsMax(Number(e.target.value))}
            className="w-full accent-[#00df59] h-2 bg-[#253243] rounded-lg cursor-pointer mb-4"
          />
          <div className="flex justify-end">
            <button
              onClick={() => handleApplyFilter(`Odds filter: 1 - ${oddsMax >= 100 ? 'Max' : oddsMax.toFixed(2)}`)}
              className="bg-[#00df59] text-black font-black px-5 py-1.5 rounded"
            >
              Apply
            </button>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* FILTER DRAWER 4: SORT OPTIONS                                     */}
      {/* ================================================================= */}
      {openFilter === 'sort' && (
        <div className="bg-[#121922] border-b border-[#253243] p-3 text-xs animate-in slide-in-from-top-2 duration-150 shadow-xl space-y-1">
          {(['Time', 'League', 'Popularity'] as const).map((opt) => (
            <button
              key={opt}
              onClick={() => {
                setSortOption(opt);
                handleApplyFilter(`Sorted by ${opt}`);
              }}
              className={`w-full py-2 px-3 flex items-center justify-between rounded font-semibold text-left ${
                sortOption === opt ? 'bg-[#1b2532] text-[#00df59]' : 'text-neutral-300 hover:bg-[#18212c]'
              }`}
            >
              <span>Sort by {opt}</span>
              {sortOption === opt && <Check className="w-4 h-4 text-[#00df59]" />}
            </button>
          ))}
        </div>
      )}

      {/* 5. SECONDARY MARKET SWITCHER: 1X2 | O/U | DC | Handicap... (00:36 in video) */}
      <div className="flex items-center justify-between px-3 pt-2.5 pb-1 border-b border-[#1b232e] bg-[#141a22]">
        <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar text-xs">
          {marketTabs.map((m) => {
            const isActive = activeMarket === m;
            return (
              <button
                key={m}
                onClick={() => setActiveMarket(m)}
                className={`relative shrink-0 pb-1.5 font-bold transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {m}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* 1 • 2 Toggle pill */}
        <div className="flex items-center bg-[#25303f] rounded-full p-0.5 shrink-0 ml-2 border border-neutral-700/60 text-[10px] font-bold">
          <button
            onClick={() => setPageToggle('1')}
            className={`px-1.5 py-0.5 rounded-full transition-colors ${
              pageToggle === '1' ? 'bg-[#79889b] text-black font-black' : 'text-neutral-300'
            }`}
          >
            1UP
          </button>
          <span className="px-0.5 text-neutral-500">•</span>
          <button
            onClick={() => setPageToggle('2')}
            className={`px-1.5 py-0.5 rounded-full transition-colors ${
              pageToggle === '2' ? 'bg-[#79889b] text-black font-black' : 'text-neutral-300'
            }`}
          >
            2UP
          </button>
        </div>
      </div>

      {/* 6. ODDS HEADER: Match | 1   X   2 (00:37 in video) */}
      <div className="flex items-center justify-between px-3 py-1 bg-[#1a222c]/60 text-[11px] text-neutral-400 font-semibold border-b border-[#212b38]">
        <div className="w-1/2">Match</div>
        <div className="w-1/2 flex items-center justify-around pr-1 text-center font-bold">
          <span className="w-1/3">1</span>
          <span className="w-1/3">X</span>
          <span className="w-1/3">2</span>
        </div>
      </div>

      {/* 7. LIVE MATCHES LIST */}
      <div className="divide-y divide-[#1e2632]">
        {liveMatches.map((match) => {
          const currentOdds = match.markets[activeMarket] || match.markets['1X2'] || [];

          return (
            <div key={match.id} className="p-3 hover:bg-[#18212b] transition-colors">
              {/* Meta row */}
              <div className="flex items-center justify-between text-[11px] mb-1.5">
                <div className="flex items-center space-x-1.5 truncate max-w-[85%]">
                  {match.isHot && (
                    <span className="text-amber-400 italic font-black text-[11px] shrink-0">
                      HOT🔥
                    </span>
                  )}
                  <span className="text-[#00df59] font-bold shrink-0">
                    {match.minute || "45' 1H"}
                  </span>
                  <span className="text-neutral-400 truncate">
                    {match.countryOrCategory} - {match.league}
                  </span>
                </div>
                <BarChart2
                  onClick={() => setDetailMatch(match)}
                  className="w-3.5 h-3.5 text-neutral-400 hover:text-white shrink-0 cursor-pointer"
                />
              </div>

              {/* Match Score & Odds */}
              <div className="flex items-center justify-between">
                <div
                  className="w-1/2 pr-2 cursor-pointer"
                  onClick={() => setDetailMatch(match)}
                >
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-100">
                    <span className="truncate pr-1">{match.homeTeam}</span>
                    <span className="font-bold text-white shrink-0 ml-1">{match.homeScore ?? 0}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs font-semibold text-neutral-100 mt-0.5">
                    <span className="truncate pr-1">{match.awayTeam}</span>
                    <span className="font-bold text-white shrink-0 ml-1">{match.awayScore ?? 0}</span>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDetailMatch(match);
                    }}
                    className="text-[11px] text-neutral-400 hover:text-white mt-1 flex items-center font-medium"
                  >
                    +{match.marketsCount || 48}&gt;
                  </button>
                </div>

                {/* 3 Odds Buttons */}
                <div className="w-1/2 flex items-center space-x-1.5">
                  {currentOdds.slice(0, 3).map((odd) => (
                    <OddButton
                      key={odd.id}
                      match={match}
                      marketName={activeMarket}
                      odd={odd}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <MatchDetailsModal
        match={detailMatch}
        onClose={() => setDetailMatch(null)}
      />
    </div>
  );
};
