import mongoose, { Schema, Document } from 'mongoose';
import { BetSelection } from '../../types';

export interface IBookingCode extends Document {
  code: string;
  userPhone?: string;
  ticketId?: string;
  transactionId?: string;
  totalOdds: number;
  selectionsCount: number;
  selections: BetSelection[];
  expiresAt: Date;
  createdAt: Date;
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

const BookingCodeSchema = new Schema<IBookingCode>(
  {
    code: { type: String, required: true, unique: true, index: true, uppercase: true },
    userPhone: { type: String },
    ticketId: { type: String },
    transactionId: { type: String },
    totalOdds: { type: Number, required: true },
    selectionsCount: { type: Number, default: 0 },
    selections: [SelectionSubSchema],
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

export const BookingCodeModel =
  mongoose.models.BookingCode || mongoose.model<IBookingCode>('BookingCode', BookingCodeSchema);
