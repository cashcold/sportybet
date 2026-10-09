import React, { useState } from 'react';
import { X, Check, Share2, MessageSquare, Sparkles, User, ShieldCheck } from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface CreatePersonalPageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePersonalPageModal: React.FC<CreatePersonalPageModalProps> = ({
  isOpen,
  onClose
}) => {
  const { user, showToast } = useBetting();
  const [handle, setHandle] = useState(user.username || 'gh_punter');
  const [bio, setBio] = useState('Daily high-probability football & Aviator codes · SportyBet Ghana verified punter');
  const [created, setCreated] = useState(false);

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setCreated(true);
    showToast(`Personal Page created: @${handle}! CodeChat unlocked.`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-in fade-in select-none">
      <div className="w-full max-w-md bg-[#16212e] border border-[#27374b] rounded-xl overflow-hidden shadow-2xl text-white">
        {/* Header */}
        <div className="bg-[#de1a22] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MessageSquare className="w-5 h-5 text-white" />
            <h2 className="text-sm font-bold tracking-wide">SportyBet Personal Page & CodeChat</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/80 hover:text-white rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 space-y-4">
          {!created ? (
            <form onSubmit={handleCreate} className="space-y-4 text-xs">
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
                    Share winning slips, booking codes, and chat with top punters
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Punter Handle (@)</label>
                <div className="flex items-center bg-[#101721] border border-[#28394e] rounded px-3 py-2 text-white">
                  <span className="text-neutral-400 mr-1">@</span>
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
                  <span>Unlocked Benefits</span>
                </div>
                <ul className="list-disc pl-4 space-y-0.5 text-neutral-400">
                  <li>Directly publish tickets to SportyBet Ghana CodeChat</li>
                  <li>Real-time follower count and win-rate badge</li>
                  <li>Instant 1-tap rebet for community members</li>
                </ul>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#00c853] hover:bg-[#00b34a] active:scale-98 text-white font-black rounded-md uppercase tracking-wider text-xs transition-all shadow-md cursor-pointer"
              >
                Create Personal Page
              </button>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 bg-[#00df59]/20 text-[#00df59] rounded-full flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-white text-base">Personal Page Active!</h3>
                <p className="text-xs text-neutral-300">
                  Your CodeChat profile <span className="text-[#00df59] font-bold">@{handle}</span> is now verified and live on SportyBet Ghana.
                </p>
              </div>

              <div className="flex items-center justify-center space-x-2 pt-2">
                <button
                  onClick={() => {
                    showToast(`Copied page link: sportybet.gh/@${handle}`);
                  }}
                  className="px-4 py-2 bg-[#1f2e40] hover:bg-[#283c53] text-white text-xs font-bold rounded flex items-center space-x-1.5 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Profile Link</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-[#00c853] hover:bg-[#00b34a] text-white text-xs font-bold rounded cursor-pointer"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
