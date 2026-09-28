// Aviator Shared Game Engine & Next Flight Predictor Service
// Synchronizes the authoritative server game loop across ALL devices and phones.

import { api } from './api';

export type GameStatus = 'waiting' | 'flying' | 'crashed';

export type SignTier = 'TRAP_SIGN' | 'BLUE_SIGN' | 'PURPLE_SIGN' | 'MAGENTA_SIGN' | 'JACKPOT_SIGN';

export type SpeedProfile = 'GLIDER' | 'NORMAL' | 'FAST_TURBO' | 'SUPERSONIC';

export interface AviatorRoundInfo {
  roundId: string;
  roundNumber: number;
  crashPoint: number;
  speedMultiplier: number;
  estimatedDurationSec: number;
  climbRatePerSec: number;
  speedProfile: SpeedProfile;
  speedLabel: string;
  sign: {
    tier: SignTier;
    label: string;
    badgeText: string;
    color: string;
    bgClass: string;
    textClass: string;
    borderClass: string;
    description: string;
    trend: 'BULLISH' | 'BEARISH' | 'BREAKOUT' | 'TRAP';
    trendIcon: string;
  };
  provablyFair: {
    serverSeed: string;
    serverSeedHash: string;
    clientSeed: string;
    nonce: number;
  };
  isOverridden?: boolean;
}

export interface AviatorEngineState {
  currentRound: {
    roundId: string;
    roundNumber: number;
    status: GameStatus;
    currentMultiplier: number;
    crashPoint: number;
    speedMultiplier: number;
    startedAt?: number;
    intermissionCountdown?: number;
  };
  nextRound: AviatorRoundInfo;
  upcomingQueue: AviatorRoundInfo[];
  history: number[];
  adminOverrideActive: boolean;
  autoRunEnabled?: boolean;
  serverTime?: number;
}

const STORAGE_KEY = 'sportybet_aviator_engine_state';

// Helper to generate realistic SHA-512-like hex hashes
function generateMockSha512(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

// Helper to calculate flight duration from crash multiplier and speed
export function calculateFlightDuration(crashPoint: number, speedMultiplier: number = 1.0): number {
  if (crashPoint <= 1.0) return 0.1;
  const speed = Math.max(0.2, speedMultiplier);
  const duration = Math.pow(Math.max(0.01, crashPoint - 1.0), 1 / 1.42) / (0.72 * speed);
  return parseFloat(duration.toFixed(2));
}

// Helper to determine Sign of the game
export function determineGameSign(crashPoint: number, previousPoint?: number): AviatorRoundInfo['sign'] {
  if (crashPoint < 1.15) {
    return {
      tier: 'TRAP_SIGN',
      label: 'Instant Trap / Flew Away',
      badgeText: '< 1.15x',
      color: '#ff4444',
      bgClass: 'bg-[#301414]',
      textClass: 'text-rose-400',
      borderClass: 'border-rose-500/50',
      description: 'Immediate fly-away trap sign. Early crash right after takeoff.',
      trend: 'TRAP',
      trendIcon: '⚠️'
    };
  } else if (crashPoint < 2.00) {
    const trend = previousPoint && crashPoint > previousPoint ? 'BULLISH' : 'BEARISH';
    return {
      tier: 'BLUE_SIGN',
      label: 'Low Altitude Sign',
      badgeText: '1.00x - 1.99x',
      color: '#34b4ff',
      bgClass: 'bg-[#102130]',
      textClass: 'text-[#34b4ff]',
      borderClass: 'border-[#34b4ff]/40',
      description: 'Standard low-altitude flight. Conservative multipliers.',
      trend,
      trendIcon: trend === 'BULLISH' ? '📈' : '📉'
    };
  } else if (crashPoint < 10.00) {
    return {
      tier: 'PURPLE_SIGN',
      label: 'Medium Cloud Sign',
      badgeText: '2.00x - 9.99x',
      color: '#9042f6',
      bgClass: 'bg-[#211432]',
      textClass: 'text-[#b77eff]',
      borderClass: 'border-[#9042f6]/40',
      description: 'Optimal medium cruise. Highest player profitability sweet-spot.',
      trend: 'BULLISH',
      trendIcon: '🚀'
    };
  } else if (crashPoint < 100.00) {
    return {
      tier: 'MAGENTA_SIGN',
      label: 'Supersonic Rocket Sign',
      badgeText: '10.00x - 99.99x',
      color: '#c017b4',
      bgClass: 'bg-[#31112c]',
      textClass: 'text-[#f046e2]',
      borderClass: 'border-[#c017b4]/40',
      description: 'High altitude sonic boom. Major multiplier breakout wave.',
      trend: 'BREAKOUT',
      trendIcon: '🔥'
    };
  } else {
    return {
      tier: 'JACKPOT_SIGN',
      label: 'Deep Space Jackpot',
      badgeText: '100.00x+',
      color: '#ffb703',
      bgClass: 'bg-[#332208]',
      textClass: 'text-[#ffb703]',
      borderClass: 'border-[#ffb703]/50',
      description: 'Cosmic scale flight. Rare stratosphere jackpot multiplier.',
      trend: 'BREAKOUT',
      trendIcon: '🌟'
    };
  }
}

// Generate realistic simulated round info with cryptographic provably-fair seed
function generateRandomRound(roundNum: number, speedMult: number = 1.0, forcedMultiplier?: number): AviatorRoundInfo {
  let crashPoint = forcedMultiplier;
  if (!crashPoint) {
    const rand = Math.random();
    if (rand < 0.08) {
      crashPoint = 1.01 + Math.random() * 0.12;
    } else if (rand < 0.65) {
      crashPoint = 1.15 + Math.random() * 2.20;
    } else if (rand < 0.90) {
      crashPoint = 3.35 + Math.random() * 5.65;
    } else {
      crashPoint = 9.00 + Math.random() * 25.00;
    }
  }

  const finalCrash = parseFloat(crashPoint.toFixed(2));
  const duration = calculateFlightDuration(finalCrash, speedMult);
  const climbRate = parseFloat((0.48 * speedMult).toFixed(2));

  let speedProfile: SpeedProfile = 'NORMAL';
  let speedLabel = '1.0x Standard Climb Rate';
  if (speedMult < 0.85) {
    speedProfile = 'GLIDER';
    speedLabel = '0.7x Slow Glider (Extended Flight)';
  } else if (speedMult > 1.7) {
    speedProfile = 'SUPERSONIC';
    speedLabel = '2.0x Supersonic (Hyper-Fast Climb)';
  } else if (speedMult > 1.2) {
    speedProfile = 'FAST_TURBO';
    speedLabel = '1.5x Fast Turbo Climb';
  }

  const sign = determineGameSign(finalCrash);

  return {
    roundId: `SB-AV-${roundNum}`,
    roundNumber: roundNum,
    crashPoint: finalCrash,
    speedMultiplier: speedMult,
    estimatedDurationSec: duration,
    climbRatePerSec: climbRate,
    speedProfile,
    speedLabel,
    sign,
    provablyFair: {
      serverSeed: `srv_seed_${generateMockSha512().slice(0, 32)}`,
      serverSeedHash: generateMockSha512(),
      clientSeed: `sb_ghana_client_${Math.floor(100000 + Math.random() * 900000)}`,
      nonce: roundNum
    }
  };
}

class AviatorEngineService {
  private state: AviatorEngineState;
  private listeners: Set<(state: AviatorEngineState) => void> = new Set();
  private pollInterval: any = null;
  private isSyncingWithServer: boolean = false;

  constructor() {
    this.state = this.loadInitialState();
    this.startServerSyncPolling();
  }

  private loadInitialState(): AviatorEngineState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nextRound && parsed.upcomingQueue?.length > 0) {
          return parsed;
        }
      }
    } catch {
      //
    }

    const startRoundNum = 4893;
    const history = [2.30, 1.00, 1.39, 1.00, 1.87, 16.48, 1.61, 1.23, 1.73, 22.96, 3.42, 1.05, 5.12];
    const nextRound = generateRandomRound(startRoundNum + 1, 1.0, 2.75);
    const upcomingQueue: AviatorRoundInfo[] = [];

    for (let i = 2; i <= 8; i++) {
      upcomingQueue.push(generateRandomRound(startRoundNum + i, 1.0));
    }

    return {
      currentRound: {
        roundId: `SB-AV-${startRoundNum}`,
        roundNumber: startRoundNum,
        status: 'waiting',
        currentMultiplier: 1.0,
        crashPoint: 2.45,
        speedMultiplier: 1.0,
        startedAt: Date.now(),
        intermissionCountdown: 5.0
      },
      nextRound,
      upcomingQueue,
      history,
      adminOverrideActive: false,
      autoRunEnabled: true,
      serverTime: Date.now()
    };
  }

  // Polls the authoritative backend server so ALL phones see the EXACT same predictions,
  // exact same crash points, and exact same flight status!
  private startServerSyncPolling() {
    if (typeof window === 'undefined') return;

    // Immediate initial sync
    this.fetchServerState();

    // Poll server every 400ms for tight cross-device synchronization
    if (this.pollInterval) clearInterval(this.pollInterval);
    this.pollInterval = setInterval(() => {
      this.fetchServerState();
    }, 400);

    // Cross-tab sync via storage events
    window.addEventListener('storage', (e) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed && parsed.nextRound) {
            this.state = parsed;
            this.notify();
          }
        } catch {
          //
        }
      }
    });
  }

  private async fetchServerState() {
    if (this.isSyncingWithServer) return;
    this.isSyncingWithServer = true;

    try {
      const res = await api.aviator.getState();
      if (res && res.success && res.currentRound && res.nextRound) {
        this.state = {
          currentRound: res.currentRound,
          nextRound: res.nextRound,
          upcomingQueue: res.upcomingQueue || this.state.upcomingQueue,
          history: res.history || this.state.history,
          adminOverrideActive: !!res.adminOverrideActive,
          autoRunEnabled: res.autoRunEnabled !== false,
          serverTime: res.serverTime || Date.now()
        };
        this.persist(false);
      }
    } catch {
      // Offline or network hiccup; local state continues
    } finally {
      this.isSyncingWithServer = false;
    }
  }

  private persist(notifyListeners: boolean = true) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      //
    }
    if (notifyListeners) {
      this.notify();
    }
  }

  private notify() {
    const copy = this.getState();
    this.listeners.forEach(fn => fn(copy));
  }

  public subscribe(fn: (state: AviatorEngineState) => void): () => void {
    this.listeners.add(fn);
    fn(this.getState());
    return () => {
      this.listeners.delete(fn);
    };
  }

  public getState(): AviatorEngineState {
    return JSON.parse(JSON.stringify(this.state));
  }

  public getNextRound(): AviatorRoundInfo {
    return JSON.parse(JSON.stringify(this.state.nextRound));
  }

  public setAutoRun(enabled: boolean) {
    this.state.autoRunEnabled = enabled;
    this.persist();
  }

  // Update real-time status of the current game
  public updateCurrentGameStatus(status: GameStatus, multiplier: number, crashPoint?: number) {
    this.state.currentRound.status = status;
    this.state.currentRound.currentMultiplier = multiplier;
    if (crashPoint !== undefined) {
      this.state.currentRound.crashPoint = crashPoint;
    }
    this.persist();
  }

  // Immediately advance to next round on the server across all phones
  public forceAdvanceNextSignal(): AviatorRoundInfo {
    // Notify server immediately
    api.aviator.forceNextRound().then(res => {
      if (res.success && res.state) {
        this.state = {
          currentRound: res.state.currentRound,
          nextRound: res.state.nextRound,
          upcomingQueue: res.state.upcomingQueue,
          history: res.state.history,
          adminOverrideActive: res.state.adminOverrideActive,
          serverTime: res.state.serverTime
        };
        this.persist();
      }
    }).catch(() => {});

    // Optimistically advance locally
    return this.advanceToNextRound();
  }

  // Called when a round finishes and the next round begins
  public advanceToNextRound(): AviatorRoundInfo {
    const finishedCrash = this.state.currentRound.crashPoint || this.state.nextRound.crashPoint;
    this.state.history.unshift(finishedCrash);
    if (this.state.history.length > 30) {
      this.state.history.pop();
    }

    const currentRoundInfo = this.state.nextRound;
    this.state.currentRound = {
      roundId: currentRoundInfo.roundId,
      roundNumber: currentRoundInfo.roundNumber,
      status: 'waiting',
      currentMultiplier: 1.0,
      crashPoint: currentRoundInfo.crashPoint,
      speedMultiplier: currentRoundInfo.speedMultiplier,
      startedAt: Date.now(),
      intermissionCountdown: 5.0
    };

    if (this.state.upcomingQueue.length > 0) {
      this.state.nextRound = this.state.upcomingQueue.shift()!;
    } else {
      const nextNum = currentRoundInfo.roundNumber + 1;
      this.state.nextRound = generateRandomRound(nextNum, 1.0);
    }

    const lastQueuedNum =
      this.state.upcomingQueue.length > 0
        ? this.state.upcomingQueue[this.state.upcomingQueue.length - 1].roundNumber
        : this.state.nextRound.roundNumber;

    while (this.state.upcomingQueue.length < 8) {
      const addNum = lastQueuedNum + (this.state.upcomingQueue.length + 1);
      this.state.upcomingQueue.push(generateRandomRound(addNum, 1.0));
    }

    this.state.adminOverrideActive = false;
    this.persist();
    return currentRoundInfo;
  }

  // Admin Override: Force/Pre-set the Next Game Crash Multiplier and/or Fly Speed across ALL phones!
  public overrideNextRound(params: {
    crashPoint: number;
    speedMultiplier?: number;
  }) {
    const speed = params.speedMultiplier ?? this.state.nextRound.speedMultiplier ?? 1.0;
    const crashPoint = parseFloat(params.crashPoint.toFixed(2));
    const duration = calculateFlightDuration(crashPoint, speed);
    const climbRate = parseFloat(((crashPoint - 1.0) / Math.max(0.5, duration)).toFixed(2));
    const sign = determineGameSign(crashPoint);

    let speedProfile: SpeedProfile = 'NORMAL';
    let speedLabel = 'Standard Climb (1.0x)';
    if (speed < 0.85) {
      speedProfile = 'GLIDER';
      speedLabel = 'Slow Glider (0.7x)';
    } else if (speed > 1.7) {
      speedProfile = 'SUPERSONIC';
      speedLabel = 'Supersonic Ascent (2.0x)';
    } else if (speed > 1.2) {
      speedProfile = 'FAST_TURBO';
      speedLabel = 'Fast Turbo (1.5x)';
    }

    // Optimistically update local view
    this.state.nextRound = {
      ...this.state.nextRound,
      crashPoint,
      speedMultiplier: speed,
      estimatedDurationSec: duration,
      climbRatePerSec: climbRate,
      speedProfile,
      speedLabel,
      sign,
      isOverridden: true
    };
    this.state.adminOverrideActive = true;
    this.persist();

    // Propagate to server so ALL other phones receive this EXACT same signal instantly!
    api.aviator.overrideNextRound(crashPoint, speed).catch(() => {});
  }

  public setNextFlightSpeed(speed: number) {
    this.overrideNextRound({
      crashPoint: this.state.nextRound.crashPoint,
      speedMultiplier: speed
    });
  }

  public resetNatural() {
    this.state.adminOverrideActive = false;
    api.aviator.resetNatural().then(res => {
      if (res.success && res.state) {
        this.state = res.state;
        this.persist();
      }
    }).catch(() => {});
  }

  public resetToNaturalAlgorithm() {
    this.resetNatural();
  }
}

export const aviatorEngine = new AviatorEngineService();
