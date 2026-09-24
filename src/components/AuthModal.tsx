import React, { useState } from 'react';
import { X, Lock, Phone, UserCheck, Shield, Database, Loader2, User } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { SportyBetLogo } from './SportyBetLogo';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'join';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, showToast } = useBetting();
  const [mode, setMode] = useState<'login' | 'join'>(initialMode);
  const [phone, setPhone] = useState('0204891235');
  const [password, setPassword] = useState('password123');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!phone.trim()) {
      showToast('Please enter mobile number');
      setErrorMessage('Mobile number is required');
      return;
    }

    if (!password.trim()) {
      showToast('Please enter password');
      setErrorMessage('Password is required');
      return;
    }

    setLoading(true);
    const cleanPhone = phone.trim().replace(/^(\+233|0)/, '');
    const formattedPhone = cleanPhone.length === 9 ? cleanPhone : phone.trim();

    try {
      if (mode === 'join') {
        const res = await register(formattedPhone, password, firstName.trim(), lastName.trim());
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Registration failed');
        }
      } else {
        const res = await login(formattedPhone, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Login failed');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    setErrorMessage(null);
    try {
      await login('20******5', 'demo');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#19222d] border border-[#2b394a] rounded-xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Top Header */}
        <div className="bg-[#de1a22] text-white px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <SportyBetLogo size="sm" variant="white" />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 px-1.5 py-0.5 rounded">
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
            onClick={() => {
              setMode('login');
              setErrorMessage(null);
            }}
            className={`flex-1 py-3 text-center transition-colors border-b-2 ${
              mode === 'login'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Log In
          </button>
          <button
            onClick={() => {
              setMode('join');
              setErrorMessage(null);
            }}
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
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {errorMessage && (
            <div className="bg-red-500/15 border border-red-500/40 rounded p-2 text-xs text-red-300">
              {errorMessage}
            </div>
          )}

          {mode === 'join' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="e.g. Kwame"
                  className="w-full bg-[#121922] border border-[#2c3848] rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#00df59]"
                />
              </div>
              <div>
                <label className="text-[11px] font-bold text-neutral-300 block mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="e.g. Mensah"
                  className="w-full bg-[#121922] border border-[#2c3848] rounded px-2.5 py-2 text-xs text-white focus:outline-none focus:border-[#00df59]"
                />
              </div>
            </div>
          )}

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
                required
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-bold text-neutral-300">
                Password
              </label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => showToast('Password reset code sent to your phone via SMS')}
                  className="text-[10px] text-[#00df59] hover:underline"
                >
                  Forgot Password?
                </button>
              )}
            </div>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-[#121922] border border-[#2c3848] rounded px-3 py-2.5 pl-9 text-xs text-white focus:outline-none focus:border-[#00df59]"
                required
              />
            </div>
          </div>

          {mode === 'join' && (
            <p className="text-[10px] text-neutral-400 leading-relaxed">
              By joining, you agree to the SportyBet Terms & Conditions and confirm you are 18 years or older. Your account is secured with MongoDB.
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] disabled:opacity-50 text-white text-xs font-black rounded uppercase tracking-wider shadow-lg transition-transform active:scale-[0.98] flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <span>{mode === 'login' ? 'Log In' : 'Create SportyBet Account'}</span>
            )}
          </button>

          <div className="pt-2 border-t border-[#232f3f] flex items-center justify-between">
            <span className="text-[10px] text-neutral-400">
              Demo Test Account:
            </span>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-[10px] text-[#00df59] hover:underline font-bold"
            >
              Quick Login (20******5)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
