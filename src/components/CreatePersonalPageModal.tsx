import React, { useState, useEffect } from 'react';
import { X, Check, Share2, MessageSquare, Sparkles, ShieldCheck, PlusCircle, Bookmark, Trophy, RefreshCw } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface CreatePersonalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
  forceCreateNew?: boolean;
}

export const CreatePersonalPageModal: React.FC<CreatePersonalPageModalProps> = ({
  isOpen,
  onClose,
  forceCreateNew = false
}) => {
  const { user, showToast } = useBetting();

  // Mode: 'profile' | 'code'
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'code'>('profile');

  // Personal Page Form State
  const [handle, setHandle] = useState('');
  const [bio, setBio] = useState('Daily high-probability football & Aviator codes · SportyBet Ghana verified punter');
  const [savedProfile, setSavedProfile] = useState<{ handle: string; bio: string; createdAt: string } | null>(null);
  const [created, setCreated] = useState(false);

  // Quick Booking Code Generator Form State
  const [ticketTitle, setTicketTitle] = useState('Weekend High Odds Combo');
  const [bookingCodeInput, setBookingCodeInput] = useState('');
  const [foldsCount, setFoldsCount] = useState(4);
  const [estimatedOdds, setEstimatedOdds] = useState('18.50');
  const [stakeAmount, setStakeAmount] = useState('20.00');
  const [codeCreated, setCodeCreated] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');

  // Load existing profile from storage or reset when forceCreateNew is triggered
  useEffect(() => {
    if (isOpen) {
      try {
        const stored = localStorage.getItem('sportybet_personal_page');
        if (stored) {
          const parsed = JSON.parse(stored);
          setSavedProfile(parsed);
          setHandle(parsed.handle || user.username || 'gh_punter');
          setBio(parsed.bio || 'Daily high-probability football & Aviator codes · SportyBet Ghana verified punter');
          // If forceCreateNew is true, show form directly instead of success/view card
          setCreated(!forceCreateNew);
        } else {
          setHandle(user.username || 'gh_punter');
          setCreated(false);
        }
      } catch {
        setHandle(user.username || 'gh_punter');
        setCreated(false);
      }
      setCodeCreated(false);
    }
  }, [isOpen, forceCreateNew, user.username]);

  if (!isOpen) return null;

  const handleCreateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanHandle = handle.trim().replace(/^@/, '');
    const newProfile = {
      handle: cleanHandle || 'gh_punter',
      bio: bio.trim(),
      createdAt: new Date().toISOString()
    };
    try {
      localStorage.setItem('sportybet_personal_page', JSON.stringify(newProfile));
    } catch {}
    setSavedProfile(newProfile);
    setCreated(true);
    showToast(`Personal Page created: @${cleanHandle}! CodeChat unlocked.`);
  };

  const handleCreateBookingCode = (e: React.FormEvent) => {
    e.preventDefault();
    const code = bookingCodeInput.trim().toUpperCase() || Math.random().toString(36).substring(2, 8).toUpperCase();
    setGeneratedCode(code);
    setCodeCreated(true);

    // Save custom booking code ticket to storage for community & open bets
    try {
      const newCustomBet = {
        id: `bet-${Date.now()}`,
        bookingCode: code,
        totalOdds: parseFloat(estimatedOdds) || 12.5,
        stake: parseFloat(stakeAmount) || 10,
        potentialWin: (parseFloat(estimatedOdds) || 12.5) * (parseFloat(stakeAmount) || 10),
        status: 'open',
        date: new Date().toISOString(),
        cashoutAvailable: true,
        currentCashout: (parseFloat(stakeAmount) || 10) * 0.95,
        title: ticketTitle,
        selections: [
          {
            matchId: 'custom-1',
            homeTeam: 'Arsenal',
            awayTeam: 'Chelsea',
            market: '1X2',
            pick: 'Arsenal',
            odds: 1.85,
            status: 'pending'
          },
          {
            matchId: 'custom-2',
            homeTeam: 'Real Madrid',
            awayTeam: 'Barcelona',
            market: 'Over/Under 2.5',
            pick: 'Over 2.5',
            odds: 1.72,
            status: 'pending'
          },
          {
            matchId: 'custom-3',
            homeTeam: 'Inter Milan',
            awayTeam: 'Juventus',
            market: 'Both Teams To Score',
            pick: 'Yes',
            odds: 1.80,
            status: 'pending'
          }
        ]
      };
      const existing = JSON.parse(localStorage.getItem('sportybet_custom_booking_codes') || '[]');
      existing.unshift(newCustomBet);
      localStorage.setItem('sportybet_custom_booking_codes', JSON.stringify(existing));
    } catch {}

    showToast(`Created & Published Booking Code: ${code}!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3.5 animate-in fade-in select-none">
      <div className="w-full max-w-md bg-[#16212e] border border-[#27374b] rounded-xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="bg-[#de1a22] px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-white animate-pulse" />
            <h2 className="text-sm font-bold tracking-wide">Create New</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch inside Create New */}
        <div className="flex border-b border-[#253243] bg-[#121922] text-xs font-bold">
          <button
            onClick={() => setActiveSubTab('profile')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeSubTab === 'profile'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-[#00df59]" />
            <span>Personal Page & CodeChat</span>
          </button>
          <button
            onClick={() => setActiveSubTab('code')}
            className={`flex-1 py-2.5 text-center transition-colors border-b-2 flex items-center justify-center space-x-1.5 cursor-pointer ${
              activeSubTab === 'code'
                ? 'border-[#00df59] text-white bg-[#19222d]'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>Create Booking Code</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          {activeSubTab === 'profile' ? (
            !created ? (
              <form onSubmit={handleCreateProfile} className="space-y-4 text-xs">
                <div className="bg-[#1c2a3b] p-3 rounded-lg border border-[#263a52] flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-neutral-800 border-2 border-[#00df59] shrink-0">
                    <img
                      src={user.avatarUrl || '/user_beach_avatar.jpg'}
                      alt="Avatar"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center space-x-1.5 font-bold text-white text-sm">
                      <span>{user.firstName || 'SPORTY'} {user.lastName || 'PUNTER'}</span>
                      <ShieldCheck className="w-4 h-4 text-[#00df59]" />
                    </div>
                    <div className="text-neutral-400 text-[11px]">
                      Share winning slips, booking codes, and chat with top Ghana punters
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Punter Handle (@)</label>
                  <div className="flex items-center bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white">
                    <span className="text-neutral-400 mr-1 font-bold">@</span>
                    <input
                      type="text"
                      value={handle}
                      onChange={(e) => setHandle(e.target.value)}
                      className="bg-transparent flex-1 focus:outline-none text-white text-xs font-semibold"
                      placeholder="your_handle"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Personal Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-[#101721] border border-[#28394e] rounded p-2 text-white text-xs focus:outline-none resize-none"
                    placeholder="Share your betting strategy or favorite leagues..."
                  />
                </div>

                <div className="bg-[#131d28] p-2.5 rounded border border-[#202f42] text-[11px] text-neutral-300 space-y-1">
                  <div className="flex items-center space-x-1.5 text-[#00df59] font-bold">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked CodeChat Benefits</span>
                  </div>
                  <ul className="list-disc pl-4 space-y-0.5 text-neutral-400">
                    <li>Directly publish tickets to SportyBet Ghana CodeChat</li>
                    <li>Real-time follower count and win-rate badge</li>
                    <li>Instant 1-tap rebet for community members</li>
                  </ul>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 text-white font-black rounded-md uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>Create Personal Page</span>
                </button>
              </form>
            ) : (
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 bg-[#00df59]/20 text-[#00df59] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Personal Page Active!</h3>
                  <p className="text-xs text-neutral-300">
                    Your CodeChat profile <span className="text-[#00df59] font-bold">@{handle}</span> is verified and live on SportyBet Ghana.
                  </p>
                </div>

                <div className="bg-[#121a24] p-3 rounded-lg border border-[#212d3d] text-left text-xs space-y-1.5">
                  <div className="text-neutral-400 text-[11px]">Bio:</div>
                  <p className="text-white italic text-[12px]">"{bio}"</p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      showToast(`Copied page link: sportybet.gh/@${handle}`);
                    }}
                    className="px-3.5 py-2 bg-[#1f2e40] hover:bg-[#283c53] text-white text-xs font-bold rounded flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Link</span>
                  </button>
                  <button
                    onClick={() => setCreated(false)}
                    className="px-3.5 py-2 bg-[#253448] hover:bg-[#2f425b] text-neutral-200 text-xs font-bold rounded flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Edit Profile</span>
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )
          ) : (
            /* Tab 2: Create Booking Code / Ticket */
            !codeCreated ? (
              <form onSubmit={handleCreateBookingCode} className="space-y-4 text-xs">
                <div>
                  <label className="block text-neutral-300 font-bold mb-1">Ticket Title</label>
                  <input
                    type="text"
                    value={ticketTitle}
                    onChange={(e) => setTicketTitle(e.target.value)}
                    className="w-full bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white text-xs font-semibold focus:outline-none focus:border-[#00df59]"
                    placeholder="e.g. Weekend Premier League Banker"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Custom Code (Optional)</label>
                    <input
                      type="text"
                      value={bookingCodeInput}
                      onChange={(e) => setBookingCodeInput(e.target.value.toUpperCase())}
                      className="w-full bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white text-xs font-mono uppercase focus:outline-none focus:border-[#00df59]"
                      placeholder="e.g. B8XZ9Q"
                      maxLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Total Odds</label>
                    <input
                      type="text"
                      value={estimatedOdds}
                      onChange={(e) => setEstimatedOdds(e.target.value)}
                      className="w-full bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-[#00df59]"
                      placeholder="18.50"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Matches / Folds</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={foldsCount}
                      onChange={(e) => setFoldsCount(Number(e.target.value))}
                      className="w-full bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white text-xs focus:outline-none focus:border-[#00df59]"
                    />
                  </div>
                  <div>
                    <label className="block text-neutral-300 font-bold mb-1">Stake (GHS)</label>
                    <input
                      type="text"
                      value={stakeAmount}
                      onChange={(e) => setStakeAmount(e.target.value)}
                      className="w-full bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-[#00df59]"
                      placeholder="20.00"
                    />
                  </div>
                </div>

                <div className="bg-[#131d28] p-2.5 rounded border border-[#202f42] text-[11px] text-neutral-300 space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-neutral-400">Potential Return:</span>
                    <span className="text-[#00df59] text-xs">
                      GHS {((parseFloat(estimatedOdds) || 1) * (parseFloat(stakeAmount) || 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="text-[10px] text-neutral-400">
                    Will be instantly published to Open Bets and the CodeChat community feed.
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#de1a22] hover:bg-[#c4151c] active:scale-98 text-white font-black rounded-md uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Trophy className="w-4 h-4" />
                  <span>Generate & Save Ticket</span>
                </button>
              </form>
            ) : (
              <div className="py-4 text-center space-y-4">
                <div className="w-14 h-14 bg-[#00df59]/20 text-[#00df59] rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-white text-base">Booking Code Created!</h3>
                  <div className="font-mono text-2xl font-black text-[#00df59] tracking-wider py-1">
                    {generatedCode}
                  </div>
                  <p className="text-xs text-neutral-300">
                    Added to your Open Bets and available for 1-tap rebet in CodeChat.
                  </p>
                </div>

                <div className="flex items-center justify-center space-x-2 pt-2">
                  <button
                    onClick={() => {
                      showToast(`Copied code: ${generatedCode}`);
                    }}
                    className="px-4 py-2 bg-[#1f2e40] hover:bg-[#283c53] text-white text-xs font-bold rounded flex items-center space-x-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Copy Code</span>
                  </button>
                  <button
                    onClick={() => setCodeCreated(false)}
                    className="px-4 py-2 bg-[#253448] hover:bg-[#2f425b] text-neutral-200 text-xs font-bold rounded cursor-pointer"
                  >
                    Create Another
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
};
