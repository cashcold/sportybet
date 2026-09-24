import React, { useState, useEffect } from 'react';
import { X, Server, Check, AlertTriangle, RefreshCw, Globe, Smartphone, ShieldCheck, Zap } from 'lucide-react';
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
  const { showToast } = useBetting();
  const [urlInput, setUrlInput] = useState('');
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  useEffect(() => {
    if (isOpen) {
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
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="bg-[#19222d] border border-[#2b394a] rounded-xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-[#141b24] px-4 py-3 border-b border-[#253243] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#00df59]/10 border border-[#00df59]/30 flex items-center justify-center text-[#00df59]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Server & Network Configuration</h3>
              <div className="flex items-center space-x-1.5 text-[11px] text-neutral-400">
                {isNative ? (
                  <span className="flex items-center space-x-1 text-amber-300">
                    <Smartphone className="w-3 h-3" />
                    <span>Android APK Mode</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-1 text-sky-300">
                    <Globe className="w-3 h-3" />
                    <span>Web Browser Mode</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 text-xs">
          {/* Explanation Box */}
          <div className="bg-[#121820] border border-[#253243] rounded-lg p-3 space-y-1.5">
            <div className="flex items-center space-x-1.5 text-neutral-200 font-bold">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Why does the Android APK need this?</span>
            </div>
            <p className="text-[11px] text-neutral-300 leading-relaxed">
              Unlike a web browser that connects to its own website origin, an Android APK runs standalone on your phone. To log in and place bets, the APK must reach your deployed web API URL (e.g. your Vercel deployment or cloud host).
            </p>
          </div>

          {/* Active Target Banner */}
          <div className="bg-[#10151c] p-2.5 rounded-lg border border-[#202b38] flex items-center justify-between">
            <span className="text-neutral-400 font-medium">Active API URL:</span>
            <span className="font-mono text-[#00df59] font-bold truncate max-w-[240px]">
              {currentActiveUrl}
            </span>
          </div>

          {/* Input field */}
          <div className="space-y-1.5">
            <label className="font-bold text-neutral-200 block">
              Custom Backend API URL:
            </label>
            <div className="relative">
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://your-sportybet-project.vercel.app"
                className="w-full bg-[#121820] border border-[#2c3848] rounded px-3 py-2 text-xs text-white font-mono placeholder:text-neutral-500 focus:outline-none focus:border-[#00df59]"
              />
            </div>
            <p className="text-[10px] text-neutral-400">
              Enter your live Vercel URL, cloud URL, or leave blank to use same-origin relative /api.
            </p>
          </div>

          {/* Test Status Result */}
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

          {/* Buttons */}
          <div className="flex items-center space-x-2 pt-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testing}
              className="flex-1 py-2 bg-[#253243] hover:bg-[#2f3e52] text-neutral-200 font-bold rounded flex items-center justify-center space-x-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
              <span>{testing ? 'Testing...' : 'Test Connection'}</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="flex-1 py-2 bg-[#00a826] hover:bg-[#009221] text-white font-bold rounded flex items-center justify-center space-x-1.5 transition-colors shadow-md"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply</span>
            </button>
          </div>

          <div className="pt-2 border-t border-[#232f3f] flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={handleReset}
              className="text-neutral-400 hover:text-white underline"
            >
              Reset to Default (/api)
            </button>
            <span className="text-neutral-500">SportyBet Mobile Network Stack</span>
          </div>
        </div>
      </div>
    </div>
  );
};
