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
import { aviatorEngine } from '../services/aviatorEngine';

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
  const [flightSpeedMultiplier, setFlightSpeedMultiplier] = useState<number>(1.0);
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
  const [bottomTab, setBottomTab] = useState<'All Bets' | 'My Bets' | 'Top'>('All Bets');
  const [topTimeFilter, setTopTimeFilter] = useState<'Day' | 'Month' | 'Year'>('Day');
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
        const speed = flightSpeedMultiplier || 1.0;
        // Exponential growth formula with dynamic speed multiplier
        const nextVal = parseFloat((1.0 + Math.pow(elapsed * 0.72 * speed, 1.42)).toFixed(2));

        // Adjust engine drone pitch with climbing multiplier
        updateEnginePitch(nextVal);

        if (nextVal >= currentCrash) {
          // CRASH / FLEW AWAY!
          setMultiplier(currentCrash);
          handleCrash(currentCrash);
        } else {
          setMultiplier(nextVal);
          aviatorEngine.updateCurrentGameStatus('flying', nextVal, currentCrash);

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
  }, [gameState, crashPoint, panel1BetState, panel1AutoCashoutEnabled, panel1AutoCashout, panel2BetState, panel2AutoCashoutEnabled, panel2AutoCashout, flightSpeedMultiplier]);

  const startFlight = () => {
    // Consume scheduled next round plan from the synchronized Aviator engine
    const nextRoundPlan = aviatorEngine.advanceToNextRound();
    const finalCrash = nextRoundPlan.crashPoint;
    const speed = nextRoundPlan.speedMultiplier || 1.0;

    setCrashPoint(finalCrash);
    setFlightSpeedMultiplier(speed);
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
    aviatorEngine.updateCurrentGameStatus('crashed', finalPoint);

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
      aviatorEngine.updateCurrentGameStatus('waiting', 1.0);
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
      return 'bg-[#102130] text-[#34b4ff] border border-[#34b4ff]/30 hover:bg-[#152e44]';
    } else if (mult < 10.0) {
      return 'bg-[#201432] text-[#9042f6] border border-[#9042f6]/30 hover:bg-[#2c1a45]';
    } else if (mult < 50.0) {
      return 'bg-[#30132b] text-[#e024c3] border border-[#e024c3]/40 font-black hover:bg-[#42173b]';
    } else {
      return 'bg-[#30132b] text-[#e024c3] border border-amber-400 font-black shadow-[0_0_8px_rgba(251,191,36,0.4)]';
    }
  };

  // Canvas / SVG curve calculation in unified 1000x650 coordinates
  const originX = 60;
  const originY = 570;
  const climbRatio = Math.min((multiplier - 1.0) / 1.4, 1.0); // 0 at 1.0x, 1 at 2.4x+

  // Base coordinates across 1000x650 viewBox
  const baseX = 100 + climbRatio * 620; // 100 to 720
  const baseY = 570 - Math.pow(climbRatio, 0.72) * 380; // 570 down to 190

  // Subtle cruising aerodynamic bobbing
  const bobY = gameState === 'flying' && climbRatio > 0.85 ? Math.sin(multiplier * 3.5) * 8 : 0;
  const bobRot = gameState === 'flying' && climbRatio > 0.85 ? Math.cos(multiplier * 3.5) * 2.5 : 0;
  const tipX = baseX;
  const tipY = baseY + bobY;

  // Control point for smooth parabolic curve
  const ctrlX = originX + (tipX - originX) * 0.52;
  const ctrlY = originY;

  // Exact tangent angle
  const dx = Math.max(1, tipX - ctrlX);
  const dy = tipY - ctrlY;
  const curveAngle = Math.atan2(dy, dx) * (180 / Math.PI);
  const planeRotation = curveAngle + bobRot;

  // Curve and Area paths
  const curveLinePath = `M ${originX} ${originY} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY}`;
  const curveAreaPath = `M ${originX} ${originY} Q ${ctrlX} ${ctrlY} ${tipX} ${tipY} L ${tipX} ${originY} Z`;

  return (
    <div className="bg-[#0f141c] text-white min-h-screen flex flex-col select-none relative overflow-x-hidden font-sans">
      {/* ========================================================= */}
      {/* 1. TOP SIMULATED BROWSER/HEADER BAR (Screenshot 1: < Aviator) */}
      {/* ========================================================= */}
      <div className="bg-[#12171f] px-3 py-2 flex items-center justify-between border-b border-[#1b232e]">
        <button
          onClick={() => setActiveTab('sports')}
          className="p-1.5 text-neutral-300 hover:text-white rounded-full transition-colors flex items-center cursor-pointer"
          title="Back to Sports"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-white tracking-wide">Aviator</h1>

        {/* Balance or spacer */}
        <div className="w-8" />
      </div>

      {/* ========================================================= */}
      {/* 2. IN-GAME AVIATOR HEADER (Spribe Header: Logo, How To Play, Balance, Sound, Chat, Hamburger) */}
      {/* ========================================================= */}
      <div className="bg-[#141a22] px-3 py-2 flex items-center justify-between border-b border-[#1c2430]">
        {/* Left: Aviator Logo & How to Play */}
        <div className="flex items-center space-x-2">
          {/* Purple square with rounded corners and white circle/spribe logo */}
          <div className="w-7 h-7 rounded-[7px] bg-gradient-to-br from-[#8a3ffc] to-[#6929c4] flex items-center justify-center shadow-md border border-white/20 shrink-0">
            <div className="w-3.5 h-3.5 rounded-full bg-white/95 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-[#6929c4]" />
            </div>
          </div>
          {/* Red italic Aviator script logo */}
          <span className="text-xl font-black italic tracking-tight text-[#e51b24] font-serif select-none drop-shadow">
            Aviator
          </span>

          {/* Orange '? How to play?' pill button */}
          <button
            onClick={() => setHowToPlayOpen(true)}
            className="bg-[#e67e22] hover:bg-[#f39c12] text-black text-[10px] font-black px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-sm transition-transform active:scale-95 cursor-pointer ml-1"
            title="How to Play"
          >
            <span className="w-3 h-3 rounded-full bg-black text-[#e67e22] text-[9px] font-black flex items-center justify-center leading-none">
              ?
            </span>
            <span className="leading-none">How to play?</span>
          </button>
        </div>

        {/* Right: Balance, Audio toggle, Chat, Hamburger Menu */}
        <div className="flex items-center space-x-2.5">
          {/* Balance in bright green bold */}
          <div className="text-right">
            <span className="text-xs sm:text-sm font-black text-[#00df59] tracking-tight">
              {user.balance.toFixed(2)} {user.currency || 'GHS'}
            </span>
          </div>

          {/* Sound Toggle Icon */}
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 text-white hover:text-neutral-300 transition-colors cursor-pointer"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-[#00df59]" />
            ) : (
              <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400" />
            )}
          </button>

          {/* Chat bubble icon */}
          <button
            onClick={() => setChatOpen(!chatOpen)}
            className="p-1 text-white hover:text-neutral-300 transition-colors relative cursor-pointer"
            title="Live Chat"
          >
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 fill-white stroke-white" />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#00df59] rounded-full ring-2 ring-[#141a22]" />
          </button>

          {/* Hamburger Menu (Screenshot 2) */}
          <button
            onClick={() => setMenuOpen(true)}
            className="p-1 text-white hover:text-neutral-300 transition-colors cursor-pointer"
            title="Game Menu"
          >
            <Menu className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MULTIPLIER HISTORY RIBBON (Screenshot 1: colored pills with ...) */}
      {/* ========================================================= */}
      <div className="bg-[#12171f] px-2 py-1.5 border-b border-[#1c2430] flex items-center justify-between overflow-x-auto no-scrollbar space-x-2">
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {multiplierHistory.slice(0, 16).map((mult, idx) => (
            <span
              key={idx}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold shrink-0 transition-transform active:scale-95 cursor-pointer shadow-sm ${getMultiplierColor(
                mult
              )}`}
              onClick={() => showToast(`Round Multiplier: ${mult.toFixed(2)}x`)}
            >
              {mult.toFixed(2)}x
            </span>
          ))}
        </div>

        {/* History Modal Trigger Button (•••) */}
        <button
          onClick={() => setHistoryModalOpen(true)}
          className="p-1 px-2 bg-[#19222c] hover:bg-[#222e3c] text-neutral-300 hover:text-white rounded-full text-xs font-bold shrink-0 border border-white/10 flex items-center space-x-0.5 cursor-pointer"
          title="Round History"
        >
          <span>•••</span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
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
          {/* C. THE UNIFIED SVG FLIGHT ARENA (Curve, Runway, Aircraft) */}
          {/* ===================================================== */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10" viewBox="0 0 1000 650">
            <defs>
              {/* Crimson gradient fill */}
              <linearGradient id="aviatorCrimson" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e51b24" stopOpacity="0.55" />
                <stop offset="65%" stopColor="#99001b" stopOpacity="0.22" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Telemetry coordinate grid lines */}
            <g opacity="0.1" stroke="#ffffff" strokeWidth="1" strokeDasharray="4 4">
              <line x1="50" y1="450" x2="950" y2="450" />
              <line x1="50" y1="320" x2="950" y2="320" />
              <line x1="50" y1="190" x2="950" y2="190" />
              <line x1="280" y1="80" x2="280" y2="570" />
              <line x1="510" y1="80" x2="510" y2="570" />
              <line x1="740" y1="80" x2="740" y2="570" />
            </g>
            {/* Runway baseline */}
            <line x1="40" y1="570" x2="960" y2="570" stroke="#e51b24" strokeWidth="1.5" opacity="0.35" />

            {/* Active Flight or Frozen Crash Curve */}
            {(gameState === 'flying' || gameState === 'crashed') && (
              <>
                {/* Filled Area Under Curve */}
                <path d={curveAreaPath} fill="url(#aviatorCrimson)" />

                {/* Red Flight Line Curve */}
                <path
                  d={curveLinePath}
                  fill="none"
                  stroke="#e51b24"
                  strokeWidth="6"
                  strokeLinecap="round"
                  className="drop-shadow-[0_0_12px_#e51b24]"
                />
              </>
            )}

            {/* Parked Aircraft on Runway when Waiting */}
            {gameState === 'waiting' && (
              <g
                transform={`translate(${originX + 25}, ${originY - 8})`}
                style={{ filter: 'drop-shadow(0 4px 10px rgba(229,27,36,0.6))' }}
              >
                {/* Fuselage */}
                <path
                  d="M 0 0 Q 30 -12, 75 0 Q 70 12, 5 6 Z"
                  fill="#e51b24"
                  stroke="#ff4d4f"
                  strokeWidth="2"
                />
                {/* Cockpit / Windshield with glass gloss reflection */}
                <path d="M 32 -6 Q 44 -14, 54 -4 Z" fill="#ffffff" opacity="0.95" />
                <path d="M 35 -6 Q 43 -12, 50 -5 Z" fill="#90caf9" opacity="0.85" />
                {/* Top wing */}
                <path
                  d="M 22 -18 L 52 -18 Q 55 -14, 48 -13 L 20 -13 Z"
                  fill="#e51b24"
                  stroke="#ff4d4f"
                  strokeWidth="1.5"
                />
                {/* Wing Struts */}
                <line x1="28" y1="-13" x2="32" y2="0" stroke="#ffffff" strokeWidth="2" />
                <line x1="44" y1="-13" x2="48" y2="0" stroke="#ffffff" strokeWidth="2" />
                {/* Tail fin */}
                <path d="M 0 0 L -12 -18 L -3 -18 L 8 0 Z" fill="#e51b24" stroke="#ff4d4f" strokeWidth="1.5" />
                {/* Fuselage X decal */}
                <text x="18" y="2" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  X
                </text>
                {/* Landing gear & wheels on runway */}
                <line x1="38" y1="6" x2="35" y2="16" stroke="#ffffff" strokeWidth="2" />
                <circle cx="34" cy="16" r="4" fill="#151a22" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="55" y1="5" x2="52" y2="16" stroke="#ffffff" strokeWidth="2" />
                <circle cx="51" cy="16" r="4" fill="#151a22" stroke="#ffffff" strokeWidth="1.5" />
                {/* Propeller hub and idling blades */}
                <circle cx="75" cy="0" r="3.5" fill="#ffffff" />
                <ellipse cx="75" cy="0" rx="2.5" ry="16" fill="#ffffff" opacity="0.85" />
              </g>
            )}

            {/* Flying or Flew-Away Red Aviator Aircraft (Seamlessly attached to curve tip) */}
            {(gameState === 'flying' || gameState === 'crashed') && (
              <g
                transform={
                  gameState === 'crashed'
                    ? `translate(${tipX + 380}, ${tipY - 260}) rotate(-26deg) scale(0.6)`
                    : `translate(${tipX}, ${tipY}) rotate(${planeRotation})`
                }
                opacity={gameState === 'crashed' ? 0 : 1}
                style={{
                  transition:
                    gameState === 'crashed'
                      ? 'transform 0.7s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.55s ease-out'
                      : 'none',
                  filter: 'drop-shadow(0 4px 14px rgba(229,27,36,0.75))'
                }}
              >
                {/* Fuselage (starts at 0 0 where the red curve touches) */}
                <path
                  d="M 0 0 Q 30 -12, 75 0 Q 70 12, 5 6 Z"
                  fill="#e51b24"
                  stroke="#ff4d4f"
                  strokeWidth="2"
                />
                {/* Cockpit / Windshield with glass reflection */}
                <path d="M 32 -6 Q 44 -14, 54 -4 Z" fill="#ffffff" opacity="0.95" />
                <path d="M 35 -6 Q 43 -12, 50 -5 Z" fill="#90caf9" opacity="0.85" />
                {/* Top wing */}
                <path
                  d="M 22 -18 L 52 -18 Q 55 -14, 48 -13 L 20 -13 Z"
                  fill="#e51b24"
                  stroke="#ff4d4f"
                  strokeWidth="1.5"
                />
                {/* Wing Struts */}
                <line x1="28" y1="-13" x2="32" y2="0" stroke="#ffffff" strokeWidth="2" />
                <line x1="44" y1="-13" x2="48" y2="0" stroke="#ffffff" strokeWidth="2" />
                {/* Tail fin & rudder */}
                <path d="M 0 0 L -12 -18 L -3 -18 L 8 0 Z" fill="#e51b24" stroke="#ff4d4f" strokeWidth="1.5" />
                {/* Fuselage "X" decal (Iconic Aviator design) */}
                <text x="18" y="2" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                  X
                </text>
                {/* Landing gear & wheels */}
                <line x1="38" y1="6" x2="35" y2="16" stroke="#ffffff" strokeWidth="2" />
                <circle cx="34" cy="16" r="4" fill="#151a22" stroke="#ffffff" strokeWidth="1.5" />
                <line x1="55" y1="5" x2="52" y2="16" stroke="#ffffff" strokeWidth="2" />
                <circle cx="51" cy="16" r="4" fill="#151a22" stroke="#ffffff" strokeWidth="1.5" />
                {/* Aerodynamic wind / vapor trailing lines */}
                <path d="M -8 -18 Q -24 -20, -38 -20" stroke="#ff4d4f" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
                <path d="M -5 3 Q -20 5, -35 5" stroke="#ff4d4f" strokeWidth="1.5" opacity="0.6" strokeDasharray="3 3" />
                {/* Propeller Hub & Spinning Blades with motion blur disc */}
                <circle cx="75" cy="0" r="3.5" fill="#ffffff" />
                <circle cx="75" cy="0" r="16" fill="#ffffff" opacity="0.2" />
                <ellipse
                  cx="75"
                  cy="0"
                  rx="2.5"
                  ry="18"
                  fill="#ffffff"
                  opacity="0.9"
                  className="animate-spin"
                  style={{ transformOrigin: '75px 0px' }}
                />
              </g>
            )}
          </svg>

          {/* ===================================================== */}
          {/* D. INTERMISSION OVERLAYS (Waiting State) */}
          {/* ===================================================== */}
          {gameState === 'waiting' && (
            <div className="relative z-20 flex flex-col items-center justify-center text-center px-4 w-full animate-in fade-in duration-300 pointer-events-none">
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
          )}

          {/* ===================================================== */}
          {/* E. FLYING MULTIPLIER DISPLAY */}
          {/* ===================================================== */}
          {gameState === 'flying' && (
            <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none">
              <div className="text-5xl sm:text-6xl font-black tracking-tight font-sans select-none text-white drop-shadow-2xl">
                {multiplier.toFixed(2)}x
              </div>
            </div>
          )}

          {/* ===================================================== */}
          {/* F. CRASHED / FLEW AWAY SCREEN */}
          {/* ===================================================== */}
          {gameState === 'crashed' && (
            <div className="absolute z-20 inset-0 flex flex-col items-center justify-center pointer-events-none animate-in fade-in duration-200">
              <span className="text-sm sm:text-base font-black uppercase tracking-widest text-white mb-1 drop-shadow">
                FLEW AWAY!
              </span>
              <div className="text-5xl sm:text-6xl font-black tracking-tight font-sans select-none text-[#e51b24] drop-shadow-2xl">
                {multiplier.toFixed(2)}x
              </div>
            </div>
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
      {/* 5. DUAL BETTING PANELS (SportyBet / Spribe Authentic Layout) */}
      {/* ========================================================= */}
      <div className="px-3 space-y-2.5">
        {/* ==================== PANEL 1 ==================== */}
        <div className="bg-[#18202a] rounded-2xl p-3 border border-[#243040] shadow-lg relative">
          {/* Bet / Auto Pill Switcher & Optional + Button */}
          <div className="flex items-center justify-between mb-2.5">
            <div className="w-6" /> {/* spacer to balance header */}
            <div className="bg-[#10161f] p-0.5 rounded-full flex items-center border border-white/5 w-48">
              <button
                onClick={() => setPanel1Mode('Bet')}
                className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  panel1Mode === 'Bet'
                    ? 'bg-[#253243] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Bet
              </button>
              <button
                onClick={() => setPanel1Mode('Auto')}
                className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  panel1Mode === 'Auto'
                    ? 'bg-[#253243] text-white shadow'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                Auto
              </button>
            </div>

            {/* Quick '+' icon to open Panel 2 if hidden */}
            {!panel2Visible ? (
              <button
                onClick={() => setPanel2Visible(true)}
                className="w-6 h-6 rounded-md bg-[#10161f] hover:bg-[#202a38] text-neutral-300 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
                title="Add second bet panel"
              >
                <Plus className="w-3.5 h-3.5 text-[#00df59]" />
              </button>
            ) : (
              <div className="w-6" />
            )}
          </div>

          {/* Stepper + Presets + Big Action Button */}
          <div className="grid grid-cols-2 gap-2.5 items-stretch">
            {/* Left controls */}
            <div className="space-y-2">
              {/* Stepper: - 1.00 + */}
              <div className="bg-[#10161f] rounded-xl px-2 py-1.5 flex items-center justify-between border border-white/5">
                <button
                  onClick={() => setPanel1Stake(prev => Math.max(1.0, parseFloat((prev - 1).toFixed(2))))}
                  className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={panel1Stake}
                  onChange={e => setPanel1Stake(Math.max(0.5, parseFloat(e.target.value) || 1.0))}
                  className="w-16 bg-transparent text-center font-black text-sm text-white focus:outline-none"
                />
                <button
                  onClick={() => setPanel1Stake(prev => parseFloat((prev + 1).toFixed(2)))}
                  className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                </button>
              </div>

              {/* 2x2 Quick Stake Presets: 1.00, 2.00, 5.00, 10.00 */}
              <div className="grid grid-cols-2 gap-1.5">
                {[1, 2, 5, 10].map(val => (
                  <button
                    key={val}
                    onClick={() => setPanel1Stake(val)}
                    className={`py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                      panel1Stake === val
                        ? 'bg-[#29384b] text-white border border-white/20'
                        : 'bg-[#121922] text-neutral-400 hover:text-white hover:bg-[#1a2330]'
                    }`}
                  >
                    {val.toFixed(2)}
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

            {/* Right: Big Action Button */}
            <div className="flex flex-col">
              {panel1BetState === 'active' && gameState === 'flying' ? (
                /* Cash Out button in bright orange/yellow */
                <button
                  onClick={() => handleCashOut(1, multiplier)}
                  className="flex-1 bg-gradient-to-b from-[#ff9a00] to-[#ff7700] hover:from-[#ffa81a] hover:to-[#ff851a] active:scale-[0.98] text-black rounded-xl p-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,154,0,0.5)] transition-all animate-pulse cursor-pointer"
                >
                  <span className="text-sm font-black uppercase tracking-wider text-black">CASH OUT</span>
                  <span className="text-lg font-black tracking-tight text-black">
                    {(panel1Stake * multiplier).toFixed(2)} {user.currency || 'GHS'}
                  </span>
                </button>
              ) : panel1BetState === 'queued' ? (
                /* Waiting for round / Cancel */
                <button
                  onClick={() => handleCancelBet(1)}
                  className="flex-1 bg-[#d9383a] hover:bg-[#c22e30] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer"
                >
                  <span className="text-xs font-black uppercase tracking-wider">WAITING</span>
                  <span className="text-[11px] text-white/90 font-bold">
                    Cancel ({panel1Stake.toFixed(2)} {user.currency || 'GHS'})
                  </span>
                </button>
              ) : panel1BetState === 'cashed_out' ? (
                /* Cashed out success */
                <div className="flex-1 bg-[#1a4025] border border-[#00df59]/40 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#00df59]">
                    CASHED OUT
                  </span>
                  <span className="text-base font-black text-white">
                    +{panel1CashedAmount.toFixed(2)} {user.currency || 'GHS'}
                  </span>
                  <span className="text-[10px] text-neutral-300">
                    at {panel1CashedMultiplier.toFixed(2)}x
                  </span>
                </div>
              ) : (
                /* Default Big Green Bet Button */
                <button
                  onClick={() => handlePlaceBet(1)}
                  className="flex-1 bg-gradient-to-b from-[#22c55e] to-[#16a34a] hover:from-[#2ecc71] hover:to-[#1eb956] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg shadow-green-900/30 transition-all cursor-pointer"
                >
                  <span className="text-xl font-black tracking-wide uppercase">BET</span>
                  <span className="text-xs font-bold text-white/90">
                    {panel1Stake.toFixed(2)} {user.currency || 'GHS'}
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
                  className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    panel2Mode === 'Bet'
                      ? 'bg-[#253243] text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Bet
                </button>
                <button
                  onClick={() => setPanel2Mode('Auto')}
                  className={`flex-1 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                    panel2Mode === 'Auto'
                      ? 'bg-[#253243] text-white shadow'
                      : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Auto
                </button>
              </div>

              {/* Minimize/Close [-] button */}
              <button
                onClick={() => setPanel2Visible(false)}
                className="w-6 h-6 rounded-md bg-[#10161f] hover:bg-[#202a38] text-neutral-400 hover:text-white flex items-center justify-center transition-colors border border-white/5 cursor-pointer"
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
                    className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    value={panel2Stake}
                    onChange={e => setPanel2Stake(Math.max(0.5, parseFloat(e.target.value) || 1.0))}
                    className="w-16 bg-transparent text-center font-black text-sm text-white focus:outline-none"
                  />
                  <button
                    onClick={() => setPanel2Stake(prev => parseFloat((prev + 1).toFixed(2)))}
                    className="w-7 h-7 rounded-full bg-[#1b2533] hover:bg-[#253346] active:scale-95 text-neutral-300 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-1.5">
                  {[1, 2, 5, 10].map(val => (
                    <button
                      key={val}
                      onClick={() => setPanel2Stake(val)}
                      className={`py-1 rounded-lg text-xs font-bold transition-all active:scale-95 cursor-pointer ${
                        panel2Stake === val
                          ? 'bg-[#29384b] text-white border border-white/20'
                          : 'bg-[#121922] text-neutral-400 hover:text-white hover:bg-[#1a2330]'
                      }`}
                    >
                      {val.toFixed(2)}
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
                    className="flex-1 bg-gradient-to-b from-[#ff9a00] to-[#ff7700] hover:from-[#ffa81a] hover:to-[#ff851a] active:scale-[0.98] text-black rounded-xl p-2 flex flex-col items-center justify-center shadow-[0_0_20px_rgba(255,154,0,0.5)] transition-all animate-pulse cursor-pointer"
                  >
                    <span className="text-sm font-black uppercase tracking-wider text-black">CASH OUT</span>
                    <span className="text-lg font-black tracking-tight text-black">
                      {(panel2Stake * multiplier).toFixed(2)} {user.currency || 'GHS'}
                    </span>
                  </button>
                ) : panel2BetState === 'queued' ? (
                  <button
                    onClick={() => handleCancelBet(2)}
                    className="flex-1 bg-[#d9383a] hover:bg-[#c22e30] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg transition-all cursor-pointer"
                  >
                    <span className="text-xs font-black uppercase tracking-wider">WAITING</span>
                    <span className="text-[11px] text-white/90 font-bold">
                      Cancel ({panel2Stake.toFixed(2)} {user.currency || 'GHS'})
                    </span>
                  </button>
                ) : panel2BetState === 'cashed_out' ? (
                  <div className="flex-1 bg-[#1a4025] border border-[#00df59]/40 rounded-xl p-2 flex flex-col items-center justify-center text-center">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#00df59]">
                      CASHED OUT
                    </span>
                    <span className="text-base font-black text-white">
                      +{panel2CashedAmount.toFixed(2)} {user.currency || 'GHS'}
                    </span>
                    <span className="text-[10px] text-neutral-300">
                      at {panel2CashedMultiplier.toFixed(2)}x
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={() => handlePlaceBet(2)}
                    className="flex-1 bg-gradient-to-b from-[#22c55e] to-[#16a34a] hover:from-[#2ecc71] hover:to-[#1eb956] active:scale-[0.98] text-white rounded-xl p-2 flex flex-col items-center justify-center shadow-lg shadow-green-900/30 transition-all cursor-pointer"
                  >
                    <span className="text-xl font-black tracking-wide uppercase">BET</span>
                    <span className="text-xs font-bold text-white/90">
                      {panel2Stake.toFixed(2)} {user.currency || 'GHS'}
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
            className="w-full py-2.5 bg-[#18202a] hover:bg-[#202b38] rounded-xl border border-dashed border-[#2d3a4e] text-xs font-bold text-neutral-300 hover:text-white flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#00df59]" />
            <span>Add Second Bet</span>
          </button>
        )}
      </div>

      {/* ========================================================= */}
      {/* 6. BOTTOM LIVE BETS CONSOLE (All Bets, My Bets, Top) */}
      {/* ========================================================= */}
      <div className="mt-4 px-3 pb-8">
        <div className="bg-[#18202a] rounded-2xl border border-[#243040] overflow-hidden shadow-xl">
          {/* Capsule Tab Switcher */}
          <div className="p-2 border-b border-[#212b38]">
            <div className="bg-[#10161f] p-0.5 rounded-full flex items-center border border-white/5">
              {(['All Bets', 'My Bets', 'Top'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setBottomTab(tab)}
                  className={`flex-1 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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

          {/* Subheader: Avatars + 611/1931 Bets + Total win GHS */}
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
                  {bottomTab === 'My Bets'
                    ? `${userBetHistory.length} My Bets`
                    : `${totalRoundBetsCount}/1529 Bets`}
                </span>
              </div>
              {/* Thin green progress bar underneath */}
              <div className="w-24 h-1 bg-neutral-800 rounded-full mt-1.5 overflow-hidden">
                <div
                  className="h-full bg-[#00df59] rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.max(5, (totalRoundBetsCount / 1529) * 100)
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Total Win GHS / Sub-selector for Top */}
            <div className="text-right">
              {bottomTab === 'Top' ? (
                <div className="flex items-center space-x-1 bg-[#10161f] p-0.5 rounded-lg border border-white/5">
                  {(['Day', 'Month', 'Year'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setTopTimeFilter(f)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                        topTimeFilter === f
                          ? 'bg-[#253243] text-white'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              ) : (
                <>
                  <div className="text-sm font-black text-white">
                    {bottomTab === 'All Bets'
                      ? totalRoundWinAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })
                      : userBetHistory
                          .reduce((acc, b) => acc + (b.won ? b.payout : 0), 0)
                          .toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                          })}
                  </div>
                  <div className="text-[10px] text-neutral-400">Total win GHS</div>
                </>
              )}
            </div>
          </div>

          {/* Table Header: Player / Time | Bet GHS | X | Cash out GHS */}
          <div className="px-4 py-2 bg-[#121820] grid grid-cols-12 text-[11px] font-bold text-neutral-400 border-b border-[#1d2632]">
            <div className="col-span-4">
              {bottomTab === 'My Bets' ? 'Time' : 'Player'}
            </div>
            <div className="col-span-3 text-right">Bet GHS</div>
            <div className="col-span-2 text-center">X</div>
            <div className="col-span-3 text-right">Cash out GHS</div>
          </div>

          {/* Table Rows */}
          <div className="divide-y divide-[#1e2733] max-h-72 overflow-y-auto no-scrollbar">
            {/* 1. ALL BETS TAB */}
            {bottomTab === 'All Bets' &&
              liveBets.map(bet => (
                <div
                  key={bet.id}
                  className={`px-4 py-2 grid grid-cols-12 items-center text-xs transition-colors ${
                    bet.winAmount
                      ? 'bg-[#152a1d]/20 hover:bg-[#152a1d]/30'
                      : 'hover:bg-[#1a232f]'
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
                    {bet.betAmount.toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
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

                  {/* Cash out GHS */}
                  <div className="col-span-3 text-right font-bold text-[11px]">
                    {bet.winAmount ? (
                      <span className="text-[#00df59]">
                        {bet.winAmount.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}
                      </span>
                    ) : (
                      <span className="text-transparent">-</span>
                    )}
                  </div>
                </div>
              ))}

            {/* 2. MY BETS TAB */}
            {bottomTab === 'My Bets' && (
              <>
                {userBetHistory.length === 0 ? (
                  <div className="p-8 text-center text-xs text-neutral-400">
                    No bets placed yet in this session. Place your bet above to fly!
                  </div>
                ) : (
                  userBetHistory.map(b => (
                    <div
                      key={b.id}
                      className={`px-4 py-2 grid grid-cols-12 items-center text-xs transition-colors ${
                        b.won ? 'bg-[#152a1d]/20 hover:bg-[#152a1d]/30' : 'hover:bg-[#1a232f]'
                      }`}
                    >
                      {/* Time */}
                      <div className="col-span-4 text-[11px] text-neutral-300 font-medium">
                        {b.time}
                      </div>

                      {/* Bet GHS */}
                      <div className="col-span-3 text-right font-medium text-white text-[11px]">
                        {b.stake.toFixed(2)}
                      </div>

                      {/* Multiplier X */}
                      <div className="col-span-2 text-center">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            b.won
                              ? 'bg-[#00df59]/20 text-[#00df59]'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {b.multiplier.toFixed(2)}x
                        </span>
                      </div>

                      {/* Cash out GHS */}
                      <div className="col-span-3 text-right font-bold text-[11px]">
                        {b.won ? (
                          <span className="text-[#00df59]">+{b.payout.toFixed(2)}</span>
                        ) : (
                          <span className="text-neutral-500">-</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </>
            )}

            {/* 3. TOP TAB (Day / Month / Year Leaderboard) */}
            {bottomTab === 'Top' && (
              <div className="divide-y divide-[#1e2733]">
                {(topTimeFilter === 'Day'
                  ? [
                      { rank: 1, user: 'k***9', bet: 1200, mult: 42.5, win: 51000 },
                      { rank: 2, user: '7***e', bet: 800, mult: 28.1, win: 22480 },
                      { rank: 3, user: 'b***m', bet: 500, mult: 35.0, win: 17500 },
                      { rank: 4, user: '0***3', bet: 350, mult: 22.4, win: 7840 }
                    ]
                  : topTimeFilter === 'Month'
                  ? [
                      { rank: 1, user: 'w***g', bet: 2000, mult: 185.0, win: 370000 },
                      { rank: 2, user: 'e***2', bet: 1500, mult: 94.2, win: 141300 },
                      { rank: 3, user: 'd***8', bet: 800, mult: 112.5, win: 90000 },
                      { rank: 4, user: 'l***1', bet: 500, mult: 78.4, win: 39200 }
                    ]
                  : [
                      { rank: 1, user: 'f***m', bet: 1000, mult: 1250.0, win: 1250000 },
                      { rank: 2, user: 'a***a', bet: 2500, mult: 480.0, win: 1200000 },
                      { rank: 3, user: 's***7', bet: 500, mult: 890.0, win: 445000 },
                      { rank: 4, user: 'm***2', bet: 600, mult: 550.0, win: 330000 }
                    ]
                ).map(row => (
                  <div key={row.rank} className="px-4 py-2.5 grid grid-cols-12 items-center text-xs">
                    <div className="col-span-4 flex items-center space-x-1.5 font-bold">
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          row.rank === 1
                            ? 'bg-amber-400 text-black'
                            : row.rank === 2
                            ? 'bg-neutral-300 text-black'
                            : row.rank === 3
                            ? 'bg-amber-700 text-white'
                            : 'bg-neutral-700 text-neutral-300'
                        }`}
                      >
                        {row.rank}
                      </span>
                      <span className="text-neutral-300 text-[11px] truncate">{row.user}</span>
                    </div>
                    <div className="col-span-3 text-right text-white font-medium text-[11px]">
                      {row.bet.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </div>
                    <div className="col-span-2 text-center">
                      <span className="px-1.5 py-0.5 rounded bg-[#e024c3]/20 text-[#e024c3] font-bold text-[10px]">
                        {row.mult.toFixed(2)}x
                      </span>
                    </div>
                    <div className="col-span-3 text-right font-bold text-[#00df59] text-[11px]">
                      {row.win.toLocaleString(undefined, { minimumFractionDigits: 2 })}
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
