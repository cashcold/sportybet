import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  MessageSquare,
  Menu,
  X,
  Volume2,
  VolumeX,
  Music,
  Fan,
  Star,
  Clock,
  Banknote,
  HelpCircle,
  FileText,
  ShieldCheck,
  User,
  Plus,
  Minus,
  Sparkles,
  Send,
  CheckCircle2,
  ChevronDown
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useBetting } from '../context/BettingContext';

interface BetRow {
  id: string;
  avatar: string;
  maskedUser: string;
  betAmount: number;
  cashoutMultiplier?: number;
  winAmount?: number;
  targetCashout: number;
}

interface ChatMessage {
  id: string;
  user: string;
  avatar: string;
  text: string;
  time: string;
}

export const AviatorView: React.FC = () => {
  const { user, deposit, showToast, setActiveTab, setIsDepositModalOpen } = useBetting();

  // Game Engine State
  const [gameState, setGameState] = useState<'waiting' | 'flying' | 'crashed'>('waiting');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [crashPoint, setCrashPoint] = useState<number>(2.45);
  const [countdown, setCountdown] = useState<number>(5); // 5s waiting intermission
  const [multiplierHistory, setMultiplierHistory] = useState<number[]>([
    2.30, 1.00, 1.39, 1.00, 1.87, 16.48, 1.61, 1.23, 1.73, 22.96, 3.42, 1.05, 5.12
  ]);

  // Visual & Sound Settings
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(false);
  const [animationEnabled, setAnimationEnabled] = useState(true);

  // Modals & Drawers
  const [menuOpen, setMenuOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [historyModalOpen, setHistoryModalOpen] = useState(false);
  const [howToPlayOpen, setHowToPlayOpen] = useState(false);
  const [provablyFairOpen, setProvablyFairOpen] = useState(false);
  const [myHistoryOpen, setMyHistoryOpen] = useState(false);

  // Chat system
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: '1', user: 'Kwame_88', avatar: '🐱', text: 'Good luck everyone! 🚀', time: '01:47' },
    { id: '2', user: 'Yaw_Accra', avatar: '🦅', text: 'Cashed out 3.5x just now!', time: '01:48' },
    { id: '3', user: 'Nana_B', avatar: '🦁', text: 'Waiting for a 10x+ round 🔥', time: '01:48' },
    { id: '4', user: 'Kofi_Dev', avatar: '🎯', text: 'Smooth flight today', time: '01:49' }
  ]);

  // Dual Betting Panels State
  // Panel 1
  const [panel1Mode, setPanel1Mode] = useState<'Bet' | 'Auto'>('Bet');
  const [panel1Stake, setPanel1Stake] = useState<number>(1.0);
  const [panel1AutoCashout, setPanel1AutoCashout] = useState<number>(2.0);
  const [panel1AutoCashoutEnabled, setPanel1AutoCashoutEnabled] = useState<boolean>(false);
  const [panel1BetState, setPanel1BetState] = useState<'idle' | 'queued' | 'active' | 'cashed_out'>('idle');
  const [panel1CashedAmount, setPanel1CashedAmount] = useState<number>(0);
  const [panel1CashedMultiplier, setPanel1CashedMultiplier] = useState<number>(0);

  // Panel 2 (collapsible)
  const [panel2Visible, setPanel2Visible] = useState<boolean>(true);
  const [panel2Mode, setPanel2Mode] = useState<'Bet' | 'Auto'>('Bet');
  const [panel2Stake, setPanel2Stake] = useState<number>(1.0);
  const [panel2AutoCashout, setPanel2AutoCashout] = useState<number>(1.5);
  const [panel2AutoCashoutEnabled, setPanel2AutoCashoutEnabled] = useState<boolean>(false);
  const [panel2BetState, setPanel2BetState] = useState<'idle' | 'queued' | 'active' | 'cashed_out'>('idle');
  const [panel2CashedAmount, setPanel2CashedAmount] = useState<number>(0);
  const [panel2CashedMultiplier, setPanel2CashedMultiplier] = useState<number>(0);

  // Bottom live multiplayer bets table
  const [bottomTab, setBottomTab] = useState<'All Bets' | 'Previous' | 'Top'>('All Bets');
  const [liveBets, setLiveBets] = useState<BetRow[]>([]);
  const [totalRoundBetsCount, setTotalRoundBetsCount] = useState<number>(1970);
  const [totalRoundWinAmount, setTotalRoundWinAmount] = useState<number>(41023.58);

  // User's own bet history in Aviator
  const [userBetHistory, setUserBetHistory] = useState<{
    id: string;
    stake: number;
    multiplier: number;
    won: boolean;
    payout: number;
    time: string;
  }[]>([
    { id: 'av-1', stake: 2.0, multiplier: 2.15, won: true, payout: 4.30, time: '01:45' },
    { id: 'av-2', stake: 5.0, multiplier: 1.10, won: false, payout: 0, time: '01:42' },
    { id: 'av-3', stake: 1.0, multiplier: 5.40, won: true, payout: 5.40, time: '01:40' }
  ]);

  // Audio synthesis ref
  const audioCtxRef = useRef<AudioContext | null>(null);
  const engineOsc1Ref = useRef<OscillatorNode | null>(null);
  const engineOsc2Ref = useRef<OscillatorNode | null>(null);
  const engineGainRef = useRef<GainNode | null>(null);

  // Sound synthesizer functions
  const startEngineSound = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Stop existing if running
      stopEngineSound();

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(85, ctx.currentTime);

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(170, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(260, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + 0.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start();
      osc2.start();

      engineOsc1Ref.current = osc1;
      engineOsc2Ref.current = osc2;
      engineGainRef.current = gain;
    } catch {
      // AudioContext not available in current environment
    }
  };

  const updateEnginePitch = (currentMult: number) => {
    if (!soundEnabled || !audioCtxRef.current || !engineOsc1Ref.current) return;
    try {
      const ctx = audioCtxRef.current;
      const targetFreq1 = Math.min(85 + (currentMult - 1.0) * 18, 220);
      const targetFreq2 = targetFreq1 * 2;
      engineOsc1Ref.current.frequency.setTargetAtTime(targetFreq1, ctx.currentTime, 0.1);
      if (engineOsc2Ref.current) {
        engineOsc2Ref.current.frequency.setTargetAtTime(targetFreq2, ctx.currentTime, 0.1);
      }
    } catch {
      // Ignore
    }
  };

  const stopEngineSound = () => {
    try {
      if (engineGainRef.current && audioCtxRef.current) {
        const ctx = audioCtxRef.current;
        engineGainRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        setTimeout(() => {
          try {
            engineOsc1Ref.current?.stop();
            engineOsc2Ref.current?.stop();
            engineOsc1Ref.current?.disconnect();
            engineOsc2Ref.current?.disconnect();
          } catch {
            // Ignore
          }
          engineOsc1Ref.current = null;
          engineOsc2Ref.current = null;
          engineGainRef.current = null;
        }, 150);
      }
    } catch {
      // Ignore
    }
  };

  const playSound = (type: 'cashout' | 'crash' | 'click') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      if (type === 'cashout') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.18); // D6
        gain.gain.setValueAtTime(0.22, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === 'crash') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.45);
        gain.gain.setValueAtTime(0.28, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.5);
      }
    } catch {
      // AudioContext fallback
    }
  };

  // Seed live bets for each round matching video
  const generateLiveBets = (): BetRow[] => {
    const avatars = [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=60&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=60&auto=format&fit=crop&q=80'
    ];
    // Exact players and stakes from the Aviator video
    const playersData = [
      { name: '0***3', stake: 785.87, target: 1.97 },
      { name: 'e***2', stake: 600.00, target: 3.06 },
      { name: 'e***2', stake: 600.00, target: 3.14 },
      { name: 'f***m', stake: 300.00, target: 6.80 },
      { name: 'l***1', stake: 300.00, target: 7.20 },
      { name: 'a***a', stake: 284.46, target: 8.50 },
      { name: 'c***1', stake: 267.44, target: 3.19 },
      { name: 'b***8', stake: 261.52, target: 5.30 },
      { name: 'd***8', stake: 261.52, target: 9.10 },
      { name: 'k***3', stake: 250.00, target: 2.45 },
      { name: 'w***g', stake: 200.00, target: 1.65 },
      { name: 'm***2', stake: 180.00, target: 3.80 },
      { name: 'p***4', stake: 150.00, target: 4.10 },
      { name: 's***7', stake: 100.00, target: 2.10 },
      { name: 'z***9', stake: 50.00, target: 1.35 },
      { name: 'b***m', stake: 450.00, target: 2.75 },
      { name: '7***e', stake: 320.00, target: 3.40 }
    ];

    return playersData.map((p, i) => ({
      id: `bet-${i}-${Date.now()}`,
      avatar: avatars[i % avatars.length],
      maskedUser: p.name,
      betAmount: p.stake,
      targetCashout: p.target
    }));
  };

  // Main Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (gameState === 'waiting') {
      stopEngineSound();
      // Countdown intermission (Screenshot 4 & video 00:05-00:10)
      // Accumulate round bets progressively
      setTotalRoundWinAmount(0);
      interval = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            // Start flight
            startFlight();
            return 5;
          }
          // Increment total round bets during countdown
          setTotalRoundBetsCount(b => Math.min(1529, b + Math.floor(250 + Math.random() * 150)));
          return prev - 1;
        });
      }, 1000);
    } else if (gameState === 'flying') {
      // Start audio engine
      startEngineSound();

      // High-frequency flight update loop
      const startTime = Date.now();
      const currentCrash = crashPoint;

      interval = setInterval(() => {
        const elapsed = (Date.now() - startTime) / 1000;
        // Exponential growth formula mimicking Spribe Aviator: 1 * e^(0.06 * t^1.2)
        const nextVal = parseFloat((1.0 + Math.pow(elapsed * 0.72, 1.42)).toFixed(2));

        // Adjust engine drone pitch with climbing multiplier
        updateEnginePitch(nextVal);

        if (nextVal >= currentCrash) {
          // CRASH / FLEW AWAY!
          setMultiplier(currentCrash);
          handleCrash(currentCrash);
        } else {
          setMultiplier(nextVal);

          // Check Panel 1 auto cashout
          if (
            panel1BetState === 'active' &&
            panel1AutoCashoutEnabled &&
            nextVal >= panel1AutoCashout
          ) {
            handleCashOut(1, nextVal);
          }

          // Check Panel 2 auto cashout
          if (
            panel2BetState === 'active' &&
            panel2AutoCashoutEnabled &&
            nextVal >= panel2AutoCashout
          ) {
            handleCashOut(2, nextVal);
          }

          // Update other simulated multiplayer bettors cashing out
          setLiveBets(prev => {
            let totalWon = 0;
            let activeCount = 0;
            const updated = prev.map(bet => {
              if (!bet.cashoutMultiplier && nextVal >= bet.targetCashout && bet.targetCashout <= currentCrash) {
                const win = parseFloat((bet.betAmount * bet.targetCashout).toFixed(2));
                totalWon += win;
                return {
                  ...bet,
                  cashoutMultiplier: bet.targetCashout,
                  winAmount: win
                };
              }
              if (bet.winAmount) {
                totalWon += bet.winAmount;
              } else {
                activeCount++;
              }
              return bet;
            });
            // Update total won amount in real time
            setTotalRoundWinAmount(parseFloat(totalWon.toFixed(2)));
            // Dynamic active bettors counter decreasing as players cash out (video 00:11-00:30)
            const remainingRatio = Math.max(0.35, 1 - (nextVal - 1.0) / (currentCrash + 2.0));
            setTotalRoundBetsCount(Math.floor(1529 * remainingRatio));
            return updated;
          });
        }
      }, 50);
    } else if (gameState === 'crashed') {
      stopEngineSound();
    }

    return () => {
      clearInterval(interval);
      stopEngineSound();
    };
  }, [gameState, crashPoint, panel1BetState, panel1AutoCashoutEnabled, panel1AutoCashout, panel2BetState, panel2AutoCashoutEnabled, panel2AutoCashout]);

  const startFlight = () => {
    // Generate crash point matching realistic Aviator distribution
    const rand = Math.random();
    let point = 1.0;
    if (rand < 0.08) {
      point = 1.01 + Math.random() * 0.12; // Instant crash
    } else if (rand < 0.65) {
      point = 1.15 + Math.random() * 2.20; // 1.15x - 3.35x
    } else if (rand < 0.90) {
      point = 3.35 + Math.random() * 5.65; // 3.35x - 9.00x
    } else {
      point = 9.00 + Math.random() * 25.00; // 9.00x - 34.00x
    }
    const finalCrash = parseFloat(point.toFixed(2));

    setCrashPoint(finalCrash);
    setMultiplier(1.0);
    setGameState('flying');
    setLiveBets(generateLiveBets());
    setTotalRoundBetsCount(1529);
    setTotalRoundWinAmount(0);

    // Transition queued bets to active bets
    if (panel1BetState === 'queued') {
      setPanel1BetState('active');
    }
    if (panel2BetState === 'queued') {
      setPanel2BetState('active');
    }
  };

  const handleCrash = (finalPoint: number) => {
    setGameState('crashed');
    stopEngineSound();
    playSound('crash');

    // Add to history strip
    setMultiplierHistory(prev => [finalPoint, ...prev.slice(0, 24)]);

    // Check if user had active bets that crashed
    if (panel1BetState === 'active') {
      setPanel1BetState('idle');
      setUserBetHistory(prev => [
        {
          id: `av-${Date.now()}-1`,
          stake: panel1Stake,
          multiplier: finalPoint,
          won: false,
          payout: 0,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }

    if (panel2BetState === 'active') {
      setPanel2BetState('idle');
      setUserBetHistory(prev => [
        {
          id: `av-${Date.now()}-2`,
          stake: panel2Stake,
          multiplier: finalPoint,
          won: false,
          payout: 0,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        ...prev
      ]);
    }

    // After 3 seconds of crash screen, go to waiting intermission
    setTimeout(() => {
      setGameState('waiting');
      setCountdown(5);
      setTotalRoundBetsCount(0);
      // Reset any cashed out states for next round
      setPanel1BetState(prev => (prev === 'cashed_out' ? 'idle' : prev));
      setPanel2BetState(prev => (prev === 'cashed_out' ? 'idle' : prev));
    }, 3000);
  };

  const handlePlaceBet = (panel: 1 | 2) => {
    const stake = panel === 1 ? panel1Stake : panel2Stake;

    if (user.balance < stake) {
      showToast('Insufficient balance. Please deposit to bet.');
      setIsDepositModalOpen(true);
      return;
    }

    // Deduct stake from wallet balance
    deposit(-stake, `Aviator Bet Panel ${panel}`);

    if (panel === 1) {
      if (gameState === 'waiting') {
        setPanel1BetState('queued');
      } else {
        setPanel1BetState('queued');
        showToast('Bet accepted for NEXT round');
      }
    } else {
      if (gameState === 'waiting') {
        setPanel2BetState('queued');
      } else {
        setPanel2BetState('queued');
        showToast('Bet accepted for NEXT round');
      }
    }
  };

  const handleCancelBet = (panel: 1 | 2) => {
    const stake = panel === 1 ? panel1Stake : panel2Stake;
    deposit(stake, `Refund Aviator Bet Panel ${panel}`);
    if (panel === 1) setPanel1BetState('idle');
    else setPanel2BetState('idle');
    showToast('Bet cancelled and refunded');
  };

  const handleCashOut = (panel: 1 | 2, currentMultiplier: number) => {
    const stake = panel === 1 ? panel1Stake : panel2Stake;
    const winAmount = parseFloat((stake * currentMultiplier).toFixed(2));

    // Credit winnings to wallet
    deposit(winAmount, `Aviator Win at ${currentMultiplier.toFixed(2)}x`);
    playSound('cashout');

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 }
    });

    if (panel === 1) {
      setPanel1BetState('cashed_out');
      setPanel1CashedAmount(winAmount);
      setPanel1CashedMultiplier(currentMultiplier);
    } else {
      setPanel2BetState('cashed_out');
      setPanel2CashedAmount(winAmount);
      setPanel2CashedMultiplier(currentMultiplier);
    }

    setUserBetHistory(prev => [
      {
        id: `av-${Date.now()}-${panel}`,
        stake,
        multiplier: currentMultiplier,
        won: true,
        payout: winAmount,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      ...prev
    ]);

    showToast(`🎉 Cashed out at ${currentMultiplier.toFixed(2)}x! Won GHS ${winAmount.toFixed(2)}`);
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const newMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      user: user.isLoggedIn ? (user.phone.slice(-4) ? `User_${user.phone.slice(-4)}` : 'You') : 'Guest',
      avatar: '🐱',
      text: chatInput.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setChatMessages(prev => [...prev, newMsg]);
    setChatInput('');
  };

  // Helper color for multiplier pills
  const getMultiplierColor = (mult: number) => {
    if (mult < 2.0) {
      return 'text-[#34b4ff] hover:bg-[#34b4ff]/20';
    } else if (mult < 10.0) {
      return 'text-[#9042f6] hover:bg-[#9042f6]/20';
    } else {
      return 'text-[#e024c3] font-black hover:bg-[#e024c3]/20';
    }
  };

  // Canvas / SVG curve calculation
  // Growth progresses from 0 to 1 as multiplier climbs from 1.00x to ~2.5x, then smoothly caps at cruising
  const climbRatio = Math.min((multiplier - 1.0) / 1.5, 1.0); // 0 at 1.0x, 1 at 2.5x+
  // Base plane coordinate (canvas is 350x230)
  const basePlaneX = 35 + climbRatio * 225; // 35 to 260
  const basePlaneY = 195 - Math.pow(climbRatio, 0.75) * 130; // 195 down to 65

  // Aerodynamic oscillations during flight (subtle pitch & altitude bobbing)
  const bobY = gameState === 'flying' ? Math.sin(Date.now() / 250) * 3.5 : 0;
  const bobRot = gameState === 'flying' ? Math.sin(Date.now() / 320) * 2.5 : 0;
  const planeX = basePlaneX;
  const planeY = basePlaneY + bobY;
  const planeRotation = -14 + (1 - climbRatio) * -12 + bobRot;

  return (
    <div className="bg-[#0f141c] text-white min-h-screen flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* ========================================================= */}
      {/* 1. TOP SIMULATED BROWSER/HEADER BAR (Screenshot 1: < Aviator) */}
      {/* ========================================================= */}
      <div className="bg-[#12171f] px-3 py-2 flex items-center justify-between border-b border-[#1b232e]">
        <button
          onClick={() => setActiveTab('sports')}
          className="p-1.5 text-neutral-300 hover:text-white rounded-full transition-colors flex items-center"
          title="Back to Sports"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-white tracking-wide">Aviator</h1>

        {/* Balance or spacer */}
        <div className="w-8" />
      </div>

      {/* ========================================================= */}
      {/* 2. IN-GAME AVIATOR HEADER (Screenshot 1: Aviator logo, 0.00 GHS, Chat, Hamburger) */}
      {/* ========================================================= */}
      <div className="bg-[#141a22] px-3 py-2 flex items-center justify-between border-b border-[#1c2430]">
        {/* Left: Aviator Logo */}
        <div className="flex items-center space-x-2">
          {/* Purple square with rounded corners and white circle/spribe logo */}
          <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-[#8a3ffc] to-[#6929c4] flex items-center justify-center shadow-md border border-white/20">
            <div className="w-3.5 h-3.5 rounded-full bg-white/95 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6929c4]" />
            </div>
          </div>
          {/* Red italic Aviator script logo */}
          <span className="text-xl font-black italic tracking-tight text-[#e51b24] font-serif select-none drop-shadow">
            Aviator
          </span>
        </div>

        {/* Right: Balance, Chat, Hamburger Menu */}
        <div className="flex items-center space-x-3">
          {/* Balance in bright white bold */}
          <div className="text-right">
            <span className="text-sm font-bold text-white">
              {user.balance.toFixed(2)} GHS
            </span>
          </div>

          {/* Chat bubble icon */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-1 text-white hover:text-neutral-300 transition-colors relative"
            title="Live Chat"
          >
            <MessageSquare className="w-5 h-5 fill-white stroke-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00df59] rounded-full" />
          </button>

          {/* Hamburger Menu (Screenshot 2) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1 text-white hover:text-neutral-300 transition-colors"
            title="Game Menu"
          >
            <Menu className="w-6 h-6 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MULTIPLIER HISTORY RIBBON (Screenshot 1: colored pills with ...) */}
      {/* ========================================================= */}
      <div className="bg-[#12171f] px-2 py-1.5 border-b border-[#1c2430] flex items-center justify-between overflow-x-auto no-scrollbar space-x-2">
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
          {multiplierHistory.slice(0, 14).map((mult, idx) => (
            <span
              key={idx}
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold shrink-0 transition-transform active:scale-95 cursor-pointer bg-[#19222c] border border-white/5 ${getMultiplierColor(
                mult
              )}`}
              onClick={() => showToast(`Round Multiplier: ${mult.toFixed(2)}x`)}
            >
              {mult.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* History Modal Trigger Button (...) */}
        <button
          onClick={() => setHistoryModalOpen(true)}
          className="p-1 px-1.5 bg-[#19222c] hover:bg-[#222e3c] text-neutral-400 hover:text-white rounded-full text-xs font-bold shrink-0 border border-white/10"
          title="Round History"
        >
          •••
        </button>
      </div>

      {/* ========================================================= */}
      {/* 4. THE FLIGHT SCREEN & CANVAS WITH ROTATING BACKGROUND */}
      {/* USER REQUIREMENT: "when the plan is frying, let the background be retation" */}
      {/* ========================================================= */}
      <div className="p-3">
        <div className="relative w-full h-[230px] bg-black rounded-2xl overflow-hidden border border-[#232b38] shadow-2xl flex items-center justify-center">
          
          {/* Floating 'More Games ↑' pill (from video frame 00:26) */}
          <button
            onClick={() => setActiveTab('sports')}
            className="absolute top-2.5 left-2.5 z-30 bg-[#6929c4]/90 hover:bg-[#7e35e6] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center space-x-1 backdrop-blur-sm shadow border border-white/20 transition-all active:scale-95"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-fuchsia-300" />
            <span>More Games</span>
            <span>↑</span>
          </button>

          {/* ===================================================== */}
          {/* A. ROTATING SUNBURST RAYS BACKGROUND (Explicit user request) */}
          {/* "when the plan is frying, let the background be retation" */}
          {/* ===================================================== */}
          <div
            className={`absolute pointer-events-none transition-opacity duration-700 ${
              animationEnabled ? 'opacity-100' : 'opacity-40'
            } ${animationEnabled && gameState === 'flying' ? 'animate-aviator-rotation' : ''}`}
            style={{
              width: '340%',
              height: '340%',
              top: '-120%',
              left: '-120%',
              backgroundImage: `repeating-conic-gradient(
                from 0deg at 50% 50%,
                rgba(20, 26, 36, 0.98) 0deg 7.5deg,
                rgba(7, 9, 14, 0.99) 7.5deg 15deg
              )`,
              transformOrigin: '50% 50%'
            }}
          />

          {/* B. DYNAMIC RADIAL SPOTLIGHT GLOW (Red at high mult, Cyan at low mult) */}
          <div
            className={`absolute inset-0 pointer-events-none transition-colors duration-1000 ${
              gameState === 'flying'
                ? multiplier > 5.0
                  ? 'bg-radial from-[#e51b24]/35 via-[#80082b]/15 to-transparent'
                  : 'bg-radial from-[#0d3a58]/40 via-[#0a1926]/20 to-transparent'
                : 'bg-radial from-[#121a24]/50 to-transparent'
            }`}
          />

          {/* Subtle vignette border inside canvas */}
          <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none" />

          {/* ===================================================== */}
          {/* C. INTERMISSION SCREEN (Screenshot 4 & Video: UFC | Aviator PARTNERS + SPRIBE) */}
          {/* ===================================================== */}
          {gameState === 'waiting' && (
            <>
              {/* Parked plane on bottom-left runway (video frames 00:00 & 00:05-00:10) */}
              <div
                className="absolute bottom-3 left-3 z-20 pointer-events-none drop-shadow-[0_4px_10px_rgba(229,27,36,0.5)]"
                style={{ transform: 'rotate(0deg)' }}
              >
                <div className="relative w-16 h-10">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    {/* Fuselage */}
                    <path
                      d="M 15 32 Q 50 18, 85 28 Q 78 38, 20 38 Z"
                      fill="#e51b24"
                      stroke="#ff4d4f"
                      strokeWidth="1.5"
                    />
                    {/* Cockpit / Windshield */}
                    <path d="M 45 23 Q 55 20, 62 27 Z" fill="#ffffff" opacity="0.9" />
                    {/* Wing */}
                    <path
                      d="M 38 12 L 68 12 Q 70 16, 65 17 L 35 17 Z"
                      fill="#e51b24"
                      stroke="#ff4d4f"
                      strokeWidth="1"
                    />
                    {/* Wing Struts */}
                    <line x1="45" y1="17" x2="48" y2="28" stroke="#ffffff" strokeWidth="1.5" />
                    <line x1="60" y1="17" x2="62" y2="28" stroke="#ffffff" strokeWidth="1.5" />
                    {/* Tail fin */}
                    <path d="M 15 32 L 6 15 L 18 15 L 24 32 Z" fill="#e51b24" stroke="#ff4d4f" strokeWidth="1" />
                    {/* Fuselage X decal */}
                    <text x="32" y="34" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      X
                    </text>
                    {/* Static propeller */}
                    <circle cx="86" cy="28" r="3" fill="#ffffff" />
                    <ellipse cx="86" cy="28" rx="2" ry="12" fill="#ffffff" opacity="0.8" />
                  </svg>
                </div>
              </div>

              {/* UFC Aviator Center Banner */}
              <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 w-full animate-in fade-in duration-300">
                {/* UFC | Aviator OFFICIAL PARTNERS */}
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-black italic tracking-tighter text-[#de1a22]">
                    UFC
                  </span>
                  <span className="text-neutral-500 font-light">|</span>
                  <span className="text-sm font-black italic text-[#de1a22]">
                    Aviator
                  </span>
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/90 mt-0.5">
                  Official Partners
                </div>

                {/* Red horizontal accent bar */}
                <div className="w-40 h-[2px] bg-gradient-to-r from-transparent via-[#de1a22] to-transparent my-2" />

                {/* SPRIBE Official Game badge */}
                <div className="bg-[#121e14]/90 border border-[#1e4620] rounded-xl px-4 py-2 mt-1 shadow-lg backdrop-blur-sm flex flex-col items-center">
                  <div className="flex items-center space-x-1.5 text-white font-black text-xs tracking-wider">
                    <div className="w-3.5 h-3.5 rounded-full border border-[#00df59] flex items-center justify-center">
                      <span className="text-[8px] text-[#00df59]">S</span>
                    </div>
                    <span>SPRIBE</span>
                  </div>
                  <div className="mt-1 flex items-center space-x-1 bg-[#00a826]/20 text-[#00df59] border border-[#00a826]/40 px-2 py-0.5 rounded-full text-[9px] font-bold">
                    <span>Official Game</span>
                    <CheckCircle2 className="w-2.5 h-2.5" />
                  </div>
                  <span className="text-[9px] text-neutral-400 mt-0.5">Since 2019</span>
                </div>

                {/* Waiting for Next Round Progress Bar */}
                <div className="w-56 mt-4">
                  <div className="flex items-center justify-between text-[10px] font-bold text-neutral-300 mb-1">
                    <span>WAITING FOR NEXT ROUND</span>
                    <span>{countdown}s</span>
                  </div>
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#00df59] transition-all duration-1000 ease-linear rounded-full shadow-[0_0_8px_#00df59]"
                      style={{ width: `${((5 - countdown) / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ===================================================== */}
          {/* D. ACTIVE FLIGHT STATE: SVG Curve, Red Plane, Center Multiplier */}
          {/* ===================================================== */}
          {gameState === 'flying' && (
            <>
              {/* SVG Flight Curve & Trailing Crimson Area */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 350 230">
                <defs>
                  {/* Crimson gradient fill */}
                  <linearGradient id="aviatorCrimson" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#e51b24" stopOpacity="0.55" />
                    <stop offset="70%" stopColor="#99001b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Filled Area Under Curve */}
                <path
                  d={`M 0 215 Q ${planeX * 0.52} 215, ${planeX - 10} ${planeY + 12} L ${planeX - 10} 215 Z`}
                  fill="url(#aviatorCrimson)"
                />

                {/* Red Flight Line Curve */}
                <path
                  d={`M 0 215 Q ${planeX * 0.52} 215, ${planeX - 10} ${planeY + 12}`}
                  fill="none"
                  stroke="#e51b24"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_8px_#e51b24]"
                />
              </svg>

              {/* The Red Propeller Plane (Flying state) */}
              <div
                className="absolute z-20 transition-transform duration-75 pointer-events-none"
                style={{
                  left: `${planeX - 35}px`,
                  top: `${planeY - 25}px`,
                  transform: `rotate(${planeRotation}deg)`
                }}
              >
                <div className="relative w-16 h-10">
                  {/* SVG Red Aviator Aircraft */}
                  <svg viewBox="0 0 100 60" className="w-full h-full drop-shadow-[0_4px_10px_rgba(229,27,36,0.6)]">
                    {/* Fuselage */}
                    <path
                      d="M 15 32 Q 50 18, 85 28 Q 78 38, 20 38 Z"
                      fill="#e51b24"
                      stroke="#ff4d4f"
                      strokeWidth="1.5"
                    />
                    {/* Cockpit / Windshield */}
                    <path d="M 45 23 Q 55 20, 62 27 Z" fill="#ffffff" opacity="0.9" />
                    {/* Top wing */}
                    <path
                      d="M 38 12 L 68 12 Q 70 16, 65 17 L 35 17 Z"
                      fill="#e51b24"
                      stroke="#ff4d4f"
                      strokeWidth="1"
                    />
                    {/* Wing Struts */}
                    <line x1="45" y1="17" x2="48" y2="28" stroke="#ffffff" strokeWidth="1.5" />
                    <line x1="60" y1="17" x2="62" y2="28" stroke="#ffffff" strokeWidth="1.5" />
                    {/* Tail fin & rudder */}
                    <path d="M 15 32 L 6 15 L 18 15 L 24 32 Z" fill="#e51b24" stroke="#ff4d4f" strokeWidth="1" />
                    {/* Fuselage "X" decal (Iconic Aviator design) */}
                    <text x="32" y="34" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                      X
                    </text>
                    {/* Propeller Hub & Spinning Blades with blur disc */}
                    <circle cx="86" cy="28" r="3" fill="#ffffff" />
                    <circle cx="86" cy="28" r="14" fill="#ffffff" opacity="0.15" />
                    <ellipse
                      cx="86"
                      cy="28"
                      rx="2.5"
                      ry="15"
                      fill="#ffffff"
                      opacity="0.85"
                      className="animate-spin"
                      style={{ transformOrigin: '86px 28px' }}
                    />
                  </svg>
                </div>
              </div>

              {/* Center Multiplier Typography (Flying: Crisp White) */}
              <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none">
                <div className="text-5xl sm:text-6xl font-black tracking-tight font-sans select-none text-white drop-shadow-2xl">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            </>
          )}

          {/* ===================================================== */}
          {/* E. CRASHED / FLEW AWAY SCREEN (Exact video match 00:01-00:04) */}
          {/* White 'FLEW AWAY!' with crimson red final multiplier below */}
          {/* ===================================================== */}
          {gameState === 'crashed' && (
            <>
              {/* Plane zooms off screen */}
              <div
                className="absolute z-20 pointer-events-none transition-all duration-700 ease-out"
                style={{
                  left: `${planeX}px`,
                  top: `${planeY}px`,
                  transform: 'translate(140px, -90px) rotate(-18deg)',
                  opacity: 0
                }}
              >
                <div className="relative w-16 h-10">
                  <svg viewBox="0 0 100 60" className="w-full h-full">
                    <path d="M 15 32 Q 50 18, 85 28 Q 78 38, 20 38 Z" fill="#e51b24" />
                  </svg>
                </div>
              </div>

              {/* Centered FLEW AWAY! (White) and final multiplier (Red) */}
              <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
                <span className="text-sm sm:text-base font-black uppercase tracking-widest text-white mb-1 drop-shadow">
                  FLEW AWAY!
                </span>
                <div className="text-5xl sm:text-6xl font-black tracking-tight font-sans select-none text-[#e51b24] drop-shadow-2xl">
                  {multiplier.toFixed(2)}x
                </div>
              </div>
            </>
          )}

          {/* F. Active Players Indicator in Round (Bottom-Right, Screenshot 1: 3 avatars + live count) */}
          <div className="absolute bottom-2.5 right-2.5 z-20 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 flex items-center space-x-1.5 shadow-lg">
            <div className="flex -space-x-1.5 items-center">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop&q=80"
                alt="p1"
                className="w-4 h-4 rounded-full border border-black object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&auto=format&fit=crop&q=80"
                alt="p2"
                className="w-4 h-4 rounded-full border border-black object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&auto=format&fit=crop&q=80"
                alt="p3"
                className="w-4 h-4 rounded-full border border-black object-cover"
              />
            </div>
            <span className="text-[11px] font-bold text-white tracking-tight">
              {totalRoundBetsCount}
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 5. DUAL BETTING PANELS (Screenshot 1, 3, 4, 5) */}
      {/* ========================================================= */}
      <div className="px-3 space-y-2.5">
        {/* ==================== PANEL 1 ==================== */}
        <div className="bg-[#18202a] rounded-2xl p-3 border border-[#243040] shadow-lg">
          {/* Bet / Auto Pill Switcher */}
          <div className="flex items-center justify-center mb-2.5">
            <div className="bg-[#10161f] p-0.5 rounded-full flex items-center border border-white/5 w-48">
              <button
                onClick={() => setPanel1Mode('Bet')}
                className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                  panel1Mode === 'Bet'
                    ? 'bg-[#253243] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Bet
              </button>
              <button
                onClick={() => setPanel1Mode('Auto')}
                className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                  panel1Mode === 'Auto'
                    ? 'bg-[#253243] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Auto
              </button>
            </div>
          </div>

          {/* Stepper + Presets + Big Action Button */}
          <div className="grid grid-cols-2 gap-2.5 items-stretch">
            {/* Left controls */}
            <div className="space-y-2">
              {/* Stepper: - 1.00 + */}
              <div className="bg-[#10161f] rounded-xl px-2 py-1.5 flex items-center justify-between border border-white/5">
                <button
                  onClick={() => setPanel1Stake(prev => Math.max(1.0, parseFloat((prev - 1).toFixed(2))))}
                  className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <div className="text-center font-black text-sm text-white">
                  {panel1Stake.toFixed(2)}
                </div>
                <button
                  onClick={() => setPanel1Stake(prev => parseFloat((prev + 1).toFixed(2)))}
                  className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* 2x2 Quick Stake Presets: 1, 5, 10, 50 */}
              <div className="grid grid-cols-2 gap-1.5">
                {[1, 5, 10, 50].map(val => (
                  <button
                    key={val}
                    onClick={() => setPanel1Stake(val)}
                    className={`py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                      panel1Stake === val
                        ? 'bg-[#29384b] text-white border border-white/20'
                        : 'bg-[#121922] text-neutral-400 hover:text-white hover:bg-[#1a2330]'
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>

              {/* Auto Cashout toggle if Auto mode */}
              {panel1Mode === 'Auto' && (
                <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-300">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={panel1AutoCashoutEnabled}
                      onChange={e => setPanel1AutoCashoutEnabled(e.target.checked)}
                      className="rounded bg-[#121922] border-neutral-700 text-[#00df59] focus:ring-0"
                    />
                    <span>Auto Cash Out</span>
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="1.01"
                    value={panel1AutoCashout}
                    onChange={e => setPanel1AutoCashout(parseFloat(e.target.value) || 2.0)}
                    disabled={!panel1AutoCashoutEnabled}
                    className="w-14 bg-[#10161f] border border-white/10 rounded px-1.5 py-0.5 text-right font-bold text-white text-[11px]"
                  />
                </div>
              )}
            </div>

            {/* Right: Big Action Button (Exact match to Screenshot 1, 3, 4, 5) */}
            <div className="flex flex-col">
              {panel1BetState === 'active' && gameState === 'flying' ? (
                /* Cash Out button in bright orange/yellow */
                <button
                  onClick={() => handleCashOut(1, multiplier)}
                  className="flex-1 bg-gradient-to-b from-[#ffb300] to-[#ff8c00] hover:from-[#ffc107] hover:to-[#ff9800] active:scale-[0.98] text-black rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all animate-pulse"
                >
                  <span className="text-xs font-black uppercase tracking-wider">Cash Out</span>
                  <span className="text-base font-black tracking-tight">
                    {(panel1Stake * multiplier).toFixed(2)} GHS
                  </span>
                </button>
              ) : panel1BetState === 'queued' ? (
                /* Waiting for round / Cancel */
                <button
                  onClick={() => handleCancelBet(1)}
                  className="flex-1 bg-[#d9383a] hover:bg-[#c22e30] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all"
                >
                  <span className="text-xs font-black uppercase tracking-wider">Waiting</span>
                  <span className="text-[11px] text-white/90 font-bold">
                    Cancel ({panel1Stake.toFixed(2)} GHS)
                  </span>
                </button>
              ) : panel1BetState === 'cashed_out' ? (
                /* Cashed out success */
                <div className="flex-1 bg-[#1a4025] border border-[#00df59]/40 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00df59]">
                    Cashed Out
                  </span>
                  <span className="text-sm font-black text-white">
                    +{panel1CashedAmount.toFixed(2)} GHS
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    at {panel1CashedMultiplier.toFixed(2)}x
                  </span>
                </div>
              ) : (
                /* Default Big Green Bet Button (Screenshot 1) */
                <button
                  onClick={() => handlePlaceBet(1)}
                  className="flex-1 bg-gradient-to-b from-[#22c55e] to-[#16a34a] hover:from-[#2ecc71] hover:to-[#1eb956] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg shadow-green-900/30 transition-all"
                >
                  <span className="text-base font-black tracking-wide">Bet</span>
                  <span className="text-xs font-bold text-white/90">
                    {panel1Stake.toFixed(2)} GHS
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* ==================== PANEL 2 (Collapsible) ==================== */}
        {panel2Visible ? (
          <div className="bg-[#18202a] rounded-2xl p-3 border border-[#243040] shadow-lg relative animate-in fade-in duration-150">
            {/* Top Bar with Bet/Auto Pill & Collapse [-] Button */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="w-6" /> {/* spacer */}
              <div className="bg-[#10161f] p-0.5 rounded-full flex items-center border border-white/5 w-48">
                <button
                  onClick={() => setPanel2Mode('Bet')}
                  className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                    panel2Mode === 'Bet'
                      ? 'bg-[#253243] text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setPanel2Mode('Auto')}
                  className={`flex-1 py-1 rounded-full text-xs font-bold transition-all ${
                    panel2Mode === 'Auto'
                      ? 'bg-[#253243] text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Auto
                </button>
              </div>

              {/* Minimize/Close [-] button (Screenshot 1 & 4) */}
              <button
                onClick={() => setPanel2Visible(false)}
                className="w-6 h-6 rounded-md bg-[#10161f] hover:bg-[#202a38] text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-white/5"
                title="Hide second bet panel"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Stepper + Presets + Big Action Button */}
            <div className="grid grid-cols-2 gap-2.5 items-stretch">
              {/* Left controls */}
              <div className="space-y-2">
                <div className="bg-[#10161f] rounded-xl px-2 py-1.5 flex items-center justify-between border border-white/5">
                  <button
                    onClick={() => setPanel2Stake(prev => Math.max(1.0, parseFloat((prev - 1).toFixed(2))))}
                    className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <div className="text-center font-black text-sm text-white">
                    {panel2Stake.toFixed(2)}
                  </div>
                  <button
                    onClick={() => setPanel2Stake(prev => parseFloat((prev + 1).toFixed(2)))}
                    className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[1, 5, 10, 50].map(val => (
                    <button
                      key={val}
                      onClick={() => setPanel2Stake(val)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all active:scale-95 ${
                        panel2Stake === val
                          ? 'bg-[#29384b] text-white border border-white/20'
                          : 'bg-[#121922] text-neutral-400 hover:text-white hover:bg-[#1a2330]'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>

                {panel2Mode === 'Auto' && (
                  <div className="pt-1 flex items-center justify-between text-[11px] text-neutral-300">
                    <label className="flex items-center space-x-1.5 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={panel2AutoCashoutEnabled}
                        onChange={e => setPanel2AutoCashoutEnabled(e.target.checked)}
                        className="rounded bg-[#121922] border-neutral-700 text-[#00df59] focus:ring-0"
                      />
                      <span>Auto Cash Out</span>
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="1.01"
                      value={panel2AutoCashout}
                      onChange={e => setPanel2AutoCashout(parseFloat(e.target.value) || 1.5)}
                      disabled={!panel2AutoCashoutEnabled}
                      className="w-14 bg-[#10161f] border border-white/10 rounded px-1.5 py-0.5 text-right font-bold text-white text-[11px]"
                    />
                  </div>
                )}
              </div>

              {/* Right Big Button */}
              <div className="flex flex-col">
                {panel2BetState === 'active' && gameState === 'flying' ? (
                  <button
                    onClick={() => handleCashOut(2, multiplier)}
                    className="flex-1 bg-gradient-to-b from-[#ffb300] to-[#ff8c00] hover:from-[#ffc107] hover:to-[#ff9800] active:scale-[0.98] text-black rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all animate-pulse"
                  >
                    <span className="text-xs font-black uppercase tracking-wider">Cash Out</span>
                    <span className="text-base font-black tracking-tight">
                      {(panel2Stake * multiplier).toFixed(2)} GHS
                    </span>
                  </button>
                ) : panel2BetState === 'queued' ? (
                  <button
                    onClick={() => handleCancelBet(2)}
                    className="flex-1 bg-[#d9383a] hover:bg-[#c22e30] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all"
                  >
                    <span className="text-xs font-black uppercase tracking-wider">Waiting</span>
                    <span className="text-[11px] text-white/90 font-bold">
                      Cancel ({panel2Stake.toFixed(2)} GHS)
                    </span>
                  </button>
                ) : panel2BetState === 'cashed_out' ? (
                  <div className="flex-1 bg-[#1a4025] border border-[#00df59]/40 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00df59]">
                      Cashed Out
                    </span>
                    <span className="text-sm font-black text-white">
                      +{panel2CashedAmount.toFixed(2)} GHS
                    </span>
                    <span className="text-[10px] text-neutral-400">
                      at {panel2CashedMultiplier.toFixed(2)}x
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlaceBet(2)}
                    className="flex-1 bg-gradient-to-b from-[#22c55e] to-[#16a34a] hover:from-[#2ecc71] hover:to-[#1eb956] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg shadow-green-900/30 transition-all"
                  >
                    <span className="text-base font-black tracking-wide">Bet</span>
                    <span className="text-xs font-bold text-white/90">
                      {panel2Stake.toFixed(2)} GHS
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Add Second Bet Panel Button */
          <button
            onClick={() => setPanel2Visible(true)}
            className="w-full py-2 bg-[#18202a] hover:bg-[#202b38] rounded-xl border border-dashed border-[#2d3a4e] text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center space-x-1.5 transition-colors"
          >
            <Plus className="w-4 h-4 text-[#00df59]" />
            <span>Add Second Bet</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 6. BOTTOM LIVE BETS CONSOLE (Screenshot 1, 3: All Bets, Previous, Top) */}
      {/* ========================================================= */}
      <div className="mt-4 px-3 pb-8">
        <div className="bg-[#18202a] rounded-2xl border border-[#243040] overflow-hidden shadow-xl">
          {/* Capsule Tab Switcher */}
          <div className="p-2 border-b border-[#212b38]">
            <div className="bg-[#10161f] p-0.5 rounded-full flex items-center border border-white/5">
              {(['All Bets', 'Previous', 'Top'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all ${
                    bottomTab === tab
                      ? 'bg-[#253243] text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Subheader: Avatars + 611/1931 Bets + 41,023.58 Total win GHS (Screenshot 1 & 3) */}
          <div className="px-4 py-2.5 bg-[#141a22] flex items-center justify-between border-b border-[#202936]">
            <div>
              <div className="flex items-center space-x-2">
                <div className="flex -space-x-1.5 items-center">
                  <img
                    src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&auto=format&fit=crop&q=80"
                    alt="u1"
                    className="w-4 h-4 rounded-full border border-black object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=40&auto=format&fit=crop&q=80"
                    alt="u2"
                    className="w-4 h-4 rounded-full border border-black object-cover"
                  />
                  <img
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&auto=format&fit=crop&q=80"
                    alt="u3"
                    className="w-4 h-4 rounded-full border border-black object-cover"
                  />
                </div>
                <span className="text-xs font-bold text-neutral-300">
                  {totalRoundBetsCount}/1529 Bets
                </span>
              </div>
              {/* Thin green progress bar underneath */}
              <div className="w-24 h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-[#00df59] rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, Math.max(5, (totalRoundBetsCount / 1529) * 100))}%` }}
                />
              </div>
            </div>

            {/* Total Win GHS */}
            <div className="text-right">
              <div className="text-sm font-black text-white">
                {bottomTab === 'All Bets'
                  ? totalRoundWinAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : bottomTab === 'Previous'
                  ? '1,127.00'
                  : '98,450.00'}
              </div>
              <div className="text-[10px] text-neutral-400">Total win GHS</div>
            </div>
          </div>

          {/* Table Header: Player | Bet GHS | X | Win GHS (Screenshot 3) */}
          <div className="px-4 py-2 bg-[#121820] grid grid-cols-12 text-[11px] font-bold text-neutral-400 border-b border-[#1d2632]">
            <div className="col-span-4">Player</div>
            <div className="col-span-3 text-right">Bet GHS</div>
            <div className="col-span-2 text-center">X</div>
            <div className="col-span-3 text-right">Win GHS</div>
          </div>

          {/* Table Rows (Matching video frames 00:31-00:34) */}
          <div className="divide-y divide-[#1e2733] max-h-72 overflow-y-auto no-scrollbar">
            {bottomTab === 'All Bets' &&
              liveBets.map(bet => (
                <div
                  key={bet.id}
                  className={`px-4 py-2 grid grid-cols-12 items-center text-xs transition-colors ${
                    bet.winAmount ? 'bg-[#152a1d]/20 hover:bg-[#152a1d]/30' : 'hover:bg-[#1a232f]'
                  }`}
                >
                  {/* Player with avatar and masked name */}
                  <div className="col-span-4 flex items-center space-x-2">
                    <img
                      src={bet.avatar}
                      alt="avatar"
                      className="w-5 h-5 rounded-full object-cover shrink-0 border border-white/10"
                    />
                    <span className="font-medium text-neutral-300 text-[11px] truncate">
                      {bet.maskedUser}
                    </span>
                  </div>

                  {/* Bet Amount */}
                  <div className="col-span-3 text-right font-medium text-white text-[11px]">
                    {bet.betAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </div>

                  {/* Multiplier X (Clean green text in video) */}
                  <div className="col-span-2 text-center">
                    {bet.cashoutMultiplier ? (
                      <span className="text-[#00df59] font-black text-[11px]">
                        {bet.cashoutMultiplier.toFixed(2)}x
                      </span>
                    ) : (
                      <span className="text-transparent">-</span>
                    )}
                  </div>

                  {/* Win GHS (Clean green bold in video) */}
                  <div className="col-span-3 text-right font-bold text-[11px]">
                    {bet.winAmount ? (
                      <span className="text-[#00df59]">
                        {bet.winAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    ) : (
                      <span className="text-transparent">-</span>
                    )}
                  </div>
                </div>
              ))}

            {bottomTab === 'Previous' && (
              <div className="p-4 text-center text-xs text-neutral-400 space-y-2">
                <p>Round #284920 Ended at {multiplierHistory[0]?.toFixed(2)}x</p>
                <div className="text-[11px] text-neutral-500">1,970 players participated</div>
              </div>
            )}

            {bottomTab === 'Top' && (
              <div className="divide-y divide-[#1e2733]">
                {[
                  { user: 'k***9', bet: 1200, mult: 42.50, win: 51000 },
                  { user: '7***e', bet: 800, mult: 28.10, win: 22480 },
                  { user: 'b***m', bet: 500, mult: 35.00, win: 17500 }
                ].map((row, i) => (
                  <div key={i} className="px-4 py-2.5 grid grid-cols-12 items-center text-xs">
                    <div className="col-span-4 flex items-center space-x-1.5 font-bold text-amber-400">
                      <span>#{i + 1}</span>
                      <span>{row.user}</span>
                    </div>
                    <div className="col-span-3 text-right text-white">{row.bet.toFixed(2)}</div>
                    <div className="col-span-2 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-[#e024c3]/20 text-[#e024c3] font-bold text-[10px]">
                        {row.mult.toFixed(2)}x
                      </span>
                    </div>
                    <div className="col-span-3 text-right font-bold text-[#00df59]">
                      {row.win.toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer: Provably Fair Game | Powered by SPRIBE (Screenshot 3) */}
          <div className="px-4 py-3 bg-[#11171f] border-t border-[#1e2733] flex items-center justify-between text-xs text-neutral-400">
            <button
              onClick={() => setProvablyFairOpen(true)}
              className="flex items-center space-x-1.5 hover:text-white transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-[#00df59]" />
              <span className="text-[11px] font-medium">Provably Fair Game</span>
            </button>

            <div className="flex items-center space-x-1.5 text-[11px] font-medium">
              <span className="text-neutral-500">Powered by</span>
              <span className="text-white font-black tracking-wider">SPRIBE</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 7. HAMBURGER SLIDE-OUT MENU DRAWER (Exact clone of Screenshot 2) */}
      {/* ========================================================= */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex justify-end animate-in fade-in duration-200">
          <div className="w-80 max-w-[85vw] bg-[#1a232f] text-white h-full flex flex-col overflow-y-auto shadow-2xl border-l border-neutral-700 animate-in slide-in-from-right duration-200">
            {/* User Profile Card Header (Screenshot 2: Cat avatar, 202XXXXX15, Change Avatar) */}
            <div className="p-4 bg-[#202b3a] border-b border-[#29374a] flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <img
                  src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=100&auto=format&fit=crop&q=80"
                  alt="avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-neutral-600 shadow"
                />
                <div>
                  <div className="text-sm font-bold text-white tracking-wide">
                    {user.phone ? `${user.phone.slice(0, 3)}XXXXX${user.phone.slice(-2)}` : '202XXXXX15'}
                  </div>
                  <button
                    onClick={() => showToast('Avatar customization')}
                    className="mt-1 flex items-center space-x-1 text-[11px] text-neutral-300 hover:text-white bg-[#2b3a4e] px-2 py-0.5 rounded-full border border-white/10"
                  >
                    <User className="w-3 h-3" />
                    <span>Change Avatar</span>
                  </button>
                </div>
              </div>

              <button
                onClick={() => setMenuOpen(false)}
                className="p-1 rounded-full text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Switches (Screenshot 2: Sound, Music, Animation) */}
            <div className="p-4 space-y-4 border-b border-[#243040]">
              {/* Sound Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-neutral-200">
                  <Volume2 className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                  <span>Sound</span>
                </div>
                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    soundEnabled ? 'bg-[#00a826]' : 'bg-neutral-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      soundEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Music Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-neutral-200">
                  <Music className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                  <span>Music</span>
                </div>
                <button
                  onClick={() => setMusicEnabled(!musicEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    musicEnabled ? 'bg-[#00a826]' : 'bg-neutral-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      musicEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              {/* Animation Toggle */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 text-sm text-neutral-200">
                  <Fan className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                  <span>Animation</span>
                </div>
                <button
                  onClick={() => setAnimationEnabled(!animationEnabled)}
                  className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors ${
                    animationEnabled ? 'bg-[#00a826]' : 'bg-neutral-600'
                  }`}
                >
                  <div
                    className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      animationEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Menu Items (Screenshot 2: Free Bets, My Bet History, Game Limits, How To Play, Game Rules, Provably Fair) */}
            <div className="py-2 divide-y divide-[#232f3f]">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  showToast('No active Free Bets vouchers available right now.');
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <Star className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>Free Bets</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setMyHistoryOpen(true);
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <Clock className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>My Bet History</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  showToast('Min Bet: 1.00 GHS | Max Bet: 10,000.00 GHS | Max Win: 1,000,000.00 GHS');
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <Banknote className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>Game Limits</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setHowToPlayOpen(true);
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <HelpCircle className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>How To Play</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setHowToPlayOpen(true);
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <FileText className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>Game Rules</span>
              </button>

              <button
                onClick={() => {
                  setMenuOpen(false);
                  setProvablyFairOpen(true);
                }}
                className="w-full px-4 py-3 flex items-center space-x-3 text-sm text-neutral-200 hover:bg-[#202b3a] transition-colors"
              >
                <ShieldCheck className="w-5 h-5 text-neutral-400 stroke-[1.8]" />
                <span>Provably Fair Settings</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 8. IN-GAME LIVE CHAT DRAWER */}
      {/* ========================================================= */}
      {chatOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex justify-end animate-in fade-in duration-150">
          <div className="w-80 max-w-[85vw] bg-[#161e27] text-white h-full flex flex-col shadow-2xl border-l border-neutral-700 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="p-3 bg-[#1e2733] border-b border-neutral-700 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-[#00df59]" />
                <span className="font-bold text-sm text-white">Aviator Community Chat</span>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 p-3 space-y-2.5 overflow-y-auto">
              {chatMessages.map(msg => (
                <div key={msg.id} className="bg-[#1b2533] p-2.5 rounded-xl border border-white/5">
                  <div className="flex items-center justify-between text-[11px] mb-1">
                    <span className="font-bold text-[#34b4ff] flex items-center space-x-1">
                      <span>{msg.avatar}</span>
                      <span>{msg.user}</span>
                    </span>
                    <span className="text-neutral-500 text-[10px]">{msg.time}</span>
                  </div>
                  <p className="text-xs text-neutral-200">{msg.text}</p>
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSendChat} className="p-3 bg-[#1e2733] border-t border-neutral-700 flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                placeholder="Say something to players..."
                className="flex-1 bg-[#121820] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#00df59]"
              />
              <button
                type="submit"
                className="p-2 bg-[#00a826] hover:bg-[#009221] text-white rounded-xl active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 9. PROVABLY FAIR MODAL */}
      {/* ========================================================= */}
      {provablyFairOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#18202a] text-white rounded-2xl max-w-sm w-full p-4 border border-neutral-700 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#00df59]" />
                <span className="font-bold text-sm">Provably Fair Cryptography</span>
              </div>
              <button onClick={() => setProvablyFairOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Aviator uses 100% Provably Fair technology based on SHA-512 cryptographic hash generation. The outcome of each round is determined before the round starts by combining the Server Seed and the Client Seeds of the first 3 bettors.
            </p>
            <div className="bg-[#10161f] p-2.5 rounded-xl border border-white/5 space-y-1.5 text-[10px] text-neutral-400 font-mono break-all">
              <div>
                <span className="text-neutral-200 font-bold">Server Seed (Hashed):</span>
                <p className="text-emerald-400">9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08</p>
              </div>
              <div>
                <span className="text-neutral-200 font-bold">Current Round ID:</span>
                <p>#GH-SPRIBE-294820</p>
              </div>
            </div>
            <button
              onClick={() => {
                setProvablyFairOpen(false);
                showToast('Seed verified successfully!');
              }}
              className="w-full py-2.5 bg-[#00a826] hover:bg-[#009221] text-white rounded-xl font-bold text-xs"
            >
              Verify Round Seeds
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 10. HOW TO PLAY MODAL */}
      {/* ========================================================= */}
      {howToPlayOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#18202a] text-white rounded-2xl max-w-sm w-full p-4 border border-neutral-700 shadow-2xl space-y-4 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-5 h-5 text-[#de1a22]" />
                <span className="font-bold text-sm">How To Play Aviator</span>
              </div>
              <button onClick={() => setHowToPlayOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="p-3 bg-[#121820] rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">1. Place Your Bets</span>
                <span>Select your stake and press the green "Bet" button before takeoff. You can place two simultaneous bets!</span>
              </div>
              <div className="p-3 bg-[#121820] rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">2. Watch the Multiplier Rise</span>
                <span>The red plane takes off and the multiplier starts increasing from 1.00x upward.</span>
              </div>
              <div className="p-3 bg-[#121820] rounded-xl border border-white/5">
                <span className="font-bold text-white block mb-1">3. Cash Out Before it Flews Away!</span>
                <span>Press Cash Out before the plane flies off the screen to lock in your multiplied win. If the plane flies away before you cash out, the bet is lost.</span>
              </div>
            </div>

            <button
              onClick={() => setHowToPlayOpen(false)}
              className="w-full py-2.5 bg-[#de1a22] hover:bg-[#c2141c] text-white rounded-xl font-bold text-xs"
            >
              Got it, let's fly!
            </button>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 11. MY BET HISTORY MODAL */}
      {/* ========================================================= */}
      {myHistoryOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#18202a] text-white rounded-2xl max-w-sm w-full p-4 border border-neutral-700 shadow-2xl space-y-3 max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-[#34b4ff]" />
                <span className="font-bold text-sm">My Aviator History</span>
              </div>
              <button onClick={() => setMyHistoryOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2">
              {userBetHistory.length === 0 ? (
                <div className="text-center py-8 text-neutral-400 text-xs">
                  No bets placed yet in this session.
                </div>
              ) : (
                userBetHistory.map(b => (
                  <div
                    key={b.id}
                    className="bg-[#121820] p-2.5 rounded-xl border border-white/5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-white">{b.stake.toFixed(2)} GHS</div>
                      <div className="text-[10px] text-neutral-400">{b.time}</div>
                    </div>
                    <div className="text-center">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          b.won ? 'bg-[#00a826]/20 text-[#00df59]' : 'bg-red-500/20 text-red-400'
                        }`}
                      >
                        {b.multiplier.toFixed(2)}x
                      </span>
                    </div>
                    <div className="text-right">
                      <div className={`font-bold ${b.won ? 'text-[#00df59]' : 'text-neutral-500'}`}>
                        {b.won ? `+${b.payout.toFixed(2)} GHS` : '0.00 GHS'}
                      </div>
                      <div className="text-[9px] text-neutral-400">{b.won ? 'WON' : 'LOST'}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 12. ROUND HISTORY POPUP (When clicking •••) */}
      {/* ========================================================= */}
      {historyModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
          <div className="bg-[#18202a] text-white rounded-2xl max-w-sm w-full p-4 border border-neutral-700 shadow-2xl space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-700/60 pb-2">
              <span className="font-bold text-sm">Previous Round Multipliers</span>
              <button onClick={() => setHistoryModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-2 max-h-60 overflow-y-auto p-1">
              {multiplierHistory.map((m, idx) => (
                <div
                  key={idx}
                  className={`p-2 rounded-xl text-center font-bold text-xs bg-[#10161f] border border-white/5 ${getMultiplierColor(
                    m
                  )}`}
                >
                  {m.toFixed(2)}x
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
