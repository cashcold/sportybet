import mongoose, { Schema, Document } from 'mongoose';
import { Match } from '../../types';

export interface IMatchDoc extends Document {
  id: string;
  gameId: string;
  sport: string;
  sportKey?: string;
  league: string;
  countryOrCategory: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  period?: string;
  minute?: string;
  isLive: boolean;
  startTime: string;
  commenceTime?: Date;
  isHot?: boolean;
  hasLiveStream?: boolean;
  marketsCount: number;
  markets: Record<string, any>;
  source: string;
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema = new Schema<IMatchDoc>(
  {
    id: { type: String, required: true, unique: true, index: true },
    gameId: { type: String, required: true, index: true },
    sport: { type: String, required: true, index: true },
    sportKey: { type: String, index: true },
    league: { type: String, required: true, index: true },
    countryOrCategory: { type: String, default: 'International' },
    homeTeam: { type: String, required: true, index: true },
    awayTeam: { type: String, required: true, index: true },
    homeScore: { type: Number },
    awayScore: { type: Number },
    period: { type: String },
    minute: { type: String },
    isLive: { type: Boolean, default: false, index: true },
    startTime: { type: String, required: true },
    commenceTime: { type: Date, index: true },
    isHot: { type: Boolean, default: false },
    hasLiveStream: { type: Boolean, default: false },
    marketsCount: { type: Number, default: 45 },
    markets: { type: Schema.Types.Mixed, required: true },
    source: { type: String, default: 'the_odds_api', index: true },
    lastSyncedAt: { type: Date, default: Date.now, index: true }
  },
  {
    timestamps: true
  }
);

// Compound index for quick querying by sport & live state
MatchSchema.index({ sport: 1, isLive: 1, commenceTime: 1 });

export const MatchModel = mongoose.models.Match || mongoose.model<IMatchDoc>('Match', MatchSchema);
