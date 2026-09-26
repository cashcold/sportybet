import React, { useState } from 'react';
import { Trophy, Sparkles, Play, Pause, Flame } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface WinnerItem {
  id: string;
  maskedUser: string;
  amount: string;
  category: string;
  timeAgo: string;
  isMega?: boolean;
}

export const GrandPrizeWinners: React.FC = () => {
  const { showToast } = useBetting();
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState<'slow' | 'normal'>('slow');

  // Extensive list of 24 realistic Ghana Grand Prize winners
  const grandPrizeWinners: WinnerItem[] = [
    {
      id: 'w1',
      maskedUser: '**********6 won',
      amount: 'GHS20,000.00',
      category: 'in Sports',
      timeAgo: '1 min ago',
      isMega: true
    },
    {
      id: 'w2',
      maskedUser: '**********7 won',
      amount: 'GHS3,162.44',
      category: 'in Sports',
      timeAgo: '2 min ago'
    },
    {
      id: 'w3',
      maskedUser: '**********2 won',
      amount: 'GHS4,149.60',
      category: 'in Sports',
      timeAgo: '3 min ago'
    },
    {
      id: 'w4',
      maskedUser: '**********7 won',
      amount: 'GHS3,050.00',
      category: 'in Sports',
      timeAgo: '3 min ago'
    },
    {
      id: 'w5',
      maskedUser: '**********1 won',
      amount: 'GHS52,800.50',
      category: 'in Aviator',
      timeAgo: '4 min ago',
      isMega: true
    },
    {
      id: 'w6',
      maskedUser: '**********4 won',
      amount: 'GHS15,480.00',
      category: 'in Sports',
      timeAgo: '5 min ago'
    },
    {
      id: 'w7',
      maskedUser: '**********9 won',
      amount: 'GHS150,000.00',
      category: 'in Super Jackpot',
      timeAgo: '6 min ago',
      isMega: true
    },
    {
      id: 'w8',
      maskedUser: '**********5 won',
      amount: 'GHS12,750.00',
      category: 'in Sporty 12 Jackpot',
      timeAgo: '7 min ago'
    },
    {
      id: 'w9',
      maskedUser: '**********3 won',
      amount: 'GHS8,850.20',
      category: 'in Aviator',
      timeAgo: '8 min ago'
    },
    {
      id: 'w10',
      maskedUser: '**********8 won',
      amount: 'GHS25,000.00',
      category: 'in Sports',
      timeAgo: '9 min ago',
      isMega: true
    },
    {
      id: 'w11',
      maskedUser: '**********0 won',
      amount: 'GHS38,400.00',
      category: 'in Aviator',
      timeAgo: '10 min ago',
      isMega: true
    },
    {
      id: 'w12',
      maskedUser: '**********9 won',
      amount: 'GHS6,210.00',
      category: 'in Sports',
      timeAgo: '12 min ago'
    },
    {
      id: 'w13',
      maskedUser: '**********2 won',
      amount: 'GHS7,340.20',
      category: 'in Lucky Numbers',
      timeAgo: '13 min ago'
    },
    {
      id: 'w14',
      maskedUser: '**********8 won',
      amount: 'GHS2,890.75',
      category: 'in Sports',
      timeAgo: '14 min ago'
    },
    {
      id: 'w15',
      maskedUser: '**********3 won',
      amount: 'GHS18,220.10',
      category: 'in Sports',
      timeAgo: '15 min ago'
    },
    {
      id: 'w16',
      maskedUser: '**********5 won',
      amount: 'GHS4,650.00',
      category: 'in Virtuals',
      timeAgo: '16 min ago'
    },
    {
      id: 'w17',
      maskedUser: '**********1 won',
      amount: 'GHS44,120.00',
      category: 'in Aviator',
      timeAgo: '18 min ago',
      isMega: true
    },
    {
      id: 'w18',
      maskedUser: '**********6 won',
      amount: 'GHS11,250.00',
      category: 'in Sports',
      timeAgo: '19 min ago'
    },
    {
      id: 'w19',
      maskedUser: '**********4 won',
      amount: 'GHS9,800.00',
      category: 'in Sports',
      timeAgo: '21 min ago'
    },
    {
      id: 'w20',
      maskedUser: '**********7 won',
      amount: 'GHS16,940.00',
      category: 'in Sports',
      timeAgo: '23 min ago'
    },
    {
      id: 'w21',
      maskedUser: '**********0 won',
      amount: 'GHS5,620.00',
      category: 'in Sports',
      timeAgo: '25 min ago'
    },
    {
      id: 'w22',
      maskedUser: '**********3 won',
      amount: 'GHS8,430.50',
      category: 'in Sports',
      timeAgo: '27 min ago'
    },
    {
      id: 'w23',
      maskedUser: '**********5 won',
      amount: 'GHS32,100.00',
      category: 'in Aviator',
      timeAgo: '29 min ago',
      isMega: true
    },
    {
      id: 'w24',
      maskedUser: '**********8 won',
      amount: 'GHS6,750.00',
      category: 'in TaDa Halloween',
      timeAgo: '30 min ago'
    }
  ];

  // Duplicate items array for a seamless infinite loop animation without jumps
  const tickerItems = [...grandPrizeWinners, ...grandPrizeWinners];

  const handleCardClick = (winner: WinnerItem) => {
    showToast(`🏆 Verified Win: ${winner.maskedUser} ${winner.amount} ${winner.category}`);
  };

  return (
    <div className="px-3 py-3 border-t border-[#1f2835] bg-[#121922] select-none relative overflow-hidden">
      {/* Header with Title, Live Indicator and Play/Pause control */}
      <div className="flex items-center justify-between mb-2.5">
        <div className="flex items-center space-x-2">
          <h2 className="text-sm font-bold text-white flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-[#00df59]" />
            <span>Grand Prize Winners</span>
          </h2>
          {/* Live indicator dot */}
          <span className="flex items-center space-x-1 px-1.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[9px] font-bold text-[#00df59]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00df59] animate-pulse" />
            <span>LIVE</span>
          </span>
        </div>

        {/* Controls: Speed selector and Play/Pause */}
        <div className="flex items-center space-x-2">
          {/* Speed Toggle: Slow / Normal */}
          <button
            onClick={() => {
              const next = speed === 'slow' ? 'normal' : 'slow';
              setSpeed(next);
              showToast(`Ticker speed: ${next === 'slow' ? 'Slow & Smooth' : 'Normal'}`);
            }}
            className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1a2330] border border-neutral-700/60 text-neutral-300 hover:text-white transition-colors"
            title="Adjust ticker sliding speed"
          >
            {speed === 'slow' ? '🐢 Slow' : '⚡ Normal'}
          </button>

          {/* Toggle animation play/pause */}
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="text-neutral-400 hover:text-white rounded transition-colors flex items-center space-x-1 text-[10px] bg-[#1a2330] border border-neutral-700/60 px-2 py-0.5"
            title={isPaused ? 'Resume auto-slide' : 'Pause auto-slide'}
          >
            {isPaused ? (
              <>
                <Play className="w-3 h-3 text-[#00df59]" />
                <span className="text-[10px] text-neutral-300 font-semibold">Play</span>
              </>
            ) : (
              <>
                <Pause className="w-3 h-3 text-neutral-400" />
                <span className="text-[10px] text-neutral-400">Pause</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Smooth Continuous Marquee Container with edge fade masks */}
      <div
        className="relative overflow-hidden group cursor-grab active:cursor-grabbing"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Left edge fade gradient */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-[#121922] to-transparent z-10" />

        {/* Right edge fade gradient */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-[#121922] to-transparent z-10" />

        {/* Sliding Ticker Track (calm, gentle speed) */}
        <div className={`animate-ticker-slide ${speed === 'slow' ? 'speed-slow' : 'speed-normal'} flex items-center space-x-2.5 pb-1 ${isPaused ? 'paused' : ''}`}>
          {tickerItems.map((w, index) => (
            <div
              key={`${w.id}-${index}`}
              onClick={() => handleCardClick(w)}
              className={`shrink-0 w-44 bg-[#1a2330] border rounded-lg p-2.5 relative overflow-hidden shadow-sm transition-all duration-200 hover:scale-[1.03] active:scale-95 cursor-pointer ${
                w.isMega
                  ? 'border-amber-400/50 hover:border-amber-400 bg-gradient-to-br from-[#1a2330] to-[#25251a]'
                  : 'border-[#263344] hover:border-[#00df59]/50'
              }`}
            >
              {/* Background trophy watermark */}
              <div className="absolute -right-2 -bottom-2 opacity-10 pointer-events-none text-white">
                <Trophy className="w-16 h-16" />
              </div>

              {/* User row */}
              <div className="flex items-center justify-between text-[11px] text-neutral-300 font-semibold mb-1">
                <div className="flex items-center space-x-1.5 truncate">
                  <Trophy className={`w-3.5 h-3.5 ${w.isMega ? 'text-amber-400' : 'text-[#00df59]'}`} />
                  <span className="truncate">{w.maskedUser}</span>
                </div>
                {w.isMega && (
                  <span className="bg-amber-500/20 text-amber-300 text-[8px] font-black px-1 py-0.2 rounded border border-amber-500/40 uppercase">
                    MEGA
                  </span>
                )}
              </div>

              {/* Won Amount in GHS */}
              <div className={`text-sm font-black tracking-tight ${w.isMega ? 'text-amber-300' : 'text-[#00df59]'}`}>
                {w.amount}
              </div>

              {/* Category and time ago */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 mt-1">
                <span className="truncate pr-1">{w.category}</span>
                <span className="text-neutral-500 shrink-0">{w.timeAgo}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
