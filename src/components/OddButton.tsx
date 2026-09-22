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
      className={`relative flex items-center justify-center flex-1 h-9 rounded-[4px] px-1 font-bold text-[13px] transition-all select-none active:scale-[0.97] ${
        isSelected
          ? 'bg-[#00a826] text-white shadow-inner font-extrabold ring-1 ring-white/20'
          : 'bg-[#222b36] hover:bg-[#2a3543] text-[#00df59]'
      }`}
    >
      <span className="flex items-center space-x-0.5">
        <span>{odd.value.toFixed(2)}</span>
        {odd.trend === 'down' && (
          <ArrowDown className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#00df59]'}`} />
        )}
        {odd.trend === 'up' && (
          <ArrowUp className={`w-3 h-3 ${isSelected ? 'text-white' : 'text-[#ff4d4f]'}`} />
        )}
      </span>
    </button>
  );
};
