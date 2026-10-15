import React, { useState, useEffect } from 'react';
import { X, Search, RefreshCw, Calendar, Trophy, ChevronRight, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';
import { useBetting } from '../context/BettingContext';

interface MatchResultItem {
  id: string;
  gameId: string;
  sport: string;
  league: string;
  country: string;
  date: string;
  formattedDate: string;
  formattedTime: string;
  homeTeam: string;
  awayTeam: string;
  homeScore: number;
  awayScore: number;
  ftScore: string;
  htScore?: string;
  status: string;
  period: string;
  winner: 'Home' | 'Away' | 'Draw';
  events?: Array<{ minute: string; team: string; player: string; type: string }>;
}

interface MatchResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSearch?: string;
}

export const MatchResultsModal: React.FC<MatchResultsModalProps> = ({
  isOpen,
  onClose,
  initialSearch = ''
}) => {
  const { showToast } = useBetting();
  const [results, setResults] = useState<MatchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedLeague, setSelectedLeague] = useState('all');
  const [selectedDate, setSelectedDate] = useState('all');
  const [apiSource, setApiSource] = useState('api_football_live');
  const [lastUpdated, setLastUpdated] = useState('');

  const loadResults = async () => {
    setIsLoading(true);
    try {
      const res = await api.sports.getResults('football');
      if (res.success && Array.isArray(res.data)) {
        setResults(res.data);
        setApiSource(res.source || 'api_football_live');
        setLastUpdated(res.lastUpdated || new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      console.warn('Failed to load results:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadResults();
      if (initialSearch) {
        setSearchQuery(initialSearch);
      }
    }
  }, [isOpen, initialSearch]);

  if (!isOpen) return null;

  const leagues = Array.from(new Set(results.map(r => r.league)));

  const filteredResults = results.filter(r => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        r.homeTeam.toLowerCase().includes(q) ||
        r.awayTeam.toLowerCase().includes(q) ||
        r.league.toLowerCase().includes(q) ||
        r.gameId.includes(q);
      if (!match) return false;
    }
    if (selectedLeague !== 'all' && r.league !== selectedLeague) {
      return false;
    }
    if (selectedDate !== 'all') {
      if (!r.formattedDate.includes(selectedDate)) return false;
    }
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#121922] w-full max-w-lg rounded-xl overflow-hidden shadow-2xl border border-[#223042] flex flex-col max-h-[90vh]">
        {/* Header - SportyBet Red Style */}
        <div className="bg-[#de1a22] text-white px-4 py-3 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-300" />
            <div>
              <h2 className="text-base font-extrabold tracking-tight">End Match Results & Scores</h2>
              <p className="text-[10px] text-white/80 font-medium">
                Official FT Results from Football API (API-Sports)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white hover:bg-white/20 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Live sync banner */}
        <div className="bg-[#182330] px-4 py-2 border-b border-[#223042] flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#00df59] animate-pulse" />
            <span className="text-neutral-300 font-medium">
              Source: <strong className="text-white">{apiSource.includes('api_football') ? 'API-Football (Live)' : 'Official Football Database'}</strong>
            </span>
            {lastUpdated && (
              <span className="text-neutral-500 text-[11px]">({lastUpdated})</span>
            )}
          </div>
          <button
            onClick={() => {
              loadResults();
              showToast('Syncing official results from Football API...');
            }}
            disabled={isLoading}
            className="flex items-center space-x-1 text-[#00df59] hover:underline font-bold text-[11px] cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Sync Live</span>
          </button>
        </div>

        {/* Search & Filter Controls */}
        <div className="p-3 bg-[#151e29] border-b border-[#223042] space-y-2 shrink-0">
          {/* Search bar */}
          <div className="relative flex items-center bg-[#1c2737] rounded-md border border-[#2b3b50] overflow-hidden">
            <Search className="w-4 h-4 text-neutral-400 ml-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search team (e.g. Slovan, Stuttgart, Liverpool)..."
              className="w-full px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none bg-transparent"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="px-2 text-neutral-400 hover:text-white text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Date Pills */}
          <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5 text-[11px]">
            <span className="text-neutral-400 text-[10px] uppercase font-bold shrink-0">Date:</span>
            {[
              { id: 'all', label: 'All Dates' },
              { id: '14/10', label: '14 Oct (Today)' },
              { id: '13/10', label: '13 Oct' },
              { id: '12/10', label: '12 Oct' },
              { id: '11/10', label: '11 Oct' }
            ].map((d) => (
              <button
                key={d.id}
                onClick={() => setSelectedDate(d.id)}
                className={`px-2.5 py-1 rounded font-semibold shrink-0 cursor-pointer transition-colors ${
                  selectedDate === d.id
                    ? 'bg-[#00a826] text-white shadow-sm'
                    : 'bg-[#1e2a3a] text-neutral-300 hover:bg-[#253448]'
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>

          {/* League Dropdown Filter */}
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-neutral-400 text-[10px] uppercase font-bold shrink-0">League:</span>
            <select
              value={selectedLeague}
              onChange={(e) => setSelectedLeague(e.target.value)}
              className="bg-[#1c2737] text-white border border-[#2b3b50] rounded px-2 py-1 text-xs focus:outline-none flex-1 truncate"
            >
              <option value="all">All Leagues ({results.length} matches)</option>
              {leagues.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 divide-y divide-[#1e2a39]">
          {isLoading && results.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-2">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#00df59]" />
              <p>Fetching official match results from Football API...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="py-12 text-center text-xs text-neutral-400 space-y-1">
              <p className="font-bold text-white text-sm">No finished match results found</p>
              <p>Try resetting the search or selecting &apos;All Dates&apos;.</p>
            </div>
          ) : (
            filteredResults.map((match) => {
              const isSlovanStuttgart =
                match.homeTeam.toLowerCase().includes('slovan') &&
                match.awayTeam.toLowerCase().includes('stuttgart');

              return (
                <div
                  key={match.id}
                  className={`pt-2.5 first:pt-0 rounded-lg p-3 transition-colors ${
                    isSlovanStuttgart
                      ? 'bg-[#182a20] border border-[#00df59]/40 shadow-md'
                      : 'bg-[#16212e] border border-[#223143] hover:bg-[#1a2736]'
                  }`}
                >
                  {/* Meta row: League, Country, Date, Status */}
                  <div className="flex items-center justify-between text-[11px] mb-2">
                    <div className="flex items-center space-x-1.5 text-neutral-300">
                      <span className="font-bold text-neutral-200">{match.league}</span>
                      <span className="text-neutral-500">•</span>
                      <span className="text-neutral-400">{match.country}</span>
                    </div>

                    <div className="flex items-center space-x-1.5">
                      <span className="text-neutral-400 font-mono text-[10px]">
                        {match.formattedDate} {match.formattedTime}
                      </span>
                      <span className="bg-[#1a3824] border border-[#00df59]/60 text-[#00df59] font-black text-[10px] px-2 py-0.5 rounded shadow-sm">
                        FT (Finished)
                      </span>
                    </div>
                  </div>

                  {/* Main Scoreboard: Home Team vs Away Team */}
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 py-1">
                    {/* Home Team */}
                    <div className="text-right">
                      <div className={`font-bold text-sm ${match.homeScore > match.awayScore ? 'text-[#00df59]' : 'text-white'}`}>
                        {match.homeTeam}
                      </div>
                      <div className="text-[10px] text-neutral-400">Home</div>
                    </div>

                    {/* Official FT Score Badge */}
                    <div className="px-3.5 py-1.5 bg-[#0f1722] border-2 border-[#2b3c52] rounded-lg shadow-inner text-center min-w-[76px]">
                      <div className="text-lg font-black tracking-widest text-white">
                        {match.homeScore} : {match.awayScore}
                      </div>
                      {match.htScore && (
                        <div className="text-[9px] text-neutral-400 font-mono">
                          HT {match.htScore}
                        </div>
                      )}
                    </div>

                    {/* Away Team */}
                    <div className="text-left">
                      <div className={`font-bold text-sm ${match.awayScore > match.homeScore ? 'text-[#00df59]' : 'text-white'}`}>
                        {match.awayTeam}
                      </div>
                      <div className="text-[10px] text-neutral-400">Away</div>
                    </div>
                  </div>

                  {/* Winner / Outcome banner */}
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1.5 text-neutral-300">
                      <span className="text-neutral-400 text-[11px]">Official Outcome:</span>
                      <span className="font-bold text-white bg-[#1e2a3a] px-2 py-0.5 rounded text-[11px]">
                        {match.winner === 'Home' ? `${match.homeTeam} Win (1)` : match.winner === 'Away' ? `${match.awayTeam} Win (2)` : 'Draw (X)'}
                      </span>
                    </div>

                    {isSlovanStuttgart && (
                      <span className="text-[#00df59] font-bold text-[11px] flex items-center space-x-1">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Exact 0:3 Match Winner</span>
                      </span>
                    )}
                  </div>

                  {/* Goal events if available */}
                  {match.events && match.events.length > 0 && (
                    <div className="mt-2 pt-1.5 border-t border-white/5 text-[11px] text-neutral-300 space-y-0.5">
                      <div className="text-[10px] font-bold uppercase text-neutral-500">Key Match Events:</div>
                      {match.events.map((evt, eIdx) => (
                        <div key={eIdx} className="flex items-center space-x-2 text-neutral-300">
                          <span className="font-mono text-neutral-400 font-bold">{evt.minute}</span>
                          <span>⚽</span>
                          <span className="font-medium text-white">{evt.player}</span>
                          <span className="text-neutral-500 text-[10px]">({evt.team === 'away' ? match.awayTeam : match.homeTeam})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#151e29] border-t border-[#223042] p-3 flex items-center justify-between shrink-0">
          <div className="text-[11px] text-neutral-400">
            Showing {filteredResults.length} completed matches
          </div>
          <button
            onClick={onClose}
            className="bg-[#243346] hover:bg-[#2d3f57] text-white font-bold text-xs px-4 py-1.5 rounded cursor-pointer transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
