import React, { useState, useEffect } from 'react';
import { Rocket, Trophy, Play, RotateCcw, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';
import { MINI_GAMES } from '../data/mockData';

export const GamesView: React.FC = () => {
  const { user, deposit, showToast, setIsDepositModalOpen } = useBetting();
  const [selectedGame, setSelectedGame] = useState<string>('sporty-hero');

  // Sporty Hero Crash Game interactive state
  const [betAmount, setBetAmount] = useState(2.0);
  const [multiplier, setMultiplier] = useState(1.0);
  const [gameState, setGameState] = useState<'idle' | 'flying' | 'crashed' | 'cashed_out'>('idle');
  const [crashPoint, setCrashPoint] = useState(2.5);
  const [history, setHistory] = useState<number[]>([1.84, 3.12, 1.15, 6.45, 2.01]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'flying') {
      timer = setInterval(() => {
        setMultiplier(prev => {
          const next = parseFloat((prev + 0.05 + prev * 0.03).toFixed(2));
          if (next >= crashPoint) {
            setGameState('crashed');
            setHistory(h => [crashPoint, ...h.slice(0, 5)]);
            showToast(`Flew Away at ${crashPoint.toFixed(2)}x!`);
            return crashPoint;
          }
          return next;
        });
      }, 100);
    }
    return () => clearInterval(timer);
  }, [gameState, crashPoint]);

  const handleStartFlight = () => {
    if (user.balance < betAmount) {
      setIsDepositModalOpen(true);
      showToast('Insufficient balance for game bet');
      return;
    }

    // Deduct bet
    deposit(-betAmount, 'Game Bet');

    // Calculate crash point: 70% random between 1.2 and 5.0, 10% instant crash, 20% high multiplier
    const r = Math.random();
    let point = 1.0;
    if (r < 0.1) point = 1.1 + Math.random() * 0.2;
    else if (r < 0.8) point = 1.3 + Math.random() * 3.5;
    else point = 4.0 + Math.random() * 12.0;

    setCrashPoint(parseFloat(point.toFixed(2)));
    setMultiplier(1.0);
    setGameState('flying');
  };

  const handleCashOut = () => {
    if (gameState !== 'flying') return;
    setGameState('cashed_out');
    const winAmount = parseFloat((betAmount * multiplier).toFixed(2));
    deposit(winAmount, 'Crash Win');
    setHistory(h => [multiplier, ...h.slice(0, 5)]);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 }
    });

    showToast(`Cashed out at ${multiplier.toFixed(2)}x! Won GHS ${winAmount.toFixed(2)}`);
  };

  return (
    <div className="pb-24 bg-[#141a22] text-white min-h-screen">
      {/* Header */}
      <div className="bg-[#1b2532] p-4 border-b border-[#212b38] flex items-center justify-between">
        <div>
          <h1 className="text-base font-black text-white flex items-center space-x-1.5">
            <Rocket className="w-5 h-5 text-[#de1a22]" />
            <span>SportyBet Games</span>
          </h1>
          <p className="text-xs text-neutral-400">Instant Virtuals, Crash & Casino</p>
        </div>

        <div className="bg-[#242f3d] px-3 py-1.5 rounded-full border border-neutral-700 text-xs font-bold text-[#00df59]">
          {user.currency} {user.balance.toFixed(2)}
        </div>
      </div>

      {/* Featured Interactive Game: Sporty Hero (Crash Aviator) */}
      <div className="p-3">
        <div className="bg-gradient-to-b from-[#182230] to-[#121922] border border-[#232f3f] rounded-xl overflow-hidden shadow-lg">
          <div className="px-4 py-2.5 bg-[#1f2937] flex items-center justify-between border-b border-neutral-700/50">
            <span className="text-xs font-black tracking-wide text-amber-400 uppercase flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sporty Hero • Live Multiplier</span>
            </span>

            {/* Crash History Ticker */}
            <div className="flex items-center space-x-1 text-[10px] font-bold">
              {history.map((h, i) => (
                <span
                  key={i}
                  className={`px-1.5 py-0.5 rounded ${
                    h >= 2.0 ? 'bg-[#00a826]/30 text-[#00df59]' : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {h.toFixed(2)}x
                </span>
              ))}
            </div>
          </div>

          {/* Game Canvas Area */}
          <div className="relative h-44 flex flex-col items-center justify-center bg-radial from-[#1e2a3b] to-[#111720] overflow-hidden p-4">
            {gameState === 'flying' && (
              <div className="text-center animate-pulse">
                <div className="text-4xl sm:text-5xl font-black text-white tracking-wider">
                  {multiplier.toFixed(2)}x
                </div>
                <div className="text-xs font-semibold text-[#00df59] mt-1 flex items-center justify-center space-x-1">
                  <Rocket className="w-4 h-4 animate-bounce" />
                  <span>Taking off...</span>
                </div>
              </div>
            )}

            {gameState === 'crashed' && (
              <div className="text-center">
                <div className="text-3xl font-black text-[#ff4d4f] tracking-wide">
                  FLEW AWAY!
                </div>
                <div className="text-sm font-bold text-neutral-400 mt-1">
                  @ {crashPoint.toFixed(2)}x
                </div>
              </div>
            )}

            {gameState === 'cashed_out' && (
              <div className="text-center">
                <div className="text-3xl font-black text-[#00df59] tracking-wide">
                  WON GHS {(betAmount * multiplier).toFixed(2)}!
                </div>
                <div className="text-xs font-bold text-neutral-300 mt-1">
                  Cashed out @ {multiplier.toFixed(2)}x
                </div>
              </div>
            )}

            {gameState === 'idle' && (
              <div className="text-center">
                <Rocket className="w-12 h-12 text-[#de1a22] mx-auto mb-2 opacity-90 animate-pulse" />
                <div className="text-sm font-bold text-neutral-200">
                  Ready to Take Off
                </div>
                <div className="text-[11px] text-neutral-400">
                  Place bet and cash out before the rocket flies away!
                </div>
              </div>
            )}
          </div>

          {/* Controls Bar */}
          <div className="p-3 bg-[#182230] border-t border-[#232f3f] flex flex-col gap-2.5">
            {/* Quick Bet Buttons */}
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-bold text-neutral-400 shrink-0">Bet GHS:</span>
              {[1, 2, 5, 10, 20].map(amt => (
                <button
                  key={amt}
                  onClick={() => setBetAmount(amt)}
                  className={`flex-1 py-1 rounded text-xs font-bold transition-all ${
                    betAmount === amt
                      ? 'bg-[#00a826] text-white shadow'
                      : 'bg-[#243040] text-neutral-300 hover:bg-[#2b394c]'
                  }`}
                >
                  {amt}
                </button>
              ))}
            </div>

            {/* Action button: Bet or Cash Out */}
            {gameState === 'flying' ? (
              <button
                onClick={handleCashOut}
                className="w-full py-3 bg-[#e69500] hover:bg-[#d68a00] active:scale-[0.98] text-neutral-950 font-black text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <span>CASH OUT GHS {(betAmount * multiplier).toFixed(2)}</span>
              </button>
            ) : (
              <button
                onClick={handleStartFlight}
                className="w-full py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-black text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>PLACE BET (GHS {betAmount.toFixed(2)})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Other Popular Games Grid */}
      <div className="px-3 mt-3">
        <h2 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
          More Ghana Favorites
        </h2>

        <div className="grid grid-cols-2 gap-2.5">
          {MINI_GAMES.map(game => (
            <div
              key={game.id}
              onClick={() => showToast(`Starting ${game.name}...`)}
              className="bg-[#1b232e] hover:bg-[#202936] border border-[#242f3e] rounded-lg p-2.5 cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold bg-[#de1a22]/20 text-[#ff4d4f] border border-[#de1a22]/30 px-1.5 py-0.5 rounded">
                  {game.tag}
                </span>
                <span className="text-[10px] text-neutral-400">
                  Min GHS {game.minBet.toFixed(2)}
                </span>
              </div>

              <div className="font-bold text-xs text-white truncate">
                {game.name}
              </div>

              <div className="text-[11px] text-neutral-400 mt-1 flex items-center justify-between">
                <span>{game.category}</span>
                <span className="text-[#00df59] font-bold">Up to {game.maxMultiplier}x</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
