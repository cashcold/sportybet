import React, { useState } from 'react';
import { X, Lock, Phone, UserCheck, Shield } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { SportyBetLogo } from './SportyBetLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'join';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, showToast } = useBetting();
  const [mode, setMode] = useState<'login' | 'join'>(initialMode);
  const [phone, setPhone] = useState('0204891235');
  const [password, setPassword] = useState('••••••••');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      showToast('Please enter mobile number');
      return;
    }
    const cleanPhone = phone.trim().replace(/^0/, '');
    const masked = `${cleanPhone.slice(0, 2)}******${cleanPhone.slice(-1)}`;
    login(masked);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#19222d] border border-[#2b394a] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#de1a22] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SportyBetLogo size="sm" variant="white" />
            <span className="text-xs font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
              Ghana
            </span>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-[#253243] bg-[#141b24] text-xs font-bold">
          <button
            onClick={() => setMode('login')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => setMode('join')}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'join'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Join Now
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <label className="text-[11px] font-bold text-neutral-300 block mb-1">
              Mobile Number (+233)
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-3 text-neutral-400 font-bold text-xs select-none">
                🇬🇭 +233
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="20 123 4567"
                className="w-full bg-[#121922] border border-[#2c3848] rounded px-3 py-2.5 pl-20 text-xs text-white font-mono tracking-wider focus:outline-none focus:border-[#00df59]"
                autoFocus
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => showToast('Password reset link sent to SMS')}
                className="text-[10px] text-[#00df59] hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#121922] border border-[#2c3848] rounded px-3 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-[#00df59]"
              />
            </div>
          </div>

          {mode === 'join' && (
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              By joining, you agree to the SportyBet Terms & Conditions and confirm you are 18 years or older.
            </p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] text-white text-xs font-black rounded uppercase tracking-wider shadow-lg transition-transform active:scale-[0.98]"
          >
            {mode === 'login' ? 'Log In' : 'Register Account'}
          </button>

          <div className="pt-2 border-t border-[#232f3f] text-center">
            <span className="text-[11px] text-neutral-400">
              Demo Test Account: <strong className="text-white">20******5</strong> (CHARLES ASUMAH)
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};
