// Aviator Shared Game Engine & Next Flight Predictor Service
// Universal Clock & Deterministic Algorithm: Guarantees 100% IDENTICAL speed signals,
// flight multipliers, and crash points on ALL connected phones and devices!

import { api } from './api';
import {
  GameStatus,
  SignTier,
  SpeedProfile,
  AviatorRoundInfo,
  AviatorEngineState,
  AVIATOR_EPOCH_START,
  AVIATOR_ROUND_CYCLE_MS,
  getDeterministicRandom,
  generateDeterministicHash,
  calculateFlightDuration,
  determineGameSign,
  generateDeterministicRoundPlan,
  calculateStateAtTime
} from '../utils/aviatorShared';

export type { GameStatus, SignTier, SpeedProfile, AviatorRoundInfo, AviatorEngineState };

export {
  AVIATOR_EPOCH_START,
  AVIATOR_ROUND_CYCLE_MS,
  getDeterministicRandom,
  generateDeterministicHash,
  calculateFlightDuration,
  determineGameSign,
  generateDeterministicRoundPlan,
  calculateStateAtTime
};

const STORAGE_KEY = 'sportybet_aviator_engine_state';
const OVERRIDES_STORAGE_KEY = 'sportybet_aviator_overrides';

class AviatorEngineService {
  private state: AviatorEngineState;
  private overrides: Record<number, { crashPoint: number; speedMultiplier?: number }> = {};
  private clockOffset: number = 0; // Milliseconds difference between client clock and authoritative server clock
  private listeners: Set<(state: AviatorEngineState) => void> = new Set();
  private loopTimer: any = null;
  private syncTimer: any = null;
  private isSyncingWithServer: boolean = false;

  constructor() {
    this.overrides = this.loadInitialOverrides();
    this.state = calculateStateAtTime(this.getNow(), this.overrides);
    this.startEngineLoop();
    this.startServerSync();
  }

  private getNow(): number {
    return Date.now() + this.clockOffset;
  }

  private loadInitialOverrides(): Record<number, { crashPoint: number; speedMultiplier?: number }> {
    if (typeof window === 'undefined') return {};
    try {
      const saved = localStorage.getItem(OVERRIDES_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved) || {};
      }
    } catch {
      //
    }
    return {};
  }

  private persistOverrides() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(OVERRIDES_STORAGE_KEY, JSON.stringify(this.overrides));
    } catch {
      //
    }
  }

  // Smooth, high-frame-rate local tick (80ms): updates current multiplier smoothly
  private startEngineLoop() {
    if (this.loopTimer) clearInterval(this.loopTimer);
    this.loopTimer = setInterval(() => {
      this.tick();
    }, 80);
  }

  private tick() {
    const updatedState = calculateStateAtTime(this.getNow(), this.overrides);
    this.state = updatedState;
    this.notify();
  }

  // Authoritative server polling (every 1.5s): keeps clock aligned & syncs multi-device overrides
  private startServerSync() {
    if (typeof window === 'undefined') return;

    this.fetchServerState();

    if (this.syncTimer) clearInterval(this.syncTimer);
    this.syncTimer = setInterval(() => {
      this.fetchServerState();
    }, 1500);

    // Cross-tab sync via storage events
    window.addEventListener('storage', (e) => {
      if (e.key === OVERRIDES_STORAGE_KEY && e.newValue) {
        try {
          this.overrides = JSON.parse(e.newValue) || {};
          this.tick();
        } catch {
          //
        }
      }
    });
  }

  public async fetchServerState() {
    if (this.isSyncingWithServer) return;
    this.isSyncingWithServer = true;

    const requestStart = Date.now();
    try {
      const res = await api.aviator.getState();
      const roundTripMs = Date.now() - requestStart;

      if (res && res.success && res.serverTime) {
        // Calculate latency-compensated clock offset
        const estimatedServerNow = res.serverTime + Math.round(roundTripMs / 2);
        this.clockOffset = estimatedServerNow - Date.now();

        // Merge any server-side overrides
        if (res.overrides && typeof res.overrides === 'object') {
          this.overrides = { ...this.overrides, ...res.overrides };
          this.persistOverrides();
        }

        this.tick();
      }
    } catch {
      // If server unreachable, universal deterministic clock continues seamlessly
    } finally {
      this.isSyncingWithServer = false;
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

  public setAutoRun(_enabled: boolean) {
    // Continuous time-based autorun
  }

  // Real-time status query
  public updateCurrentGameStatus(_status: GameStatus, _multiplier: number, _crashPoint?: number) {
    // Maintained by universal clock
  }

  // Used by Admin buttons to generate/advance to next signal
  public forceAdvanceNextSignal(): AviatorRoundInfo {
    const nextRound = this.state.nextRound;
    // Tell server to advance
    api.aviator.forceNextRound().catch(() => {});
    return nextRound;
  }

  public advanceToNextRound(): AviatorRoundInfo {
    return this.state.nextRound;
  }

  // Admin Override: Force/Pre-set the Next Game Crash Multiplier and/or Fly Speed across ALL phones!
  public overrideNextRound(params: {
    roundNumber?: number;
    crashPoint: number;
    speedMultiplier?: number;
  }) {
    const now = this.getNow();
    const currentRoundNum = Math.floor((now - AVIATOR_EPOCH_START) / AVIATOR_ROUND_CYCLE_MS);
    const elapsedSec = ((now - AVIATOR_EPOCH_START) % AVIATOR_ROUND_CYCLE_MS) / 1000;
    const targetRoundNum = params.roundNumber ?? (elapsedSec < 5.0 ? currentRoundNum : currentRoundNum + 1);

    const crashPoint = parseFloat(params.crashPoint.toFixed(2));
    const speed = params.speedMultiplier;

    this.overrides[targetRoundNum] = {
      crashPoint,
      speedMultiplier: speed
    };
    this.persistOverrides();
    this.tick();

    // Propagate to server so ALL other phones receive this EXACT same signal instantly!
    api.aviator.overrideNextRound(crashPoint, speed).then(res => {
      if (res && res.success && res.state) {
        if (res.state.overrides) {
          this.overrides = { ...this.overrides, ...res.state.overrides };
          this.persistOverrides();
          this.tick();
        }
      }
    }).catch(() => {});
  }

  public setNextFlightSpeed(speed: number) {
    this.overrideNextRound({
      crashPoint: this.state.nextRound.crashPoint,
      speedMultiplier: speed
    });
  }

  public resetNatural() {
    this.overrides = {};
    this.persistOverrides();
    this.tick();

    api.aviator.resetNatural().then(() => {
      this.fetchServerState();
    }).catch(() => {});
  }

  public resetToNaturalAlgorithm() {
    this.resetNatural();
  }
}

export const aviatorEngine = new AviatorEngineService();
