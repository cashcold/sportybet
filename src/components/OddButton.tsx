import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { OddItem, Match } from '../types';
import { useBetting } from '../context/BettingContext';

interface OddButtonProps {
  match: Match;
  marketName: string;
  odd: OddItem;
}

export const OddButton: React.FC<OddButtonProps> = ({ match, marketName, odd }) => {
  const { betslip, toggleSelection } = useBetting();

  const isSelected = betslip.some(
    s => s.matchId === match.id && s.marketName === marketName && s.selectionName === odd.name
  );

  return (
    <button
      onClick={() => toggleSelection(match, marketName, odd)}
      className={`relative flex items-center justify-center flex-1 h-9 rounded-[4px] px-1 font-bold text-[13px] transition-all select-none active:scale-[0.97] cursor-pointer overflow-hidden ${
        isSelected
          ? 'bg-[#00a826] text-white shadow-inner font-extrabold ring-1 ring-white/20'
          : 'bg-[#222b36] hover:bg-[#2a3543] text-[#00df59]'
      }`}
    >
      <span className="flex items-center space-x-0.5">
        <span>{odd.value.toFixed(2)}</span>
      </span>

      {/* SportyBet corner indicators (seen in video at 00:06 on 2.05 and 2.75) */}
      {odd.trend === 'up' && (
        <span
          className="absolute top-0.5 right-0.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[6px] border-b-[#00df59]"
          title="Odds increased"
        />
      )}
      {odd.trend === 'down' && (
        <span
          className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[6px] border-t-[#ff4d4f]"
          title="Odds decreased"
        />
      )}
    </button>
  );
};
