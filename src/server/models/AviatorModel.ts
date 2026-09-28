import mongoose, { Schema, Document } from 'mongoose';

export interface IAviatorState extends Document {
  stateId: string; // 'global_aviator_state'
  currentRound: {
    roundId: string;
    roundNumber: number;
    status: 'waiting' | 'flying' | 'crashed';
    currentMultiplier: number;
    crashPoint: number;
    speedMultiplier: number;
    startedAt: number;
    intermissionCountdown: number;
  };
  nextRound: {
    roundId: string;
    roundNumber: number;
    crashPoint: number;
    speedMultiplier: number;
    estimatedDurationSec: number;
    climbRatePerSec: number;
    speedProfile: string;
    speedLabel: string;
    sign: {
      tier: string;
      label: string;
      badgeText: string;
      color: string;
      bgClass: string;
      textClass: string;
      borderClass: string;
      description: string;
      trend: string;
      trendIcon: string;
    };
    provablyFair: {
      serverSeed: string;
      serverSeedHash: string;
      clientSeed: string;
      nonce: number;
    };
    isOverridden?: boolean;
  };
  upcomingQueue: any[];
  history: number[];
  adminOverrideActive: boolean;
  autoRunEnabled: boolean;
  overrides?: Record<number, any>;
  lastUpdatedAt: number;
}

const AviatorStateSchema = new Schema<IAviatorState>(
  {
    stateId: { type: String, required: true, unique: true, default: 'global_aviator_state' },
    currentRound: {
      roundId: { type: String, default: 'SB-AV-4893' },
      roundNumber: { type: Number, default: 4893 },
      status: { type: String, default: 'waiting' },
      currentMultiplier: { type: Number, default: 1.0 },
      crashPoint: { type: Number, default: 2.45 },
      speedMultiplier: { type: Number, default: 1.0 },
      startedAt: { type: Number, default: () => Date.now() },
      intermissionCountdown: { type: Number, default: 5.0 }
    },
    nextRound: { type: Schema.Types.Mixed, required: true },
    upcomingQueue: { type: Schema.Types.Mixed, default: [] },
    history: { type: [Number], default: [] },
    adminOverrideActive: { type: Boolean, default: false },
    autoRunEnabled: { type: Boolean, default: true },
    overrides: { type: Schema.Types.Mixed, default: {} },
    lastUpdatedAt: { type: Number, default: () => Date.now() }
  },
  { timestamps: true }
);

export const AviatorStateModel =
  mongoose.models.AviatorState || mongoose.model<IAviatorState>('AviatorState', AviatorStateSchema);
