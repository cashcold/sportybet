import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  phone: string;
  password?: string;
  username: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  location: string;
  email: string;
  isEmailVerified: boolean;
  avatarUrl: string;
  balance: number;
  currency: string;
  loyaltyTier: string;
  loyaltyProgress: number;
  dailyStreak: number;
  unreadNotifications: number;
  isLoggedIn: boolean;
  sessionTokens: string[];
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, unique: true, index: true },
    password: { type: String },
    username: { type: String, default: '' },
    firstName: { type: String, default: 'CHARLES' },
    lastName: { type: String, default: 'ASUMAH' },
    dateOfBirth: { type: String, default: '15/05/1998' },
    location: { type: String, default: 'Ghana' },
    email: { type: String, default: '' },
    isEmailVerified: { type: Boolean, default: false },
    avatarUrl: { type: String, default: '/user_beach_avatar.jpg' },
    balance: { type: Number, default: 5000.00 },
    currency: { type: String, default: 'GHC' },
    loyaltyTier: { type: String, default: 'Tier 1' },
    loyaltyProgress: { type: Number, default: 96 },
    dailyStreak: { type: Number, default: 5 },
    unreadNotifications: { type: Number, default: 1 },
    isLoggedIn: { type: Boolean, default: true },
    sessionTokens: [{ type: String }]
  },
  { timestamps: true }
);

export const UserModel = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
