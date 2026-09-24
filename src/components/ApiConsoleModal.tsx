import React, { useState, useEffect } from 'react';
import { X, Play, Copy, Check, Server, Terminal, Globe, ShieldCheck, RefreshCw, Trash2, Activity, Zap } from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { resolveApiUrl } from '../config/apiConfig';
import { api } from '../services/api';

interface ApiEndpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST' | 'PUT';
  path: string;
  category: 'Wallet' | 'Bets' | 'Matches' | 'Auth' | 'Live Feed' | 'Sports API' | 'System';
  description: string;
  defaultBody?: any;
}

const ENDPOINTS: ApiEndpoint[] = [
  {
    id: 'sports-usage',
    name: 'Sports Quota & Usage',
    method: 'GET',
    path: '/api/sports/usage',
    category: 'Sports API',
    description: 'Real-time multi-sport request counters, cache hits/misses, and safety threshold statuses'
  },
  {
    id: 'sports-football-live',
    name: 'Football Live (60s Cache)',
    method: 'GET',
    path: '/api/sports/football/live',
    category: 'Sports API',
    description: 'Single-flight deduplicated live matches feed with 60-second in-memory cache'
  },
  {
    id: 'sports-football-fixtures',
    name: 'Football Fixtures (15m Cache)',
    method: 'GET',
    path: '/api/sports/football/fixtures',
    category: 'Sports API',
    description: 'Upcoming scheduled matches with 15-minute (900s) centralized cache'
  },
  {
    id: 'sports-nba-live',
    name: 'NBA Live Games (60s Cache)',
    method: 'GET',
    path: '/api/sports/nba/live',
    category: 'Sports API',
    description: 'Real-time NBA in-play game feed with single-flight request protection'
  },
  {
    id: 'sports-clear-cache',
    name: 'Flush Central Cache',
    method: 'POST',
    path: '/api/sports/clear-cache',
    category: 'Sports API',
    description: 'Clears in-memory sports cache while retaining lifetime rate limit counters'
  },
  {
    id: 'sys-status',
    name: 'Serverless API Overview',
    method: 'GET',
    path: '/api',
    category: 'System',
    description: 'Returns API health, serverless environment status, and registered endpoints'
  },
  {
    id: 'matches-live',
    name: 'Get Matches Feed',
    method: 'GET',
    path: '/api/matches?live=true',
    category: 'Matches',
    description: 'Fetch active live matches with realtime 1X2, Over/Under & Handicap odds'
  },
  {
    id: 'wallet-bal',
    name: 'Get Wallet Balance',
    method: 'GET',
    path: '/api/wallet/balance',
    category: 'Wallet',
    description: 'Query live account balance and currency for authenticated user'
  },
  {
    id: 'wallet-txs',
    name: 'Transaction Ledger',
    method: 'GET',
    path: '/api/wallet/transactions',
    category: 'Wallet',
    description: 'Fetch complete history of deposits, withdrawals, and bet stakes'
  },
  {
    id: 'wallet-dep',
    name: 'Mobile Money Deposit',
    method: 'POST',
    path: '/api/wallet/deposit',
    category: 'Wallet',
    description: 'Simulate instant MTN/Telecel/AT MoMo deposit with ref generation',
    defaultBody: {
      amount: 25.00,
      provider: 'MTN Mobile Money',
      accountNumber: '0241234567'
    }
  },
  {
    id: 'bets-open',
    name: 'Get Open Bets & Cashout',
    method: 'GET',
    path: '/api/bets/open',
    category: 'Bets',
    description: 'Returns active betting slips with dynamic realtime cashout offers'
  },
  {
    id: 'bets-code',
    name: 'Generate Booking Code',
    method: 'POST',
    path: '/api/bets/booking-code',
    category: 'Bets',
    description: 'Create a shareable 6-character SportyBet booking code',
    defaultBody: {
      selections: [
        {
          matchId: 'live-alloa-hib',
          gameId: '19482',
          matchTitle: 'Alloa Athletic vs Hibernian B',
          marketName: '1X2',
          selectionName: '1',
          odd: 1.03,
          isLive: true
        }
      ]
    }
  },
  {
    id: 'football-status',
    name: 'API-Football Feed Status',
    method: 'GET',
    path: '/api/football/status',
    category: 'Live Feed',
    description: 'Check connectivity and remaining daily quota with external sports data provider'
  }
];

export const ApiConsoleModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose
}) => {
  const { user, sportsUsage, refreshSportsUsage, showToast } = useBetting();
  const [activeTab, setActiveTab] = useState<'console' | 'quotas'>('quotas');
  const [selectedEndpoint, setSelectedEndpoint] = useState<ApiEndpoint>(ENDPOINTS[0]);
  const [requestBody, setRequestBody] = useState<string>('');
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [responseBody, setResponseBody] = useState<string>('');
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isClearingCache, setIsClearingCache] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      refreshSportsUsage();
    }
  }, [isOpen]);

  useEffect(() => {
    if (selectedEndpoint.defaultBody) {
      setRequestBody(JSON.stringify(selectedEndpoint.defaultBody, null, 2));
    } else {
      setRequestBody('');
    }
    setResponseStatus(null);
    setResponseBody('');
    setLatencyMs(null);
  }, [selectedEndpoint]);

  if (!isOpen) return null;

  const handleExecute = async () => {
    setIsLoading(true);
    setResponseStatus(null);
    setResponseBody('');
    setLatencyMs(null);

    const token = localStorage.getItem('sportybet_auth_token') || 'sporty-session-default';
    const startTime = performance.now();

    try {
      const options: RequestInit = {
        method: selectedEndpoint.method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
        options.body = requestBody;
      }

      const resolvedUrl = resolveApiUrl(selectedEndpoint.path);
      const res = await fetch(resolvedUrl, options);
      const elapsed = Math.round(performance.now() - startTime);
      setLatencyMs(elapsed);
      setResponseStatus(res.status);

      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        const json = await res.json();
        setResponseBody(JSON.stringify(json, null, 2));
      } else {
        const text = await res.text();
        setResponseBody(text);
      }
      refreshSportsUsage();
    } catch (err: any) {
      setResponseStatus(500);
      setResponseBody(JSON.stringify({ error: err.message, status: 'network_failure' }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    setIsClearingCache(true);
    try {
      const res = await api.sports.clearCache();
      if (res.success) {
        showToast('Sports cache cleared successfully');
        await refreshSportsUsage();
      }
    } catch {
      showToast('Failed to clear cache');
    } finally {
      setIsClearingCache(false);
    }
  };

  const getCurlSnippet = () => {
    const token = localStorage.getItem('sportybet_auth_token') || 'sporty-session-default';
    let cmd = `curl -X ${selectedEndpoint.method} "https://sportybet.com${selectedEndpoint.path}" \\\n  -H "Authorization: Bearer ${token}"`;
    if (selectedEndpoint.method !== 'GET' && requestBody.trim()) {
      cmd += ` \\\n  -H "Content-Type: application/json" \\\n  -d '${requestBody.replace(/\n/g, ' ')}'`;
    }
    return cmd;
  };

  const handleCopyCurl = () => {
    navigator.clipboard.writeText(getCurlSnippet());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-3">
      <div className="bg-[#121922] border border-[#232f3f] w-full max-w-5xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#19222d] px-4 py-3 border-b border-[#232f3f] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-[#00df59]/10 border border-[#00df59]/30 flex items-center justify-center text-[#00df59]">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-white text-sm">Centralized API-Sports Monitor & Console</h3>
                <span className="bg-[#00a826]/20 text-[#00df59] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#00a826]/40 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00df59] animate-pulse" />
                  <span>ONLINE</span>
                </span>
              </div>
              <p className="text-[11px] text-neutral-400">
                15-Minute Fixture Cache · Single-Flight Deduplication · Rate Limit Protection
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-[#121922] p-1 rounded-lg border border-[#212d3d] flex space-x-1">
              <button
                onClick={() => setActiveTab('quotas')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  activeTab === 'quotas'
                    ? 'bg-[#00a826] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Quota & Health Monitor
              </button>
              <button
                onClick={() => setActiveTab('console')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  activeTab === 'console'
                    ? 'bg-[#00a826] text-white shadow-sm'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                REST Explorer
              </button>
            </div>
            <button
              onClick={onClose}
              className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors ml-2"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* TAB 1: Quota & Usage Monitor Table */}
        {activeTab === 'quotas' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#121922]">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#19222d] p-3 rounded-lg border border-[#232f3f]">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#00df59]" />
                <div>
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                    API-Sports Subscribed Sports (100 req/day per sport)
                  </h4>
                  <p className="text-[11px] text-neutral-400">
                    Safety limit set to 80 requests. Backend caches fixtures for 15 minutes, live games for 60 seconds.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => refreshSportsUsage()}
                  className="px-3 py-1.5 bg-[#232f3f] hover:bg-[#2e3e52] text-neutral-200 text-xs font-bold rounded flex items-center space-x-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Refresh Stats</span>
                </button>
                <button
                  onClick={handleClearCache}
                  disabled={isClearingCache}
                  className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-bold rounded flex items-center space-x-1.5 transition-colors disabled:opacity-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{isClearingCache ? 'Flushing...' : 'Clear Cache'}</span>
                </button>
              </div>
            </div>

            {/* Quota & Usage Table */}
            <div className="bg-[#16212e] border border-[#212d3d] rounded-xl overflow-hidden shadow-lg">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#1d2b3b] text-neutral-400 font-bold uppercase tracking-wider text-[10px] border-b border-[#212d3d]">
                    <tr>
                      <th className="py-2.5 px-3">Sport</th>
                      <th className="py-2.5 px-3 text-center">Daily Limit</th>
                      <th className="py-2.5 px-3 text-center">Used</th>
                      <th className="py-2.5 px-3 text-center">Remaining</th>
                      <th className="py-2.5 px-3 text-center">Cache Hits</th>
                      <th className="py-2.5 px-3 text-center">Cache Misses</th>
                      <th className="py-2.5 px-3">Last API Request</th>
                      <th className="py-2.5 px-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#212d3d]/60 font-mono text-[11px]">
                    {sportsUsage && sportsUsage.length > 0 ? (
                      sportsUsage.map((item: any) => {
                        const status = item.status || 'Healthy';
                        const isConservative = status === 'Conservative';
                        const isExhausted = status === 'Exhausted' || status === 'Rate Limited';

                        return (
                          <tr key={item.sport} className="hover:bg-[#1a2636] transition-colors">
                            <td className="py-2.5 px-3 font-sans font-bold text-white">
                              {item.sportName || item.sport}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-300">
                              {item.dailyLimit}
                            </td>
                            <td className="py-2.5 px-3 text-center font-bold text-white">
                              {item.requestsMade}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <span
                                className={`font-bold ${
                                  item.remainingRequests <= 20
                                    ? 'text-rose-400'
                                    : item.remainingRequests <= 50
                                    ? 'text-amber-400'
                                    : 'text-[#00df59]'
                                }`}
                              >
                                {item.remainingRequests}
                              </span>
                            </td>
                            <td className="py-2.5 px-3 text-center text-[#00df59] font-bold">
                              {item.cacheHits}
                            </td>
                            <td className="py-2.5 px-3 text-center text-neutral-400">
                              {item.cacheMisses}
                            </td>
                            <td className="py-2.5 px-3 text-neutral-400 text-[10px]">
                              {item.lastApiRequest
                                ? new Date(item.lastApiRequest).toLocaleTimeString()
                                : 'None yet'}
                            </td>
                            <td className="py-2.5 px-3 text-center font-sans">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                                  isExhausted
                                    ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                                    : isConservative
                                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                                    : 'bg-[#00df59]/10 text-[#00df59] border-[#00df59]/30'
                                }`}
                              >
                                {status}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={8} className="py-6 text-center text-neutral-400 font-sans">
                          Loading sports usage statistics...
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Architecture Protection Explainer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-[#16212e] p-3 rounded-lg border border-[#212d3d] space-y-1">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Single-Flight Request Locking</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  When 20 users open football fixtures simultaneously, only ONE upstream call is made. All concurrent users share the in-flight promise.
                </p>
              </div>

              <div className="bg-[#16212e] p-3 rounded-lg border border-[#212d3d] space-y-1">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00df59]" />
                  <span>15-Minute Global Cache</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  Upcoming fixtures are cached for 900 seconds. Live games are cached for 60 seconds. Static data (teams, leagues) cached for 24 hours.
                </p>
              </div>

              <div className="bg-[#16212e] p-3 rounded-lg border border-[#212d3d] space-y-1">
                <div className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
                  <span>Stale-Cache Fallback</span>
                </div>
                <p className="text-[11px] text-neutral-400 leading-relaxed">
                  If the 100-request limit is reached or the network times out, the backend gracefully serves stale cached fixtures so betting never breaks.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: Interactive REST Explorer */}
        {activeTab === 'console' && (
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
            {/* Left Endpoint List */}
            <div className="w-full md:w-72 bg-[#16212e] border-r border-[#212d3d] overflow-y-auto p-2 space-y-1">
              <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1.5">
                Available Endpoints
              </div>
              {ENDPOINTS.map(ep => {
                const isSelected = selectedEndpoint.id === ep.id;
                return (
                  <button
                    key={ep.id}
                    onClick={() => setSelectedEndpoint(ep)}
                    className={`w-full text-left p-2.5 rounded-lg text-xs transition-colors flex flex-col space-y-1 ${
                      isSelected
                        ? 'bg-[#1e2a3b] border border-[#00df59]/40 text-white'
                        : 'text-neutral-300 hover:bg-[#1a2535] border border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                          ep.method === 'GET'
                            ? 'bg-sky-500/20 text-sky-400'
                            : ep.method === 'POST'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {ep.method}
                      </span>
                      <span className="font-semibold truncate text-[11px]">{ep.name}</span>
                    </div>
                    <div className="text-[10px] font-mono text-neutral-400 truncate">
                      {ep.path}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right Request/Response Panel */}
            <div className="flex-1 flex flex-col overflow-y-auto p-4 space-y-3 bg-[#121922]">
              {/* Endpoint header & Execute button */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-[#19222d] p-3 rounded-lg border border-[#232f3f]">
                <div className="flex items-center space-x-2 flex-1 min-w-0">
                  <span
                    className={`text-xs font-black px-2 py-1 rounded uppercase ${
                      selectedEndpoint.method === 'GET'
                        ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                        : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    }`}
                  >
                    {selectedEndpoint.method}
                  </span>
                  <span className="font-mono text-sm font-bold text-white truncate">
                    {selectedEndpoint.path}
                  </span>
                </div>
                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <button
                    onClick={handleCopyCurl}
                    className="px-2.5 py-1.5 bg-[#232f3f] hover:bg-[#2b384a] text-neutral-300 rounded text-xs flex items-center space-x-1 transition-colors"
                    title="Copy as cURL command"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'cURL'}</span>
                  </button>
                  <button
                    onClick={handleExecute}
                    disabled={isLoading}
                    className="flex-1 sm:flex-none px-4 py-1.5 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-xs rounded flex items-center justify-center space-x-1.5 transition-all disabled:opacity-50"
                  >
                    {isLoading ? (
                      <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isLoading ? 'Executing...' : 'Send Request'}</span>
                  </button>
                </div>
              </div>

              <p className="text-xs text-neutral-400">
                {selectedEndpoint.description}
              </p>

              {/* Request Body (if POST/PUT) */}
              {selectedEndpoint.method !== 'GET' && (
                <div className="space-y-1">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider">
                    Request Payload (JSON)
                  </div>
                  <textarea
                    value={requestBody}
                    onChange={e => setRequestBody(e.target.value)}
                    className="w-full h-24 bg-[#0d141d] border border-[#212d3d] rounded-lg p-2.5 font-mono text-xs text-[#00df59] focus:outline-none focus:border-[#00df59]"
                  />
                </div>
              )}

              {/* Response Section */}
              <div className="flex-1 flex flex-col min-h-[220px] space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-neutral-300 uppercase tracking-wider">
                    Response Output
                  </span>
                  <div className="flex items-center space-x-2 font-mono">
                    {responseStatus !== null && (
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          responseStatus >= 200 && responseStatus < 300
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                            : 'bg-rose-500/20 text-rose-400 border border-rose-500/40'
                        }`}
                      >
                        HTTP {responseStatus}
                      </span>
                    )}
                    {latencyMs !== null && (
                      <span className="text-neutral-400 text-[10px]">
                        {latencyMs}ms
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 bg-[#090e15] border border-[#212d3d] rounded-lg p-3 font-mono text-xs overflow-auto max-h-64 text-neutral-200">
                  {isLoading ? (
                    <div className="h-full flex items-center justify-center text-neutral-400 space-x-2 py-8">
                      <span className="w-4 h-4 border-2 border-[#00df59] border-t-transparent rounded-full animate-spin" />
                      <span>Calling serverless handler...</span>
                    </div>
                  ) : responseBody ? (
                    <pre className="whitespace-pre-wrap leading-relaxed">{responseBody}</pre>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-neutral-500 py-10 space-y-1">
                      <Terminal className="w-6 h-6 text-neutral-600 mb-1" />
                      <span>Click &quot;Send Request&quot; to invoke this endpoint live.</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
