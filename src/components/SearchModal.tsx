import React, { useState } from 'react';
import { Search, X, Flame, ChevronRight } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { Match } from '../types';

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, matches, toggleSelection } = useBetting();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const filtered = matches.filter(m =>
    m.homeTeam.toLowerCase().includes(query.toLowerCase()) ||
    m.awayTeam.toLowerCase().includes(query.toLowerCase()) ||
    m.league.toLowerCase().includes(query.toLowerCase()) ||
    m.gameId.includes(query)
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-start justify-center p-0 sm:p-4 pt-0">
      <div className="w-full max-w-md bg-[#161e27] text-white min-h-[60vh] max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-800">
        {/* Search header */}
        <div className="bg-[#de1a22] p-3 flex items-center space-x-2">
          <div className="flex-1 relative flex items-center bg-white rounded-[4px] overflow-hidden">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team, league, or game ID..."
              className="w-full px-3 py-2 text-xs text-neutral-800 focus:outline-none placeholder-neutral-400 font-medium"
              autoFocus
            />
            <Search className="w-4 h-4 text-neutral-500 mr-2 shrink-0" />
          </div>
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 rounded text-white hover:bg-white/10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3 divide-y divide-[#222d3b]">
          {query.trim() === '' ? (
            <div className="py-8 text-center text-neutral-400 text-xs">
              <p className="font-semibold text-neutral-300">Quick Searches</p>
              <div className="flex flex-wrap gap-2 justify-center mt-3">
                {['Inter Milano', 'Arsenal', 'Real Madrid', 'EFL Trophy', 'Bayern Munich', 'NBA'].map(t => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="bg-[#202a37] text-neutral-300 hover:text-white px-2.5 py-1 rounded text-xs"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-xs">
              No matches found for "{query}"
            </div>
          ) : (
            filtered.map(match => (
              <div key={match.id} className="py-3">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 mb-1">
                  <span>{match.countryOrCategory} - {match.league}</span>
                  <span>ID: {match.gameId}</span>
                </div>
                <div className="text-xs font-bold text-white">
                  {match.homeTeam} vs {match.awayTeam}
                </div>
                <div className="flex space-x-2 mt-2">
                  {match.markets['1X2']?.map(odd => (
                    <button
                      key={odd.id}
                      onClick={() => {
                        toggleSelection(match, '1X2', odd);
                        setIsSearchOpen(false);
                      }}
                      className="flex-1 py-1.5 bg-[#222b36] hover:bg-[#00a826] hover:text-white text-[#00df59] font-bold text-xs rounded transition-colors text-center"
                    >
                      <span className="text-[10px] text-neutral-400 mr-1">{odd.name}:</span>
                      <span>{odd.value.toFixed(2)}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
