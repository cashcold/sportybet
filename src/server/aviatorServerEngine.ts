// Server-Side Master Authoritative Aviator Engine
// Runs on Node.js & MongoDB. Single Source of Truth for ALL devices and phones globally.

import { AviatorStateModel } from './models/AviatorModel';
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

export type { GameStatus, SignTier, SpeedProfile, AviatorRoundInfo };
export type AviatorServerState = AviatorEngineState;

export {
  getDeterministicRandom,
  generateDeterministicHash,
  calculateFlightDuration,
  determineGameSign,
  generateDeterministicRoundPlan,
  calculateStateAtTime
};

class ServerAviatorEngine {
  private overrides: Record<number, { crashPoint: number; speedMultiplier?: number }> = {};
  private isSavingToMongo: boolean = false;

  constructor() {
    this.initFromMongo();
  }

  private async initFromMongo() {
    try {
      const doc = await AviatorStateModel.findOne({ stateId: 'global_aviator_state' });
      if (doc && (doc as any).overrides) {
        this.overrides = (doc as any).overrides || {};
        console.log('[Aviator Server Engine] Loaded active overrides from MongoDB:', Object.keys(this.overrides).length);
      }
    } catch {
      // MongoDB might not be connected yet
    }
  }

  private async persistOverridesToMongo() {
    if (this.isSavingToMongo) return;
    this.isSavingToMongo = true;
    try {
      const currentState = this.getState();
      await AviatorStateModel.findOneAndUpdate(
        { stateId: 'global_aviator_state' },
        {
          stateId: 'global_aviator_state',
          currentRound: currentState.currentRound,
          nextRound: currentState.nextRound,
          upcomingQueue: currentState.upcomingQueue,
          history: currentState.history,
          adminOverrideActive: currentState.adminOverrideActive,
          autoRunEnabled: true,
          overrides: this.overrides,
          lastUpdatedAt: Date.now()
        },
        { upsert: true, new: true }
      );
    } catch (err) {
      console.warn('[Aviator Server Engine] Failed to persist overrides to MongoDB:', err);
    } finally {
      this.isSavingToMongo = false;
    }
  }

  /**
   * Returns authoritative global state calculated at current server millisecond.
   * Identical across every single phone, tablet, and server.
   */
  public getState(): AviatorServerState {
    const now = Date.now();
    // Clean up stale overrides older than 2 hours
    const currentRoundNum = Math.floor((now - AVIATOR_EPOCH_START) / AVIATOR_ROUND_CYCLE_MS);
    for (const roundKey of Object.keys(this.overrides)) {
      const rNum = Number(roundKey);
      if (rNum < currentRoundNum - 100) {
        delete this.overrides[rNum];
      }
    }

    return calculateStateAtTime(now, this.overrides);
  }

  public getNextRound(): AviatorRoundInfo {
    return this.getState().nextRound;
  }

  /**
   * Force/Rig Next Flight or specific round multiplier across all phones!
   */
  public overrideNextRound(params: {
    roundNumber?: number;
    crashPoint?: number;
    speedMultiplier?: number;
  }): AviatorRoundInfo {
    const now = Date.now();
    const currentRoundNum = Math.floor((now - AVIATOR_EPOCH_START) / AVIATOR_ROUND_CYCLE_MS);
    const elapsedSec = ((now - AVIATOR_EPOCH_START) % AVIATOR_ROUND_CYCLE_MS) / 1000;

    // If currently in waiting phase (first 5 seconds), target current round, otherwise next round
    const targetRoundNum = params.roundNumber ?? (elapsedSec < 5.0 ? currentRoundNum : currentRoundNum + 1);

    const targetCrash = params.crashPoint !== undefined ? parseFloat(params.crashPoint.toFixed(2)) : 5.00;
    const targetSpeed = params.speedMultiplier !== undefined ? parseFloat(params.speedMultiplier.toFixed(2)) : undefined;

    this.overrides[targetRoundNum] = {
      crashPoint: targetCrash,
      speedMultiplier: targetSpeed
    };

    console.log(`[Aviator Master Engine] Round ${targetRoundNum} locked to ${targetCrash}x across ALL connected phones.`);

    this.persistOverridesToMongo();

    const plan = generateDeterministicRoundPlan(
      targetRoundNum,
      undefined,
      targetCrash,
      targetSpeed,
      this.overrides
    );
    return plan;
  }

  public advanceToNextRound(): AviatorRoundInfo {
    // In universal epoch time, rounds naturally advance continuously with time.
    // Calling advanceToNextRound returns the next round plan
    return this.getState().nextRound;
  }

  public resetNatural(): void {
    this.overrides = {};
    this.persistOverridesToMongo();
    console.log('[Aviator Server Engine] Reset all overrides to natural universal algorithm on all phones.');
  }
}

export const serverAviatorEngine = new ServerAviatorEngine();
