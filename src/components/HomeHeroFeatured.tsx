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
}

export const HomeHeroFeatured: React.FC<HomeHeroFeaturedProps> = ({
  onOpenBookingCode,
  onOpenAviator,
  onSelectTournament
}) => {
  const { toggleSelection, betslip, showToast, setActiveTab } = useBetting();
  const [activeTournamentTab, setActiveTournamentTab] = useState("Brasileiro Serie B");
  const [activeFeaturedTab, setActiveFeaturedTab] = useState<'Matches' | 'Games' | 'Codes' | 'Virtuals'>('Matches');
  const [selectedPromo, setSelectedPromo] = useState<PromoFeatureItem | null>(null);

  // Exact 11 cards sequence from user screenshots starting from Lucky Numbers to 24/7 Basketball
  const featuredCards: PromoFeatureItem[] = [
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
      id: 'aviator',
      title: 'Aviator',
      lines: ['Aviator'],
      image: aviatorImg,
      posterImage: '/Aviator.jpg',
      tagline: 'Next-gen crash game',
      description: 'Fly high with the red airplane! Cash out before the aircraft flies away to secure up to 10,000x multiplier payouts!',
      actionText: 'Play Now',
      actionType: 'aviator'
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

  // Featured live match: Criciuma EC SC vs Operario Ferroviario EC PR (from screenshot 1 & 5)
  const featuredMatch: Match = {
    id: 'feat-criciuma-operario',
    gameId: '38921',
    sport: 'football',
    league: 'Brasileiro Serie B',
    countryOrCategory: 'Brazil',
    homeTeam: 'Criciuma EC SC',
    awayTeam: 'Operario Ferroviario EC PR',
    homeScore: 0,
    awayScore: 1,
    minute: "72:16 H2",
    period: "H2",
    isLive: true,
    startTime: 'Live',
    isHot: true,
    hasLiveStream: true,
    marketsCount: 107,
    markets: {
      '1X2': [
        { id: 'feat-cr-1', name: '1', value: 8.90, trend: 'same' },
        { id: 'feat-cr-x', name: 'X', value: 3.10, trend: 'same' },
        { id: 'feat-cr-2', name: '2', value: 1.61, trend: 'same' }
      ]
    }
  };

  const tournamentFilters = [
    "Brasileiro Serie B",
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

      {/* Interactive Modal for Selected Promo Card */}
      <PromoFeatureModal
        item={selectedPromo}
        onClose={() => setSelectedPromo(null)}
        onOpenAviator={onOpenAviator}
      />
    </div>
  );
};
