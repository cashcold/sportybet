import React, { useState } from 'react';
import { Flame, BarChart2, SlidersHorizontal, ChevronRight, ArrowRight, RefreshCw, Zap, X } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { Match } from '../types';
import { OddButton } from './OddButton';
import { MatchDetailsModal } from './MatchDetailsModal';
import { HomeHeroFeatured } from './HomeHeroFeatured';

export const SportsView: React.FC = () => {
  const {
    matches,
    selectedSport,
    setSelectedSport,
    selectedLeagueFilter,
    setSelectedLeagueFilter,
    apiFootballConfigured,
    refreshLiveOdds,
    showToast,
    setActiveTab,
    loadBookingCode
  } = useBetting();
  
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isBookingCodeModalOpen, setIsBookingCodeModalOpen] = useState(false);
  const [bookingCodeInput, setBookingCodeInput] = useState('');

  const handleManualSync = async () => {
    setIsRefreshing(true);
    await refreshLiveOdds();
    setIsRefreshing(false);
    if (!apiFootballConfigured) {
      showToast('API-Football: Add API_FOOTBALL_KEY in AI Studio Settings to load real in-play odds');
    }
  };
  
  // Market tab state
  const [liveMarket, setLiveMarket] = useState('1X2');
  const [sportsSubTab, setSportsSubTab] = useState<'Highlights' | 'Today' | 'Countries'>('Highlights');
  const [sportsMarket, setSportsMarket] = useState('1X2');
  const [upToggle, setUpToggle] = useState<'1UP' | '2UP'>('1UP');
  const [detailMatch, setDetailMatch] = useState<Match | null>(null);

  const sportsList = ['Football', 'vFootball', 'Basketball', 'Tennis', 'eFootball'];
  const marketTypes = ['1X2', 'O/U', 'DC', '1st Half O/U', 'Handicap'];

  const liveMatches = matches.filter(m => m.isLive);
  const upcomingMatches = matches.filter(m => !m.isLive);

  const handleLoadBookingCodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingCodeInput.trim()) return;
    const ok = loadBookingCode(bookingCodeInput.trim());
    if (ok) {
      setIsBookingCodeModalOpen(false);
      setBookingCodeInput('');
      showToast(`Booking Code ${bookingCodeInput.toUpperCase()} loaded into slip!`);
    } else {
      showToast('Booking code not found. Try code: SPORTY10');
    }
  };

  return (
    <div className="pb-24 bg-[#141a22] text-white min-h-screen">
      {/* ========================================================= */}
      {/* 0. HOME HERO FEATURED SECTION (Exact match to uploaded screenshot) */}
      {/* Stories, Quick Nav, Tournament Filters, Featured Match */}
      {/* ========================================================= */}
      <HomeHeroFeatured
        onOpenBookingCode={() => setIsBookingCodeModalOpen(true)}
        onOpenAviator={() => setActiveTab('games')}
        onSelectTournament={(tourn) => {
          showToast(`Filtered: ${tourn}`);
        }}
      />

      {/* ========================================================= */}
      {/* 1. LIVE SECTION (Screenshot 1 & 3) */}
      {/* ========================================================= */}
      <section className="border-b border-[#212b38]">
        {/* Live Top Bar: 'Live' title + Sports scrollbar + API-Football sync indicator */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1 border-b border-[#1c2430]">
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar text-xs font-semibold flex-1">
            <span className="text-[17px] font-black tracking-wide text-white mr-1 shrink-0">Live</span>
            {sportsList.map(sport => {
              const isActive = selectedSport.toLowerCase() === sport.toLowerCase();
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport.toLowerCase())}
                  className={`shrink-0 transition-colors pb-1 ${
                    isActive ? 'text-[#00df59] font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {sport}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleManualSync}
            title={apiFootballConfigured ? 'API-Football Live Synced' : 'Sync live odds / check API'}
            className="shrink-0 ml-2 px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 bg-[#1a2330] border border-neutral-700/60 text-neutral-300 hover:text-white"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-[#00df59]' : 'text-neutral-400'}`} />
            {apiFootballConfigured ? (
              <span className="text-[#00df59] flex items-center space-x-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#00df59] animate-pulse" />
                <span>API-Football</span>
              </span>
            ) : (
              <span>Live Sync</span>
            )}
          </button>
        </div>

        {/* Live Markets Selector (1X2, O/U, DC, 1st Half O/U, Handicap) + 1UP/2UP Toggle */}
        <div className="flex items-center justify-between px-3 pt-2.5 pb-1 border-b border-[#1b232e]">
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar text-xs">
            {marketTypes.map(m => {
              const isActive = liveMarket === m;
              return (
                <button
                  key={m}
                  onClick={() => setLiveMarket(m)}
                  className={`relative shrink-0 pb-1.5 font-bold transition-colors ${
                    isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  {m === 'Handicap' ? 'Hand' : m}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* 1UP / 2UP Toggle Pill (Matches Screenshot 1000038449 / Screenshot 3) */}
          <div className="flex items-center bg-[#25303f] rounded-full p-0.5 shrink-0 ml-2 border border-neutral-700/60 text-[10px] font-bold">
            <button
              onClick={() => setUpToggle('1UP')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                upToggle === '1UP' ? 'bg-[#79889b] text-black font-black' : 'text-neutral-300'
              }`}
            >
              1UP
            </button>
            <span className="px-0.5 text-neutral-500">•</span>
            <button
              onClick={() => setUpToggle('2UP')}
              className={`px-1.5 py-0.5 rounded-full transition-colors ${
                upToggle === '2UP' ? 'bg-[#79889b] text-black font-black' : 'text-neutral-300'
              }`}
            >
              2UP
            </button>
          </div>
        </div>

        {/* Odds Column Headers: 1  X  2 */}
        <div className="flex items-center justify-between px-3 py-1 bg-[#1a222c]/60 text-[11px] text-neutral-400 font-semibold border-b border-[#212b38]">
          <div className="w-1/2">Match</div>
          <div className="w-1/2 flex items-center justify-around pr-1 text-center font-bold">
            <span className="w-1/3">1</span>
            <span className="w-1/3">X</span>
            <span className="w-1/3">2</span>
          </div>
        </div>

        {/* Live Match Cards */}
        <div className="divide-y divide-[#1e2632]">
          {liveMatches.map(match => {
            const currentOdds = match.markets[liveMarket] || match.markets['1X2'] || [];

            return (
              <div key={match.id} className="p-3 hover:bg-[#18212b] transition-colors">
                {/* Meta header row: HOT, time, league, stats icon */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center space-x-1.5 truncate max-w-[85%]">
                    {match.isHot && (
                      <span className="bg-transparent text-amber-400 italic font-black flex items-center text-[11px] shrink-0">
                        HOT🔥
                      </span>
                    )}
                    <span className="text-[#00df59] font-bold shrink-0">
                      {match.minute} {match.period}
                    </span>
                    <span className="text-neutral-400 truncate">
                      {match.countryOrCategory} - {match.league}
                    </span>
                  </div>
                  <BarChart2 className="w-3.5 h-3.5 text-neutral-400 hover:text-white shrink-0 cursor-pointer" />
                </div>

                {/* Match Info & Odds Grid */}
                <div className="flex items-center justify-between">
                  {/* Left: Teams & Live Scores */}
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
                      +{match.marketsCount}&gt;
                    </button>
                  </div>

                  {/* Right: 3 Odds Buttons (1, X, 2) */}
                  <div className="w-1/2 flex items-center space-x-1.5">
                    {currentOdds.slice(0, 3).map(odd => (
                      <OddButton
                        key={odd.id}
                        match={match}
                        marketName={liveMarket}
                        odd={odd}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* All Live Events link */}
        <div className="px-3 py-2.5 bg-[#161d26] text-right border-t border-[#202936]">
          <button
            onClick={() => {}}
            className="text-[12px] text-[#00df59] font-semibold hover:underline inline-flex items-center space-x-1"
          >
            <span>All Live Events 191</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. SPORTS SECTION (Screenshot 2) */}
      {/* ========================================================= */}
      <section className="mt-2">
        {/* Sports Header: 'Sports' + Sports list + Filter icon */}
        <div className="flex items-center justify-between px-3 pt-3 pb-1 border-b border-[#1c2430]">
          <div className="flex items-center space-x-4 overflow-x-auto no-scrollbar">
            <span className="text-[17px] font-black tracking-wide text-white shrink-0">Sports</span>
            <div className="flex items-center space-x-4 text-xs font-semibold">
              {sportsList.map(sport => {
                const isActive = selectedSport.toLowerCase() === sport.toLowerCase();
                return (
                  <button
                    key={sport}
                    onClick={() => setSelectedSport(sport.toLowerCase())}
                    className={`shrink-0 transition-colors pb-1 ${
                      isActive ? 'text-[#00df59] font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sport}
                  </button>
                );
              })}
            </div>
          </div>
          <button className="p-1 text-neutral-400 hover:text-white shrink-0">
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>

        {/* Subtabs: Highlights | Today | Countries */}
        <div className="flex items-center space-x-6 px-3 pt-2 pb-1 border-b border-[#1b232e] text-xs font-bold">
          {(['Highlights', 'Today', 'Countries'] as const).map(tab => {
            const isActive = sportsSubTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setSportsSubTab(tab)}
                className={`relative pb-1.5 transition-colors ${
                  isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {tab}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59] rounded-full" />
                )}
              </button>
            );
          })}
        </div>

        {/* Markets + 1UP/2UP switcher */}
        <div className="flex items-center justify-between px-3 pt-2 pb-1 border-b border-[#1b232e] text-xs">
          <div className="flex items-center space-x-5 overflow-x-auto no-scrollbar">
            {marketTypes.slice(0, 4).map(m => {
              const isActive = sportsMarket === m;
              return (
                <button
                  key={m}
                  onClick={() => setSportsMarket(m)}
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

          {/* 1UP / 2UP Toggle as shown in screenshot */}
          <div className="flex items-center bg-[#202936] rounded-full p-0.5 border border-neutral-700 shrink-0 text-[10px] font-bold">
            <button
              onClick={() => setUpToggle('1UP')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                upToggle === '1UP' ? 'bg-[#526071] text-white' : 'text-neutral-400'
              }`}
            >
              1UP
            </button>
            <button
              onClick={() => setUpToggle('2UP')}
              className={`px-2 py-0.5 rounded-full transition-all ${
                upToggle === '2UP' ? 'bg-[#526071] text-white' : 'text-neutral-400'
              }`}
            >
              2UP
            </button>
          </div>
        </div>

        {/* Date Row: 22/09 Tuesday + Columns 1  X  2 */}
        <div className="flex items-center justify-between px-3 py-1.5 bg-[#1a222c]/80 text-[11px] text-neutral-300 font-semibold border-b border-[#212b38]">
          <div className="font-bold text-neutral-200">22/09 Tuesday</div>
          <div className="w-1/2 flex items-center justify-around pr-1 text-center font-bold text-neutral-400">
            <span className="w-1/3">1</span>
            <span className="w-1/3">X</span>
            <span className="w-1/3">2</span>
          </div>
        </div>

        {/* Upcoming Matches List */}
        <div className="divide-y divide-[#1e2632]">
          {upcomingMatches.map(match => {
            const currentOdds = match.markets[sportsMarket] || match.markets['1X2'] || [];

            return (
              <div key={match.id} className="p-3 hover:bg-[#18212b] transition-colors">
                {/* Meta header */}
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <div className="flex items-center space-x-1.5 truncate max-w-[85%]">
                    {match.isHot && (
                      <span className="bg-transparent text-amber-400 italic font-black flex items-center text-[11px] shrink-0">
                        HOT🔥
                      </span>
                    )}
                    <span className="text-neutral-300 font-semibold shrink-0">
                      {match.startTime || '18:00'} ID {match.gameId}
                    </span>
                    <span className="text-neutral-400 truncate">
                      {match.countryOrCategory} - {match.league}
                    </span>
                  </div>
                  <BarChart2 className="w-3.5 h-3.5 text-neutral-400 hover:text-white shrink-0 cursor-pointer" />
                </div>

                {/* Match Info & Odds Grid */}
                <div className="flex items-center justify-between">
                  {/* Left: Teams */}
                  <div 
                    className="w-1/2 pr-2 cursor-pointer"
                    onClick={() => setDetailMatch(match)}
                  >
                    <div className="text-xs font-semibold text-neutral-100 truncate">
                      {match.homeTeam}
                    </div>
                    <div className="text-xs font-semibold text-neutral-100 truncate mt-0.5">
                      {match.awayTeam}
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailMatch(match);
                      }}
                      className="text-[11px] text-neutral-400 hover:text-white mt-1 flex items-center font-medium"
                    >
                      +{match.marketsCount}&gt;
                    </button>
                  </div>

                  {/* Right: 3 Odds Buttons */}
                  <div className="w-1/2 flex items-center space-x-1.5">
                    {currentOdds.slice(0, 3).map(odd => (
                      <OddButton
                        key={odd.id}
                        match={match}
                        marketName={sportsMarket}
                        odd={odd}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Full Market Details Modal */}
      <MatchDetailsModal
        match={detailMatch}
        onClose={() => setDetailMatch(null)}
      />

      {/* Booking Code Modal */}
      {isBookingCodeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-[#1b2532] border border-[#2b394a] rounded-lg w-full max-w-sm p-4 space-y-4 shadow-2xl animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-[#243040]">
              <h3 className="font-black text-sm text-white flex items-center space-x-2">
                <span>📋</span>
                <span>Load Booking Code</span>
              </h3>
              <button
                onClick={() => setIsBookingCodeModalOpen(false)}
                className="text-neutral-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleLoadBookingCodeSubmit} className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Enter Booking Code
                </label>
                <input
                  type="text"
                  value={bookingCodeInput}
                  onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
                  placeholder="e.g. SPORTY10 or BC8912"
                  className="w-full bg-[#121922] border border-neutral-700 rounded px-3 py-2.5 text-xs text-white uppercase font-mono tracking-widest focus:outline-none focus:border-[#00df59]"
                  autoFocus
                />
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setIsBookingCodeModalOpen(false)}
                  className="flex-1 py-2 bg-[#253243] hover:bg-[#2d3c50] text-xs font-bold rounded text-neutral-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-[#00a826] hover:bg-[#009221] text-xs font-black rounded text-white shadow"
                >
                  Load Slip
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
