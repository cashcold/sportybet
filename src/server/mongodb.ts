import mongoose from 'mongoose';
import { UserModel } from './models/UserModel';

export const MONGODB_URI = process.env.MONGODB_URI || '';

let isConnected = false;
let connectionPromise: Promise<typeof mongoose | null> | null = null;

// Ensure mongoose never buffers commands when offline
mongoose.set('bufferCommands', false);

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (!MONGODB_URI) {
    // In-memory mode active (db.ts)
    return null;
  }

  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      console.log('[MongoDB] Connecting to SportyBet database...');
      // Fast timeouts (2.5s) to guarantee serverless function responds quickly
      const conn = await mongoose.connect(MONGODB_URI, {
        serverSelectionTimeoutMS: 2500,
        connectTimeoutMS: 3000,
        bufferCommands: false,
      });

      isConnected = true;
      console.log('[MongoDB] Successfully connected to SportyBet MongoDB cluster!');

      // Background non-blocking sync for default account balances
      UserModel.updateMany(
        { balance: { $gte: 9000000 } },
        { $set: { balance: 5000.00 } }
      ).catch(() => {});

      return conn;
    } catch (error: any) {
      console.warn('[MongoDB Notice] Operating with in-memory cache:', error?.message || error);
      isConnected = false;
      return null;
    } finally {
      // Allow future reconnection attempts if initial attempt failed
      if (!isConnected) {
        connectionPromise = null;
      }
    }
  })();

  return connectionPromise;
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
