import React from 'react';
import { ShieldCheck, Smartphone } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export const SportyBetFooter: React.FC = () => {
  const { showToast } = useBetting();

  return (
    <footer className="bg-[#10161f] border-t border-[#1b2430] px-4 pt-6 pb-24 text-center select-none text-neutral-400">
      {/* 18+ & Copyright */}
      <div className="flex items-center justify-center space-x-2 text-xs mb-4">
        <div className="border border-neutral-600 rounded px-1.5 py-0.5 text-[10px] font-black text-neutral-300 flex items-center gap-1">
          <ShieldCheck className="w-3 h-3 text-[#00df59]" />
          <span>18+</span>
        </div>
        <span className="text-[11px] text-neutral-500">
          © 2026 SportyBet. All rights reserved.
        </span>
      </div>

      {/* Official Partnership Badge (Real Madrid & LaLiga) */}
      <div className="flex items-center justify-center space-x-3 mb-4 py-2 border-y border-[#18212c]">
        <div className="flex items-center space-x-1.5">
          <span className="text-white font-black italic text-xs tracking-tight">SportyBet</span>
          <span className="text-[9px] text-neutral-500 uppercase tracking-tighter">Official Sports<br />Betting Partner</span>
        </div>
        <div className="h-6 w-px bg-neutral-800" />
        <div className="flex items-center space-x-1">
          <span className="text-white font-bold text-xs">⚽ Real Madrid</span>
          <span className="text-neutral-500 text-[10px]">•</span>
          <span className="text-red-400 font-bold text-xs">LaLiga</span>
        </div>
      </div>

      {/* The world's most visited betting platform */}
      <p className="text-xs text-neutral-400 font-semibold mb-3">
        The world's most visited betting platform
      </p>

      {/* Paybill Code (Ghana standard: *711*222#) */}
      <div className="mb-4">
        <span className="text-[11px] text-neutral-500 uppercase font-bold tracking-wider">Paybill:</span>
        <div className="text-xl font-black text-white tracking-widest mt-0.5">
          *711*222#
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex items-center justify-center space-x-4 text-xs font-semibold mb-4">
        <button
          onClick={() => showToast('Supported: MTN Mobile Money, Vodafone Cash, AirtelTigo')}
          className="hover:text-white transition-colors underline cursor-pointer"
        >
          Payment methods
        </button>
        <span className="text-neutral-700">•</span>
        <button
          onClick={() => showToast('Opening SportyBet Ghana Android APK download')}
          className="hover:text-white transition-colors underline inline-flex items-center gap-1 cursor-pointer"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>Get the SportyBet app</span>
        </button>
      </div>
    </footer>
  );
};
