import React from 'react';

interface SportyBetSpinnerProps {
  text?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const SportyBetSpinner: React.FC<SportyBetSpinnerProps> = ({
  text = 'Loading...',
  size = 'md'
}) => {
  const dim = size === 'sm' ? 'w-12 h-12' : size === 'lg' ? 'w-20 h-20' : 'w-16 h-16';
  const fontSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col items-center justify-center p-8 select-none">
      <div className={`relative ${dim} flex items-center justify-center`}>
        {/* Outer spinning ring matching SportyBet brand style from video */}
        <div className="absolute inset-0 rounded-full border-[3px] border-neutral-700/40 border-t-[#00df59] border-r-white/40 animate-spin" />
        
        {/* Inner circular badge */}
        <div className="w-[75%] h-[75%] rounded-full bg-[#1b2430] border border-[#2b394a] flex items-center justify-center shadow-lg">
          <span className="text-white font-black italic tracking-tighter text-lg select-none">
            S
          </span>
        </div>
      </div>
      
      {text && (
        <span className={`mt-3 text-neutral-300 font-medium ${fontSize} tracking-wide animate-pulse`}>
          {text}
        </span>
      )}
    </div>
  );
};
