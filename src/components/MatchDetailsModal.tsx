import React, { useState } from 'react';
import { X, Flame, BarChart2 } from 'lucide-react';
import { Match } from '../types';
import { OddButton } from './OddButton';

interface MatchDetailsModalProps {
  match: Match | null;
  onClose: () => void;
}

export const MatchDetailsModal: React.FC<MatchDetailsModalProps> = ({ match, onClose }) => {
  const [activeTab, setActiveTab] = useState('All');

  if (!match) return null;

  const marketTabs = ['All', 'Match Result', 'Goals', 'Double Chance', 'Halves', 'Handicap'];

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div 
        className="w-full max-w-md bg-[#161d26] text-white rounded-t-xl sm:rounded-xl max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-neutral-800 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="bg-[#1e2733] px-4 py-3 flex items-center justify-between border-b border-neutral-700/50">
          <div className="flex items-center space-x-2 truncate">
            {match.isHot && <Flame className="w-4 h-4 text-amber-500 fill-amber-500 shrink-0" />}
            <span className="text-xs text-neutral-300 font-medium truncate">
              {match.countryOrCategory} - {match.league}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-neutral-400 hover:text-white hover:bg-neutral-700/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Match scoreboard banner */}
        <div className="bg-gradient-to-b from-[#1a222c] to-[#141a22] px-4 py-4 border-b border-neutral-800 text-center">
          {match.isLive ? (
            <div className="inline-flex items-center space-x-1.5 bg-[#00a826]/20 border border-[#00a826]/40 px-2.5 py-0.5 rounded-full text-[#00df59] text-xs font-bold mb-2">
              <span className="w-2 h-2 rounded-full bg-[#00df59] animate-pulse" />
              <span>LIVE {match.period} {match.minute}</span>
            </div>
          ) : (
            <div className="text-xs text-neutral-400 mb-2">
              {match.startTime || 'Today 18:00'} • ID: {match.gameId}
            </div>
          )}

          <div className="flex items-center justify-between px-2">
            <div className="flex-1 text-center font-bold text-sm sm:text-base">
              {match.homeTeam}
            </div>

            <div className="px-4 py-1 mx-2 bg-[#222b36] rounded font-black text-lg tracking-wider text-white border border-neutral-700/50">
              {match.isLive ? `${match.homeScore ?? 0} : ${match.awayScore ?? 0}` : 'VS'}
            </div>

            <div className="flex-1 text-center font-bold text-sm sm:text-base">
              {match.awayTeam}
            </div>
          </div>
        </div>

        {/* Markets category tabs */}
        <div className="flex overflow-x-auto no-scrollbar border-b border-neutral-800 bg-[#141b23] text-xs px-2">
          {marketTabs.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 shrink-0 font-medium transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-[#00df59] text-[#00df59] font-bold'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Markets List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* 1X2 Market */}
          {match.markets['1X2'] && (
            <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-neutral-200">1X2 (Full Time)</span>
                <span className="text-[11px] text-neutral-500">Regular time only</span>
              </div>
              <div className="flex space-x-2">
                {match.markets['1X2'].map(odd => (
                  <OddButton key={odd.id} match={match} marketName="1X2" odd={odd} />
                ))}
              </div>
            </div>
          )}

          {/* Over / Under Market */}
          {match.markets['O/U'] && (
            <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-neutral-200">Total Goals (Over/Under 2.5)</span>
                <span className="text-[11px] text-neutral-500">Goals 90 min</span>
              </div>
              <div className="flex space-x-2">
                {match.markets['O/U'].map(odd => (
                  <OddButton key={odd.id} match={match} marketName="O/U" odd={odd} />
                ))}
              </div>
            </div>
          )}

          {/* Double Chance Market */}
          {match.markets['DC'] && (
            <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-neutral-200">Double Chance</span>
                <span className="text-[11px] text-neutral-500">1X, 12, X2</span>
              </div>
              <div className="flex space-x-2">
                {match.markets['DC'].map(odd => (
                  <OddButton key={odd.id} match={match} marketName="DC" odd={odd} />
                ))}
              </div>
            </div>
          )}

          {/* 1st Half O/U */}
          {match.markets['1st Half O/U'] && (
            <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-neutral-200">1st Half - Over/Under</span>
                <span className="text-[11px] text-neutral-500">1st Half goals only</span>
              </div>
              <div className="flex space-x-2">
                {match.markets['1st Half O/U'].map(odd => (
                  <OddButton key={odd.id} match={match} marketName="1st Half O/U" odd={odd} />
                ))}
              </div>
            </div>
          )}

          {/* Handicap */}
          {match.markets['Handicap'] && (
            <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
              <div className="flex justify-between items-center mb-2.5">
                <span className="text-xs font-bold text-neutral-200">Handicap</span>
                <span className="text-[11px] text-neutral-500">Goal advantage</span>
              </div>
              <div className="flex space-x-2">
                {match.markets['Handicap'].map(odd => (
                  <OddButton key={odd.id} match={match} marketName="Handicap" odd={odd} />
                ))}
              </div>
            </div>
          )}

          {/* Both Teams To Score (GG / NG) */}
          <div className="bg-[#1b232e] rounded-lg p-3 border border-neutral-800">
            <div className="flex justify-between items-center mb-2.5">
              <span className="text-xs font-bold text-neutral-200">Both Teams To Score (GG/NG)</span>
            </div>
            <div className="flex space-x-2">
              <OddButton
                match={match}
                marketName="GG/NG"
                odd={{ id: `${match.id}-gg`, name: 'Yes (GG)', value: 1.78, trend: 'same' }}
              />
              <OddButton
                match={match}
                marketName="GG/NG"
                odd={{ id: `${match.id}-ng`, name: 'No (NG)', value: 1.95, trend: 'same' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
