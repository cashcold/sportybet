import React, { useState } from 'react';
import {
  ArrowLeft,
  Home,
  Users,
  Share2,
  Ticket,
  ChevronDown,
  Info,
  Edit3,
  BarChart2,
  Shield,
  MessageSquare
} from 'lucide-react';
import { useBetting } from '../context/BettingContext';

interface CodeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'load' | 'popular';
}

export const CodeHubModal: React.FC<CodeHubModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'load'
}) => {
  const { loadBookingCode, showToast, setIsBetslipOpen, betslip } = useBetting();
  const [activeSubTab, setActiveSubTab] = useState<'popular' | 'load' | 'bb' | 'follow'>('load');
  const [inputCode, setInputCode] = useState('');
  const [loading, setLoading] = useState(false);

  // Sync initial tab when opening
  React.useEffect(() => {
    if (defaultTab === 'popular') {
      setActiveSubTab('popular');
    } else {
      setActiveSubTab('load');
    }
  }, [defaultTab, isOpen]);

  if (!isOpen) return null;

  // Exact last loaded codes from Screenshot 4
  const recentLoadedCodes = [
    {
      code: 'CXA7PN',
      folds: 6,
      odds: 12.83,
      date: '07:00 23/09'
    },
    {
      code: 'CKBBGF',
      folds: 10,
      odds: 33.13,
      date: '18:00 22/09'
    },
    {
      code: 'CKVPY0',
      folds: 3,
      odds: 6.28,
      date: '15:00 20/09'
    }
  ];

  // Exact popular booking codes from Screenshot 5
  const popularCodes = [
    {
      code: 'DA2R1A',
      comments: 79,
      folds: 19,
      odds: 507.79,
      shieldText: '1UP or 2UP rewards you early when your team leads!',
      selections: [
        {
          marketText: 'Home @1.10 | 1X2 - 1UP',
          match: 'Portugal vs Wales',
          time: 'Today 18:45',
          flag: '🇵🇹'
        },
        {
          marketText: 'Home @1.22 | 1X2 - 1UP',
          match: 'Austria vs Israel',
          time: 'Today 18:45',
          flag: '🇦🇹'
        },
        {
          marketText: 'Home @1.39 | 1X2 - 1UP',
          match: 'Armenia vs Latvia',
          time: '25/09 Fri 16:00',
          flag: '🇦🇲'
        }
      ]
    },
    {
      code: 'DA2R3J',
      comments: 0,
      folds: 43,
      odds: 2188.05,
      shieldText: '1UP or 2UP rewards you early when your team leads!',
      selections: [
        {
          marketText: 'Over 1.5 @1.32 | Borussia Dortmund...',
          match: 'Borussia Dortmund vs Werder Bremen',
          time: '09/10 Fri 18:30',
          flag: '🇩🇪'
        },
        {
          marketText: 'Over 1.5 @1.26 | Over/Under',
          match: 'Rayo Vallecano vs Athletic Bilbao',
          time: '10/10 Sat 12:00',
          flag: '🇪🇸'
        },
        {
          marketText: 'Over 1.5 @1.31 | Over/Under',
          match: 'Genoa vs Fiorentina',
          time: '10/10 Sat 13:00',
          flag: '🇮🇹'
        }
      ]
    },
    {
      code: 'DA2R0J',
      comments: 17,
      folds: 15,
      odds: 125.93,
      shieldText: '1UP or 2UP rewards you early when your team leads!',
      selections: [
        {
          marketText: 'Home @1.20 | 1X2',
          match: 'Portugal vs Wales',
          time: 'Today 18:45',
          flag: '🇵🇹'
        },
        {
          marketText: 'Over 1.5 @1.14 | Over/Under',
          match: 'Austria vs Israel',
          time: 'Today 18:45',
          flag: '🇦🇹'
        }
      ]
    }
  ];

  const handleLoadCode = async (codeToLoad: string) => {
    const clean = codeToLoad.trim().toUpperCase();
    if (!clean) {
      showToast('Please insert a booking code');
      return;
    }
    setLoading(true);
    const success = await loadBookingCode(clean);
    setLoading(false);
    if (success) {
      onClose();
      setIsBetslipOpen(true);
      showToast(`Booking Code ${clean} loaded into betslip!`);
    } else {
      showToast('Booking code not found. Try CXA7PN or DA2R1A');
    }
  };

  const handleShare = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Booking code ${code} copied to clipboard!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#121922] text-white flex flex-col max-w-md mx-auto animate-in slide-in-from-right duration-200">
      {/* 1. Exact Crimson Red Top Header from Screenshots 4 & 5 */}
      <div className="bg-[#de1a22] px-3.5 py-3 flex items-center justify-between shadow-md">
        <button
          onClick={onClose}
          className="flex items-center space-x-2.5 text-white active:scale-95 transition-transform"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.4]" />
          <span className="font-bold text-[17px] tracking-tight">Code Hub-Football</span>
        </button>

        <div className="flex items-center space-x-4 text-white">
          <button
            onClick={() => showToast('SportyBet Social Community')}
            className="hover:opacity-80 active:scale-90"
            title="Community"
          >
            <Users className="w-5 h-5 stroke-[2]" />
          </button>
          <button
            onClick={onClose}
            className="hover:opacity-80 active:scale-90"
            title="Home"
          >
            <Home className="w-5 h-5 stroke-[2]" />
          </button>
        </div>
      </div>

      {/* 2. Sub-Navigation Tabs: Popular Codes | Load Code | BB | Follow | Note */}
      <div className="bg-[#182330] border-b border-[#243243] flex items-center justify-between text-xs px-2 select-none">
        <button
          onClick={() => setActiveSubTab('popular')}
          className={`py-3 px-3 relative font-bold transition-colors ${
            activeSubTab === 'popular' ? 'text-white font-black' : 'text-[#8e9cae] hover:text-white'
          }`}
        >
          Popular Codes
          {activeSubTab === 'popular' && (
            <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#00df59] rounded-t-sm" />
          )}
        </button>

        <button
          onClick={() => setActiveSubTab('load')}
          className={`py-3 px-3 relative font-bold transition-colors ${
            activeSubTab === 'load' ? 'text-white font-black' : 'text-[#8e9cae] hover:text-white'
          }`}
        >
          Load Code
          {activeSubTab === 'load' && (
            <span className="absolute bottom-0 left-2 right-2 h-[3px] bg-[#00df59] rounded-t-sm" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveSubTab('bb');
            showToast('BetBuilder Codes');
          }}
          className="py-3 px-2 text-[#8e9cae] hover:text-white font-bold"
        >
          <span className="bg-[#243243] text-white px-1.5 py-0.5 rounded text-[10px] italic font-black">
            BB
          </span>
        </button>

        <button
          onClick={() => {
            setActiveSubTab('follow');
            showToast('Follow Top Tipsters');
          }}
          className="py-3 px-2 text-[#8e9cae] hover:text-white font-bold"
        >
          Follow
        </button>

        <button
          onClick={() => showToast('Share your own booking code')}
          className="py-3 px-2 text-[#00df59] hover:text-emerald-300 font-bold"
        >
          <Edit3 className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Tab Content */}
      <div className="flex-1 overflow-y-auto pb-16 bg-[#131b24]">
        {/* =================================================================== */}
        {/* TAB 1: LOAD CODE (Screenshot 4)                                     */}
        {/* =================================================================== */}
        {activeSubTab === 'load' && (
          <div className="p-3.5 space-y-4">
            {/* Input Card */}
            <div className="bg-[#1b2532] border border-[#273648] rounded-md p-3.5 shadow">
              <div className="flex items-center space-x-1.5 text-xs text-[#cad4e0] font-bold mb-2">
                <span>Please insert booking code</span>
                <Info className="w-3.5 h-3.5 text-neutral-400" />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  placeholder="Booking Code"
                  className="flex-1 bg-[#101720] border border-[#2b394b] rounded px-3 py-2 text-xs text-white uppercase font-mono tracking-wider focus:outline-none focus:border-[#00df59]"
                  maxLength={10}
                />
                <button
                  onClick={() => handleLoadCode(inputCode)}
                  disabled={loading || !inputCode.trim()}
                  className={`px-5 py-2 rounded text-xs font-bold transition-all shadow ${
                    inputCode.trim()
                      ? 'bg-[#00a826] hover:bg-[#009221] text-white cursor-pointer'
                      : 'bg-[#313f50] text-[#7f8f9f] cursor-not-allowed'
                  }`}
                >
                  {loading ? 'Loading...' : 'Load'}
                </button>
              </div>

              <p className="text-[10px] text-[#7f8f9f] mt-2">
                *Odds or availabilities may change.
              </p>
            </div>

            {/* Section: Last Loaded Code */}
            <div>
              <h4 className="text-xs font-black text-white mb-2 px-0.5">
                Last Loaded Code
              </h4>

              <div className="space-y-2">
                {recentLoadedCodes.map((item) => (
                  <div
                    key={item.code}
                    className="bg-[#1b2532] border border-[#273648] rounded-md p-3 flex items-center justify-between shadow-sm hover:border-[#384a62] transition-colors"
                  >
                    {/* Left: Code in green + share icon */}
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-sm text-[#00df59] tracking-wide">
                        {item.code}
                      </span>
                      <button
                        onClick={() => handleShare(item.code)}
                        className="text-[#8e9cae] hover:text-white p-1"
                        title="Share code"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Middle: Folds & Odds + Date */}
                    <div className="flex flex-col text-right text-[11px] leading-tight">
                      <div className="text-white font-medium">
                        <span className="text-neutral-400">Folds: </span>
                        <strong className="font-bold">{item.folds}</strong>
                        <span className="text-neutral-400 ml-2">Odds: </span>
                        <strong className="font-bold">{item.odds.toFixed(2)}</strong>
                      </div>
                      <div className="text-[10px] text-[#7f8f9f] font-mono mt-0.5">
                        {item.date}
                      </div>
                    </div>

                    {/* Right: Green Ticket Icon */}
                    <button
                      onClick={() => handleLoadCode(item.code)}
                      className="ml-3 p-1.5 rounded-full text-[#00df59] hover:bg-[#00df59]/10 active:scale-90 transition-transform"
                      title="Load into betslip"
                    >
                      <Ticket className="w-5 h-5 stroke-[2.2]" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="text-center text-[11px] text-[#7f8f9f] mt-4">
                Display the last 6 recent codes only
              </div>
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: POPULAR CODES (Screenshot 5)                                 */}
        {/* =================================================================== */}
        {activeSubTab === 'popular' && (
          <div>
            {/* Filter Dropdowns Strip: Time | Folds | Odds | Sort */}
            <div className="grid grid-cols-4 gap-1 p-2 bg-[#121922] border-b border-[#232e3d] text-[11px]">
              {['Time', 'Folds', 'Odds', 'Sort'].map((f) => (
                <button
                  key={f}
                  onClick={() => showToast(`Filter by ${f}`)}
                  className="bg-[#1b2532] text-neutral-200 py-1.5 px-2 rounded flex items-center justify-center space-x-1 border border-[#273648] hover:bg-[#233041]"
                >
                  <span>{f}</span>
                  <ChevronDown className="w-3 h-3 text-neutral-400" />
                </button>
              ))}
            </div>

            {/* Popular Codes Cards */}
            <div className="p-2 space-y-3">
              {popularCodes.map((item) => (
                <div
                  key={item.code}
                  className="bg-[#1b2532] border border-[#273648] rounded-md overflow-hidden shadow"
                >
                  {/* Card Header: Code + Comments + Folds + Odds */}
                  <div className="p-2.5 flex items-center justify-between border-b border-[#243243] bg-[#17202b]">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-black text-sm text-[#00df59]">
                        {item.code}
                      </span>
                      {item.comments > 0 && (
                        <div className="flex items-center space-x-0.5 text-[#00df59] text-[11px] font-bold">
                          <MessageSquare className="w-3 h-3" />
                          <span>{item.comments}</span>
                        </div>
                      )}
                    </div>

                    <div className="text-[11px] text-neutral-300">
                      <span>Folds: </span>
                      <strong className="font-black text-white mr-2.5">{item.folds}</strong>
                      <span>Odds: </span>
                      <strong className="font-black text-white">{item.odds.toLocaleString()}</strong>
                    </div>
                  </div>

                  {/* Green Shield Promo Banner */}
                  <div className="bg-[#14261c] px-3 py-1.5 flex items-center space-x-1.5 text-[11px] text-emerald-200 border-b border-emerald-900/30">
                    <Shield className="w-3.5 h-3.5 text-[#00df59] shrink-0" />
                    <span className="truncate">{item.shieldText}</span>
                  </div>

                  {/* Selections Preview */}
                  <div className="divide-y divide-[#243243] px-2.5 py-1">
                    {item.selections.map((s, idx) => (
                      <div key={idx} className="py-2 flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2 flex-1 min-w-0">
                          <span className="text-base shrink-0">{s.flag}</span>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-white text-[11px] truncate">
                              {s.marketText}
                            </div>
                            <div className="text-[10px] text-neutral-400 truncate">
                              {s.match}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-2 text-[10px] text-neutral-400 shrink-0 ml-2">
                          <span>{s.time}</span>
                          <BarChart2 className="w-3.5 h-3.5 text-neutral-500" />
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Card Bottom Bar: Share & Add to Betslip Button */}
                  <div className="p-2.5 bg-[#17202b] border-t border-[#243243] flex items-center justify-between">
                    <button
                      onClick={() => handleShare(item.code)}
                      className="flex items-center space-x-1 text-xs text-[#00df59] hover:text-emerald-300 font-bold px-2 py-1"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>

                    <button
                      onClick={() => handleLoadCode(item.code)}
                      className="bg-[#00a826] hover:bg-[#009221] active:scale-95 text-white text-xs font-black px-4 py-2 rounded flex items-center space-x-1.5 shadow transition-transform"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Add to Betslip</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback for BB / Follow tabs */}
        {(activeSubTab === 'bb' || activeSubTab === 'follow') && (
          <div className="p-8 text-center text-neutral-400 text-xs">
            <p className="font-bold text-white text-sm mb-1">
              {activeSubTab === 'bb' ? 'BetBuilder Football Codes' : 'Follow Top Tipsters'}
            </p>
            <p className="text-neutral-400 mb-4">
              Explore custom combinations and verified top winning slips.
            </p>
            <button
              onClick={() => setActiveSubTab('popular')}
              className="bg-[#00a826] text-white px-4 py-2 rounded text-xs font-bold shadow"
            >
              Browse Popular Codes
            </button>
          </div>
        )}
      </div>

      {/* Floating Betslip Ticket Shortcut */}
      <div className="absolute bottom-4 right-4 z-20">
        <button
          onClick={() => {
            onClose();
            setIsBetslipOpen(true);
          }}
          className="relative w-12 h-12 rounded-full bg-[#00a826] text-white flex items-center justify-center shadow-2xl border-2 border-[#121922] active:scale-95 transition-transform"
          title="Open Betslip"
        >
          <Ticket className="w-6 h-6 stroke-[2.2]" />
          <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow border border-neutral-300">
            {betslip.length}
          </span>
        </button>
      </div>
    </div>
  );
};
