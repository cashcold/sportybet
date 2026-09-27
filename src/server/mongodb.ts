import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { UserModel } from './models/UserModel';
import { BetModel } from './models/BetModel';
import { INITIAL_OPEN_BETS, INITIAL_BET_HISTORY, INITIAL_USER } from '../data/mockData';

let customMongoUri: string = '';
let memoryServerInstance: MongoMemoryServer | null = null;
let isConnected = false;
let connectionPromise: Promise<typeof mongoose | null> | null = null;

export function getMongoUri(): string {
  return customMongoUri || process.env.MONGODB_URI || '';
}

export function setCustomMongoUri(uri: string) {
  customMongoUri = uri.trim();
  isConnected = false;
  connectionPromise = null;
}

export async function seedDefaultDatabase() {
  try {
    // 1. Seed User if not exists
    const userCount = await UserModel.countDocuments();
    if (userCount === 0) {
      await UserModel.create({
        phone: INITIAL_USER.phone || '20******5',
        firstName: INITIAL_USER.firstName || 'Nana',
        lastName: INITIAL_USER.lastName || 'Kojo',
        balance: INITIAL_USER.balance || 5000.00,
        currency: INITIAL_USER.currency || 'GHS',
        loyaltyTier: INITIAL_USER.loyaltyTier || 'Gold VIP',
        loyaltyProgress: INITIAL_USER.loyaltyProgress || 65,
        sessionTokens: ['default_session_token_sportybet']
      });
      console.log('[MongoDB Seed] Initial User created in MongoDB.');
    }

    // 2. Seed Bets if not exists
    const betCount = await BetModel.countDocuments();
    if (betCount === 0) {
      const allInitialBets = [...INITIAL_OPEN_BETS, ...INITIAL_BET_HISTORY];
      for (const b of allInitialBets) {
        await BetModel.create({
          id: b.id,
          ticketId: b.ticketId,
          transactionId: b.transactionId || `TX-GH-${Math.floor(100000000 + Math.random() * 900000000)}`,
          userPhone: '20******5',
          type: b.type,
          date: b.date,
          isLive: b.isLive,
          selections: b.selections,
          stake: b.stake,
          totalOdds: b.totalOdds,
          potentialWin: b.potentialWin,
          status: b.status,
          cashoutAvailable: b.cashoutAvailable,
          cashoutAmount: b.cashoutAmount || b.stake * 0.9,
          bookingCode: b.bookingCode || 'BD9812',
          canRebet: b.canRebet ?? true,
          isAllGreen: b.isAllGreen || false
        });
      }
      console.log(`[MongoDB Seed] ${allInitialBets.length} Initial Bet Slips created in MongoDB.`);
    }
  } catch (err: any) {
    console.warn('[MongoDB Seed Notice]', err?.message || err);
  }
}

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  connectionPromise = (async () => {
    try {
      let targetUri = getMongoUri();

      // If no external MONGODB_URI is provided, launch real embedded MongoDB server
      if (!targetUri) {
        if (!memoryServerInstance) {
          console.log('[MongoDB] Starting dedicated MongoDB database engine...');
          memoryServerInstance = await MongoMemoryServer.create({
            instance: {
              dbName: 'sportybet_ghana'
            }
          });
        }
        targetUri = memoryServerInstance.getUri();
        console.log('[MongoDB Engine] Local MongoDB Server active at:', targetUri);
      } else {
        console.log('[MongoDB] Connecting to external MongoDB Cluster at:', targetUri.replace(/\/\/.*@/, '//***:***@'));
      }

      const conn = await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 10000,
        connectTimeoutMS: 10000,
      });

      isConnected = true;
      console.log('[MongoDB] Connected successfully to SportyBet MongoDB database!');

      // Populate MongoDB with initial data if database is brand new
      await seedDefaultDatabase();

      return conn;
    } catch (error: any) {
      console.error('[MongoDB Connection Error]:', error?.message || error);
      isConnected = false;
      return null;
    } finally {
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

export async function getMongoStatus() {
  const connected = isDbConnected();
  let betsCount = 0;
  let openCount = 0;
  let settledCount = 0;
  let userCount = 0;

  if (connected) {
    try {
      betsCount = await BetModel.countDocuments();
      openCount = await BetModel.countDocuments({ status: 'open' });
      settledCount = await BetModel.countDocuments({ status: { $ne: 'open' } });
      userCount = await UserModel.countDocuments();
    } catch {
      //
    }
  }

  return {
    connected,
    uri: getMongoUri() ? getMongoUri().replace(/\/\/.*@/, '//***:***@') : (memoryServerInstance ? 'Embedded MongoDB Engine (Localhost)' : 'Disconnected'),
    isEmbedded: !getMongoUri(),
    databaseName: mongoose.connection.name || 'sportybet_ghana',
    stats: {
      totalBets: betsCount,
      openBets: openCount,
      settledBets: settledCount,
      users: userCount
    }
  };
}
