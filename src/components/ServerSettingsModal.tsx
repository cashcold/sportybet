import React, { useState, useEffect } from 'react';
import {
  X,
  Server,
  Check,
  AlertTriangle,
  RefreshCw,
  Globe,
  Smartphone,
  ShieldCheck,
  Zap,
  Trophy,
  CheckCircle2,
  Sliders,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  getApiBaseUrl,
  setCustomApiUrl,
  getSavedApiUrl,
  clearCustomApiUrl,
  testApiConnection,
  isNativePlatform
} from '../config/apiConfig';
import { useBetting } from '../context/BettingContext';

interface ServerSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ServerSettingsModal: React.FC<ServerSettingsModalProps> = ({ isOpen, onClose }) => {
  const {
    showToast,
    isAllGreenTriggered,
    markAllBetsGreen,
    resetBetsGreenState,
    openBets,
    betHistory,
    user
  } = useBetting();

  const [activeTab, setActiveTab] = useState<'trigger' | 'network'>('trigger');
  const [urlInput, setUrlInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
      // Auto-purge dead sportybet.vercel.app domain
      const saved = getSavedApiUrl();
      if (saved && (saved.includes('sportybet.vercel.app') || saved.includes('undefined') || saved.includes('null'))) {
        clearCustomApiUrl();
      }
      setUrlInput(getSavedApiUrl() || (isNativePlatform() ? getApiBaseUrl() : ''));
      setTestResult(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isNative = isNativePlatform();
  const currentActiveUrl = getApiBaseUrl() || '/api';

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);

    const target = urlInput.trim() || currentActiveUrl;
    const res = await testApiConnection(target);
    setTesting(false);

    if (res.success) {
      setTestResult({
        success: true,
        message: `Connected successfully! Response time: ${res.latencyMs}ms`,
        latency: res.latencyMs
      });
    } else {
      setTestResult({
        success: false,
        message: res.error || 'Connection failed. Please check the URL and internet connection.'
      });
    }
  };

  const handleSave = () => {
    const trimmed = urlInput.trim();
    if (trimmed) {
      setCustomApiUrl(trimmed);
      showToast('Backend API URL saved!');
    } else {
      clearCustomApiUrl();
      showToast('Reset to default API URL');
    }
    onClose();
  };

  const handleReset = () => {
    clearCustomApiUrl();
    setUrlInput('');
    setTestResult(null);
    showToast('Reset to default');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-4 select-none animate-in fade-in">
      <div className="bg-[#19222d] border border-[#2b394a] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#141b24] px-4 py-3 border-b border-[#253243] flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00df59]/15 border border-[#00df59]/40 flex items-center justify-center text-[#00df59]">
              <Zap className="w-4 h-4 fill-[#00df59]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white leading-tight">Admin Dashboard & Settings</h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400">
                <span>Prediction Triggers & Platform Controls</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 bg-[#121820] border-b border-[#253243] text-xs font-bold shrink-0">
          <button
            onClick={() => setActiveTab('trigger')}
            className={`py-2.5 flex items-center justify-center space-x-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'trigger'
                ? 'border-[#00df59] text-[#00df59] bg-[#192330]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Mark Green Trigger</span>
          </button>

          <button
            onClick={() => setActiveTab('network')}
            className={`py-2.5 flex items-center justify-center space-x-1.5 transition-all cursor-pointer border-b-2 ${
              activeTab === 'network'
                ? 'border-[#00df59] text-[#00df59] bg-[#192330]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Server className="w-4 h-4" />
            <span>Network / APK URL</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 space-y-4 text-xs overflow-y-auto flex-1">
          {/* TAB 1: MARK GREEN PREDICTION TRIGGER */}
          {activeTab === 'trigger' && (
            <div className="space-y-4">
              {/* Status Banner */}
              <div
                className={`p-3 rounded-lg border flex items-center justify-between transition-all ${
                  isAllGreenTriggered
                    ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-200'
                    : 'bg-[#151f2b] border-[#253344] text-neutral-300'
                }`}
              >
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center ${
                      isAllGreenTriggered
                        ? 'bg-[#00df59] text-black font-black'
                        : 'bg-neutral-700 text-neutral-400'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                  <div>
                    <div className="font-bold text-white text-[13px]">
                      {isAllGreenTriggered ? 'Green Mark Mode: ACTIVE' : 'Standard Betting Mode'}
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      {isAllGreenTriggered
                        ? 'All user predictions mark GREEN with winning FT scores'
                        : 'Matches display live / pending scores'}
                    </div>
                  </div>
                </div>

                <span
                  className={`text-[10px] uppercase font-black px-2 py-0.5 rounded ${
                    isAllGreenTriggered
                      ? 'bg-[#00df59] text-black'
                      : 'bg-neutral-800 text-neutral-400'
                  }`}
                >
                  {isAllGreenTriggered ? 'ACTIVE' : 'OFF'}
                </span>
              </div>

              {/* Master Trigger Actions */}
              <div className="space-y-2.5">
                <label className="font-bold text-neutral-200 block text-xs">
                  Admin Trigger Actions:
                </label>

                {/* Primary Button: Mark All Bets Green (Open Bets & Slips) */}
                <button
                  type="button"
                  onClick={() => {
                    markAllBetsGreen(false);
                  }}
                  className="w-full py-3 bg-[#00df59] hover:bg-[#00c54e] active:scale-[0.99] text-black font-black text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4 stroke-[3.5]" />
                  <span>Mark All Bet Slips Green Now</span>
                </button>

                {/* Secondary Button: Settle All as WON and Payout to Wallet */}
                <button
                  type="button"
                  onClick={() => {
                    markAllBetsGreen(true);
                  }}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-[0.99] text-black font-black text-xs rounded-lg shadow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Settle All as WON (Credit Payout to Wallet)</span>
                </button>

                {/* Revert Button */}
                {isAllGreenTriggered && (
                  <button
                    type="button"
                    onClick={() => {
                      resetBetsGreenState();
                    }}
                    className="w-full py-2 bg-[#253243] hover:bg-[#2e3e52] text-neutral-300 font-bold text-xs rounded-lg flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset to Pending / Live State</span>
                  </button>
                )}

                {/* Direct link to /admin portal */}
                <button
                  type="button"
                  onClick={() => {
                    window.history.pushState(null, '', '/admin');
                    window.dispatchEvent(new PopStateEvent('popstate'));
                    onClose();
                  }}
                  className="w-full py-2.5 bg-[#172332] hover:bg-[#213042] border border-[#2b3c50] text-[#00df59] font-bold text-xs rounded-lg flex items-center justify-center space-x-2 transition-colors cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-[#00df59]" />
                  <span>Launch Dedicated Admin Portal (/admin)</span>
                </button>
              </div>

              {/* Preview of Marked Green Layout (Matches User Screenshot) */}
              <div className="bg-[#121922] border border-[#253344] rounded-lg p-3 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-neutral-400 font-bold border-b border-[#1f2b3a] pb-1.5">
                  <span>How each leg appears when marked green:</span>
                  <span className="text-[#00df59]">Screenshot Match</span>
                </div>

                <div className="flex items-start space-x-3 pt-1">
                  <div className="w-5 h-5 rounded-full bg-[#00df59] flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                    <Check className="w-3.5 h-3.5 text-black stroke-[3.5]" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="text-[11px] text-neutral-400">Game ID: 23888 | 26/09 18:45</div>
                    <div className="font-bold text-white text-xs">Albania v Belarus</div>
                    <div className="text-[11px] text-neutral-300 flex items-center space-x-2">
                      <span>FT Score: <strong className="text-white">2:0</strong></span>
                      <span className="text-neutral-600">|</span>
                      <span className="text-[#00df59] font-bold">📗 Match Tracker</span>
                    </div>
                    <div className="bg-[#182330] p-2 rounded border border-[#243346] text-[11px] relative overflow-hidden space-y-0.5">
                      <div className="flex items-center space-x-1">
                        <span className="text-neutral-400">Pick:</span>
                        <strong className="text-white">Home @1.69</strong>
                        <Check className="w-3 h-3 text-[#00df59] stroke-[3]" />
                      </div>
                      <div className="text-neutral-400">Market: <span className="text-neutral-200">1X2</span></div>
                      <div className="text-neutral-400">Outcome: <strong className="text-white">Home</strong></div>
                      <Trophy className="w-8 h-8 text-white/[0.08] absolute right-2 bottom-1" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Counts summary */}
              <div className="bg-[#151f2b] p-3 rounded-lg border border-[#233142] flex items-center justify-between text-neutral-400">
                <div>
                  <span>Open Bets: </span>
                  <strong className="text-white">{openBets.length} tickets</strong>
                </div>
                <div>
                  <span>Settled History: </span>
                  <strong className="text-white">{betHistory.length} tickets</strong>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: NETWORK & SERVER CONFIGURATION */}
          {activeTab === 'network' && (
            <div className="space-y-4">
              <div className="bg-[#121820] border border-[#253243] rounded-lg p-3 space-y-1.5">
                <div className="flex items-center space-x-1.5 text-neutral-200 font-bold">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>APK Network Connection</span>
                </div>
                <p className="text-[11px] text-neutral-300 leading-relaxed">
                  When deployed on an Android phone, the APK connects to your live cloud URL (e.g. Vercel backend).
                </p>
              </div>

              <div className="bg-[#10151c] p-2.5 rounded-lg border border-[#202b38] flex items-center justify-between">
                <span className="text-neutral-400 font-medium">Active API URL:</span>
                <span className="font-mono text-[#00df59] font-bold truncate max-w-[220px]">
                  {currentActiveUrl}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-neutral-200 block">Custom Backend API URL:</label>
                <input
                  type="text"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://your-sportybet-project.vercel.app"
                  className="w-full bg-[#121820] border border-[#2c3848] rounded px-3 py-2 text-xs text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#00df59]"
                />
              </div>

              {testResult && (
                <div
                  className={`p-2.5 rounded-lg text-xs font-medium flex items-start space-x-2 ${
                    testResult.success
                      ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-500/15 border border-rose-500/40 text-rose-300'
                  }`}
                >
                  {testResult.success ? (
                    <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                  )}
                  <span className="leading-snug">{testResult.message}</span>
                </div>
              )}

              <div className="flex items-center space-x-2 pt-2">
                <button
                  type="button"
                  onClick={handleTestConnection}
                  disabled={testing}
                  className="flex-1 py-2 bg-[#253243] hover:bg-[#2f3e52] text-neutral-200 font-bold rounded flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
                  <span>{testing ? 'Testing...' : 'Test Connection'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="py-2 px-3 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-bold rounded transition-colors cursor-pointer"
                >
                  Reset
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleSave}
                  className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] text-white font-black text-xs rounded shadow transition-colors cursor-pointer"
                >
                  Save API URL & Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-[#141b24] px-4 py-2.5 border-t border-[#253243] flex items-center justify-between text-neutral-400 text-xs shrink-0">
          <span>Admin Controls Active</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-[#253243] hover:bg-[#2e3e52] text-white font-bold rounded text-xs transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
