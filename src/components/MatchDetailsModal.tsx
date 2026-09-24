import React, { useState } from 'react';
import {
  ArrowLeft,
  Search,
  Home,
  Star,
  ChevronDown,
  ChevronUp,
  Info,
  BarChart2,
  Lock,
  MessageSquare,
  FileCode
} from 'lucide-react';
import { Match, OddItem } from '../types';
import { useBetting } from '../context/BettingContext';

interface MatchDetailsModalProps {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ match, onClose }) => {
  const { toggleSelection, betslip, setActiveTab, showToast } = useBetting();
  const [topTab, setTopTab] = useState<'BB' | 'Markets' | 'Stats' | 'Codes' | 'Chat'>('Markets');
  const [category, setCategory] = useState<'All' | 'Main' | 'Goals' | 'Corners' | 'Half' | 'Players'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [favoriteMarkets, setFavoriteMarkets] = useState<string[]>([]);
  const [collapsedMarkets, setCollapsedMarkets] = useState<Record<string, boolean>>({});

  if (!match) return null;

  const toggleFavorite = (marketName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavoriteMarkets(prev =>
      prev.includes(marketName) ? prev.filter(m => m !== marketName) : [...prev, marketName]
    );
  };

  const toggleCollapse = (marketName: string) => {
    setCollapsedMarkets(prev => ({
      ...prev,
      [marketName]: !prev[marketName]
    }));
  };

  const isSelected = (marketName: string, selName: string) => {
    return betslip.some(
      s => s.matchId === match.id && s.marketName === marketName && s.selectionName === selName
    );
  };

  const handleSelect = (marketName: string, odd: OddItem) => {
    toggleSelection(match, marketName, odd);
  };

  // Check country flag emoji or fallback
  const getFlagEmoji = (country: string) => {
    const c = country.toLowerCase();
    if (c.includes('brazil') || c.includes('serie b')) return '🇧🇷';
    if (c.includes('scotland')) return '🏴󠁧󠁢󠁳󠁣󠁴󠁿';
    if (c.includes('spain')) return '🇪🇸';
    if (c.includes('italy')) return '🇮🇹';
    if (c.includes('germany')) return '🇩🇪';
    if (c.includes('france')) return '🇫🇷';
    if (c.includes('andorra')) return '🇦🇩';
    if (c.includes('malta')) return '🇲🇹';
    if (c.includes('england')) return '🏴󠁧󠁢󠁥󠁮󠁧󠁿';
    return '⚽';
  };

  // Base odds calculated dynamically or pulled from match
  const homeOdd = match.markets['1X2'] ? match.markets['1X2'][0].value : 2.10;
  const drawOdd = match.markets['1X2'] ? match.markets['1X2'][1].value : 3.10;
  const awayOdd = match.markets['1X2'] ? match.markets['1X2'][2].value : 3.40;

  return (
    <div className="fixed inset-0 z-50 bg-[#121922] text-white flex flex-col overflow-hidden select-none animate-in fade-in duration-150">
      {/* Red Top Bar (Screenshots 6-12: ← Details [or Match Title] 🔍 🏠) */}
      <div className="sticky top-0 z-40 bg-[#de1a22] text-white px-3 py-2.5 flex items-center justify-between shadow-md h-12">
        <div className="flex items-center space-x-3 min-w-0">
          <button
            onClick={onClose}
            className="p-1 -ml-1 text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
          <span className="text-base font-bold tracking-tight truncate">
            {match.homeTeam} vs {match.awayTeam}
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Search markets"
          >
            <Search className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            onClick={() => {
              onClose();
              setActiveTab('sports');
            }}
            className="p-1 text-white hover:bg-white/10 rounded-full transition-colors"
            title="Go to Home"
          >
            <Home className="w-5 h-5 fill-white stroke-none" />
          </button>
        </div>
      </div>

      {/* Search Input Bar (if open) */}
      {showSearch && (
        <div className="bg-[#19222d] p-2 border-b border-[#253243] flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search markets (e.g. 1X2, Over, Handicap)..."
            className="w-full bg-[#121922] border border-[#2e3b4d] rounded px-3 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00df59]"
            autoFocus
          />
        </div>
      )}

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        {/* Match Scoreboard Banner (Screenshot 6) */}
        <div className="bg-[#18212c] px-4 pt-3 pb-4 border-b border-[#222e3d] relative">
          {/* Top row: Tournament & Switch match */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-bold text-[#00df59] hover:underline cursor-pointer truncate max-w-[70%]">
              Football - {match.countryOrCategory} - {match.league}
            </span>
            <button
              onClick={() => showToast('Choose other matches in this tournament')}
              className="text-[11px] font-bold text-neutral-300 bg-[#253243] hover:bg-[#2c3b4f] px-2 py-0.5 rounded flex items-center space-x-1"
            >
              <span>Switch match</span>
              <span className="text-xs">📑</span>
            </button>
          </div>

          {/* Teams Row with circular flags and center timing/scores */}
          <div className="grid grid-cols-3 items-center text-center my-2">
            {/* Home Team */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#202936] border border-white/20 flex items-center justify-center text-2xl shadow mb-1.5">
                {getFlagEmoji(match.countryOrCategory)}
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
                    <span>Live</span>
                    <span>{match.minute || "76:51 H2"}</span>
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
                    const weekday = matchDateObj.toLocaleDateString('en-GB', { weekday: 'long' });
                    const dayMonth = matchDateObj.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' });
                    
                    dateLabel = isToday ? `Today ${dayMonth}` : isTomorrow ? `Tomorrow ${dayMonth}` : `${weekday} ${dayMonth}`;
                    timeLabel = matchDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                  }

                  return (
                    <>
                      <div className="text-xs text-neutral-400 font-medium">
                        {dateLabel}
                      </div>
                      <div className="text-sm font-black text-white mt-0.5">
                        {timeLabel}
                      </div>
                    </>
                  );
                })()
              )}
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#202936] border border-white/20 flex items-center justify-center text-2xl shadow mb-1.5">
                {getFlagEmoji(match.awayTeam)}
              </div>
              <span className="font-bold text-xs text-white leading-tight">
                {match.awayTeam}
              </span>
            </div>
          </div>

          {/* Game ID & Live In-Play text */}
          <div className="text-center text-[10px] text-neutral-400 mt-2">
            Game ID {match.gameId} • <span className="text-neutral-300">Live In-Play Available</span>
          </div>
        </div>

        {/* Sub-tabs Bar (Screenshot 6: [BB] | Markets | Stats | Codes [New] | Chat) */}
        <div className="flex items-center bg-[#151c25] border-b border-[#222e3d] text-xs font-bold px-2">
          {/* Bet Builder */}
          <button
            onClick={() => setTopTab('BB')}
            className={`py-2.5 px-3 flex items-center space-x-1 transition-colors ${
              topTab === 'BB'
                ? 'bg-[#202c3b] text-white'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span className="border border-neutral-500 px-1 py-0.2 rounded text-[10px] font-black">
              BB
            </span>
          </button>

          {/* Markets tab */}
          <button
            onClick={() => setTopTab('Markets')}
            className={`py-2.5 px-4 transition-colors ${
              topTab === 'Markets'
                ? 'bg-[#ffffff] text-[#141b24] font-black shadow'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Markets
          </button>

          {/* Stats tab */}
          <button
            onClick={() => {
              setTopTab('Stats');
              showToast('Match Statistics: 54% Possession, 6 Shots on Target');
            }}
            className={`py-2.5 px-3 transition-colors ${
              topTab === 'Stats'
                ? 'bg-[#ffffff] text-[#141b24] font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Stats
          </button>

          {/* Codes with red NEW badge */}
          <button
            onClick={() => {
              setTopTab('Codes');
              showToast('Betting codes for this match loaded');
            }}
            className={`py-2.5 px-3 relative transition-colors ${
              topTab === 'Codes'
                ? 'bg-[#ffffff] text-[#141b24] font-black'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <span>Codes</span>
            <span className="absolute -top-1 right-1 bg-[#ff4d4f] text-white text-[8px] font-bold px-1 rounded-full">
              New
            </span>
          </button>

          {/* Chat Icon */}
          <button
            onClick={() => showToast('Match chat room (245 users active)')}
            className="py-2.5 px-3 ml-auto text-neutral-400 hover:text-white"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

        {/* Market Category Pills (Screenshot 6: 🔍 | ⭐ | All | Main | Goals | Corners | Half | Players) */}
        <div className="flex items-center overflow-x-auto no-scrollbar bg-[#19222d] border-b border-[#253243] text-xs px-2 py-1.5 space-x-1">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-1.5 text-neutral-400 hover:text-white shrink-0"
          >
            <Search className="w-4 h-4" />
          </button>

          <button
            onClick={() => showToast('Favorite markets filter')}
            className="p-1.5 text-neutral-400 hover:text-amber-400 shrink-0"
          >
            <Star className="w-4 h-4" />
          </button>

          {(['All', 'Main', 'Goals', 'Corners', 'Half', 'Players'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1 font-bold shrink-0 rounded transition-colors ${
                category === cat
                  ? 'text-white border-b-2 border-[#00df59]'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Markets Accordion List (Screenshots 6 to 12) */}
        <div className="divide-y divide-[#202a37]">
          {/* 1. 1X2 Market */}
          {renderMarketSection(
            '1X2',
            collapsedMarkets['1X2'],
            () => toggleCollapse('1X2'),
            favoriteMarkets.includes('1X2'),
            (e) => toggleFavorite('1X2', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('1X2', 'Home', homeOdd, isSelected('1X2', 'Home'), () =>
                  handleSelect('1X2', { id: `${match.id}-1`, name: 'Home', value: homeOdd })
                )}
                {renderOddBox('1X2', 'Draw', drawOdd, isSelected('1X2', 'Draw'), () =>
                  handleSelect('1X2', { id: `${match.id}-x`, name: 'Draw', value: drawOdd })
                )}
                {renderOddBox('1X2', 'Away', awayOdd, isSelected('1X2', 'Away'), () =>
                  handleSelect('1X2', { id: `${match.id}-2`, name: 'Away', value: awayOdd })
                )}
              </div>
            )
          )}

          {/* 2. 1X2 - 1UP (Early Payout if team goes 1 goal ahead) */}
          {renderMarketSection(
            '1X2 - 1UP',
            collapsedMarkets['1X2 - 1UP'],
            () => toggleCollapse('1X2 - 1UP'),
            favoriteMarkets.includes('1X2 - 1UP'),
            (e) => toggleFavorite('1X2 - 1UP', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('1X2 - 1UP', 'Home', 2.29, isSelected('1X2 - 1UP', 'Home'), () =>
                  handleSelect('1X2 - 1UP', { id: `${match.id}-1up-1`, name: 'Home', value: 2.29 })
                )}
                {renderOddBox('1X2 - 1UP', 'Draw', 2.95, isSelected('1X2 - 1UP', 'Draw'), () =>
                  handleSelect('1X2 - 1UP', { id: `${match.id}-1up-x`, name: 'Draw', value: 2.95 })
                )}
                {renderOddBox('1X2 - 1UP', 'Away', 1.78, isSelected('1X2 - 1UP', 'Away'), () =>
                  handleSelect('1X2 - 1UP', { id: `${match.id}-1up-2`, name: 'Away', value: 1.78 })
                )}
              </div>
            )
          )}

          {/* 3. 1X2 - 2UP (Early Payout if team goes 2 goals ahead) */}
          {renderMarketSection(
            '1X2 - 2UP',
            collapsedMarkets['1X2 - 2UP'],
            () => toggleCollapse('1X2 - 2UP'),
            favoriteMarkets.includes('1X2 - 2UP'),
            (e) => toggleFavorite('1X2 - 2UP', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('1X2 - 2UP', 'Home', 3.41, isSelected('1X2 - 2UP', 'Home'), () =>
                  handleSelect('1X2 - 2UP', { id: `${match.id}-2up-1`, name: 'Home', value: 3.41 })
                )}
                {renderOddBox('1X2 - 2UP', 'Draw', 2.95, isSelected('1X2 - 2UP', 'Draw'), () =>
                  handleSelect('1X2 - 2UP', { id: `${match.id}-2up-x`, name: 'Draw', value: 2.95 })
                )}
                {renderOddBox('1X2 - 2UP', 'Away', 2.33, isSelected('1X2 - 2UP', 'Away'), () =>
                  handleSelect('1X2 - 2UP', { id: `${match.id}-2up-2`, name: 'Away', value: 2.33 })
                )}
              </div>
            )
          )}

          {/* 4. 1X2 - Never Down */}
          {renderMarketSection(
            '1X2 - Never Down',
            collapsedMarkets['1X2 - Never Down'],
            () => toggleCollapse('1X2 - Never Down'),
            favoriteMarkets.includes('1X2 - Never Down'),
            (e) => toggleFavorite('1X2 - Never Down', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('1X2 - Never Down', 'Home', 3.73, isSelected('1X2 - Never Down', 'Home'), () =>
                  handleSelect('1X2 - Never Down', { id: `${match.id}-nd-1`, name: 'Home', value: 3.73 })
                )}
                {renderOddBox('1X2 - Never Down', 'Draw', 2.95, isSelected('1X2 - Never Down', 'Draw'), () =>
                  handleSelect('1X2 - Never Down', { id: `${match.id}-nd-x`, name: 'Draw', value: 2.95 })
                )}
                {renderOddBox('1X2 - Never Down', 'Away', 2.53, isSelected('1X2 - Never Down', 'Away'), () =>
                  handleSelect('1X2 - Never Down', { id: `${match.id}-nd-2`, name: 'Away', value: 2.53 })
                )}
              </div>
            )
          )}

          {/* 5. Over/Under Grid (Screenshot 7: Over | Under header with 0.5 to 4.5 rows) */}
          {renderMarketSection(
            'Over/Under',
            collapsedMarkets['Over/Under'],
            () => toggleCollapse('Over/Under'),
            favoriteMarkets.includes('Over/Under'),
            (e) => toggleFavorite('Over/Under', e),
            (
              <div>
                <div className="grid grid-cols-3 text-center text-xs font-bold text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
                  <span>Line</span>
                  <span>Over</span>
                  <span>Under</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { line: '0.5', over: 1.15, under: 6.00 },
                    { line: '1.5', over: 1.66, under: 2.30 },
                    { line: '2.5', over: 3.00, under: 1.41 },
                    { line: '3.5', over: 6.25, under: 1.14 },
                    { line: '4.5', over: 13.00, under: 1.04 }
                  ].map(row => (
                    <div key={row.line} className="grid grid-cols-3 gap-1.5 items-center">
                      <div className="py-2.5 bg-[#1b2533] text-center font-bold text-xs text-neutral-300 rounded">
                        {row.line}
                      </div>
                      {renderOddBox('Over/Under', `Over ${row.line}`, row.over, isSelected('Over/Under', `Over ${row.line}`), () =>
                        handleSelect('Over/Under', { id: `ou-o-${row.line}`, name: `Over ${row.line}`, value: row.over })
                      )}
                      {renderOddBox('Over/Under', `Under ${row.line}`, row.under, isSelected('Over/Under', `Under ${row.line}`), () =>
                        handleSelect('Over/Under', { id: `ou-u-${row.line}`, name: `Under ${row.line}`, value: row.under })
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* 6. Asian Over/Under (Screenshot 8) */}
          {renderMarketSection(
            'Asian Over/Under',
            collapsedMarkets['Asian Over/Under'],
            () => toggleCollapse('Asian Over/Under'),
            favoriteMarkets.includes('Asian Over/Under'),
            (e) => toggleFavorite('Asian Over/Under', e),
            (
              <div>
                <div className="grid grid-cols-3 text-center text-xs font-bold text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
                  <span>Line</span>
                  <span>Over</span>
                  <span>Under</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { line: '1', over: 1.23, under: 4.40 },
                    { line: '2', over: 2.25, under: 1.67 },
                    { line: '3', over: 5.40, under: 1.17 },
                    { line: '4', over: 12.50, under: 1.04 }
                  ].map(row => (
                    <div key={row.line} className="grid grid-cols-3 gap-1.5 items-center">
                      <div className="py-2.5 bg-[#1b2533] text-center font-bold text-xs text-neutral-300 rounded">
                        {row.line}
                      </div>
                      {renderOddBox('Asian O/U', `Over ${row.line}`, row.over, isSelected('Asian O/U', `Over ${row.line}`), () =>
                        handleSelect('Asian O/U', { id: `aou-o-${row.line}`, name: `Over ${row.line}`, value: row.over })
                      )}
                      {renderOddBox('Asian O/U', `Under ${row.line}`, row.under, isSelected('Asian O/U', `Under ${row.line}`), () =>
                        handleSelect('Asian O/U', { id: `aou-u-${row.line}`, name: `Under ${row.line}`, value: row.under })
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* 7. Double Chance (Screenshot 9) */}
          {renderMarketSection(
            'Double Chance',
            collapsedMarkets['Double Chance'],
            () => toggleCollapse('Double Chance'),
            favoriteMarkets.includes('Double Chance'),
            (e) => toggleFavorite('Double Chance', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('Double Chance', 'Home or Draw', 1.56, isSelected('Double Chance', 'Home or Draw'), () =>
                  handleSelect('Double Chance', { id: 'dc-1x', name: 'Home or Draw', value: 1.56 })
                )}
                {renderOddBox('Double Chance', 'Home or Away', 1.42, isSelected('Double Chance', 'Home or Away'), () =>
                  handleSelect('Double Chance', { id: 'dc-12', name: 'Home or Away', value: 1.42 })
                )}
                {renderOddBox('Double Chance', 'Draw or Away', 1.30, isSelected('Double Chance', 'Draw or Away'), () =>
                  handleSelect('Double Chance', { id: 'dc-x2', name: 'Draw or Away', value: 1.30 })
                )}
              </div>
            )
          )}

          {/* 8. 1st Goal (Screenshot 9) */}
          {renderMarketSection(
            '1st Goal',
            collapsedMarkets['1st Goal'],
            () => toggleCollapse('1st Goal'),
            favoriteMarkets.includes('1st Goal'),
            (e) => toggleFavorite('1st Goal', e),
            (
              <div className="grid grid-cols-3 gap-2">
                {renderOddBox('1st Goal', 'Home', 2.40, isSelected('1st Goal', 'Home'), () =>
                  handleSelect('1st Goal', { id: 'fg-1', name: 'Home', value: 2.40 })
                )}
                {renderOddBox('1st Goal', 'None', 5.40, isSelected('1st Goal', 'None'), () =>
                  handleSelect('1st Goal', { id: 'fg-none', name: 'None', value: 5.40 })
                )}
                {renderOddBox('1st Goal', 'Away', 1.89, isSelected('1st Goal', 'Away'), () =>
                  handleSelect('1st Goal', { id: 'fg-2', name: 'Away', value: 1.89 })
                )}
              </div>
            )
          )}

          {/* 9. Handicap Table (Screenshot 9: 0:1, 0:2, 1:0, 2:0, 3:0) */}
          {renderMarketSection(
            'Handicap',
            collapsedMarkets['Handicap'],
            () => toggleCollapse('Handicap'),
            favoriteMarkets.includes('Handicap'),
            (e) => toggleFavorite('Handicap', e),
            (
              <div>
                <div className="grid grid-cols-4 text-center text-xs font-bold text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
                  <span>Line</span>
                  <span>Home</span>
                  <span>Draw</span>
                  <span>Away</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { hc: '0:1', h: 10.00, d: 5.00, a: 1.31 },
                    { hc: '0:2', h: 33.00, d: 11.00, a: 1.07 },
                    { hc: '1:0', h: 1.60, d: 3.90, a: 5.50 },
                    { hc: '2:0', h: 1.16, d: 7.40, a: 16.00 },
                    { hc: '3:0', h: 1.03, d: 15.00, a: 44.00 }
                  ].map(row => (
                    <div key={row.hc} className="grid grid-cols-4 gap-1.5 items-center">
                      <div className="py-2.5 bg-[#1b2533] text-center font-bold text-xs text-neutral-300 rounded">
                        {row.hc}
                      </div>
                      {renderOddBox(`Handicap ${row.hc}`, 'Home', row.h, isSelected(`Handicap ${row.hc}`, 'Home'), () =>
                        handleSelect(`Handicap ${row.hc}`, { id: `hc-${row.hc}-1`, name: `Home (${row.hc})`, value: row.h })
                      )}
                      {renderOddBox(`Handicap ${row.hc}`, 'Draw', row.d, isSelected(`Handicap ${row.hc}`, 'Draw'), () =>
                        handleSelect(`Handicap ${row.hc}`, { id: `hc-${row.hc}-x`, name: `Draw (${row.hc})`, value: row.d })
                      )}
                      {renderOddBox(`Handicap ${row.hc}`, 'Away', row.a, isSelected(`Handicap ${row.hc}`, 'Away'), () =>
                        handleSelect(`Handicap ${row.hc}`, { id: `hc-${row.hc}-2`, name: `Away (${row.hc})`, value: row.a })
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* 10. Asian Handicap (Screenshot 10) */}
          {renderMarketSection(
            'Asian Handicap',
            collapsedMarkets['Asian Handicap'],
            () => toggleCollapse('Asian Handicap'),
            favoriteMarkets.includes('Asian Handicap'),
            (e) => toggleFavorite('Asian Handicap', e),
            (
              <div>
                <div className="grid grid-cols-2 text-center text-xs font-bold text-neutral-400 py-1 bg-[#19222d] rounded-t mb-1">
                  <span>Home</span>
                  <span>Away</span>
                </div>
                <div className="space-y-1.5">
                  {[
                    { hLine: '-1.5', hOdd: 8.70, aLine: '+1.5', aOdd: 1.07 },
                    { hLine: '-1.0', hOdd: 7.50, aLine: '+1.0', aOdd: 1.09 },
                    { hLine: '-0.5', hOdd: 3.40, aLine: '+0.5', aOdd: 1.32 },
                    { hLine: '0', hOdd: 2.35, aLine: '0', aOdd: 1.60 },
                    { hLine: '+0.5', hOdd: 1.60, aLine: '-0.5', aOdd: 2.35 },
                    { hLine: '+1.0', hOdd: 1.24, aLine: '-1.0', aOdd: 4.10 },
                    { hLine: '+1.5', hOdd: 1.16, aLine: '-1.5', aOdd: 5.20 },
                    { hLine: '+2.0', hOdd: 1.04, aLine: '-2.0', aOdd: 11.50 }
                  ].map((row, idx) => (
                    <div key={idx} className="grid grid-cols-2 gap-1.5">
                      {renderOddBox('Asian Handicap', `Home ${row.hLine}`, row.hOdd, isSelected('Asian Handicap', `Home ${row.hLine}`), () =>
                        handleSelect('Asian Handicap', { id: `ah-h-${row.hLine}`, name: `Home (${row.hLine})`, value: row.hOdd })
                      )}
                      {renderOddBox('Asian Handicap', `Away ${row.aLine}`, row.aOdd, isSelected('Asian Handicap', `Away ${row.aLine}`), () =>
                        handleSelect('Asian Handicap', { id: `ah-a-${row.aLine}`, name: `Away (${row.aLine})`, value: row.aOdd })
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )
          )}

          {/* 11. GG/NG Both Teams to Score (Screenshot 11 & 12) */}
          {renderMarketSection(
            'GG/NG',
            collapsedMarkets['GG/NG'],
            () => toggleCollapse('GG/NG'),
            favoriteMarkets.includes('GG/NG'),
            (e) => toggleFavorite('GG/NG', e),
            (
              <div className="grid grid-cols-2 gap-2">
                {renderOddBox('GG/NG', 'Yes', 2.45, isSelected('GG/NG', 'Yes'), () =>
                  handleSelect('GG/NG', { id: 'gg-yes', name: 'GG (Yes)', value: 2.45 })
                )}
                {renderOddBox('GG/NG', 'No', 1.56, isSelected('GG/NG', 'No'), () =>
                  handleSelect('GG/NG', { id: 'gg-no', name: 'NG (No)', value: 1.56 })
                )}
              </div>
            )
          )}

          {/* 12. Any Team To Score 2 or More Goals in a Row (Screenshot 12) */}
          {renderMarketSection(
            'Any Team To Score 2 or More Goals in a Row',
            collapsedMarkets['Any Team 2 Goals'],
            () => toggleCollapse('Any Team 2 Goals'),
            favoriteMarkets.includes('Any Team 2 Goals'),
            (e) => toggleFavorite('Any Team 2 Goals', e),
            (
              <div className="grid grid-cols-2 gap-2">
                {renderOddBox('Any Team 2 Goals', 'Yes', 2.45, isSelected('Any Team 2 Goals', 'Yes'), () =>
                  handleSelect('Any Team 2 Goals', { id: 'at-2g-y', name: 'Yes', value: 2.45 })
                )}
                {renderOddBox('Any Team 2 Goals', 'No', 1.56, isSelected('Any Team 2 Goals', 'No'), () =>
                  handleSelect('Any Team 2 Goals', { id: 'at-2g-n', name: 'No', value: 1.56 })
                )}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};

// Helper: render collapsible market container matching SportyBet UI
function renderMarketSection(
  title: string,
  isCollapsed: boolean,
  onToggle: () => void,
  isFav: boolean,
  onFav: (e: React.MouseEvent) => void,
  children: React.ReactNode
) {
  return (
    <div className="bg-[#151c25]">
      {/* Header bar */}
      <div
        onClick={onToggle}
        className="px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-[#19222d] transition-colors"
      >
        <div className="flex items-center space-x-2">
          {isCollapsed ? (
            <ChevronUp className="w-4 h-4 text-[#00df59]" />
          ) : (
            <ChevronDown className="w-4 h-4 text-[#00df59]" />
          )}
          <span className="font-bold text-xs text-white">{title}</span>
          <Info className="w-3.5 h-3.5 text-neutral-400" />
        </div>

        <div className="flex items-center space-x-3 text-neutral-400">
          <BarChart2 className="w-3.5 h-3.5 hover:text-white" />
          <button onClick={onFav} className="p-0.5">
            <Star className={`w-4 h-4 ${isFav ? 'text-amber-400 fill-amber-400' : 'hover:text-white'}`} />
          </button>
        </div>
      </div>

      {/* Body */}
      {!isCollapsed && <div className="px-3 pb-3 pt-1">{children}</div>}
    </div>
  );
}

// Helper: render standard SportyBet odds button
function renderOddBox(
  market: string,
  name: string,
  value: number,
  isSelected: boolean,
  onClick: () => void
) {
  return (
    <button
      onClick={onClick}
      className={`py-2 px-2 rounded-[3px] flex items-center justify-between text-xs transition-all active:scale-95 ${
        isSelected
          ? 'bg-[#00a826] text-white shadow font-black'
          : 'bg-[#1b2533] hover:bg-[#222e3e] text-neutral-300'
      }`}
    >
      <span className="truncate mr-1 font-medium">{name}</span>
      <span className={`font-black ${isSelected ? 'text-white' : 'text-[#00df59]'}`}>
        {value.toFixed(2)}
      </span>
    </button>
  );
}
