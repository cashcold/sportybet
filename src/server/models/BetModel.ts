import mongoose, { Schema, Document } from 'mongoose';
import { BetSelection } from '../../types';

export interface IBet extends Document {
  id: string;
  ticketId: string;
  transactionId: string;
  userPhone: string;
  type: string;
  date: string;
  isLive: boolean;
  selections: BetSelection[];
  stake: number;
  totalOdds: number;
  potentialWin: number;
  status: 'open' | 'won' | 'lost' | 'cashed_out';
  cashoutAvailable: boolean;
  cashoutAmount: number;
  bookingCode?: string;
  canRebet: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SelectionSubSchema = new Schema(
  {
    matchId: { type: String, required: true },
    gameId: { type: String },
    matchTitle: { type: String, required: true },
    marketName: { type: String, required: true },
    selectionName: { type: String, required: true },
    odd: { type: Number, required: true },
    isLive: { type: Boolean, default: false }
  },
  { _id: false }
);

const BetSchema = new Schema<IBet>(
  {
    id: { type: String, required: true, unique: true, index: true },
    ticketId: { type: String, required: true, unique: true, index: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    userPhone: { type: String, required: true, index: true },
    type: { type: String, default: 'Single' },
    date: { type: String },
    isLive: { type: Boolean, default: false },
    selections: [SelectionSubSchema],
    stake: { type: Number, required: true },
    totalOdds: { type: Number, required: true },
    potentialWin: { type: Number, required: true },
    status: {
      type: String,
      enum: ['open', 'won', 'lost', 'cashed_out'],
      default: 'open'
    },
    cashoutAvailable: { type: Boolean, default: true },
    cashoutAmount: { type: Number, default: 0 },
    bookingCode: { type: String, index: true },
    canRebet: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export const BetModel = mongoose.models.Bet || mongoose.model<IBet>('Bet', BetSchema);
