import React, { useState } from 'react';
import {
  Tv,
  Share2,
  Plane,
  MoreHorizontal,
  BarChart2,
  Ticket,
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { Match } from '../types';
import { PromoFeatureModal, PromoFeatureItem } from './PromoFeatureModal';

// High-fidelity generated image assets for cards
import luckynumbersImg from '../assets/images/luckynumbers_card_1790159844507.jpg';
import aviatorImg from '../assets/images/aviator_card_1790159858969.jpg';
import jackpotImg from '../assets/images/jackpot_card_1790159870643.jpg';
import tadaHalloweenImg from '../assets/images/tada_halloween_card_1790159882420.jpg';
import sportypicksImg from '../assets/images/sportypicks_card_1790159897219.jpg';
import casinocashbackImg from '../assets/images/casinocashback_card_1790159908672.jpg';
import autobetImg from '../assets/images/autobet_card_1790159921668.jpg';
import sportysimImg from '../assets/images/sportysim_card_1790159934597.jpg';
import sportypenaltyImg from '../assets/images/sportypenalty_card_1790159944350.jpg';
import dogracingImg from '../assets/images/dogracing_card_1790159959872.jpg';
import basketballImg from '../assets/images/basketball_card_1790159971798.jpg';

interface HomeHeroFeaturedProps {
  onOpenBookingCode: () => void;
  onOpenAviator: () => void;
  onSelectTournament: (name: string) => void;
  onOpenAllLive?: () => void;
}

export const HomeHeroFeatured: React.FC<HomeHeroFeaturedProps> = ({
  onOpenBookingCode,
  onOpenAviator,
  onSelectTournament,
  onOpenAllLive
}) => {
  const { toggleSelection, betslip, showToast, setActiveTab, matches, selectedSport } = useBetting();
  const [activeTournamentTab, setActiveTournamentTab] = useState("TODAY'S FOOTBALL");
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<'Matches' | 'Games' | 'Codes' | 'Virtuals'>('Matches');
  const [selectedPromo, setSelectedPromo] = useState<PromoFeatureItem | null>(null);

  // Exact cards sequence from video (00:00 - 00:03)
  const featuredCards: PromoFeatureItem[] = [
    {
      id: 'eng_vs_esp',
      title: 'ENG vs ESP',
      lines: ['ENG vs ESP'],
      image: luckynumbersImg,
      posterImage: '/luckynumbers.jpg',
      tagline: 'UEFA Nations League Blockbuster',
      description: 'England takes on European champions Spain! Place your bets on the blockbuster showdown with boosted odds.',
      actionText: 'Bet Now',
      actionType: 'modal'
    },
    {
      id: 'aviator_missions',
      title: 'Aviator Missions',
      lines: ['Aviator', 'Missions'],
      image: aviatorImg,
      posterImage: '/Aviator.jpg',
      tagline: 'Complete daily flight missions',
      description: 'Fly high with the red airplane! Cash out before the aircraft flies away to secure up to 10,000x multiplier payouts!',
      actionText: 'Play Now',
      actionType: 'aviator'
    },
    {
      id: 'lucky_numbers',
      title: 'Lucky Numbers',
      lines: ['Lucky', 'Numbers'],
      image: luckynumbersImg,
      posterImage: '/luckynumbers.jpg',
      tagline: "Don't miss the next level of winning",
      description: 'Pick your lucky balls and play global instant lotteries and draws with rapid multipliers and huge jackpot payouts!',
      actionText: 'Bet Now',
      actionType: 'lottery'
    },
    {
      id: 'jackpot',
      title: 'Jackpot',
      lines: ['Jackpot'],
      image: jackpotImg,
      posterImage: '/jackpot.jpg',
      tagline: 'Sporty 12 Jackpot',
      description: 'Predict 12 matches correctly to win the guaranteed GHS 150,000 jackpot prize with weekly consolations!',
      actionText: 'Bet Now',
      actionType: 'modal'
    },
    {
      id: 'intl_challenge',
      title: "Int'l Challenge",
      lines: ["Int'l Challenge"],
      badge: "UP TO GHS 1,500",
      image: tadaHalloweenImg,
      posterImage: '/tada_halloween.jpg',
      tagline: "Predict International football and win up to GHS 1,500!",
      description: 'Compete in the International matches challenge leaderboard. Top predictors share weekly cash prizes!',
      actionText: 'Join Challenge',
      actionType: 'modal'
    },
    {
      id: 'tada_halloween',
      title: 'TaDa Halloween',
      lines: ['TaDa', 'Halloween'],
      image: tadaHalloweenImg,
      posterImage: '/tada_halloween.jpg',
      tagline: 'Spooky Season Slots',
      description: 'Spin the magical witch cauldron with wild multipliers, free spins, and instant spooky treats!',
      actionText: 'Play Now',
      actionType: 'modal'
    },
    {
      id: 'sporty_picks',
      title: 'SportyPicks',
      lines: ['SportyPicks'],
      image: sportypicksImg,
      posterImage: '/sportyPicks.jpg',
      tagline: 'Betting simplified: Just YES or NO',
      description: 'Free sports prediction challenge! Answer simple YES/NO questions on European football and win real cash!',
      actionText: 'Play Now',
      actionType: 'modal'
    },
    {
      id: 'casino_cashback',
      title: 'Casino Cashback',
      lines: ['Casino', 'Cashback'],
      image: casinocashbackImg,
      posterImage: '/CasinoCashback.jpg',
      tagline: '400,000 GHS in daily cashback',
      description: 'Enjoy daily cashback on net casino losses up to 10%. Play your favorite casino tables and crash games worry-free!',
      actionText: 'Play Now',
      actionType: 'modal'
    },
    {
      id: 'autobet',
      title: 'AutoBet',
      lines: ['AutoBet'],
      image: autobetImg,
      posterImage: '/autoBet.jpg',
      tagline: 'Never miss your odds again!',
      description: 'Set your target odds threshold and let SportyBet automatically place your bet the instant the market reaches your target!',
      actionText: 'Try Now',
      actionType: 'modal'
    },
    {
      id: 'sportysim',
      title: 'SportySIM',
      lines: ['SportySIM'],
      image: sportysimImg,
      posterImage: '/simbet.jpg',
      tagline: 'Lead by 2? You win! 1/2 Up in SIM',
      description: 'Non-stop virtual football simulations available 24/7 with instant early payouts whenever your team takes a 2-goal lead!',
      actionText: 'Bet Now',
      actionType: 'modal'
    },
    {
      id: 'sporty_penalty',
      title: 'Sporty Penalty',
      lines: ['Sporty Penalty'],
      image: sportypenaltyImg,
      posterImage: '/sportyPenalty.jpg',
      tagline: 'Predict virtual football shootouts',
      description: 'Step up to the penalty spot! Guess where the ball will go or pick the goalie dive direction to win instant cash!',
      actionText: 'Bet Now',
      actionType: 'penalty'
    },
    {
      id: 'dog_racing',
      title: '24/7 Dog Racing',
      lines: ['24/7 Dog', 'Racing'],
      image: dogracingImg,
      posterImage: '/24+7.jpg',
      tagline: 'Instant Greyhound Racing',
      description: 'High-speed 6-greyhound races run every 2 minutes. Bet on Win, Exacta, Quinella, and Trifecta with live virtual tracking!',
      actionText: 'Play Now',
      actionType: 'modal'
    },
    {
      id: 'basketball',
      title: '24/7 Basketball',
      lines: ['24/7', 'Basketball'],
      image: basketballImg,
      posterImage: '/24+7Basketball.jpg',
      tagline: 'Instant Basketball Virtuals',
      description: 'Non-stop simulated basketball court action! Real-time quarters, team handicaps, and over/under markets on every fixture.',
      actionText: 'Play Now',
      actionType: 'modal'
    }
  ];

  const handleCardClick = (card: PromoFeatureItem) => {
    if (card.id === 'aviator') {
      onOpenAviator();
    } else {
      setSelectedPromo(card);
    }
  };

  // Featured hero match derived from video (England vs Spain UEFA Nations League)
  const featuredMatch: Match =
    matches.find(m => m.id === 'theodds-eng-esp-nations') ||
    matches.find(m => m.homeTeam === 'England' && m.awayTeam === 'Spain') ||
    matches[0];

  const tournamentFilters = [
    "TODAY'S FOOTBALL",
    "FOOTBALL IN NEXT 3 HOURS",
    "AFCON QUALIFIERS",
    "UEFA NATIONS LEAGUE"
  ];

  const quickNavItems = [
    {
      id: 'all_sports',
      label: 'All Sports',
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 32 32" fill="none">
          {/* Top-left basketball */}
          <circle cx="12" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path d="M5 11h14 M12 4v14" stroke="currentColor" strokeWidth="1.2" />
          <path d="M7 6.5c3 1.8 4.5 4.5 4.5 8" stroke="currentColor" strokeWidth="1.1" />
          {/* Bottom soccer ball */}
          <circle cx="16" cy="22" r="6.5" fill="#121922" stroke="currentColor" strokeWidth="1.8" />
          <polygon points="16,19 18,20.5 17.5,23 14.5,23 14,20.5" fill="currentColor" />
          <path d="M16 19v-2.5 M18 20.5l2-1 M17.5 23l1.5 2 M14.5 23l-1.5 2 M14 20.5l-2-1" stroke="currentColor" strokeWidth="1.2" />
          {/* Right tennis ball */}
          <circle cx="23.5" cy="10.5" r="5.5" fill="#121922" stroke="currentColor" strokeWidth="1.8" />
          <path d="M19 8c2.5 1 3.8 3.2 3.5 5.5" stroke="currentColor" strokeWidth="1.2" />
          <path d="M22 15.5c1-2 2.8-3.2 5.5-3" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ),
      action: () => showToast('Browsing All Sports')
    },
    {
      id: 'live',
      label: 'Live',
      icon: (
        <div className="relative">
          <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="none">
            {/* TV Antenna / Handle */}
            <path d="M10 5l4 3 4-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            {/* TV Screen */}
            <rect x="3" y="8" width="22" height="15" rx="2.5" stroke="currentColor" strokeWidth="2" />
            {/* Play triangle inside */}
            <polygon points="12,12 18,15.5 12,19" fill="currentColor" />
          </svg>
          {/* Red live dot from video */}
          <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
          </span>
        </div>
      ),
      action: onOpenAllLive || (() => showToast('Opening All Live Events'))
    },
    {
      id: 'load_code',
      label: 'Load Code',
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="none">
          {/* 3 Nodes connecting lines */}
          <line x1="14" y1="6.5" x2="6.5" y2="20.5" stroke="currentColor" strokeWidth="2.2" />
          <line x1="14" y1="6.5" x2="21.5" y2="20.5" stroke="currentColor" strokeWidth="2.2" />
          <line x1="6.5" y1="20.5" x2="21.5" y2="20.5" stroke="currentColor" strokeWidth="2.2" />
          {/* 3 Node Circles */}
          <circle cx="14" cy="6.5" r="3.2" fill="#121922" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="6.5" cy="20.5" r="3.2" fill="#121922" stroke="currentColor" strokeWidth="2.4" />
          <circle cx="21.5" cy="20.5" r="3.2" fill="#121922" stroke="currentColor" strokeWidth="2.4" />
        </svg>
      ),
      action: onOpenBookingCode
    },
    {
      id: 'aviator',
      label: 'Aviator',
      icon: (
        <svg className="w-7 h-7 text-[#ff1a2d]" viewBox="0 0 30 22" fill="currentColor">
          {/* Red Aviator Propeller Airplane from Screenshot 1 */}
          <path d="M2 13.5c-.8 0-1.2-.6-.8-1.2l3-2.3L3.8 8.5c-.3-.7.1-1.2.7-1.2l2.5.5L13 4 8 1c-.4-.3-.1-.7.5-.7l8 2 7-2c1.8-.4 3.5.3 4 1.8l1 2.5 2.5.5c.6.1 1 .6 1 1.2s-.4 1.1-1 1.2l-2.5.5-3 4.5c-1 1.8-3.2 2.5-5.2 2.5l-6.2-2L10 18c-.3.6-1 .8-1.6.5L4 16.5l-2-3z" />
          {/* Front Propeller */}
          <line x1="28" y1="2.5" x2="29.5" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
      action: onOpenAviator
    },
    {
      id: 'virtuals',
      label: 'Virtuals',
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          {/* Outer Stylized V from Screenshot 1 */}
          <path d="M4 6l10 17L24 6" strokeWidth="2.8" />
          {/* Inner Stylized V from Screenshot 1 */}
          <path d="M8.5 6l5.5 9.5L19.5 6" strokeWidth="2.8" />
        </svg>
      ),
      action: () => showToast('Virtual Sports Arena')
    },
    {
      id: 'more',
      label: 'More',
      icon: (
        <svg className="w-7 h-7 text-white" viewBox="0 0 28 28" fill="none">
          {/* Circle outline with 3 dots from Screenshot 1 */}
          <circle cx="14" cy="14" r="10.5" stroke="currentColor" strokeWidth="2.2" />
          <circle cx="9.5" cy="14" r="1.5" fill="currentColor" />
          <circle cx="14" cy="14" r="1.5" fill="currentColor" />
          <circle cx="18.5" cy="14" r="1.5" fill="currentColor" />
        </svg>
      ),
      action: () => setActiveTab('az_menu')
    }
  ];

  return (
    <div className="w-full bg-[#121922] text-white border-b border-[#1f2835]">
      {/* =================================================================== */}
      {/* 1. TOP PROMO & GAME CARDS ROW (Exact match to Screenshots 1 & 2)   */}
      {/* Starting from Lucky Numbers to 24/7 Basketball                     */}
      {/* =================================================================== */}
      <div className="px-3 pt-3 pb-2.5 flex items-center space-x-2.5 overflow-x-auto no-scrollbar">
        {featuredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => handleCardClick(card)}
            className="shrink-0 w-20 h-20 rounded-xl overflow-hidden relative shadow-lg cursor-pointer border border-[#2b3648]/80 group hover:scale-[1.03] active:scale-95 transition-all duration-200 bg-[#161f2c]"
          >
            {/* Background Image */}
            <img
              src={card.image}
              alt={card.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 select-none"
              onError={(e) => {
                e.currentTarget.src = card.posterImage;
              }}
            />

            {/* Dark gradient overlay for bottom text legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent pointer-events-none" />

            {/* Bold white title label placed at bottom-left */}
            <div className="absolute bottom-1.5 left-2 right-1 pointer-events-none text-left leading-[1.1]">
              {card.lines.map((line, idx) => (
                <span
                  key={idx}
                  className="block text-white font-black text-[11px] tracking-tight drop-shadow-[0_1.5px_2px_rgba(0,0,0,0.95)]"
                >
                  {line}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* =================================================================== */}
      {/* 2. QUICK NAVIGATION ICONS ROW (All Sports, Live, Load Code...) */}
      {/* =================================================================== */}
      <div className="grid grid-cols-6 gap-1 px-1.5 py-2.5 border-t border-[#1c2430] bg-[#121922] text-center">
        {quickNavItems.map(item => (
          <button
            key={item.id}
            onClick={item.action}
            className="flex flex-col items-center justify-center space-y-1.5 hover:opacity-90 active:scale-95 transition-transform"
          >
            <div className="h-7 flex items-center justify-center">
              {item.icon}
            </div>
            <span className="text-[11px] text-[#e2e8f0] font-normal tracking-tight truncate w-full">
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
      {/* 5. TOURNAMENT CAPSULE PILL (00:02 in video)                         */}
      {/* =================================================================== */}
      <div className="px-3 pb-2">
        <div className="bg-[#1b2532] border border-[#273444] rounded-full px-3 py-1.5 flex items-center justify-between shadow-sm">
          <div className="flex items-center space-x-2 text-xs font-bold text-neutral-200 truncate">
            <span>🏆</span>
            <span className="truncate">UEFA Nations League</span>
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
      {/* 6. BIG FEATURED MATCH CARD (00:02 - 00:05 in video)                 */}
      {/* =================================================================== */}
      <div className="px-3 pb-3">
        <div className="bg-[#16202c] border border-[#232e3d] rounded-md p-3 shadow-md">
          {/* Card Top: POPULAR 🔥, Tournament Link, Stats Icon */}
          <div className="flex items-center justify-between text-xs pb-2 border-b border-[#1f2936]">
            <div className="flex items-center space-x-2 truncate">
              {/* POPULAR Badge from video */}
              <span className="bg-[#de1a22] text-white text-[10px] font-black px-1.5 py-0.5 rounded flex items-center space-x-0.5">
                <span>POPULAR</span>
                <span>🔥</span>
              </span>

              {/* Tournament link */}
              <span className="text-[#00df59] underline font-semibold text-[11px] truncate flex items-center gap-1">
                <span>Football - International - UEFA Nations League</span>
                <span>&gt;</span>
              </span>
            </div>

            <button
              onClick={() => showToast(`Opening England vs Spain Statistics`)}
              className="text-neutral-400 hover:text-white shrink-0 ml-1"
            >
              <BarChart2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Teams, Score and Time */}
          <div className="grid grid-cols-3 items-center py-3 text-center">
            {/* England */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-white border border-neutral-300 flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* England St George Cross flag */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-2 bg-red-600 absolute" />
                  <div className="h-full w-2 bg-red-600 absolute" />
                </div>
              </div>
              <span className="text-xs font-bold text-neutral-200 leading-tight">
                England
              </span>
            </div>

            {/* Center: 18:45 | Today and 1X2 */}
            <div className="flex flex-col items-center space-y-1">
              <span className="text-sm font-bold text-neutral-300 tracking-wide">
                18:45 | Today
              </span>

              <span className="text-xs font-black text-[#00df59] pt-0.5 tracking-wider">
                1X2
              </span>
            </div>

            {/* Spain */}
            <div className="flex flex-col items-center space-y-1">
              <div className="w-10 h-10 rounded-full bg-red-600 border border-neutral-700 flex items-center justify-center shadow-inner relative overflow-hidden">
                {/* Spain Red-Gold-Red flag */}
                <div className="w-full h-4 bg-amber-400" />
              </div>
              <span className="text-xs font-bold text-neutral-200 leading-tight">
                Spain
              </span>
            </div>
          </div>

          {/* Bottom Odds Row (1: 3.45, X: 3.62, 2: 2.20) */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {(featuredMatch.markets['1X2'] || [
              { id: 'o1', name: '1', value: 3.45 },
              { id: 'ox', name: 'X', value: 3.62 },
              { id: 'o2', name: '2', value: 2.20 },
            ]).map(odd => {
              const isSelected = betslip.some(
                s => s.matchId === featuredMatch.id && s.marketName === '1X2' && s.selectionName === odd.name
              );
              return (
                <button
                  key={odd.id}
                  onClick={() => toggleSelection(featuredMatch, '1X2', odd)}
                  className={`py-2 px-2.5 rounded-[3px] border flex items-center justify-between text-xs font-black transition-all cursor-pointer ${
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

      {/* Interactive Modal for Selected Promo Card */}
      <PromoFeatureModal
        item={selectedPromo}
        onClose={() => setSelectedPromo(null)}
        onOpenAviator={onOpenAviator}
      />
    </div>
  );
};
