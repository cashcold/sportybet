// Universal Authoritative Aviator Engine & Deterministic Synchronization Core
// Synchronizes Round ID, Multipliers, Flight Speed, and Speed Signals across ALL phones and devices.

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
    startedAt: number;
    intermissionCountdown: number;
  };
  nextRound: AviatorRoundInfo;
  upcomingQueue: AviatorRoundInfo[];
  history: number[];
  adminOverrideActive: boolean;
  autoRunEnabled: boolean;
  serverTime: number;
  overrides?: Record<number, { crashPoint: number; speedMultiplier?: number }>;
}

// Fixed universal epoch timestamp: exactly aligns all phone clocks and servers
export const AVIATOR_EPOCH_START = 1790520000000;
export const AVIATOR_ROUND_CYCLE_MS = 18000; // 18.0 seconds total per round
export const AVIATOR_WAITING_DURATION_MS = 5000; // 5.0 seconds intermission countdown
export const AVIATOR_MAX_FLIGHT_WINDOW_MS = 10500; // 10.5 seconds max flight window
export const AVIATOR_CRASH_HOLD_MS = 2500; // 2.5 seconds crashed hold screen

/**
 * Universal Deterministic PRNG based on seed.
 * Guarantees every phone, server, and client calculates the EXACT SAME numbers for any round!
 */
export function getDeterministicRandom(seed: number): number {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function generateDeterministicHash(roundNumber: number): string {
  let hex = '';
  for (let i = 0; i < 64; i++) {
    const val = Math.floor(getDeterministicRandom(roundNumber * 100 + i) * 16);
    hex += val.toString(16);
  }
  return hex;
}

/**
 * Dynamically scales speed multiplier for mega/supersonic flights so that any crash target
 * (even 100x or 500x) smoothly climbs to its target within the 10.5-second flight window.
 */
export function getRequiredSpeedForCrash(crashPoint: number): number {
  if (crashPoint <= 1.0) return 1.0;
  const rawDur = Math.pow(Math.max(0.01, crashPoint - 1.0), 1 / 1.42) / 0.72;
  if (rawDur <= 10.5) return 1.0;
  return parseFloat(Math.max(1.0, rawDur / 10.5).toFixed(2));
}

/**
 * Helper to calculate flight duration from crash multiplier and speed
 */
export function calculateFlightDuration(crashPoint: number, speedMultiplier: number = 1.0): number {
  if (crashPoint <= 1.0) return 0.1;
  const speed = Math.max(0.2, speedMultiplier);
  const duration = Math.pow(Math.max(0.01, crashPoint - 1.0), 1 / 1.42) / (0.72 * speed);
  return parseFloat(Math.min(10.5, duration).toFixed(2));
}

/**
 * Helper to determine Sign of the game
 */
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

/**
 * Generates round plan deterministically from roundNumber.
 * Same roundNumber = IDENTICAL crashPoint, duration, sign across ALL phones!
 */
export function generateDeterministicRoundPlan(
  roundNumber: number,
  previousCrash?: number,
  targetCrash?: number,
  speedMult?: number,
  overrideMap: Record<number, { crashPoint: number; speedMultiplier?: number }> = {}
): AviatorRoundInfo {
  let crashPoint = targetCrash;
  let finalSpeed = speedMult;
  let isOverridden = !!targetCrash;

  // Check overrideMap if not passed directly
  if (!crashPoint && overrideMap[roundNumber]) {
    crashPoint = overrideMap[roundNumber].crashPoint;
    finalSpeed = overrideMap[roundNumber].speedMultiplier;
    isOverridden = true;
  }

  // Algorithmic deterministic outcome if not overridden
  if (!crashPoint) {
    const rand = getDeterministicRandom(roundNumber);
    const rand2 = getDeterministicRandom(roundNumber * 3 + 7);
    if (rand < 0.08) {
      crashPoint = 1.01 + rand2 * 0.12;
    } else if (rand < 0.65) {
      crashPoint = 1.15 + rand2 * 2.20;
    } else if (rand < 0.88) {
      crashPoint = 3.35 + rand2 * 5.65;
    } else {
      crashPoint = 9.00 + rand2 * 25.00;
    }
  }

  const finalCrash = parseFloat(crashPoint.toFixed(2));
  if (!finalSpeed) {
    finalSpeed = getRequiredSpeedForCrash(finalCrash);
  }

  const duration = calculateFlightDuration(finalCrash, finalSpeed);
  const climbRate = parseFloat((0.48 * finalSpeed).toFixed(2));

  let speedProfile: SpeedProfile = 'NORMAL';
  let speedLabel = '1.0x Standard Climb Rate';
  if (finalSpeed < 0.85) {
    speedProfile = 'GLIDER';
    speedLabel = '0.7x Slow Glider (Extended Flight)';
  } else if (finalSpeed > 1.7) {
    speedProfile = 'SUPERSONIC';
    speedLabel = `${finalSpeed.toFixed(1)}x Supersonic (Hyper-Fast Climb)`;
  } else if (finalSpeed > 1.2) {
    speedProfile = 'FAST_TURBO';
    speedLabel = `${finalSpeed.toFixed(1)}x Fast Turbo Climb`;
  }

  const sign = determineGameSign(finalCrash, previousCrash);
  const serverSeed = `srv_seed_${generateDeterministicHash(roundNumber).slice(0, 32)}`;
  const serverSeedHash = generateDeterministicHash(roundNumber);

  return {
    roundId: `SB-AV-${roundNumber}`,
    roundNumber,
    crashPoint: finalCrash,
    speedMultiplier: finalSpeed,
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
    isOverridden
  };
}

/**
 * Given any universal millisecond timestamp, computes the exact authoritative state.
 * Any two devices calling this with the same timestamp will receive IDENTICAL state,
 * identical multiplier, identical round number, and identical next flight predictions!
 */
export function calculateStateAtTime(
  timestampMs: number,
  overrideMap: Record<number, { crashPoint: number; speedMultiplier?: number }> = {}
): AviatorEngineState {
  const roundNumber = Math.floor((timestampMs - AVIATOR_EPOCH_START) / AVIATOR_ROUND_CYCLE_MS);
  const elapsedMs = (timestampMs - AVIATOR_EPOCH_START) % AVIATOR_ROUND_CYCLE_MS;
  const elapsedSec = elapsedMs / 1000;

  const currentPlan = generateDeterministicRoundPlan(roundNumber, undefined, undefined, undefined, overrideMap);
  const nextPlan = generateDeterministicRoundPlan(roundNumber + 1, currentPlan.crashPoint, undefined, undefined, overrideMap);

  let status: GameStatus = 'waiting';
  let currentMultiplier = 1.0;
  let intermissionCountdown = 0;

  if (elapsedSec < 5.0) {
    status = 'waiting';
    intermissionCountdown = Math.max(0.1, parseFloat((5.0 - elapsedSec).toFixed(1)));
    currentMultiplier = 1.0;
  } else {
    const flightElapsedSec = elapsedSec - 5.0;
    const flightDuration = currentPlan.estimatedDurationSec;

    if (flightElapsedSec < flightDuration) {
      status = 'flying';
      const calcMult = 1.0 + Math.pow(flightElapsedSec * 0.72 * currentPlan.speedMultiplier, 1.42);
      currentMultiplier = parseFloat(Math.min(currentPlan.crashPoint, calcMult).toFixed(2));
    } else {
      status = 'crashed';
      currentMultiplier = currentPlan.crashPoint;
    }
  }

  // Upcoming queue: next 8 rounds
  const upcomingQueue: AviatorRoundInfo[] = [];
  let prevCrash = nextPlan.crashPoint;
  for (let i = 2; i <= 9; i++) {
    const qRound = generateDeterministicRoundPlan(roundNumber + i, prevCrash, undefined, undefined, overrideMap);
    upcomingQueue.push(qRound);
    prevCrash = qRound.crashPoint;
  }

  // Settled history: last 20 rounds
  const history: number[] = [];
  for (let i = 1; i <= 20; i++) {
    const histPlan = generateDeterministicRoundPlan(roundNumber - i, undefined, undefined, undefined, overrideMap);
    history.push(histPlan.crashPoint);
  }

  return {
    currentRound: {
      roundId: currentPlan.roundId,
      roundNumber: currentPlan.roundNumber,
      status,
      currentMultiplier,
      crashPoint: currentPlan.crashPoint,
      speedMultiplier: currentPlan.speedMultiplier,
      startedAt: timestampMs - elapsedMs + 5000,
      intermissionCountdown
    },
    nextRound: nextPlan,
    upcomingQueue,
    history,
    adminOverrideActive: !!currentPlan.isOverridden || !!nextPlan.isOverridden,
    autoRunEnabled: true,
    serverTime: timestampMs,
    overrides: overrideMap
  };
}
