import React, { useState, useEffect } from 'react';
import { X, Lock, Settings, Server, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { SportyBetLogo } from './SportyBetLogo';
import {
  getApiBaseUrl,
  setCustomApiUrl,
  getSavedApiUrl,
  testApiConnection,
  clearCustomApiUrl,
  isNativePlatform
} from '../config/apiConfig';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'join';
}

function sanitizeError(msg?: string | null): string | null {
  if (!msg) return null;
  if (
    msg.includes('<!doctype') ||
    msg.includes('<html') ||
    msg.includes('<head>') ||
    msg.includes('<div id="root">') ||
    msg.includes('<!DOCTYPE')
  ) {
    return 'Unable to reach backend API. The app received an HTML page instead of JSON. Ensure connection to https://sportybet-sand.vercel.app.';
  }
  return msg;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, showToast } = useBetting();
  const [mode, setMode] = useState<'login' | 'join'>(initialMode);
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [rawErrorMessage, setRawErrorMessage] = useState<string | null>(null);

  const errorMessage = sanitizeError(rawErrorMessage);
  const setErrorMessage = (msg: string | null) => setRawErrorMessage(sanitizeError(msg));

  // Server Settings State (for Android APK & dynamic connection)
  const [showServerConfig, setShowServerConfig] = useState(false);
  const [apiUrlInput, setApiUrlInput] = useState('');
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode);
      setErrorMessage(null);
      setApiUrlInput(getSavedApiUrl() || getApiBaseUrl());
      setTestResult(null);
    }
  }, [isOpen, initialMode]);

  if (!isOpen) return null;

  const isNetworkFailure =
    errorMessage &&
    (errorMessage.toLowerCase().includes('failed to connect') ||
      errorMessage.toLowerCase().includes('failed to fetch') ||
      errorMessage.toLowerCase().includes('network'));

  const handleTestAndSaveServer = async () => {
    if (!apiUrlInput.trim()) {
      clearCustomApiUrl();
      setTestResult({ success: true, message: 'Reset to default relative API' });
      showToast('API URL reset to default');
      return;
    }

    setTestingConnection(true);
    setTestResult(null);

    const res = await testApiConnection(apiUrlInput.trim());
    setTestingConnection(false);

    if (res.success) {
      setCustomApiUrl(apiUrlInput.trim());
      setTestResult({
        success: true,
        message: `Connected successfully! Latency: ${res.latencyMs}ms`
      });
      showToast('Backend API URL saved!');
      setErrorMessage(null);
    } else {
      setCustomApiUrl(apiUrlInput.trim()); // Save anyway in case of transient offline
      setTestResult({
        success: false,
        message: `Could not verify: ${res.error}. Saved anyway.`
      });
    }
  };

  const handleResetServer = () => {
    clearCustomApiUrl();
    setApiUrlInput(getApiBaseUrl());
    setTestResult({ success: true, message: 'Reset to default' });
    showToast('Reset to default');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (mode === 'join' && (!firstName.trim() || !lastName.trim())) {
      showToast('Please enter your First Name and Last Name');
      setErrorMessage('First Name and Last Name are required for registration');
      return;
    }

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
          if (res.error?.toLowerCase().includes('failed to connect') || res.error?.toLowerCase().includes('fetch')) {
            setShowServerConfig(true);
          }
        }
      } else {
        const res = await login(formattedPhone, password);
        if (res.success) {
          onClose();
        } else {
          setErrorMessage(res.error || 'Login failed');
          if (res.error?.toLowerCase().includes('failed to connect') || res.error?.toLowerCase().includes('fetch')) {
            setShowServerConfig(true);
          }
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Authentication error');
      setShowServerConfig(true);
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
            {isNativePlatform() && (
              <span className="text-[9px] font-bold uppercase tracking-wider bg-black/30 px-1.5 py-0.5 rounded text-amber-200">
                APK
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <button
              type="button"
              onClick={() => setShowServerConfig(!showServerConfig)}
              className="text-white/80 hover:text-white p-1 rounded hover:bg-white/10 transition-colors"
              title="Configure API Server URL"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button onClick={onClose} className="text-white/80 hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>
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

        {/* Server Configuration Drawer / Banner */}
        {showServerConfig && (
          <div className="bg-[#121820] border-b border-[#293647] p-3 text-xs space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5 font-bold text-neutral-200">
                <Server className="w-3.5 h-3.5 text-[#00df59]" />
                <span>Backend API Configuration</span>
              </div>
              <button
                type="button"
                onClick={() => setShowServerConfig(false)}
                className="text-neutral-400 hover:text-white text-[10px]"
              >
                Hide
              </button>
            </div>

            <p className="text-[11px] text-neutral-400 leading-tight">
              Specify your deployed web API URL (e.g. Vercel or cloud backend) so this APK can communicate with your server:
            </p>

            <div className="space-y-1">
              <input
                type="text"
                value={apiUrlInput}
                onChange={(e) => setApiUrlInput(e.target.value)}
                placeholder="https://your-app.vercel.app"
                className="w-full bg-[#1b2430] border border-[#2b394a] rounded px-2.5 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-[#00df59]"
              />
              <div className="flex items-center justify-between text-[10px] text-neutral-400 pt-0.5">
                <span>Active Target: <span className="font-mono text-[#00df59]">{getApiBaseUrl() || '/api'}</span></span>
              </div>
            </div>

            {testResult && (
              <div
                className={`p-2 rounded text-[11px] font-medium flex items-center space-x-1.5 ${
                  testResult.success
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                    : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <Check className="w-3.5 h-3.5 shrink-0" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex items-center space-x-2 pt-1">
              <button
                type="button"
                onClick={handleTestAndSaveServer}
                disabled={testingConnection}
                className="flex-1 py-1.5 bg-[#00a826] hover:bg-[#009221] text-white text-[11px] font-bold rounded flex items-center justify-center space-x-1 transition-colors disabled:opacity-50"
              >
                {testingConnection ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    <span>Testing...</span>
                  </>
                ) : (
                  <span>Test & Save URL</span>
                )}
              </button>
              <button
                type="button"
                onClick={handleResetServer}
                className="px-2.5 py-1.5 bg-[#253243] hover:bg-[#2e3e52] text-neutral-300 text-[11px] rounded transition-colors"
              >
                Reset
              </button>
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3.5">
          {errorMessage && (
            <div className="bg-red-500/15 border border-red-500/40 rounded p-2 text-xs text-red-300 space-y-1">
              <div className="flex items-start space-x-1.5">
                <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{errorMessage}</span>
              </div>
              {isNetworkFailure && !showServerConfig && (
                <div className="pt-1 border-t border-red-500/30 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowServerConfig(true)}
                    className="text-[11px] text-amber-300 hover:underline font-bold flex items-center space-x-1"
                  >
                    <Settings className="w-3 h-3" />
                    <span>Configure Server API URL</span>
                  </button>
                </div>
              )}
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
              By joining, you agree to the SportyBet Terms & Conditions and confirm you are 18 years or older.
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
        </form>
      </div>
    </div>
  );
};
