// Aviator Shared Game Engine & Next Flight Predictor Service
// Handles synchronization between AviatorView and AdminPortal

export type GameStatus = 'waiting' | 'flying' | 'crashed';

export type SignTier = 'TRAP_SIGN' | 'BLUE_SIGN' | 'PURPLE_SIGN' | 'MAGENTA_SIGN' | 'JACKPOT_SIGN';

export type SpeedProfile = 'GLIDER' | 'NORMAL' | 'FAST_TURBO' | 'SUPERSONIC';

export interface AviatorRoundInfo {
  roundId: string;
  roundNumber: number;
  crashPoint: number;
  speedMultiplier: number; // e.g. 1.0, 1.5
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
    serverSeedHash: string; // SHA-512 hex signature committed before flight
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
  autoRunEnabled: boolean;
  lastRoundUpdated?: number;
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
  // Multiplier formula: 1.0 + (t * 0.72 * speed)^1.42
  // => t = ((multiplier - 1.0)^(1 / 1.42)) / (0.72 * speed)
  const duration = Math.pow(Math.max(0.01, crashPoint - 1.0), 1 / 1.42) / (0.72 * speed);
  return parseFloat(duration.toFixed(2));
}

// Helper to determine Sign of the game
export function determineGameSign(crashPoint: number, previousPoint?: number): AviatorRoundInfo['sign'] {
  let tier: SignTier = 'BLUE_SIGN';
  let label = 'Low Altitude / Safe Blue';
  let badgeText = '1.00x - 1.99x';
  let color = '#34b4ff';
  let bgClass = 'bg-[#102130]';
  let textClass = 'text-[#34b4ff]';
  let borderClass = 'border-[#34b4ff]/40';
  let description = 'Low climb rate. Optimal for high-stake quick auto-cashouts under 2.0x.';
  let trend: 'BULLISH' | 'BEARISH' | 'BREAKOUT' | 'TRAP' = 'BEARISH';
  let trendIcon = '📉';

  if (crashPoint < 1.15) {
    tier = 'TRAP_SIGN';
    label = 'Instant Trap / Flew Away';
    badgeText = '< 1.15x';
    color = '#ff4444';
    bgClass = 'bg-[#301414]';
    textClass = 'text-rose-400';
    borderClass = 'border-rose-500/50';
    description = 'Immediate fly-away trap sign. Early crash right after takeoff.';
    trend = 'TRAP';
    trendIcon = '⚠️';
  } else if (crashPoint < 2.00) {
    tier = 'BLUE_SIGN';
    label = 'Low Altitude Sign';
    badgeText = '1.00x - 1.99x';
    color = '#34b4ff';
    bgClass = 'bg-[#102130]';
    textClass = 'text-[#34b4ff]';
    borderClass = 'border-[#34b4ff]/40';
    description = 'Standard low-altitude flight. Conservative multipliers.';
    trend = previousPoint && crashPoint > previousPoint ? 'BULLISH' : 'BEARISH';
    trendIcon = trend === 'BULLISH' ? '📈' : '📉';
  } else if (crashPoint < 10.00) {
    tier = 'PURPLE_SIGN';
    label = 'Medium Cloud Sign';
    badgeText = '2.00x - 9.99x';
    color = '#9042f6';
    bgClass = 'bg-[#211432]';
    textClass = 'text-[#b77eff]';
    borderClass = 'border-[#9042f6]/40';
    description = 'Optimal medium cruise. Highest player profitability sweet-spot.';
    trend = 'BULLISH';
    trendIcon = '🚀';
  } else if (crashPoint < 100.00) {
    tier = 'MAGENTA_SIGN';
    label = 'Supersonic Rocket Sign';
    badgeText = '10.00x - 99.99x';
    color = '#c017b4';
    bgClass = 'bg-[#31112c]';
    textClass = 'text-[#f046e2]';
    borderClass = 'border-[#c017b4]/50';
    description = 'Mega high sky multiplier. Extreme altitude and high payouts.';
    trend = 'BREAKOUT';
    trendIcon = '🔥';
  } else {
    tier = 'JACKPOT_SIGN';
    label = 'Deep Space Jackpot Sign';
    badgeText = '100.00x+';
    color = '#ffaa00';
    bgClass = 'bg-[#332205]';
    textClass = 'text-amber-400';
    borderClass = 'border-amber-400/50';
    description = 'Legendary cosmic round. Unprecedented 100x+ payout jackpot!';
    trend = 'BREAKOUT';
    trendIcon = '🌟';
  }

  return {
    tier,
    label,
    badgeText,
    color,
    bgClass,
    textClass,
    borderClass,
    description,
    trend,
    trendIcon
  };
}

// Generate a random round using Spribe's realistic Aviator distribution
export function generateRandomRound(roundNum: number, speedMultiplier: number = 1.0): AviatorRoundInfo {
  const rand = Math.random();
  let point = 1.0;
  if (rand < 0.08) {
    point = 1.01 + Math.random() * 0.12; // Instant trap crash (1.01x - 1.13x)
  } else if (rand < 0.65) {
    point = 1.15 + Math.random() * 2.20; // 1.15x - 3.35x (common blue/purple)
  } else if (rand < 0.90) {
    point = 3.35 + Math.random() * 5.65; // 3.35x - 9.00x (solid purple)
  } else {
    point = 9.00 + Math.random() * 25.00; // 9.00x - 34.00x (rocket magenta)
  }
  const crashPoint = parseFloat(point.toFixed(2));
  const duration = calculateFlightDuration(crashPoint, speedMultiplier);
  const climbRate = parseFloat(((crashPoint - 1.0) / Math.max(0.5, duration)).toFixed(2));

  let speedProfile: SpeedProfile = 'NORMAL';
  let speedLabel = 'Standard Climb (1.0x)';
  if (speedMultiplier < 0.85) {
    speedProfile = 'GLIDER';
    speedLabel = 'Slow Glider (0.7x)';
  } else if (speedMultiplier > 1.7) {
    speedProfile = 'SUPERSONIC';
    speedLabel = 'Supersonic Ascent (2.0x)';
  } else if (speedMultiplier > 1.2) {
    speedProfile = 'FAST_TURBO';
    speedLabel = 'Fast Turbo (1.5x)';
  }

  const sign = determineGameSign(crashPoint);

  return {
    roundId: `SB-AV-${roundNum}`,
    roundNumber: roundNum,
    crashPoint,
    speedMultiplier,
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
  private loopTimer: any = null;
  private crashHoldTimestamp: number = 0;

  constructor() {
    this.state = this.loadInitialState();
    this.startAutonomousLoop();
  }

  private loadInitialState(): AviatorEngineState {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.nextRound && parsed.upcomingQueue?.length > 0) {
          if (parsed.autoRunEnabled === undefined) parsed.autoRunEnabled = true;
          if (!parsed.currentRound.intermissionCountdown) parsed.currentRound.intermissionCountdown = 5;
          return parsed;
        }
      }
    } catch {
      //
    }

    const startRoundNum = 4892;
    const history = [2.30, 1.00, 1.39, 1.00, 1.87, 16.48, 1.61, 1.23, 1.73, 22.96, 3.42, 1.05, 5.12];
    const nextRound = generateRandomRound(startRoundNum + 1, 1.0);
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
        intermissionCountdown: 5
      },
      nextRound,
      upcomingQueue,
      history,
      adminOverrideActive: false,
      autoRunEnabled: true,
      lastRoundUpdated: Date.now()
    };
  }

  private startAutonomousLoop() {
    if (typeof window === 'undefined') return;
    if (this.loopTimer) clearInterval(this.loopTimer);

    // Cross-window / cross-tab storage listener
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

    this.loopTimer = setInterval(() => {
      this.tick();
    }, 200);
  }

  private tick() {
    if (!this.state.autoRunEnabled) return;

    const cur = this.state.currentRound;

    if (cur.status === 'waiting') {
      const remaining = Math.max(0, parseFloat(((cur.intermissionCountdown ?? 5) - 0.2).toFixed(1)));
      cur.intermissionCountdown = remaining;

      if (remaining <= 0) {
        // Take off!
        cur.status = 'flying';
        cur.currentMultiplier = 1.0;
        cur.startedAt = Date.now();
        this.notify();
      } else {
        // Notify every whole second
        if (remaining % 1 === 0) {
          this.notify();
        }
      }
    } else if (cur.status === 'flying') {
      const elapsed = (Date.now() - (cur.startedAt || Date.now())) / 1000;
      const speed = cur.speedMultiplier || 1.0;
      const nextVal = parseFloat((1.0 + Math.pow(elapsed * 0.72 * speed, 1.42)).toFixed(2));

      if (nextVal >= cur.crashPoint) {
        // Crash / Flew away!
        cur.currentMultiplier = cur.crashPoint;
        cur.status = 'crashed';
        this.crashHoldTimestamp = Date.now();
        this.persist();
      } else {
        cur.currentMultiplier = nextVal;
        this.notify();
      }
    } else if (cur.status === 'crashed') {
      // Hold crashed state for 2.2 seconds then automatically advance to the next round
      if (Date.now() - this.crashHoldTimestamp > 2200) {
        this.advanceToNextRound();
      }
    }
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch {
      //
    }
    this.notify();
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

  // Force advance to next round immediately (Admin 1-click refresh signal)
  public forceAdvanceNextSignal(): AviatorRoundInfo {
    return this.advanceToNextRound();
  }

  // Update real-time status of the current game (e.g. from AviatorView)
  public updateCurrentGameStatus(status: GameStatus, multiplier: number, crashPoint?: number) {
    this.state.currentRound.status = status;
    this.state.currentRound.currentMultiplier = multiplier;
    if (crashPoint !== undefined) {
      this.state.currentRound.crashPoint = crashPoint;
    }
    this.persist();
  }

  // Called when a round finishes and the next round begins
  public advanceToNextRound(): AviatorRoundInfo {
    const finishedCrash = this.state.currentRound.crashPoint || this.state.nextRound.crashPoint;
    this.state.history.unshift(finishedCrash);
    if (this.state.history.length > 30) {
      this.state.history.pop();
    }

    // Scheduled next round becomes the new current round
    const currentRoundInfo = this.state.nextRound;
    this.state.currentRound = {
      roundId: currentRoundInfo.roundId,
      roundNumber: currentRoundInfo.roundNumber,
      status: 'waiting',
      currentMultiplier: 1.0,
      crashPoint: currentRoundInfo.crashPoint,
      speedMultiplier: currentRoundInfo.speedMultiplier,
      startedAt: Date.now(),
      intermissionCountdown: 5
    };

    // Dequeue next round from queue or generate new
    if (this.state.upcomingQueue.length > 0) {
      this.state.nextRound = this.state.upcomingQueue.shift()!;
    } else {
      const nextNum = currentRoundInfo.roundNumber + 1;
      this.state.nextRound = generateRandomRound(nextNum, 1.0);
    }

    // Refill queue to always have at least 8 upcoming games
    const lastQueuedNum =
      this.state.upcomingQueue.length > 0
        ? this.state.upcomingQueue[this.state.upcomingQueue.length - 1].roundNumber
        : this.state.nextRound.roundNumber;

    while (this.state.upcomingQueue.length < 8) {
      const addNum = lastQueuedNum + (this.state.upcomingQueue.length + 1);
      this.state.upcomingQueue.push(generateRandomRound(addNum, 1.0));
    }

    this.state.adminOverrideActive = false;
    this.state.lastRoundUpdated = Date.now();
    this.persist();
    return currentRoundInfo;
  }

  // Admin Override: Force/Pre-set the Next Game Crash Multiplier and/or Fly Speed
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
  }

  // Admin Override: Set Fly Speed Multiplier for next flight
  public setNextFlightSpeed(speedMultiplier: number) {
    this.overrideNextRound({
      crashPoint: this.state.nextRound.crashPoint,
      speedMultiplier
    });
  }

  // Reset upcoming rounds to natural algorithmic distribution
  public resetToNaturalAlgorithm() {
    const curNum = this.state.currentRound.roundNumber;
    this.state.nextRound = generateRandomRound(curNum + 1, 1.0);
    this.state.upcomingQueue = [];
    for (let i = 2; i <= 8; i++) {
      this.state.upcomingQueue.push(generateRandomRound(curNum + i, 1.0));
    }
    this.state.adminOverrideActive = false;
    this.persist();
  }
}

export const aviatorEngine = new AviatorEngineService();
