import React from 'react';
import { useBetting } from '../context/BettingContext';

export const Toast: React.FC = () => {
  const { toastMessage, setIsBetslipOpen } = useBetting();

  if (!toastMessage) return null;

  const isBetslipToast = toastMessage.includes('Betslip');

  return (
    <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 w-11/12 max-w-sm pointer-events-auto">
      <div
        onClick={() => {
          if (isBetslipToast) {
            setIsBetslipOpen(true);
          }
        }}
        className={`bg-[#1e2733]/95 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-2xl border border-neutral-700/80 text-center backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-150 ${
          isBetslipToast ? 'cursor-pointer hover:border-[#00df59]' : ''
        }`}
      >
        <span>{toastMessage}</span>
        {isBetslipToast && (
          <span className="ml-2 text-[#00df59] underline font-bold">
            View Slip
          </span>
        )}
      </div>
    </div>
  );
};
