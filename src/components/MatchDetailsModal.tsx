import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  Search,
  Home,
  Star,
  ChevronDown,
  ChevronUp,
  Info,
  BarChart2,
  MessageSquare,
  ChevronsUpDown,
  Ticket,
  X
} from 'lucide-react';
import { Match, OddItem } from '../types';
import { useBetting } from '../context/BettingContext';
import { generateAllMatchMarkets, MarketItem } from '../data/matchMarketsData';

interface MatchDetailsModalProps {
  match: Match | null;
  onClose: () => void;
}

type CategoryType = 'All' | 'Main' | 'Goals' | 'Half' | 'Combos' | 'Minutes' | 'Players';

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ match, onClose }) => {
  const { toggleSelection, betslip, setActiveTab, showToast, setIsBetslipOpen } = useBetting();
  const [topTab, setTopTab] = useState<'BB' | 'Markets' | 'Stats' | 'Codes' | 'Chat'>('Markets');
  const [category, setCategory] = useState<CategoryType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [favoriteMarkets, setFavoriteMarkets] = useState<string[]>([]);
  const [collapsedMarkets, setCollapsedMarkets] = useState<Record<string, boolean>>({});

  const allMarkets = useMemo(() => {
    if (!match) return [];
    return generateAllMatchMarkets(match);
  }, [match]);

  if (!match) return null;

  const toggleFavorite = (marketId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteMarkets(prev =>
      prev.includes(marketId) ? prev.filter(m => m !== marketId) : [...prev, marketId]
    );
  };

  const toggleCollapse = (marketId: string) => {
    setCollapsedMarkets(prev => ({
      ...prev,
      [marketId]: !prev[marketId]
    }));
  };

  const toggleAllCollapse = () => {
    const areSomeExpanded = allMarkets.some(m => !collapsedMarkets[m.id]);
    const newState: Record<string, boolean> = {};
    allMarkets.forEach(m => {
      newState[m.id] = areSomeExpanded;
    });
    setCollapsedMarkets(newState);
  };

  const isSelected = (marketName: string, selName: string) => {
    return betslip.some(
      s => s.matchId === match.id && s.marketName === marketName && s.selectionName === selName
    );
  };

  const handleSelect = (marketName: string, odd: OddItem) => {
    toggleSelection(match, marketName, odd);
  };

  // Flag Emoji helper
  const getFlagEmoji = (countryOrTeam: string) => {
    const c = countryOrTeam.toLowerCase();
    if (c.includes('brazil') || c.includes('serie b')) return '🇧🇷';
    if (c.includes('scotland')) return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
    if (c.includes('spain') || c.includes('madrid') || c.includes('barcelona')) return '🇪🇸';
    if (c.includes('italy') || c.includes('milan') || c.includes('juve')) return '🇮🇹';
    if (c.includes('germany') || c.includes('bayern') || c.includes('dortmund')) return '🇩🇪';
    if (c.includes('france') || c.includes('psg')) return '🇫🇷';
    if (c.includes('ghana') || c.includes('accra') || c.includes('kotoko')) return '🇬🇭';
    if (c.includes('england') || c.includes('arsenal') || c.includes('leeds') || c.includes('liverpool') || c.includes('chelsea') || c.includes('manchester')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    return '⚽';
  };

  // Filter markets by category, search query, and favorites
  const filteredMarkets = allMarkets.filter(market => {
    if (onlyFavorites && !favoriteMarkets.includes(market.id)) {
      return false;
    }

    if (category !== 'All' && market.category !== category) {
      return false;
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = market.name.toLowerCase().includes(q);
      const matchOdds =
        market.odds?.some(o => o.name.toLowerCase().includes(q)) ||
        market.lines?.some(l => l.line.toLowerCase().includes(q)) ||
        market.handicaps?.some(h => h.line.toLowerCase().includes(q)) ||
        market.asianHandicaps?.some(ah => ah.hLine.toLowerCase().includes(q) || ah.aLine.toLowerCase().includes(q));

      if (!matchName && !matchOdds) return false;
    }

    return true;
  });

  // Calculate total odds in betslip
  const totalBetslipOdds = betslip.reduce((acc, curr) => acc * curr.odd, 1.0);

  return (
    <div className="fixed inset-0 z-50 bg-[#121922] text-white flex flex-col overflow-hidden select-none animate-in fade-in duration-150 font-sans">
      {/* ========================================================= */}
      {/* 1. RED TOP NAVIGATION BAR */}
      {/* ========================================================= */}
      <div className="sticky top-0 z-40 bg-[#de1a22] text-white px-3 py-2.5 flex items-center justify-between shadow-md h-12">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Back"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-bold tracking-tight truncate">
              {match.homeTeam} vs {match.awayTeam}
            </span>
            <span className="text-[10px] text-white/80 -mt-0.5 truncate">
              {allMarkets.length}+ Markets Available
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className={`p-1.5 rounded-full transition-colors cursor-pointer ${
              showSearch ? 'bg-black/25 text-white' : 'text-white hover:bg-white/10'
            }`}
            title="Search markets"
          >
            <Search className="w-4 h-4 stroke-[2.2]" />
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveTab('sports');
            }}
            className="p-1.5 text-white hover:bg-white/10 rounded-full transition-colors cursor-pointer"
            title="Go to Home"
          >
            <Home className="w-4 h-4 fill-white stroke-none" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 2. SEARCH INPUT BAR (Expandable) */}
      {/* ========================================================= */}
      {showSearch && (
        <div className="bg-[#19222d] p-2 border-b border-[#253243] flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search option (e.g. 1X2, Over/Under, Handicap, Clean Sheet)..."
              className="w-full bg-[#121922] border border-[#2e3b4d] rounded pl-8 pr-8 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00df59]"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-neutral-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <button
            onClick={() => setShowSearch(false)}
            className="text-xs text-neutral-400 hover:text-white px-2 py-1"
          >
            Cancel
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MAIN SCROLLABLE CONTENT */}
      {/* ========================================================= */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Match Scoreboard Banner */}
        <div className="bg-[#18212c] px-4 pt-3 pb-3 border-b border-[#222e3d] relative">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold text-[#00df59] truncate max-w-[70%]">
              Football • {match.countryOrCategory} • {match.league}
            </span>
            <div className="flex items-center space-x-1">
              <span className="text-[10px] bg-[#222f3f] text-neutral-300 font-bold px-1.5 py-0.5 rounded border border-white/5">
                Game ID: {match.gameId}
              </span>
            </div>
          </div>

          {/* Teams Row with circular crests and timing */}
          <div className="grid grid-cols-3 items-center text-center my-1.5">
            {/* Home Team */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-[#202936] border border-white/20 flex items-center justify-center text-xl shadow mb-1">
                {getFlagEmoji(match.homeTeam)}
              </div>
              <span className="font-bold text-xs text-white leading-tight">
                {match.homeTeam}
              </span>
            </div>

            {/* Center Status / Scores */}
            <div className="flex flex-col items-center">
              {match.isLive ? (
                <>
                  <div className="text-xl font-black text-white tracking-wider">
                    {match.homeScore ?? 0} - {match.awayScore ?? 0}
                  </div>
                  <div className="inline-flex items-center space-x-1 mt-1 bg-[#00a826] text-white text-[10px] font-bold px-2 py-0.5 rounded">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    <span>Live {match.minute || "76'"}</span>
                  </div>
                </>
              ) : (
                (() => {
                  const matchDateObj = match.commenceTime
                    ? new Date(match.commenceTime)
                    : (match.date ? new Date(match.date) : null);

                  let dateLabel = match.dateLabel || 'Today';
                  let timeLabel = match.startTime || '18:00';

                  if (matchDateObj && !isNaN(matchDateObj.getTime())) {
                    const isToday = matchDateObj.toDateString() === new Date().toDateString();
                    const tomorrow = new Date(Date.now() + 86400000);
                    const isTomorrow = matchDateObj.toDateString() === tomorrow.toDateString();
                    const weekday = matchDateObj.toLocaleDateString('en-GB', { weekday: 'short' });
                    const dayMonth = matchDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });

                    dateLabel = isToday ? `Today ${dayMonth}` : isTomorrow ? `Tomorrow ${dayMonth}` : `${weekday} ${dayMonth}`;
                    timeLabel = matchDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }

                  return (
                    <>
                      <div className="text-[11px] text-neutral-400 font-medium">
                        {dateLabel}
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        {timeLabel}
                      </div>
                      <span className="text-[9px] text-emerald-400 font-bold mt-1 bg-emerald-500/10 px-1.5 py-0.2 rounded border border-emerald-500/20">
                        Pre-Match Live Odds
                      </span>
                    </>
                  );
                })()
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center">
              <div className="w-11 h-11 rounded-full bg-[#202936] border border-white/20 flex items-center justify-center text-xl shadow mb-1">
                {getFlagEmoji(match.awayTeam)}
              </div>
              <span className="font-bold text-xs text-white leading-tight">
                {match.awayTeam}
              </span>
            </div>
          </div>
        </div>

        {/* Sub-tabs Bar ([BB] | Markets | Stats | Codes [New] | Chat) */}
        <div className="flex items-center bg-[#151c25] border-b border-[#222e3d] text-xs font-bold px-2">
          <button
            onClick={() => setTopTab('BB')}
            className={`py-2 px-3 flex items-center space-x-1 transition-colors ${
              topTab === 'BB'
                ? 'bg-[#202c3b] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="border border-neutral-500 px-1 py-0.2 rounded text-[10px] font-black">
              BB
            </span>
            <span>Builder</span>
          </button>

          <button
            onClick={() => setTopTab('Markets')}
            className={`py-2 px-4 transition-colors ${
              topTab === 'Markets'
                ? 'bg-white text-[#141b24] font-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Markets ({allMarkets.length})
          </button>

          <button
            onClick={() => {
              setTopTab('Stats');
              showToast('Match Stats: Possession 58% - 42%, Dangerous Attacks 48 - 35');
            }}
            className={`py-2 px-3 transition-colors ${
              topTab === 'Stats'
                ? 'bg-white text-[#141b24] font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Stats
          </button>

          <button
            onClick={() => {
              setTopTab('Codes');
              showToast('Booking code generated for this match!');
            }}
            className={`py-2 px-3 relative transition-colors ${
              topTab === 'Codes'
                ? 'bg-white text-[#141b24] font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Codes</span>
            <span className="absolute -top-1 right-1 bg-[#ff4d4f] text-white text-[8px] font-bold px-1 rounded-full">
              New
            </span>
          </button>

          <button
            onClick={() => showToast('Match discussion chat (128 fans active)')}
            className="py-2 px-3 ml-auto text-neutral-400 hover:text-white"
            title="Chat Room"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Market Category Pills with counters */}
        <div className="flex items-center overflow-x-auto no-scrollbar bg-[#19222d] border-b border-[#253243] text-xs px-2 py-1.5 space-x-1.5 sticky top-12 z-30 shadow">
          {/* Favorite toggle */}
          <button
            onClick={() => setOnlyFavorites(!onlyFavorites)}
            className={`p-1.5 rounded flex items-center space-x-1 shrink-0 transition-colors ${
              onlyFavorites
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40 font-bold'
                : 'text-neutral-400 hover:text-amber-400'
            }`}
            title="Starred favorite markets"
          >
            <Star className={`w-3.5 h-3.5 ${onlyFavorites ? 'fill-amber-400' : ''}`} />
            {favoriteMarkets.length > 0 && (
              <span className="text-[10px] font-black">{favoriteMarkets.length}</span>
            )}
          </button>

          {(
            [
              { id: 'All', label: 'All' },
              { id: 'Main', label: 'Main' },
              { id: 'Goals', label: 'Goals' },
              { id: 'Half', label: 'Half' },
              { id: 'Combos', label: 'Combos' },
              { id: 'Minutes', label: 'Minutes' },
              { id: 'Players', label: 'Players' }
            ] as const
          ).map(tab => {
            const count = tab.id === 'All'
              ? allMarkets.length
              : allMarkets.filter(m => m.category === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => {
                  setCategory(tab.id);
                  setOnlyFavorites(false);
                }}
                className={`px-2.5 py-1 text-xs font-bold shrink-0 rounded transition-all whitespace-nowrap flex items-center space-x-1 ${
                  category === tab.id && !onlyFavorites
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#141c26] text-neutral-400 hover:text-white hover:bg-[#1f2b3a]'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] opacity-75 font-normal`}>({count})</span>
              </button>
            );
          })}
        </div>

        {/* Action bar: Expand/Collapse All and Active Search Indicator */}
        <div className="px-3 py-2 bg-[#121922] flex items-center justify-between text-xs text-neutral-400 border-b border-[#1b2533]">
          <div className="flex items-center space-x-1.5">
            <span>Showing</span>
            <span className="text-[#00df59] font-black">{filteredMarkets.length}</span>
            <span>market options</span>
            {searchQuery && (
              <span className="text-amber-300 font-medium">for "{searchQuery}"</span>
            )}
          </div>

          <button
            onClick={toggleAllCollapse}
            className="text-[11px] text-neutral-300 hover:text-white flex items-center space-x-1 cursor-pointer"
          >
            <ChevronsUpDown className="w-3.5 h-3.5 text-neutral-400" />
            <span>Toggle All</span>
          </button>
        </div>

        {/* Markets Accordion List */}
        {filteredMarkets.length === 0 ? (
          <div className="p-8 text-center text-neutral-400 space-y-2">
            <Info className="w-8 h-8 text-neutral-500 mx-auto" />
            <div className="text-sm font-bold text-white">No markets found</div>
            <div className="text-xs text-neutral-400">
              No options match your current filter or search criteria.
            </div>
            {(searchQuery || onlyFavorites || category !== 'All') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setOnlyFavorites(false);
                  setCategory('All');
                }}
                className="mt-2 px-3 py-1 bg-[#1b2533] hover:bg-[#253346] text-white text-xs font-bold rounded"
              >
                Reset Filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-[#1e2836]">
            {filteredMarkets.map(market => {
              const isCollapsed = !!collapsedMarkets[market.id];
              const isFav = favoriteMarkets.includes(market.id);

              return (
                <div key={market.id} className="bg-[#151c25]">
                  {/* Market Header */}
                  <div
                    onClick={() => toggleCollapse(market.id)}
                    className="px-3.5 py-2.5 flex items-center justify-between cursor-pointer hover:bg-[#1a232e] transition-colors"
                  >
                    <div className="flex items-center space-x-2 min-w-0">
                      {isCollapsed ? (
                        <ChevronDown className="w-4 h-4 text-neutral-400 shrink-0" />
                      ) : (
                        <ChevronUp className="w-4 h-4 text-[#00df59] shrink-0" />
                      )}
                      <span className="font-bold text-xs text-white truncate tracking-tight">
                        {market.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 text-neutral-400 shrink-0 ml-2">
                      <span className="text-[10px] text-neutral-500 font-mono hidden xs:inline">
                        {market.category}
                      </span>
                      <button
                        onClick={(e) => toggleFavorite(market.id, e)}
                        className="p-1 hover:text-amber-400 cursor-pointer"
                        title={isFav ? 'Remove from favorites' : 'Star favorite'}
                      >
                        <Star
                          className={`w-3.5 h-3.5 ${
                            isFav ? 'text-amber-400 fill-amber-400' : 'text-neutral-500'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Market Body */}
                  {!isCollapsed && (
                    <div className="px-3 pb-3 pt-1">
                      {renderMarketContent(market, match, isSelected, handleSelect)}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* 4. BOTTOM FLOATING BETSLIP SUMMARY BAR */}
      {/* ========================================================= */}
      {betslip.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#16202c] border-t border-[#253243] px-3.5 py-2.5 flex items-center justify-between shadow-2xl backdrop-blur-md">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-full bg-[#00df59] text-black font-black text-xs flex items-center justify-center shadow">
              {betslip.length}
            </div>
            <div>
              <div className="text-xs font-black text-white">
                {betslip.length} {betslip.length === 1 ? 'Selection' : 'Selections'} in Betslip
              </div>
              <div className="text-[10px] text-neutral-400">
                Total Odds: <span className="text-[#00df59] font-bold">{totalBetslipOdds.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsBetslipOpen(true)}
            className="py-2 px-4 bg-[#00df59] hover:bg-[#00c54f] active:bg-[#00a826] text-black font-black text-xs rounded shadow flex items-center space-x-1.5 transition-transform active:scale-95 cursor-pointer"
          >
            <Ticket className="w-4 h-4 text-black" />
            <span>Open Betslip</span>
          </button>
        </div>
      )}
    </div>
  );
};

// ==========================================
// RENDERERS FOR DIFFERENT MARKET TYPES
// ==========================================
function renderMarketContent(
  market: MarketItem,
  match: Match,
  isSelected: (mName: string, selName: string) => boolean,
  handleSelect: (mName: string, odd: OddItem) => void
) {
  // 1. Standard 3-Column Odds (e.g. 1X2, 1UP, 2UP, Double Chance, etc.)
  if (market.type === '3col' && market.odds) {
    const cols = market.odds.length === 2 ? 'grid-cols-2' : market.odds.length === 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-3';
    return (
      <div className={`grid ${cols} gap-1.5`}>
        {market.odds.map(odd => (
          <button
            key={odd.name}
            onClick={() =>
              handleSelect(market.name, {
                id: `${match.id}-${market.id}-${odd.name}`,
                name: odd.name,
                value: odd.value
              })
            }
            className={`py-2 px-2.5 rounded-[3px] flex items-center justify-between text-xs transition-all active:scale-95 cursor-pointer ${
              isSelected(market.name, odd.name)
                ? 'bg-[#00a826] text-white shadow font-black'
                : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
            }`}
          >
            <span className="truncate mr-1 text-[11px] font-medium">{odd.name}</span>
            <span
              className={`font-black text-xs shrink-0 ${
                isSelected(market.name, odd.name) ? 'text-white' : 'text-[#00df59]'
              }`}
            >
              {odd.value.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // 2. Standard 2-Column Odds (e.g. GG/NG, Clean Sheet, Win to Nil, etc.)
  if (market.type === '2col' && market.odds) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {market.odds.map(odd => (
          <button
            key={odd.name}
            onClick={() =>
              handleSelect(market.name, {
                id: `${match.id}-${market.id}-${odd.name}`,
                name: odd.name,
                value: odd.value
              })
            }
            className={`py-2 px-3 rounded-[3px] flex items-center justify-between text-xs transition-all active:scale-95 cursor-pointer ${
              isSelected(market.name, odd.name)
                ? 'bg-[#00a826] text-white shadow font-black'
                : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
            }`}
          >
            <span className="truncate mr-1 font-medium">{odd.name}</span>
            <span
              className={`font-black text-xs ${
                isSelected(market.name, odd.name) ? 'text-white' : 'text-[#00df59]'
              }`}
            >
              {odd.value.toFixed(2)}
            </span>
          </button>
        ))}
      </div>
    );
  }

  // 3. Line Table (e.g. Over/Under, Team Over/Under, Minute Over/Under)
  if (market.type === 'lines' && market.lines) {
    return (
      <div>
        <div className="grid grid-cols-3 text-center text-[10px] font-black uppercase text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
          <span>Line</span>
          <span>Over</span>
          <span>Under</span>
        </div>
        <div className="space-y-1">
          {market.lines.map(row => (
            <div key={row.line} className="grid grid-cols-3 gap-1.5 items-center">
              <div className="py-2 bg-[#19232f] text-center font-bold text-xs text-neutral-300 rounded-[3px]">
                {row.line}
              </div>

              {/* Over odd */}
              <button
                onClick={() =>
                  handleSelect(market.name, {
                    id: `${match.id}-${market.id}-o-${row.line}`,
                    name: `Over ${row.line}`,
                    value: row.over
                  })
                }
                className={`py-2 px-2 rounded-[3px] flex items-center justify-center space-x-1 text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected(market.name, `Over ${row.line}`)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span className="text-[10px] text-neutral-400 mr-0.5">Over</span>
                <span
                  className={`font-black text-xs ${
                    isSelected(market.name, `Over ${row.line}`) ? 'text-white' : 'text-[#00df59]'
                  }`}
                >
                  {row.over.toFixed(2)}
                </span>
              </button>

              {/* Under odd */}
              {row.under !== undefined ? (
                <button
                  onClick={() =>
                    handleSelect(market.name, {
                      id: `${match.id}-${market.id}-u-${row.line}`,
                      name: `Under ${row.line}`,
                      value: row.under!
                    })
                  }
                  className={`py-2 px-2 rounded-[3px] flex items-center justify-center space-x-1 text-xs transition-all active:scale-95 cursor-pointer ${
                    isSelected(market.name, `Under ${row.line}`)
                      ? 'bg-[#00a826] text-white shadow font-black'
                      : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                  }`}
                >
                  <span className="text-[10px] text-neutral-400 mr-0.5">Under</span>
                  <span
                    className={`font-black text-xs ${
                      isSelected(market.name, `Under ${row.line}`) ? 'text-white' : 'text-[#00df59]'
                    }`}
                  >
                    {row.under.toFixed(2)}
                  </span>
                </button>
              ) : (
                <div className="py-2 text-center text-xs text-neutral-600 bg-[#161d26] rounded-[3px]">
                  -
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 4. European Handicap (Line, Home, Draw, Away)
  if (market.type === 'handicap' && market.handicaps) {
    return (
      <div>
        <div className="grid grid-cols-4 text-center text-[10px] font-black uppercase text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
          <span>Line</span>
          <span>Home</span>
          <span>Draw</span>
          <span>Away</span>
        </div>
        <div className="space-y-1">
          {market.handicaps.map(row => (
            <div key={row.line} className="grid grid-cols-4 gap-1.5 items-center">
              <div className="py-2 bg-[#19232f] text-center font-bold text-xs text-neutral-300 rounded-[3px]">
                {row.line}
              </div>

              {/* Home */}
              <button
                onClick={() =>
                  handleSelect(`Handicap ${row.line}`, {
                    id: `${match.id}-hc-${row.line}-1`,
                    name: `Home (${row.line})`,
                    value: row.home
                  })
                }
                className={`py-2 px-1 text-center rounded-[3px] text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected(`Handicap ${row.line}`, `Home (${row.line})`)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span
                  className={`font-black ${
                    isSelected(`Handicap ${row.line}`, `Home (${row.line})`)
                      ? 'text-white'
                      : 'text-[#00df59]'
                  }`}
                >
                  {row.home.toFixed(2)}
                </span>
              </button>

              {/* Draw */}
              {row.draw !== undefined ? (
                <button
                  onClick={() =>
                    handleSelect(`Handicap ${row.line}`, {
                      id: `${match.id}-hc-${row.line}-x`,
                      name: `Draw (${row.line})`,
                      value: row.draw!
                    })
                  }
                  className={`py-2 px-1 text-center rounded-[3px] text-xs transition-all active:scale-95 cursor-pointer ${
                    isSelected(`Handicap ${row.line}`, `Draw (${row.line})`)
                      ? 'bg-[#00a826] text-white shadow font-black'
                      : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                  }`}
                >
                  <span
                    className={`font-black ${
                      isSelected(`Handicap ${row.line}`, `Draw (${row.line})`)
                        ? 'text-white'
                        : 'text-[#00df59]'
                    }`}
                  >
                    {row.draw.toFixed(2)}
                  </span>
                </button>
              ) : (
                <div className="py-2 text-center text-xs text-neutral-600 bg-[#161d26] rounded-[3px]">-</div>
              )}

              {/* Away */}
              <button
                onClick={() =>
                  handleSelect(`Handicap ${row.line}`, {
                    id: `${match.id}-hc-${row.line}-2`,
                    name: `Away (${row.line})`,
                    value: row.away
                  })
                }
                className={`py-2 px-1 text-center rounded-[3px] text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected(`Handicap ${row.line}`, `Away (${row.line})`)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span
                  className={`font-black ${
                    isSelected(`Handicap ${row.line}`, `Away (${row.line})`)
                      ? 'text-white'
                      : 'text-[#00df59]'
                  }`}
                >
                  {row.away.toFixed(2)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 5. Asian Handicap (Home, Away)
  if (market.type === 'asian_handicap' && market.asianHandicaps) {
    return (
      <div>
        <div className="grid grid-cols-2 text-center text-[10px] font-black uppercase text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
          <span>Home</span>
          <span>Away</span>
        </div>
        <div className="space-y-1">
          {market.asianHandicaps.map((row, idx) => (
            <div key={idx} className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() =>
                  handleSelect('Asian Handicap', {
                    id: `${match.id}-ah-h-${row.hLine}`,
                    name: `Home (${row.hLine})`,
                    value: row.hOdd
                  })
                }
                className={`py-2 px-2.5 rounded-[3px] flex items-center justify-between text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected('Asian Handicap', `Home (${row.hLine})`)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span className="font-medium text-[11px] truncate">Home ({row.hLine})</span>
                <span
                  className={`font-black text-xs ${
                    isSelected('Asian Handicap', `Home (${row.hLine})`) ? 'text-white' : 'text-[#00df59]'
                  }`}
                >
                  {row.hOdd.toFixed(2)}
                </span>
              </button>

              <button
                onClick={() =>
                  handleSelect('Asian Handicap', {
                    id: `${match.id}-ah-a-${row.aLine}`,
                    name: `Away (${row.aLine})`,
                    value: row.aOdd
                  })
                }
                className={`py-2 px-2.5 rounded-[3px] flex items-center justify-between text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected('Asian Handicap', `Away (${row.aLine})`)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span className="font-medium text-[11px] truncate">Away ({row.aLine})</span>
                <span
                  className={`font-black text-xs ${
                    isSelected('Asian Handicap', `Away (${row.aLine})`) ? 'text-white' : 'text-[#00df59]'
                  }`}
                >
                  {row.aOdd.toFixed(2)}
                </span>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // 6. Matrix Grid (e.g. 1X2 & Over/Under, Double Chance & GG/NG, etc.)
  if (market.type === 'grid' && market.gridRows) {
    const colCount = (market.gridHeader?.length || 3) + 1;
    const gridColsClass =
      colCount === 3
        ? 'grid-cols-3'
        : colCount === 4
        ? 'grid-cols-4'
        : 'grid-cols-4';

    return (
      <div className="space-y-1">
        {market.gridHeader && (
          <div className={`grid ${gridColsClass} text-center text-[10px] font-black uppercase text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1`}>
            <span>Market</span>
            {market.gridHeader.map(h => (
              <span key={h} className="truncate px-0.5">{h}</span>
            ))}
          </div>
        )}

        {market.gridRows.map(row => (
          <div key={row.label} className={`grid ${gridColsClass} gap-1 items-center`}>
            <div className="py-2 bg-[#19232f] text-center font-bold text-[11px] text-neutral-300 rounded-[3px] px-1 truncate">
              {row.label}
            </div>

            {row.values.map(val => (
              <button
                key={val.name}
                onClick={() =>
                  handleSelect(market.name, {
                    id: `${match.id}-${market.id}-${val.name}`,
                    name: val.name,
                    value: val.value
                  })
                }
                className={`py-2 px-1 text-center rounded-[3px] text-xs transition-all active:scale-95 cursor-pointer ${
                  isSelected(market.name, val.name)
                    ? 'bg-[#00a826] text-white shadow font-black'
                    : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
                }`}
              >
                <span
                  className={`font-black ${
                    isSelected(market.name, val.name) ? 'text-white' : 'text-[#00df59]'
                  }`}
                >
                  {val.value.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
}
