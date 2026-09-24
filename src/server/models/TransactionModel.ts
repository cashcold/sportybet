import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  id: string;
  transactionId: string;
  userPhone: string;
  type: 'deposit' | 'withdrawal' | 'bet_placed' | 'bet_won' | 'cashout';
  amount: number;
  currency: string;
  reference: string;
  provider?: string;
  accountNumber?: string;
  status: 'completed' | 'pending' | 'failed';
  date: string;
  description: string;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    id: { type: String, required: true, unique: true },
    transactionId: { type: String, required: true, unique: true, index: true },
    userPhone: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: ['deposit', 'withdrawal', 'bet_placed', 'bet_won', 'cashout'],
      required: true
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'GHC' },
    reference: { type: String },
    provider: { type: String },
    accountNumber: { type: String },
    status: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed'
    },
    date: { type: String },
    description: { type: String }
  },
  { timestamps: true }
);

export const TransactionModel =
  mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);
