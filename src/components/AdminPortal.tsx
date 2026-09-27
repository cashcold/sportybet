import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  Unlock,
  Zap,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Eye,
  ArrowLeft,
  LogOut,
  DollarSign,
  Ticket,
  Check,
  X,
  AlertCircle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Trash2,
  Database,
  Server
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';
import { PlacedBet } from '../types';
import { TicketDetailsModal } from './TicketDetailsModal';
import { resolveWinningPredictionDetails } from '../utils/predictionHelper';
import { api } from '../services/api';

interface AdminPortalProps {
  onBackToApp: () => void;
}

export const AdminPortal: React.FC<AdminPortalProps> = ({ onBackToApp }) => {
  const {
    openBets,
    betHistory,
    user,
    updateProfile,
    showToast,
    isAllGreenTriggered,
    markAllBetsGreen,
    markSingleBetGreen,
    resetBetsGreenState,
    deleteBetFromMongo,
    syncWithMongo
  } = useBetting();

  const ADMIN_PASSWORD = 'admin12345@';

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('sportybet_admin_auth') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<PlacedBet | null>(null);
  const [creditAmount, setCreditAmount] = useState('');
  const [activeAdminTab, setActiveAdminTab] = useState<'bets' | 'wallet' | 'mongodb'>('bets');
  const [isSyncing, setIsSyncing] = useState(false);
  const [mongoStatus, setMongoStatus] = useState<any>(null);
  const [mongoUriInput, setMongoUriInput] = useState('');
  const [isUpdatingMongoUri, setIsUpdatingMongoUri] = useState(false);

  // Load MongoDB Status
  const fetchMongoStatus = async () => {
    try {
      const res = await api.admin.getStatus();
      if (res.success) {
        setMongoStatus(res);
      }
    } catch {
      //
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchMongoStatus();
      syncWithMongo();
    }
  }, [isAuthenticated]);

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncWithMongo();
    await fetchMongoStatus();
    setIsSyncing(false);
    showToast('Synchronized with MongoDB database');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput.trim() === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sportybet_admin_auth', 'true');
      setErrorMsg('');
      showToast('Admin Portal unlocked successfully!');
    } else {
      setErrorMsg('Incorrect admin password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sportybet_admin_auth');
    setPasswordInput('');
    showToast('Logged out of Admin Portal');
  };

  const handleAddBalance = async (amount: number) => {
    const newBal = parseFloat((user.balance + amount).toFixed(2));
    updateProfile({ balance: newBal });
    try {
      await api.admin.updateBalance(undefined, amount);
      await syncWithMongo();
    } catch {
      //
    }
    showToast(`Added GHS ${amount.toFixed(2)} in MongoDB. New Balance: GHS ${newBal.toFixed(2)}`);
  };

  const handleSetExactBalance = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(creditAmount);
    if (isNaN(val) || val < 0) {
      showToast('Please enter a valid amount');
      return;
    }
    updateProfile({ balance: val });
    try {
      await api.admin.updateBalance(val);
      await syncWithMongo();
    } catch {
      //
    }
    showToast(`Balance updated in MongoDB to GHS ${val.toFixed(2)}`);
    setCreditAmount('');
  };

  const handleDeleteBet = async (betId: string, ticketId: string) => {
    const confirmed = window.confirm(`Permanently delete bet ticket "${ticketId}" from MongoDB database? This will immediately reflect in the customer app.`);
    if (!confirmed) return;

    const ok = await deleteBetFromMongo(betId);
    if (ok) {
      await fetchMongoStatus();
    }
  };

  const handleUpdateMongoUri = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mongoUriInput.trim()) {
      showToast('Please enter a MongoDB connection string');
      return;
    }

    setIsUpdatingMongoUri(true);
    try {
      const res = await api.admin.setMongoUri(mongoUriInput.trim());
      if (res.success) {
        showToast('Connected to custom MongoDB cluster!');
        await fetchMongoStatus();
        await syncWithMongo();
        setMongoUriInput('');
      } else {
        showToast(res.error || 'Failed to connect to MongoDB cluster');
      }
    } catch (err: any) {
      showToast(err?.message || 'Error updating MongoDB URI');
    } finally {
      setIsUpdatingMongoUri(false);
    }
  };

  // 1. Password Protection Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0b1016] text-white flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-[#131b25] border border-[#243346] rounded-2xl shadow-2xl p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-red-600/15 border border-red-500/40 rounded-2xl flex items-center justify-center mx-auto text-red-500 shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="text-xl font-black tracking-tight text-white">SportyBet Admin Portal</h1>
            <p className="text-xs text-neutral-400">
              Restricted Area. Enter admin credentials to manage MongoDB bet slips and outcomes.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-300 block">
                Admin Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="Enter admin password"
                  autoFocus
                  className="w-full bg-[#1b2634] border border-[#2b3a4d] rounded-lg px-3.5 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#00df59] pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>
              {errorMsg && (
                <div className="flex items-center space-x-1.5 text-rose-400 text-xs pt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#00df59] hover:bg-[#00c54e] active:scale-[0.99] text-black font-black text-sm rounded-lg shadow-lg flex items-center justify-center space-x-2 transition-all cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>Unlock Admin Portal</span>
            </button>
          </form>

          {/* Back link */}
          <div className="pt-2 text-center border-t border-[#1e2a39]">
            <button
              onClick={onBackToApp}
              className="inline-flex items-center space-x-1 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to SportyBet Ghana App</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Portal
  return (
    <div className="min-h-screen bg-[#0c1219] text-white flex flex-col font-sans select-none">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#141d28] border-b border-[#223142] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center text-white font-black text-xs shadow">
            SB
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-sm font-black text-white tracking-wide">ADMIN PORTAL</h1>
              <span className="bg-[#00df59]/20 text-[#00df59] border border-[#00df59]/40 text-[10px] font-black px-1.5 py-0.5 rounded flex items-center space-x-1">
                <Database className="w-2.5 h-2.5" />
                <span>MongoDB Heart</span>
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">SportyBet Ghana Master Control</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {/* Real-time Sync from MongoDB button */}
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            className="px-2.5 py-1.5 bg-[#1b2533] hover:bg-[#243346] text-neutral-300 hover:text-white font-bold text-xs rounded flex items-center space-x-1.5 border border-[#2b3a4d] transition-colors cursor-pointer disabled:opacity-50"
            title="Fetch latest data from MongoDB database"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#00df59]' : ''}`} />
            <span className="hidden sm:inline">Sync Mongo</span>
          </button>

          <button
            onClick={onBackToApp}
            className="px-3 py-1.5 bg-[#1e2a39] hover:bg-[#28384d] text-white font-bold text-xs rounded flex items-center space-x-1.5 border border-[#2b3a4d] transition-colors cursor-pointer"
            title="Open Customer Front-end"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Go to App</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-rose-500/10 rounded transition-colors cursor-pointer"
            title="Lock Admin Portal"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 max-w-4xl w-full mx-auto p-3 sm:p-5 space-y-4">
        {/* KPI Stat Cards (Direct from MongoDB) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
          {/* Card 1: MongoDB Database Status */}
          <div className="bg-[#151f2b] border border-[#243346] rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider flex items-center justify-between">
              <span>Database</span>
              <Database className="w-3 h-3 text-[#00df59]" />
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00df59] animate-pulse" />
              <span className="text-xs font-black text-[#00df59] truncate">
                MongoDB Active
              </span>
            </div>
          </div>

          {/* Card 2: Open Slips in MongoDB */}
          <div className="bg-[#151f2b] border border-[#243346] rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
              Open Slips
            </div>
            <div className="text-xl font-black text-white">{openBets.length}</div>
          </div>

          {/* Card 3: Settled Won History in MongoDB */}
          <div className="bg-[#151f2b] border border-[#243346] rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
              Settled Slips
            </div>
            <div className="text-xl font-black text-emerald-400">{betHistory.length}</div>
          </div>

          {/* Card 4: Customer Wallet in MongoDB */}
          <div className="bg-[#151f2b] border border-[#243346] rounded-xl p-3.5 space-y-1">
            <div className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider">
              MongoDB Wallet
            </div>
            <div className="text-xl font-black text-[#00df59]">
              GHS {user.balance.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Primary Master Trigger Banner */}
        <div className="bg-gradient-to-r from-[#172535] to-[#121c27] border border-[#283c52] rounded-xl p-4 sm:p-5 shadow-lg space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 rounded-md bg-[#00df59]/20 flex items-center justify-center text-[#00df59]">
                  <Zap className="w-3.5 h-3.5 fill-[#00df59]" />
                </div>
                <h2 className="text-base font-black text-white tracking-tight">
                  Master MongoDB Green Prediction Trigger
                </h2>
              </div>
              <p className="text-xs text-neutral-300">
                Directly mutates MongoDB: updates all user predictions with green checkmarks (`✔`),
                winning FT scores, and winning outcome labels. App syncs automatically!
              </p>
            </div>

            {/* Quick Master Toggle */}
            <button
              onClick={() => markAllBetsGreen(!isAllGreenTriggered)}
              className={`px-4 py-2.5 rounded-lg text-xs font-black flex items-center space-x-2 shadow-md transition-transform active:scale-95 cursor-pointer shrink-0 ${
                isAllGreenTriggered
                  ? 'bg-[#00df59] text-black hover:bg-[#00c54e]'
                  : 'bg-[#223344] text-[#00df59] border border-[#00df59]/50 hover:bg-[#2b4056]'
              }`}
            >
              <Check className="w-4 h-4 stroke-[3.5]" />
              <span>{isAllGreenTriggered ? 'Mode: All Green ACTIVE' : 'Trigger All Green'}</span>
            </button>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 border-t border-[#233346]">
            <button
              onClick={() => markAllBetsGreen(false)}
              className="py-2.5 px-3 bg-[#00a826] hover:bg-[#009221] active:scale-98 text-white font-extrabold text-xs rounded-md shadow flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
              <span>Mark All Slips Green Now</span>
            </button>

            <button
              onClick={() => markAllBetsGreen(true)}
              className="py-2.5 px-3 bg-amber-500 hover:bg-amber-600 active:scale-98 text-black font-extrabold text-xs rounded-md shadow flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span>Settle All as WON & Credit Wallet</span>
            </button>

            <button
              onClick={() => resetBetsGreenState()}
              className="py-2.5 px-3 bg-[#243346] hover:bg-[#2e4057] active:scale-98 text-neutral-300 font-bold text-xs rounded-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Standard Live/Pending</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#212f3f] text-xs font-bold space-x-1">
          <button
            onClick={() => setActiveAdminTab('bets')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeAdminTab === 'bets'
                ? 'border-[#00df59] text-[#00df59] bg-[#16212e]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Bet Slips & Tickets ({openBets.length + betHistory.length})
          </button>

          <button
            onClick={() => setActiveAdminTab('wallet')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeAdminTab === 'wallet'
                ? 'border-[#00df59] text-[#00df59] bg-[#16212e]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Customer Wallet Management
          </button>

          <button
            onClick={() => setActiveAdminTab('mongodb')}
            className={`py-2 px-4 rounded-t-lg transition-colors cursor-pointer border-b-2 ${
              activeAdminTab === 'mongodb'
                ? 'border-[#00df59] text-[#00df59] bg-[#16212e]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            MongoDB Status & Cluster
          </button>
        </div>

        {/* TAB 1: BET SLIPS MANAGEMENT */}
        {activeAdminTab === 'bets' && (
          <div className="space-y-4">
            {/* Open Bets Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase text-neutral-300 tracking-wider">
                  Active Open Slips in MongoDB ({openBets.length})
                </h3>
                <span className="text-[11px] text-neutral-500">
                  Deleting here deletes from MongoDB & front-end immediately
                </span>
              </div>

              {openBets.length === 0 ? (
                <div className="p-6 bg-[#131b25] border border-[#223142] rounded-xl text-center text-xs text-neutral-400 space-y-2">
                  <p>No active open bets in MongoDB.</p>
                  <button
                    onClick={resetBetsGreenState}
                    className="px-3 py-1.5 bg-[#00df59] text-black font-black rounded text-xs hover:bg-[#00c54e]"
                  >
                    Load Initial Bets into MongoDB
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {openBets.map((bet) => {
                    const isGreen = bet.isAllGreen || isAllGreenTriggered;

                    return (
                      <div
                        key={bet.id}
                        className="bg-[#141d27] border border-[#233144] rounded-xl p-3.5 space-y-3 shadow-md hover:border-[#2d4057] transition-all"
                      >
                        {/* Header Row */}
                        <div className="flex items-center justify-between border-b border-[#1f2b3a] pb-2 text-xs">
                          <div>
                            <span className="font-mono font-bold text-white text-[13px]">
                              {bet.ticketId}
                            </span>
                            <span className="text-neutral-500 mx-1.5">•</span>
                            <span className="text-neutral-400">{bet.type}</span>
                            <span className="text-neutral-500 mx-1.5">•</span>
                            <span className="text-neutral-400">{bet.selections.length} Legs</span>
                          </div>

                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                                isGreen
                                  ? 'bg-[#00df59]/20 text-[#00df59] border border-[#00df59]/40'
                                  : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {isGreen ? 'Marked Green' : 'Pending'}
                            </span>
                          </div>
                        </div>

                        {/* Financials & Action Buttons */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                          <div className="space-x-3 text-neutral-300">
                            <span>
                              Stake: <strong className="text-white">GHS {bet.stake.toFixed(2)}</strong>
                            </span>
                            <span>
                              Odds: <strong className="text-white">{bet.totalOdds.toFixed(2)}</strong>
                            </span>
                            <span>
                              Pot. Win:{' '}
                              <strong className="text-[#00df59] font-black">
                                GHS {bet.potentialWin.toFixed(2)}
                              </strong>
                            </span>
                          </div>

                          <div className="flex items-center space-x-1.5 pt-1 sm:pt-0">
                            {/* Mark Green Button */}
                            <button
                              onClick={() => markSingleBetGreen(bet.id, false)}
                              className="px-2.5 py-1.5 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white font-bold text-[11px] rounded flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Mark predictions on this slip green in MongoDB"
                            >
                              <Check className="w-3 h-3 stroke-[3]" />
                              <span>Mark Green</span>
                            </button>

                            {/* Settle Won Button */}
                            <button
                              onClick={() => markSingleBetGreen(bet.id, true)}
                              className="px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-black font-extrabold text-[11px] rounded flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Settle this slip as won & credit user wallet in MongoDB"
                            >
                              <Trophy className="w-3 h-3" />
                              <span>Settle Won</span>
                            </button>

                            {/* View Customer Slip Modal */}
                            <button
                              onClick={() => setSelectedTicket(bet)}
                              className="px-2.5 py-1.5 bg-[#233144] hover:bg-[#2c3d54] text-white font-bold text-[11px] rounded flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Preview ticket as customer sees it"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Slip</span>
                            </button>

                            {/* DELETE BET DIRECTLY FROM MONGODB */}
                            <button
                              onClick={() => handleDeleteBet(bet.id, bet.ticketId)}
                              className="px-2 py-1.5 bg-rose-950/60 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/40 font-bold text-[11px] rounded flex items-center space-x-1 cursor-pointer transition-colors"
                              title="Delete permanently from MongoDB"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Delete</span>
                            </button>
                          </div>
                        </div>

                        {/* Legs preview */}
                        <div className="bg-[#111720] rounded-lg p-2.5 border border-[#1d2836] divide-y divide-[#1b2532] text-xs">
                          {bet.selections.map((sel, idx) => {
                            const details = resolveWinningPredictionDetails(sel);
                            return (
                              <div
                                key={idx}
                                className="py-1.5 flex items-center justify-between first:pt-0 last:pb-0"
                              >
                                <div className="flex items-center space-x-2 truncate pr-2">
                                  {isGreen ? (
                                    <div className="w-4 h-4 rounded-full bg-[#00df59] flex items-center justify-center shrink-0">
                                      <Check className="w-2.5 h-2.5 text-black stroke-[3.5]" />
                                    </div>
                                  ) : (
                                    <div className="w-4 h-4 rounded-full border border-neutral-600 shrink-0" />
                                  )}
                                  <span className="text-white font-medium truncate">
                                    {details.formattedMatchTitle}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 shrink-0">
                                  <span className="text-neutral-400 font-mono text-[11px]">
                                    {sel.selectionName} ({details.ftScore})
                                  </span>
                                  {isGreen && <Check className="w-3 h-3 text-[#00df59] stroke-[3]" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Settled History Section */}
            {betHistory.length > 0 && (
              <div className="space-y-2.5 pt-4 border-t border-[#202d3c]">
                <h3 className="text-xs font-black uppercase text-neutral-300 tracking-wider">
                  Settled Tickets in MongoDB ({betHistory.length})
                </h3>
                <div className="space-y-2">
                  {betHistory.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#131b24] border border-[#212f40] rounded-lg p-3 flex items-center justify-between hover:border-[#00df59]/40 transition-colors text-xs"
                    >
                      <div
                        onClick={() => setSelectedTicket(item)}
                        className="space-y-0.5 cursor-pointer flex-1"
                      >
                        <div className="flex items-center space-x-2">
                          <span className="text-white font-bold font-mono">{item.ticketId}</span>
                          <span className="bg-[#153a23] text-[#00df59] font-black text-[10px] px-1.5 py-0.5 rounded">
                            🏆 WON
                          </span>
                        </div>
                        <div className="text-neutral-400 text-[11px]">
                          Stake: GHS {item.stake.toFixed(2)} • Return: GHS {item.potentialWin.toFixed(2)}
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedTicket(item)}
                          className="flex items-center space-x-1 text-[#00df59] font-bold text-xs hover:underline cursor-pointer"
                        >
                          <span>View Ticket</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDeleteBet(item.id, item.ticketId)}
                          className="p-1 text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 rounded cursor-pointer transition-colors"
                          title="Delete settled ticket from MongoDB"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WALLET MANAGEMENT */}
        {activeAdminTab === 'wallet' && (
          <div className="bg-[#141d27] border border-[#243346] rounded-xl p-4 sm:p-5 space-y-4 shadow-md text-xs">
            <div>
              <h3 className="text-sm font-bold text-white">Customer Balance Adjustment (MongoDB)</h3>
              <p className="text-neutral-400 text-[11px]">
                Directly modifies the customer's balance stored in the MongoDB `users` collection.
              </p>
            </div>

            {/* Current Balance Display */}
            <div className="bg-[#10161f] p-3 rounded-lg border border-[#1f2b3a] flex items-center justify-between">
              <span className="text-neutral-300 font-medium">MongoDB Balance:</span>
              <span className="text-lg font-black text-[#00df59]">
                GHS {user.balance.toFixed(2)}
              </span>
            </div>

            {/* Quick Credit Buttons */}
            <div className="space-y-1.5">
              <label className="text-neutral-300 font-bold block">Quick Top-Up to MongoDB:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleAddBalance(amt)}
                    className="py-2.5 bg-[#1e2a39] hover:bg-[#28384d] text-white font-bold rounded-lg border border-[#2a3c50] transition-colors cursor-pointer"
                  >
                    + GHS {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* Set Custom Balance Form */}
            <form onSubmit={handleSetExactBalance} className="space-y-2 pt-2 border-t border-[#1e2b3a]">
              <label className="text-neutral-300 font-bold block">Set Exact Balance in MongoDB (GHS):</label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  step="0.01"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="e.g. 10000.00"
                  className="flex-1 bg-[#10161f] border border-[#273648] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00df59]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#00df59] hover:bg-[#00c54e] text-black font-black rounded-lg transition-colors cursor-pointer"
                >
                  Update MongoDB Balance
                </button>
              </div>
            </form>
          </div>
        )}

        {/* TAB 3: MONGODB STATUS & CLUSTER CONFIGURATION */}
        {activeAdminTab === 'mongodb' && (
          <div className="bg-[#141d27] border border-[#243346] rounded-xl p-4 sm:p-5 space-y-4 shadow-md text-xs">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                <Database className="w-4 h-4 text-[#00df59]" />
                <span>MongoDB Database Architecture & Connection</span>
              </h3>
              <p className="text-neutral-400 text-[11px] mt-0.5">
                MongoDB is the main heart of data for SportyBet Ghana. All bets and balances are read and written directly to MongoDB collections without intermediate file caches.
              </p>
            </div>

            {/* Connection Information */}
            <div className="bg-[#10161f] p-3.5 rounded-lg border border-[#1f2b3a] space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-neutral-400">Database Engine:</span>
                <span className="text-emerald-400 font-bold">
                  {mongoStatus?.isEmbedded ? 'Dedicated MongoDB Instance' : 'Remote MongoDB Atlas Cluster'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Database Name:</span>
                <span className="text-white font-bold">{mongoStatus?.databaseName || 'sportybet_ghana'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Total Bets in Collection:</span>
                <span className="text-[#00df59] font-bold">{mongoStatus?.stats?.totalBets ?? openBets.length + betHistory.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Active Open Bets:</span>
                <span className="text-white font-bold">{mongoStatus?.stats?.openBets ?? openBets.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-400">Customer Wallet Balance:</span>
                <span className="text-[#00df59] font-bold">GHS {user.balance.toFixed(2)}</span>
              </div>
            </div>

            {/* Connect to Custom MongoDB Atlas URI */}
            <form onSubmit={handleUpdateMongoUri} className="space-y-2 pt-2 border-t border-[#1e2b3a]">
              <label className="text-neutral-300 font-bold block">
                Connect External MongoDB Atlas Cluster (Optional):
              </label>
              <div className="space-y-1.5">
                <input
                  type="text"
                  value={mongoUriInput}
                  onChange={(e) => setMongoUriInput(e.target.value)}
                  placeholder="mongodb+srv://user:password@cluster.mongodb.net/sportybet_ghana"
                  className="w-full bg-[#10161f] border border-[#273648] rounded-lg px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-[#00df59]"
                />
                <p className="text-[10px] text-neutral-400">
                  If left default, the app runs on its dedicated MongoDB database engine with full MongoDB persistence.
                </p>
              </div>

              <div className="flex space-x-2 pt-1">
                <button
                  type="submit"
                  disabled={isUpdatingMongoUri}
                  className="px-4 py-2 bg-[#00df59] hover:bg-[#00c54e] active:scale-98 text-black font-black rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingMongoUri ? 'Connecting...' : 'Connect to MongoDB Atlas'}
                </button>

                <button
                  type="button"
                  onClick={handleManualSync}
                  className="px-3 py-2 bg-[#1e2a39] hover:bg-[#28384d] text-white font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Refresh MongoDB Status
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* Customer Ticket Modal Preview */}
      <TicketDetailsModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        bet={selectedTicket}
      />
    </div>
  );
};
