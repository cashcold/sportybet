import React, { useState } from 'react';
import {
  HelpCircle,
  RefreshCw,
  Play,
  Share2,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  PlayCircle,
  BarChart2,
  Gamepad2,
  ArrowDown,
  ArrowUp,
  Tv
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';

export const OpenBetsView: React.FC = () => {
  const { openBets, betHistory, user, cashoutBet, showToast } = useBetting();
  const [activeTab, setActiveTab] = useState<'open' | 'history'>('open');
  const [filter, setFilter] = useState<'all' | 'cashout' | 'live'>('all');

  const filteredOpenBets = openBets.filter(bet => {
    if (filter === 'cashout') return bet.cashoutAvailable;
    if (filter === 'live') return bet.isLive;
    return true;
  });

  return (
    <div className="pb-20 bg-[#121922] text-white min-h-screen">
      {/* Top Bar (Exact match to screenshot 1000038449.jpg) */}
      <div className="px-4 py-3 bg-[#131b24] border-b border-[#1f2835] flex items-center justify-between">
        <button
          onClick={() => showToast('Cashout allows you to settle bets before matches conclude!')}
          className="flex items-center space-x-1.5 text-xs text-neutral-300 hover:text-white font-medium"
        >
          <HelpCircle className="w-4 h-4 text-neutral-400 stroke-[2.2]" />
          <span>How to Cashout?</span>
        </button>

        {/* Profile Avatar + GHS 0.00 in bright gold/yellow */}
        <div className="flex items-center space-x-1.5">
          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center border border-white/20 bg-neutral-800">
            <img
              src={user.avatarUrl || '/user_beach_avatar.jpg'}
              alt="User"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <span className="text-xs font-black text-[#ffde00] tracking-wide">
            {user.currency} {user.balance.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Tab Switcher: Open Bets (1) | Bet History */}
      <div className="flex bg-[#131b24] text-xs font-bold">
        <button
          onClick={() => setActiveTab('open')}
          className={`flex-1 py-3 text-center transition-all ${
            activeTab === 'open'
              ? 'bg-[#131b24] text-white font-black'
              : 'bg-[#485363] text-neutral-300 hover:text-white'
          }`}
        >
          Open Bets ({openBets.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-3 text-center transition-all ${
            activeTab === 'history'
              ? 'bg-[#131b24] text-white font-black'
              : 'bg-[#485363] text-neutral-300 hover:text-white'
          }`}
        >
          Bet History
        </button>
      </div>

      {/* Filter Row: All | Cashout Available | Live Games | 4-square Grid Icon */}
      {activeTab === 'open' && (
        <div className="px-3 py-2.5 flex items-center justify-between bg-[#121922] border-b border-[#1d2633]">
          <div className="flex items-center space-x-2 text-[11px] font-bold">
            <button
              onClick={() => setFilter('all')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors ${
                filter === 'all'
                  ? 'bg-[#79889b] text-[#131a22] font-black'
                  : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2b3848]'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('cashout')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors ${
                filter === 'cashout'
                  ? 'bg-[#79889b] text-[#131a22] font-black'
                  : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2b3848]'
              }`}
            >
              Cashout Available
            </button>
            <button
              onClick={() => setFilter('live')}
              className={`px-3 py-1.5 rounded-[2px] transition-colors ${
                filter === 'live'
                  ? 'bg-[#79889b] text-[#131a22] font-black'
                  : 'bg-[#242f3d] text-neutral-300 hover:bg-[#2b3848]'
              }`}
            >
              Live Games
            </button>
          </div>

          <button className="p-1 text-neutral-400 hover:text-white">
            <LayoutGrid className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Content Section */}
      <div className="p-2 sm:p-3 space-y-3">
        {activeTab === 'open' ? (
          filteredOpenBets.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-300">No active bets</p>
              <p className="text-xs text-neutral-500 mt-1">Place a bet to see live tickets here</p>
            </div>
          ) : (
            filteredOpenBets.map(bet => (
              <div
                key={bet.id}
                className="bg-[#17202b] border border-[#232d3b] rounded-sm overflow-hidden shadow-sm"
              >
                {/* Header row: Multiple Live + Actions (Rebet, SIM, Share, Edit Bet) */}
                <div className="px-3.5 py-3 flex items-center justify-between border-b border-[#212b38]">
                  <div className="flex items-center space-x-2">
                    <span className="font-black text-sm text-white">{bet.type}</span>
                    {bet.isLive && (
                      <span className="bg-[#153422] text-[#00df59] text-[11px] font-bold px-1.5 py-0.2 rounded border border-[#00a826]/30">
                        Live
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-bold text-[#00df59]">
                    <button
                      onClick={() => showToast('Rebet selections loaded into slip')}
                      className="flex items-center space-x-1 hover:text-emerald-400"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Rebet</span>
                    </button>
                    <button
                      onClick={() => showToast('Match probability simulation running...')}
                      className="flex items-center space-x-1 hover:text-emerald-400"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>SIM</span>
                    </button>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(bet.ticketId);
                        showToast(`Copied Ticket ID: ${bet.ticketId}`);
                      }}
                      className="hover:text-emerald-400"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => showToast('Edit Bet: Add or swap selections')}
                      className="hover:text-emerald-400"
                    >
                      Edit Bet
                    </button>
                  </div>
                </div>

                {/* Selections List (Exact match to 1000038449.jpg) */}
                <div className="divide-y divide-[#212b38]">
                  {bet.selections.map((sel, idx) => (
                    <div key={idx} className="p-3.5 flex items-start space-x-3">
                      {/* Left circular play button icon */}
                      <button
                        onClick={() => showToast(`Opening live match tracker for ${sel.matchTitle}`)}
                        className="text-white hover:text-[#00df59] shrink-0 mt-0.5"
                      >
                        <PlayCircle className="w-5 h-5 stroke-[1.8]" />
                      </button>

                      {/* Right selection details */}
                      <div className="flex-1 min-w-0">
                        {/* Line 1: Soccer icon + Pick @ Odd + Market */}
                        <div className="flex items-center space-x-1.5 flex-wrap">
                          <span className="text-xs">⚽</span>
                          <span className="font-black text-sm text-white">
                            {sel.selectionName} @ {sel.odd.toFixed(2)}
                          </span>
                          <span className="text-xs text-neutral-400 font-medium ml-1">
                            {sel.marketName}
                          </span>
                        </div>

                        {/* Line 2: Live Odds pill + Value with trend arrow */}
                        <div className="flex items-center space-x-2 mt-1.5">
                          <span className="bg-[#242f3d] text-neutral-300 text-[11px] px-2 py-0.5 rounded font-semibold border border-neutral-700/50">
                            Live Odds
                          </span>
                          <div className="flex items-center space-x-1 text-sm font-black text-white">
                            <span>{(sel.liveOdds ?? sel.odd).toFixed(2)}</span>
                            {sel.liveOddsTrend === 'down' && (
                              <ArrowDown className="w-3.5 h-3.5 text-[#ff4d4f] stroke-[2.5]" />
                            )}
                            {sel.liveOddsTrend === 'up' && (
                              <ArrowUp className="w-3.5 h-3.5 text-[#00df59] stroke-[2.5]" />
                            )}
                          </div>
                        </div>

                        {/* Line 3: Match Title (underlined link style as in screenshot) */}
                        <button
                          onClick={() => showToast(`Viewing ${sel.matchTitle}`)}
                          className="text-[#9bc2e6] hover:text-white text-xs font-semibold underline block mt-1.5 text-left truncate w-full"
                        >
                          {sel.matchTitle}
                        </button>

                        {/* Line 4: Live minute & score + Live tracker / TV icons */}
                        <div className="flex items-center justify-between mt-2 pt-0.5">
                          <span className="text-[#00df59] font-black text-xs">
                            {sel.liveTime || "84' H2"} | {sel.liveScore || '1:0'}
                          </span>

                          <div className="flex items-center space-x-3 text-neutral-400">
                            {/* Gamepad icon */}
                            <Gamepad2 className="w-4 h-4 text-purple-400" />

                            {/* STV badge for stream */}
                            {sel.hasStream && (
                              <span className="bg-[#de1a22] text-white text-[9px] font-black px-1 py-0.2 rounded tracking-tighter">
                                STV
                              </span>
                            )}

                            {/* Yellow card icon */}
                            <div className="w-3.5 h-2.5 bg-amber-400 rounded-[1px] border border-amber-600/40" />

                            {/* Stats chart icon */}
                            <BarChart2 className="w-4 h-4 text-sky-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Stake, Odds, Return footer */}
                <div className="p-3.5 bg-[#141b24] border-t border-[#212b38] flex items-center justify-between text-xs text-neutral-300">
                  <div>
                    Stake: <span className="font-black text-white">{bet.stake.toFixed(2)}</span>
                  </div>
                  <div>
                    Odds: <span className="font-black text-white">{bet.totalOdds.toFixed(2)}</span>
                  </div>
                  <div>
                    Pot. Win: <span className="font-black text-[#00df59]">{bet.potentialWin.toFixed(2)}</span>
                  </div>
                </div>

                {/* Cashout Button Section */}
                <div className="p-3.5 bg-[#141b24] border-t border-[#212b38]">
                  {bet.cashoutAvailable && bet.cashoutAmount ? (
                    <button
                      onClick={() => cashoutBet(bet.id)}
                      className="w-full bg-[#00a826] hover:bg-[#009221] active:scale-[0.98] text-white font-black py-2.5 rounded-[4px] text-xs transition-all shadow flex items-center justify-center space-x-1"
                    >
                      <span>Cashout GHS {bet.cashoutAmount.toFixed(2)}</span>
                    </button>
                  ) : (
                    <div className="flex flex-col items-end">
                      <button
                        disabled
                        className="bg-[#242f3d] text-neutral-400 font-bold text-xs py-2 px-4 rounded-[4px] cursor-not-allowed opacity-90"
                      >
                        Cashout Unavailable
                      </button>
                      <span className="text-[10px] text-neutral-500 mt-1">
                        Cashout is temporarily unavailable for this bet
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))
          )
        ) : (
          /* Bet History Tab */
          betHistory.length === 0 ? (
            <div className="py-16 text-center text-neutral-400">
              <p className="text-sm font-semibold text-neutral-300">No settled bets</p>
            </div>
          ) : (
            betHistory.map(bet => (
              <div
                key={bet.id}
                className="bg-[#17202b] border border-[#232d3b] rounded-sm p-3.5 shadow-sm"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#242f3e]">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">{bet.type}</span>
                    <span className="text-neutral-400 text-[11px]">{bet.date}</span>
                  </div>
                  <div>
                    {bet.status === 'won' && (
                      <span className="flex items-center space-x-1 text-xs font-bold text-[#00df59]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Won</span>
                      </span>
                    )}
                    {bet.status === 'lost' && (
                      <span className="flex items-center space-x-1 text-xs font-bold text-[#ff4d4f]">
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Lost</span>
                      </span>
                    )}
                    {bet.status === 'cashed_out' && (
                      <span className="text-xs font-bold text-amber-400">
                        Cashed Out
                      </span>
                    )}
                  </div>
                </div>

                <div className="py-2 space-y-1">
                  {bet.selections.map((s, idx) => (
                    <div key={idx} className="text-xs text-neutral-200">
                      {s.matchTitle} • <span className="font-semibold">{s.selectionName}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex items-center justify-between text-xs text-neutral-400 border-t border-[#242f3e]">
                  <div>Stake: GHS {bet.stake.toFixed(2)}</div>
                  <div>
                    Payout:{' '}
                    <span className={`font-bold ${bet.status === 'won' ? 'text-[#00df59]' : bet.status === 'cashed_out' ? 'text-amber-400' : 'text-neutral-400'}`}>
                      GHS {bet.status === 'won' || bet.status === 'cashed_out' ? bet.potentialWin.toFixed(2) : '0.00'}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )
        )}
      </div>
    </div>
  );
};
