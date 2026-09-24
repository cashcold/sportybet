import mongoose from 'mongoose';

export const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://capital:mangement12345@capgainco.o3hgd.mongodb.net/SportyBet?retryWrites=true&w=majority&appName=Capgainco';

let isConnected = false;
let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase(): Promise<typeof mongoose | null> {
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (connectionPromise) {
    return connectionPromise;
  }

  try {
    console.log('[MongoDB] Connecting to SportyBet database...');
    connectionPromise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
    });

    const conn = await connectionPromise;
    isConnected = true;
    console.log('[MongoDB] Successfully connected to SportyBet MongoDB cluster!');

    // Ensure all accounts default to GHC 5000.00 as requested
    try {
      const { UserModel } = await import('./models/UserModel');
      await UserModel.updateMany(
        { balance: { $gte: 9000000 } },
        { $set: { balance: 5000.00 } }
      );
      await UserModel.updateOne(
        { phone: '20******5' },
        { $set: { balance: 5000.00 } }
      );
    } catch (syncErr) {
      console.error('[MongoDB balance sync error]', syncErr);
    }

    return conn;
  } catch (error) {
    console.error('[MongoDB] Connection error:', error);
    connectionPromise = null;
    isConnected = false;
    return null;
  }
}

export function isDbConnected(): boolean {
  return isConnected && mongoose.connection.readyState === 1;
}
