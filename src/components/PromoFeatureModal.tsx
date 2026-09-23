import React, { useState } from 'react';
import { X, Play, Trophy, Sparkles, CheckCircle2, ChevronRight, Dices, Flame } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export interface PromoFeatureItem {
  id: string;
  title: string;
  subTitle?: string;
  lines: string[];
  image: string;
  posterImage: string;
  badge?: string;
  tagline: string;
  description: string;
  actionText: string;
  actionType: 'aviator' | 'modal' | 'toast' | 'lottery' | 'penalty';
}

interface PromoFeatureModalProps {
  item: PromoFeatureItem | null;
  onClose: () => void;
  onOpenAviator: () => void;
}

export const PromoFeatureModal: React.FC<PromoFeatureModalProps> = ({
  item,
  onClose,
  onOpenAviator
}) => {
  const { showToast, deposit } = useBetting();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([7, 14, 21, 33]);
  const [penaltySide, setPenaltySide] = useState<'left' | 'center' | 'right' | null>(null);
  const [penaltyResult, setPenaltyResult] = useState<string | null>(null);

  if (!item) return null;

  const handleAction = () => {
    if (item.actionType === 'aviator') {
      onClose();
      onOpenAviator();
    } else if (item.id === 'lucky_numbers') {
      showToast(`Lucky Numbers submitted: [${selectedNumbers.join(', ')}]! Good luck!`);
      deposit(50, 'Lucky Numbers Promo Bonus');
      onClose();
    } else if (item.id === 'sporty_penalty') {
      if (!penaltySide) {
        setPenaltySide('right');
        setPenaltyResult('GOAL! You scored! +10 GHS Bonus');
        deposit(10, 'Sporty Penalty Shootout Win');
      } else {
        onClose();
      }
    } else {
      showToast(`${item.title}: Action confirmed!`);
      onClose();
    }
  };

  const toggleNumber = (num: number) => {
    if (selectedNumbers.includes(num)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== num));
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, num]);
    } else {
      showToast('Maximum 6 numbers for Lucky Numbers');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-3 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-sm bg-[#141b24] border border-[#2b3748] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1a232f] border-b border-[#2a3646]">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00df59] animate-pulse" />
            <h3 className="font-black text-sm text-white tracking-wide">{item.title}</h3>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {/* Main Visual Poster / Banner */}
          <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden shadow-lg border border-white/10 bg-neutral-900 group">
            <img 
              src={item.posterImage || item.image} 
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                e.currentTarget.src = item.image;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-black/60 px-2 py-0.5 rounded w-fit mb-1 border border-amber-500/30">
                {item.tagline}
              </span>
              <h2 className="text-lg font-black text-white leading-tight drop-shadow">
                {item.title}
              </h2>
            </div>
          </div>

          {/* Description */}
          <div className="bg-[#1b2431] p-3 rounded-xl border border-[#2b384a] text-xs text-neutral-300 leading-relaxed">
            {item.description}
          </div>

          {/* Interactive Feature Widget */}
          {item.id === 'lucky_numbers' && (
            <div className="bg-[#18212d] p-3 rounded-xl border border-[#2a3749] space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-neutral-200">Pick Your 6 Lucky Numbers</span>
                <button
                  type="button"
                  onClick={() => {
                    const randoms: number[] = [];
                    while (randoms.length < 6) {
                      const r = Math.floor(Math.random() * 49) + 1;
                      if (!randoms.includes(r)) randoms.push(r);
                    }
                    setSelectedNumbers(randoms);
                  }}
                  className="text-[11px] text-[#00df59] font-bold hover:underline"
                >
                  Quick Pick ⚡
                </button>
              </div>

              {/* Number Ball Grid */}
              <div className="grid grid-cols-7 gap-1.5 py-1">
                {Array.from({ length: 28 }, (_, i) => i + 1).map((n) => {
                  const isSel = selectedNumbers.includes(n);
                  return (
                    <button
                      key={n}
                      type="button"
                      onClick={() => toggleNumber(n)}
                      className={`h-7 rounded-full text-xs font-black transition-all ${
                        isSel
                          ? 'bg-gradient-to-b from-amber-300 to-amber-500 text-neutral-900 shadow-md scale-105 border border-white'
                          : 'bg-[#222e3d] text-neutral-300 hover:bg-[#2b3a4d]'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>

              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-700/50">
                <span className="text-neutral-400">Selected ({selectedNumbers.length}/6):</span>
                <span className="font-mono font-bold text-amber-400">
                  {selectedNumbers.join(', ') || 'None'}
                </span>
              </div>
            </div>
          )}

          {item.id === 'sporty_penalty' && (
            <div className="bg-[#18212d] p-3 rounded-xl border border-[#2a3749] space-y-2.5">
              <span className="text-xs font-bold text-neutral-200 block text-center">
                Aim Shootout Target
              </span>
              <div className="grid grid-cols-3 gap-2">
                {(['left', 'center', 'right'] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => {
                      setPenaltySide(side);
                      setPenaltyResult('GOAL! Top corner finish! Win +10 GHS');
                      deposit(10, 'Sporty Penalty Win');
                    }}
                    className={`py-3 rounded-lg text-xs font-black uppercase transition-all ${
                      penaltySide === side
                        ? 'bg-[#00a826] text-white ring-2 ring-[#00df59]'
                        : 'bg-[#222e3d] text-neutral-300 hover:bg-[#2d3d52]'
                    }`}
                  >
                    ⚽ {side}
                  </button>
                ))}
              </div>
              {penaltyResult && (
                <div className="bg-emerald-950/60 border border-emerald-500/40 p-2 rounded-lg text-center text-xs font-bold text-emerald-300">
                  {penaltyResult}
                </div>
              )}
            </div>
          )}

          {item.id === 'jackpot' && (
            <div className="bg-[#18212d] p-3 rounded-xl border border-[#2a3749] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-neutral-300 font-medium">Grand Jackpot Pool</span>
                <span className="text-sm font-black text-amber-400">GHS 150,000.00</span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-neutral-400">
                <span>12 Match Pool</span>
                <span className="text-[#00df59] font-bold">12 / 12 Guaranteed</span>
              </div>
            </div>
          )}

          {item.id === 'sporty_picks' && (
            <div className="bg-[#18212d] p-3 rounded-xl border border-[#2a3749] space-y-2 text-xs">
              <div className="font-bold text-neutral-200">Today's Free Question:</div>
              <p className="text-neutral-300 text-[11px]">Will Erling Haaland score in both halves this weekend?</p>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button 
                  onClick={() => showToast('Pick recorded: YES')}
                  className="py-1.5 bg-[#00a826] hover:bg-[#009221] text-white font-black rounded text-center"
                >
                  YES
                </button>
                <button 
                  onClick={() => showToast('Pick recorded: NO')}
                  className="py-1.5 bg-[#de1a22] hover:bg-[#c4151c] text-white font-black rounded text-center"
                >
                  NO
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Button Footer */}
        <div className="p-3 bg-[#18212d] border-t border-[#263344] flex items-center space-x-2">
          <button
            onClick={handleAction}
            className="flex-1 py-3 bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>{item.actionText}</span>
            <ChevronRight className="w-4 h-4 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </div>
  );
};
