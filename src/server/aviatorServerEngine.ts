// Server-Side Master Authoritative Aviator Engine
// Runs on the Node.js backend. Single Source of Truth for ALL devices/phones.

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

export interface AviatorServerState {
  currentRound: {
    roundId: string;
    roundNumber: number;
    status: GameStatus;
    currentMultiplier: number;
    crashPoint: number;
    speedMultiplier: number;
    startedAt: number;
    intermissionCountdown: number;
  };
  nextRound: AviatorRoundInfo;
  upcomingQueue: AviatorRoundInfo[];
  history: number[];
  adminOverrideActive: boolean;
  autoRunEnabled: boolean;
  serverTime: number;
}

function generateMockSha512(): string {
  const chars = '0123456789abcdef';
  let hash = '';
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

export function calculateFlightDuration(crashPoint: number, speedMultiplier: number = 1.0): number {
  if (crashPoint <= 1.0) return 0.1;
  const speed = Math.max(0.2, speedMultiplier);
  const duration = Math.pow(Math.max(0.01, crashPoint - 1.0), 1 / 1.42) / (0.72 * speed);
  return parseFloat(duration.toFixed(2));
}

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

export function generateRoundPlan(roundNumber: number, previousCrash?: number, targetCrash?: number, speedMult: number = 1.0): AviatorRoundInfo {
  let crashPoint = targetCrash;
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

  const sign = determineGameSign(finalCrash, previousCrash);
  const serverSeed = generateMockSha512();
  const serverSeedHash = generateMockSha512();

  return {
    roundId: `SB-AV-${roundNumber}`,
    roundNumber,
    crashPoint: finalCrash,
    speedMultiplier: speedMult,
    estimatedDurationSec: duration,
    climbRatePerSec: climbRate,
    speedProfile,
    speedLabel,
    sign,
    provablyFair: {
      serverSeed,
      serverSeedHash,
      clientSeed: 'sportybet-client-seed-ghana-master',
      nonce: roundNumber
    },
    isOverridden: !!targetCrash
  };
}

class ServerAviatorEngine {
  private state: AviatorServerState;
  private loopInterval: NodeJS.Timeout | null = null;
  private crashHoldTimer: number = 0;

  constructor() {
    const initialRoundNumber = 4893;
    const nextRound = generateRoundPlan(initialRoundNumber + 1, 2.45, 2.75, 1.0);
    const queue: AviatorRoundInfo[] = [];
    let prev = nextRound.crashPoint;
    for (let i = 2; i <= 8; i++) {
      const qRound = generateRoundPlan(initialRoundNumber + i, prev);
      queue.push(qRound);
      prev = qRound.crashPoint;
    }

    this.state = {
      currentRound: {
        roundId: `SB-AV-${initialRoundNumber}`,
        roundNumber: initialRoundNumber,
        status: 'waiting',
        currentMultiplier: 1.0,
        crashPoint: 2.45,
        speedMultiplier: 1.0,
        startedAt: Date.now(),
        intermissionCountdown: 5.0
      },
      nextRound,
      upcomingQueue: queue,
      history: [2.30, 1.00, 1.39, 1.00, 1.87, 16.48, 1.61, 1.23, 1.73, 22.96, 3.42, 1.05, 5.12],
      adminOverrideActive: false,
      autoRunEnabled: true,
      serverTime: Date.now()
    };

    this.startLoop();
  }

  private startLoop() {
    if (this.loopInterval) clearInterval(this.loopInterval);
    this.loopInterval = setInterval(() => {
      this.tick();
    }, 200);
  }

  private tick() {
    this.state.serverTime = Date.now();
    if (!this.state.autoRunEnabled) return;

    const cur = this.state.currentRound;

    if (cur.status === 'waiting') {
      const nextRemaining = Math.max(0, parseFloat((cur.intermissionCountdown - 0.2).toFixed(1)));
      cur.intermissionCountdown = nextRemaining;

      if (nextRemaining <= 0) {
        // Plane Takeoff!
        cur.status = 'flying';
        cur.currentMultiplier = 1.0;
        cur.startedAt = Date.now();
      }
    } else if (cur.status === 'flying') {
      const elapsed = (Date.now() - cur.startedAt) / 1000;
      const speed = cur.speedMultiplier || 1.0;
      // Exponential curve: 1.0 + (elapsed * 0.72 * speed)^1.42
      const nextVal = parseFloat((1.0 + Math.pow(elapsed * 0.72 * speed, 1.42)).toFixed(2));

      if (nextVal >= cur.crashPoint) {
        // Crash / Flew Away!
        cur.currentMultiplier = cur.crashPoint;
        cur.status = 'crashed';
        this.crashHoldTimer = Date.now();
      } else {
        cur.currentMultiplier = nextVal;
      }
    } else if (cur.status === 'crashed') {
      // Hold crashed screen for 2.4 seconds then advance to next round
      if (Date.now() - this.crashHoldTimer >= 2400) {
        this.advanceToNextRound();
      }
    }
  }

  public advanceToNextRound(): AviatorRoundInfo {
    const finishedCrash = this.state.currentRound.crashPoint || this.state.nextRound.crashPoint;
    this.state.history.unshift(finishedCrash);
    if (this.state.history.length > 30) {
      this.state.history.pop();
    }

    const scheduled = this.state.nextRound;
    this.state.currentRound = {
      roundId: scheduled.roundId,
      roundNumber: scheduled.roundNumber,
      status: 'waiting',
      currentMultiplier: 1.0,
      crashPoint: scheduled.crashPoint,
      speedMultiplier: scheduled.speedMultiplier,
      startedAt: Date.now(),
      intermissionCountdown: 5.0
    };

    // Promote first item from queue
    let newNext: AviatorRoundInfo;
    if (this.state.upcomingQueue.length > 0) {
      newNext = this.state.upcomingQueue.shift()!;
    } else {
      newNext = generateRoundPlan(scheduled.roundNumber + 1, scheduled.crashPoint);
    }
    this.state.nextRound = newNext;

    // Maintain 8 rounds in upcoming queue
    while (this.state.upcomingQueue.length < 8) {
      const lastRoundNumber = this.state.upcomingQueue.length > 0
        ? this.state.upcomingQueue[this.state.upcomingQueue.length - 1].roundNumber
        : newNext.roundNumber;
      const lastCrash = this.state.upcomingQueue.length > 0
        ? this.state.upcomingQueue[this.state.upcomingQueue.length - 1].crashPoint
        : newNext.crashPoint;
      this.state.upcomingQueue.push(generateRoundPlan(lastRoundNumber + 1, lastCrash));
    }

    this.state.adminOverrideActive = false;
    return scheduled;
  }

  public overrideNextRound(params: { crashPoint?: number; speedMultiplier?: number }): AviatorRoundInfo {
    const currentNext = this.state.nextRound;
    const finalCrash = params.crashPoint ?? currentNext.crashPoint;
    const finalSpeed = params.speedMultiplier ?? currentNext.speedMultiplier;

    const updated = generateRoundPlan(
      currentNext.roundNumber,
      this.state.currentRound.crashPoint,
      finalCrash,
      finalSpeed
    );
    updated.isOverridden = true;
    this.state.nextRound = updated;
    this.state.adminOverrideActive = true;
    return updated;
  }

  public resetNatural(): void {
    const currentNext = this.state.nextRound;
    const natural = generateRoundPlan(
      currentNext.roundNumber,
      this.state.currentRound.crashPoint,
      undefined,
      1.0
    );
    this.state.nextRound = natural;
    this.state.adminOverrideActive = false;
  }

  public getState(): AviatorServerState {
    this.state.serverTime = Date.now();
    return this.state;
  }
}

export const serverAviatorEngine = new ServerAviatorEngine();
