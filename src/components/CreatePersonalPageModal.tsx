import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Copy, Check, MessageSquare, Share2, Users, Flame, ExternalLink, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';

interface CreatePersonalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePersonalPageModal: React.FC<CreatePersonalPageModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateUsername, showToast, openBets, loadBookingCode, setIsBetslipOpen } = useBetting();

  const [username, setUsername] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'codechat'>('profile');
  const [chatMessage, setChatMessage] = useState('');

  // Sample active CodeChat community messages
  const [codeChatMessages, setCodeChatMessages] = useState([
    {
      id: 'm1',
      author: 'gh_sniper99',
      avatar: '⚽',
      time: '2m ago',
      text: 'Borussia Dortmund vs Werder Bremen is looking solid for 1X + Over 1.5. Cashout already climbing!',
      bookingCode: 'CXA7PN',
      likes: 14,
    },
    {
      id: 'm2',
      author: 'accra_punter',
      avatar: '🔥',
      time: '5m ago',
      text: 'Loaded the 6-fold Nations League multi! Who is riding with me on England away?',
      bookingCode: 'CKBBGF',
      likes: 29,
    },
    {
      id: 'm3',
      author: 'kwame_bets',
      avatar: '🎯',
      time: '11m ago',
      text: 'SportyBet cashout button is ultra fast today. Cashed out 80% stake and left the rest running 🚀',
      likes: 8,
    },
  ]);

  // Check saved personal page from localStorage or user profile
  const [savedPersonalPage, setSavedPersonalPage] = useState<{
    username: string;
    url: string;
    createdAt: string;
  } | null>(() => {
    try {
      const saved = localStorage.getItem('sportybet_personal_page');
      if (saved) return JSON.parse(saved);
    } catch {}
    return null;
  });

  // Keep username input initialized
  useEffect(() => {
    if (savedPersonalPage?.username) {
      setUsername(savedPersonalPage.username);
    } else if (user?.username && !user.username.startsWith('User_') && !user.username.startsWith('Guest')) {
      setUsername(user.username.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 15));
    }
  }, [savedPersonalPage, user?.username, isOpen]);

  if (!isOpen) return null;

  // Validation criteria
  const isLengthValid = username.length >= 6 && username.length <= 15;
  const isFormatValid = username.length > 0 && /^[a-z0-9]+$/.test(username);
  const isValid = isLengthValid && isFormatValid;

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Automatically convert to lowercase letters and numbers as user types
    const raw = e.target.value.toLowerCase().replace(/\s+/g, '');
    setUsername(raw);
  };

  const handleCreate = () => {
    if (!isValid) return;

    const pageData = {
      username,
      url: `sportybet.com/gh/p/${username}`,
      createdAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem('sportybet_personal_page', JSON.stringify(pageData));
      localStorage.setItem('sportybet_personal_page_username', username);
    } catch {}

    setSavedPersonalPage(pageData);
    updateUsername(username);

    // Trigger victory confetti
    try {
      confetti({
        particleCount: 65,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00df59', '#e41b23', '#ffffff', '#ffd700'],
      });
    } catch {}

    showToast(`Personal Page created: sportybet.com/gh/p/${username}! CodeChat unlocked.`);
  };

  const handleCopyLink = () => {
    const link = savedPersonalPage?.url || `sportybet.com/gh/p/${username}`;
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(`https://${link}`);
    }
    setCopiedLink(true);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      author: savedPersonalPage?.username || username || 'you',
      avatar: '👑',
      time: 'Just now',
      text: chatMessage.trim(),
      likes: 0,
    };

    setCodeChatMessages((prev) => [newMsg, ...prev]);
    setChatMessage('');
    showToast('Posted to CodeChat community!');
  };

  const handleLoadBookingCode = async (code: string) => {
    const ok = await loadBookingCode(code);
    if (ok) {
      setIsBetslipOpen(true);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-[2px] animate-in fade-in duration-150">
      {/* Mobile container matching SportyBet viewport */}
      <div className="w-full max-w-md h-full sm:h-auto sm:max-h-[92vh] sm:rounded-md bg-[#141a22] text-white flex flex-col overflow-hidden shadow-2xl relative border border-[#232f3e]">
        {/* ========================================================= */}
        {/* TOP BAR: Solid Red (#e41b23) with white close "X" on right */}
        {/* Exact match to Screenshot 3                               */}
        {/* ========================================================= */}
        <div className="h-12 bg-[#e41b23] flex items-center justify-between px-4 shrink-0 shadow-sm">
          <div className="flex items-center space-x-2">
            <span className="text-white text-xs font-black tracking-wider uppercase opacity-95">
              SPORTYBET COMMUNITY
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-white hover:opacity-80 active:scale-95 transition-all cursor-pointer rounded"
            aria-label="Close"
          >
            <X className="w-6 h-6 stroke-[2.6]" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {!savedPersonalPage ? (
            /* ======================================================= */
            /* VIEW 1: CREATE PERSONAL PAGE (Exact match to Screenshot 3) */
            /* ======================================================= */
            <div className="px-5 py-6">
              {/* Title */}
              <h1 className="text-[22px] font-bold text-white mb-3 tracking-tight">
                Create Personal Page
              </h1>

              {/* Description paragraph */}
              <p className="text-[13px] text-neutral-300 leading-relaxed mb-6 font-normal">
                Join the community of bettors. Share your picks. Build your following. Unlock CodeChat to connect with others on the same bets. Pick your username to begin.
              </p>

              {/* Field Label */}
              <div className="mb-3">
                <label className="block text-xs font-bold text-neutral-100 mb-2">
                  Verify Username
                </label>

                {/* Input box */}
                <div className="relative">
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    placeholder="Username"
                    maxLength={15}
                    autoFocus
                    className="w-full bg-[#18212c] border border-[#2d3a4b] rounded-[3px] px-3.5 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#00df59] transition-colors"
                  />
                  {username && (
                    <button
                      type="button"
                      onClick={() => setUsername('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Validation Checklist directly below input (Exact match to Screenshot 3) */}
              <div className="space-y-2 mb-4">
                {/* Rule 1: Between 6 and 15 characters */}
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isLengthValid
                        ? 'text-[#00df59] fill-[#00df59]/20'
                        : 'text-neutral-500'
                    }`}
                  />
                  <span
                    className={`transition-colors ${
                      isLengthValid ? 'text-neutral-200 font-medium' : 'text-neutral-400'
                    }`}
                  >
                    Must be between 6 and 15 characters
                  </span>
                </div>

                {/* Rule 2: Only lowercase letters or numbers */}
                <div className="flex items-center space-x-2 text-xs">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isFormatValid
                        ? 'text-[#00df59] fill-[#00df59]/20'
                        : 'text-neutral-500'
                    }`}
                  />
                  <span
                    className={`transition-colors ${
                      isFormatValid ? 'text-neutral-200 font-medium' : 'text-neutral-400'
                    }`}
                  >
                    Only contains lowercase letters or numbers
                  </span>
                </div>
              </div>

              {/* Informational note paragraph (Exact match to Screenshot 3) */}
              <p className="text-xs text-neutral-400 leading-relaxed mb-6">
                Now your username will become the unique URL to your personal page. Please note once you have set up your user name, it will be permanent and not changeable.
              </p>

              {/* Create Action Button (Matches Screenshot 3) */}
              <div>
                <button
                  onClick={handleCreate}
                  disabled={!isValid}
                  className={`px-6 py-2.5 rounded-[3px] text-xs font-bold uppercase tracking-wider transition-all shadow-sm ${
                    isValid
                      ? 'bg-[#00a826] hover:bg-[#009221] active:bg-[#007f1c] text-white cursor-pointer active:scale-95'
                      : 'bg-[#2b3542] text-neutral-400 cursor-not-allowed'
                  }`}
                >
                  Create
                </button>
              </div>

              {/* Preview preview card previewing url */}
              {username && (
                <div className="mt-8 p-3 rounded bg-[#10161e] border border-[#212d3b] text-xs text-neutral-400">
                  <span className="text-neutral-500 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">
                    Your Personal URL Preview:
                  </span>
                  <span className="text-[#00df59] font-mono break-all font-semibold">
                    https://sportybet.com/gh/p/{username || '...'}
                  </span>
                </div>
              )}
            </div>
          ) : (
            /* ======================================================= */
            /* VIEW 2: ACTIVE PERSONAL PAGE & CODECHAT COMMUNITY       */
            /* ======================================================= */
            <div className="px-5 py-6">
              {/* Header profile badge */}
              <div className="bg-[#17222f] border border-[#273648] rounded-lg p-4 mb-5 relative overflow-hidden shadow-lg">
                <div className="absolute top-0 right-0 px-2.5 py-1 bg-[#00df59]/15 border-b border-l border-[#00df59]/30 rounded-bl text-[10px] font-black text-[#00df59] flex items-center space-x-1">
                  <ShieldCheck className="w-3 h-3 text-[#00df59]" />
                  <span>VERIFIED PAGE</span>
                </div>

                <div className="flex items-center space-x-3.5 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#00df59] to-[#009221] text-black font-black text-xl flex items-center justify-center shadow-md">
                    {savedPersonalPage.username.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                      <span>@{savedPersonalPage.username}</span>
                      <span className="w-2 h-2 rounded-full bg-[#00df59]" />
                    </h2>
                    <p className="text-[11px] text-neutral-400 font-mono">
                      sportybet.com/gh/p/{savedPersonalPage.username}
                    </p>
                  </div>
                </div>

                {/* Share URL Row */}
                <div className="flex items-center space-x-2 pt-2 border-t border-[#233142]">
                  <div className="flex-1 bg-[#101720] border border-[#202c3b] rounded px-2.5 py-1.5 text-[11px] text-[#00df59] font-mono truncate">
                    https://sportybet.com/gh/p/{savedPersonalPage.username}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-1.5 bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white rounded text-xs font-bold flex items-center space-x-1 cursor-pointer transition-all shrink-0"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedLink ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>

              {/* Sub-Tabs: My Page vs CodeChat Lobby */}
              <div className="flex items-center space-x-2 border-b border-[#212d3b] mb-4 text-xs font-bold">
                <button
                  onClick={() => setActiveSubTab('profile')}
                  className={`pb-2.5 relative transition-colors ${
                    activeSubTab === 'profile' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <span>My Picks & Stats</span>
                  {activeSubTab === 'profile' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59] rounded-full" />
                  )}
                </button>
                <button
                  onClick={() => setActiveSubTab('codechat')}
                  className={`pb-2.5 relative transition-colors flex items-center space-x-1.5 ${
                    activeSubTab === 'codechat' ? 'text-white' : 'text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <MessageSquare className="w-3.5 h-3.5 text-[#00df59]" />
                  <span>CodeChat Lobby</span>
                  <span className="px-1.5 py-0.2 bg-[#e41b23] text-white text-[9px] rounded-full font-black">
                    LIVE
                  </span>
                  {activeSubTab === 'codechat' && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#00df59] rounded-full" />
                  )}
                </button>
              </div>

              {activeSubTab === 'profile' ? (
                <div className="space-y-4">
                  {/* Stats Grid */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-[#17222f] p-2.5 rounded border border-[#243243]">
                      <div className="text-base font-black text-white">0</div>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">Followers</div>
                    </div>
                    <div className="bg-[#17222f] p-2.5 rounded border border-[#243243]">
                      <div className="text-base font-black text-[#00df59]">
                        {openBets.length}
                      </div>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">Active Bets</div>
                    </div>
                    <div className="bg-[#17222f] p-2.5 rounded border border-[#243243]">
                      <div className="text-base font-black text-amber-400">100%</div>
                      <div className="text-[10px] text-neutral-400 uppercase font-semibold">Reputation</div>
                    </div>
                  </div>

                  {/* Active Picks shared from Open Bets */}
                  <div>
                    <h3 className="text-xs font-bold text-neutral-200 mb-2 flex items-center justify-between">
                      <span>Shared Picks ({openBets.length})</span>
                      <span className="text-[10px] text-neutral-400">Syncs with Open Bets</span>
                    </h3>

                    {openBets.length === 0 ? (
                      <div className="p-6 text-center bg-[#17222f] rounded border border-[#243243] text-xs text-neutral-400">
                        <p>No open bets placed yet.</p>
                        <p className="mt-1 text-[11px] text-neutral-500">
                          Place a bet on Sports to share your booking codes on your personal page.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {openBets.map((b) => (
                          <div
                            key={b.id}
                            className="bg-[#17222f] border border-[#263546] rounded p-3 flex items-center justify-between"
                          >
                            <div>
                              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                                <span>{b.type} Bet</span>
                                {b.bookingCode && (
                                  <span className="px-1.5 py-0.5 bg-[#00df59]/15 text-[#00df59] font-mono text-[10px] rounded font-bold">
                                    {b.bookingCode}
                                  </span>
                                )}
                              </div>
                              <div className="text-[11px] text-neutral-400 mt-0.5">
                                {b.selections.length} Events • Stake GHS {b.stake.toFixed(2)}
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                showToast(`Booking code ${b.bookingCode || 'CXA7PN'} copied!`);
                              }}
                              className="px-2.5 py-1 bg-[#233142] hover:bg-[#2e3f54] text-neutral-200 text-xs font-semibold rounded flex items-center space-x-1"
                            >
                              <Share2 className="w-3 h-3 text-[#00df59]" />
                              <span>Share</span>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Re-edit option */}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSavedPersonalPage(null);
                        localStorage.removeItem('sportybet_personal_page');
                        localStorage.removeItem('sportybet_personal_page_username');
                      }}
                      className="text-[11px] text-neutral-500 hover:text-neutral-300 underline"
                    >
                      Change or Reset Username
                    </button>
                  </div>
                </div>
              ) : (
                /* CodeChat Lobby */
                <div className="space-y-3">
                  {/* Message Input */}
                  <form onSubmit={handleSendChatMessage} className="flex gap-2">
                    <input
                      type="text"
                      value={chatMessage}
                      onChange={(e) => setChatMessage(e.target.value)}
                      placeholder="Share pick, tips, or odds insight..."
                      className="flex-1 bg-[#18212c] border border-[#2b3a4b] rounded px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00df59]"
                    />
                    <button
                      type="submit"
                      disabled={!chatMessage.trim()}
                      className="px-4 py-2 bg-[#00a826] hover:bg-[#009221] disabled:opacity-40 text-white font-bold text-xs rounded transition-colors"
                    >
                      Post
                    </button>
                  </form>

                  {/* Feed */}
                  <div className="space-y-2.5 max-h-[380px] overflow-y-auto no-scrollbar pr-0.5">
                    {codeChatMessages.map((msg) => (
                      <div
                        key={msg.id}
                        className="bg-[#17222f] border border-[#253445] rounded-lg p-3 space-y-1.5"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <span className="text-base">{msg.avatar}</span>
                            <span className="font-bold text-white">@{msg.author}</span>
                          </div>
                          <span className="text-[10px] text-neutral-400 font-mono">{msg.time}</span>
                        </div>

                        <p className="text-xs text-neutral-300 leading-relaxed">{msg.text}</p>

                        {msg.bookingCode && (
                          <div className="flex items-center justify-between pt-1 text-xs">
                            <span className="text-[11px] text-neutral-400">
                              Booking Code: <strong className="text-[#00df59] font-mono font-bold">{msg.bookingCode}</strong>
                            </span>
                            <button
                              onClick={() => handleLoadBookingCode(msg.bookingCode!)}
                              className="px-2 py-0.5 bg-[#00df59]/20 hover:bg-[#00df59]/30 text-[#00df59] font-bold text-[10px] rounded transition-colors"
                            >
                              Load Bet →
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
