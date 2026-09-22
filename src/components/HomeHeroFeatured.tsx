import React, { useState, useEffect } from 'react';
import {
  Tv,
  Share2,
  Plane,
  Grid,
  MoreHorizontal,
  Flame,
  BarChart2,
  Ticket,
  ChevronRight,
  Globe,
  Trophy,
  Dices,
  Sparkles,
  Gamepad2
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { Match, OddItem } from '../types';

interface HomeHeroFeaturedProps {
  onOpenBookingCode: () => void;
  onOpenAviator: () => void;
  onSelectTournament: (name: string) => void;
}

export const HomeHeroFeatured: React.FC<HomeHeroFeaturedProps> = ({
  onOpenBookingCode,
  onOpenAviator,
  onSelectTournament
}) => {
  const { toggleSelection, betslip, showToast, setActiveTab } = useBetting();
  const [activeTournamentTab, setActiveTournamentTab] = useState("TODAY'S FOOTBALL");
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<'Matches' | 'Games' | 'Codes' | 'Virtuals'>('Matches');

  // Featured live match: Real Madrid W vs Paris Saint-Germain W (from screenshot)
  const featuredMatch: Match = {
    id: 'feat-uefa-rm-psg',
    gameId: '29810',
    sport: 'football',
    league: 'UEFA Champions League Women',
    countryOrCategory: 'International Clubs',
    homeTeam: 'Real Madrid W',
    awayTeam: 'Paris Saint-Germain W',
    homeScore: 1,
    awayScore: 0,
    minute: "2:41 H1",
    period: "H1",
    isLive: true,
    startTime: 'Live',
    isHot: true,
    hasLiveStream: true,
    marketsCount: 145,
    markets: {
      '1X2': [
        { id: 'feat-rm-1', name: '1', value: 1.22, trend: 'same' },
        { id: 'feat-rm-x', name: 'X', value: 6.00, trend: 'same' },
        { id: 'feat-rm-2', name: '2', value: 8.75, trend: 'same' }
      ]
    }
  };

  const tournamentFilters = [
    "TODAY'S FOOTBALL",
    "FOOTBALL IN NEXT 3 HOURS",
    "AFCON QUALIFIERS",
    "UEFA LEAGUES"
  ];

  const quickNavItems = [
    {
      id: 'all_sports',
      label: 'All Sports',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-white">
          ⚽
        </div>
      ),
      action: () => showToast('Browsing All Sports')
    },
    {
      id: 'live',
      label: 'Live',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-white">
          <Tv className="w-4 h-4 text-white" />
        </div>
      ),
      action: () => showToast('Filtered to Live Events')
    },
    {
      id: 'load_code',
      label: 'Load Code',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-white">
          <Share2 className="w-4 h-4 text-white" />
        </div>
      ),
      action: onOpenBookingCode
    },
    {
      id: 'aviator',
      label: 'Aviator',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-[#ff3344]">
          <Plane className="w-4 h-4 fill-current rotate-[-20deg]" />
        </div>
      ),
      action: onOpenAviator
    },
    {
      id: 'virtuals',
      label: 'Virtuals',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center font-black text-sm text-white">
          V
        </div>
      ),
      action: () => showToast('Virtual Sports Arena')
    },
    {
      id: 'more',
      label: 'More',
      icon: (
        <div className="w-8 h-8 rounded-full border border-neutral-600 flex items-center justify-center text-white">
          <MoreHorizontal className="w-4 h-4" />
        </div>
      ),
      action: () => setActiveTab('az_menu')
    }
  ];

  return (
    <div className="w-full bg-[#121922] text-white border-b border-[#1f2835]">
      {/* =================================================================== */}
      {/* 1. TOP STORY BANNERS ROW (Exact visual match to yellow circle top) */}
      {/* =================================================================== */}
      <div className="px-3 pt-3 pb-2 flex items-center space-x-2.5 overflow-x-auto no-scrollbar">
        {/* Banner 1: Aviator Missions */}
        <div
          onClick={onOpenAviator}
          className="shrink-0 w-22 h-24 rounded-lg bg-gradient-to-b from-[#2d1120] to-[#5a1628] border border-[#782236]/60 p-2 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md group hover:border-[#ff3344] transition-all"
        >
          <div className="absolute -right-2 top-0 opacity-40 group-hover:scale-110 transition-transform">
            <Plane className="w-14 h-14 text-[#ff2e43] -rotate-12 fill-current" />
          </div>
          <div className="w-6 h-6 rounded-full bg-[#ff2e43]/20 flex items-center justify-center text-[#ff4455]">
            <Plane className="w-3.5 h-3.5 fill-current -rotate-12" />
          </div>
          <span className="text-[11px] font-black leading-tight text-white relative z-10">
            Aviator<br />Missions
          </span>
        </div>

        {/* Banner 2: Lucky Numbers */}
        <div
          onClick={() => showToast('Lucky Numbers: Pick & Win Instant Jackpots')}
          className="shrink-0 w-22 h-24 rounded-lg bg-gradient-to-b from-[#251515] to-[#451818] border border-[#6b2727]/60 p-2 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md group hover:border-amber-400 transition-all"
        >
          <div className="absolute right-0 top-1 text-2xl opacity-80 group-hover:scale-110 transition-transform">
            ⚽🪙
          </div>
          <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400">
            <Dices className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black leading-tight text-white relative z-10">
            Lucky<br />Numbers
          </span>
        </div>

        {/* Banner 3: Jackpot */}
        <div
          onClick={() => showToast('SportyBet 12-Match Super Jackpot: Win GHS 350,000!')}
          className="shrink-0 w-22 h-24 rounded-lg bg-gradient-to-b from-[#13222e] to-[#14374a] border border-[#20526e]/60 p-2 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md group hover:border-cyan-400 transition-all"
        >
          <div className="absolute -right-1 top-1 opacity-70 group-hover:scale-110 transition-transform text-cyan-300">
            <Trophy className="w-11 h-11 text-amber-300 fill-amber-300/30" />
          </div>
          <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300 font-black text-xs">
            S
          </div>
          <span className="text-[11px] font-black leading-tight text-white relative z-10">
            Jackpot
          </span>
        </div>

        {/* Banner 4: SportyPicks */}
        <div
          onClick={() => showToast('SportyPicks: Free predictor with cash prizes')}
          className="shrink-0 w-22 h-24 rounded-lg bg-gradient-to-b from-[#1d1b2e] to-[#2e2652] border border-[#483c7d]/60 p-2 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md group hover:border-purple-400 transition-all"
        >
          <div className="absolute right-1 top-1 text-xl opacity-75 group-hover:scale-110 transition-transform">
            👥⚡
          </div>
          <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-300">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black leading-tight text-white relative z-10">
            SportyPicks
          </span>
        </div>

        {/* Banner 5: Promotions */}
        <div
          onClick={() => showToast('Promotions: 1000% Multi-Bet Bonus & Free Bets')}
          className="shrink-0 w-22 h-24 rounded-lg bg-gradient-to-b from-[#2e2311] to-[#573e16] border border-[#785926]/60 p-2 flex flex-col justify-between cursor-pointer relative overflow-hidden shadow-md group hover:border-amber-300 transition-all"
        >
          <div className="absolute right-1 top-1 text-2xl opacity-75 group-hover:scale-110 transition-transform">
            ⚡👑
          </div>
          <div className="w-6 h-6 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-300">
            <Trophy className="w-3.5 h-3.5" />
          </div>
          <span className="text-[11px] font-black leading-tight text-white relative z-10">
            Promotions
          </span>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 2. QUICK NAVIGATION ICONS ROW (All Sports, Live, Load Code...) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-6 gap-1 px-2 py-2.5 border-t border-[#1c2430] text-center">
        {quickNavItems.map(item => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center space-y-1 hover:opacity-90 active:scale-95 transition-transform"
          >
            {item.icon}
            <span className="text-[10px] text-neutral-300 font-semibold tracking-tight truncate w-full">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      {/* =================================================================== */}
      {/* 3. TOURNAMENT FILTER STRIP (TODAY'S FOOTBALL, AFCON...) */}
      {/* =================================================================== */}
      <div className="flex bg-[#121922] border-t border-b border-[#212b38] overflow-x-auto no-scrollbar">
        {tournamentFilters.map(t => {
          const isActive = activeTournamentTab === t;
          return (
            <button
              key={t}
              onClick={() => {
                setActiveTournamentTab(t);
                onSelectTournament(t);
              }}
              className={`shrink-0 px-3.5 py-2.5 text-[11px] font-black tracking-wide border-r border-[#1c2430] transition-colors relative ${
                isActive ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              {t}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#de1a22]" />
              )}
            </button>
          );
        })}
      </div>

      {/* =================================================================== */}
      {/* 4. FEATURED SUB-NAV BAR (Featured | Matches, Games, Codes...) */}
      {/* =================================================================== */}
      <div className="px-3 pt-3 pb-2 flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          <span className="text-base font-black text-white">Featured</span>

          <div className="flex items-center space-x-3 text-xs font-bold">
            <button
              onClick={() => setActiveFeaturedTab('Matches')}
              className={`transition-colors ${
                activeFeaturedTab === 'Matches' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Matches
            </button>
            <button
              onClick={() => {
                setActiveFeaturedTab('Games');
                setActiveTab('games');
              }}
              className={`transition-colors ${
                activeFeaturedTab === 'Games' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => {
                setActiveFeaturedTab('Codes');
                onOpenBookingCode();
              }}
              className={`transition-colors ${
                activeFeaturedTab === 'Codes' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Codes
            </button>
            <button
              onClick={() => {
                setActiveFeaturedTab('Virtuals');
                showToast('SportyBet Virtual Football League');
              }}
              className={`transition-colors ${
                activeFeaturedTab === 'Virtuals' ? 'text-[#00df59]' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Vir...
            </button>
          </div>
        </div>

        {/* Green ticket receipt icon on far right */}
        <button
          onClick={onOpenBookingCode}
          title="Booking Codes"
          className="text-[#00df59] hover:text-emerald-400 p-1"
        >
          <Ticket className="w-4 h-4 stroke-[2.2]" />
        </button>
      </div>

      {/* =================================================================== */}
      {/* 5. TOURNAMENT CAPSULE PILL: UEFA Champions League Women */}
      {/* =================================================================== */}
      <div className="px-3 pb-2">
        <div className="bg-[#1b2532] border border-[#273444] rounded-full px-3 py-1.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-200 truncate">
            <span>⚽</span>
            <span className="truncate">UEFA Champions League Women</span>
          </div>

          <div className="flex items-center space-x-1.5 shrink-0 ml-2">
            <div className="w-4 h-4 rounded-full bg-blue-600/30 border border-blue-400 flex items-center justify-center text-[9px] text-blue-300">
              🌐
            </div>
            <div className="w-4 h-4 rounded-full bg-rose-600/30 border border-rose-400 flex items-center justify-center text-[9px] text-rose-300">
              ⚽
            </div>
          </div>
        </div>
      </div>

      {/* =================================================================== */}
      {/* 6. BIG FEATURED MATCH CARD: Real Madrid W vs PSG W (Exact match) */}
      {/* =================================================================== */}
      <div className="px-3 pb-3">
        <div className="bg-[#16202c] border border-[#232e3d] rounded-md p-3 shadow-md">
          {/* Card Top: HOT 🔥, STV, Tournament Link, Stats Icon */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f2936]">
            <div className="flex items-center space-x-2 truncate">
              {/* HOT Badge */}
              <span className="bg-[#de1a22] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                <span>HOT</span>
                <span>🔥</span>
              </span>

              {/* STV Live Stream Badge */}
              <span className="bg-[#b3141b] text-white text-[9px] font-black px-1 py-0.2 rounded tracking-tighter">
                STV
              </span>

              {/* Tournament link */}
              <span className="text-[#00df59] underline font-semibold text-[11px] truncate">
                Football - International Clubs - UEFA Champio...
              </span>
            </div>

            <button
              onClick={() => showToast('Opening UEFA Head-to-Head Statistics')}
              className="text-neutral-400 hover:text-white shrink-0 ml-1"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teams, Score and Live Clock */}
          <div className="grid grid-cols-3 items-center py-3 text-center">
            {/* Home: Real Madrid W */}
            <div className="flex flex-col items-center space-y-1">
              {/* Real Madrid crest */}
              <div className="w-10 h-10 rounded-full bg-white/10 border border-amber-400/50 flex items-center justify-center shadow-inner relative">
                <span className="text-lg">👑</span>
              </div>
              <span className="text-xs font-bold text-neutral-200 leading-tight">
                Real Madrid W
              </span>
            </div>

            {/* Center: Score + Live badge + 1X2 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="text-xl font-black text-white tracking-wider">
                1 - 0
              </span>

              <div className="flex items-center space-x-1.5">
                <span className="bg-[#00a826] text-white text-[10px] font-extrabold px-1.5 py-0.2 rounded-sm">
                  Live
                </span>
                <span className="text-[11px] font-bold text-neutral-300">
                  2:41 H1
                </span>
              </div>

              <span className="text-xs font-black text-[#00df59] pt-0.5">
                1X2
              </span>
            </div>

            {/* Away: Paris Saint-Germain W */}
            <div className="flex flex-col items-center space-y-1">
              {/* PSG crest */}
              <div className="w-10 h-10 rounded-full bg-blue-950 border border-blue-400/50 flex items-center justify-center shadow-inner">
                <span className="text-xs font-black text-rose-500">PSG</span>
              </div>
              <span className="text-xs font-bold text-neutral-200 leading-tight">
                Paris Saint-Germain W
              </span>
            </div>
          </div>

          {/* Bottom Odds Row (1, X, 2) in green text matching screenshot */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {featuredMatch.markets['1X2'].map(odd => {
              const isSelected = betslip.some(
                s => s.matchId === featuredMatch.id && s.marketName === '1X2' && s.selectionName === odd.name
              );
              return (
                <button
                  key={odd.id}
                  onClick={() => toggleSelection(featuredMatch, '1X2', odd)}
                  className={`py-2 px-2.5 rounded-[3px] border flex items-center justify-between text-xs font-black transition-all ${
                    isSelected
                      ? 'bg-[#00df59] text-black border-[#00df59]'
                      : 'bg-[#1b2532] text-[#00df59] border-[#253242] hover:bg-[#232f3f]'
                  }`}
                >
                  <span className={`${isSelected ? 'text-black' : 'text-neutral-400'} font-bold`}>
                    {odd.name}
                  </span>
                  <span>{odd.value.toFixed(2)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
