import { Router, Request, Response } from 'express';
import { BetModel } from '../models/BetModel';
import { UserModel } from '../models/UserModel';
import { TransactionModel } from '../models/TransactionModel';
import { db } from '../db';
import {
  connectToDatabase,
  isDbConnected,
  getMongoStatus,
  setCustomMongoUri,
  seedDefaultDatabase
} from '../mongodb';
import { resolveWinningPredictionDetails } from '../../utils/predictionHelper';
import { BetSelection } from '../../types';
import { serverAviatorEngine } from '../aviatorServerEngine';

export const adminRouter = Router();

// Middleware: ensure MongoDB is connected before running any admin command
adminRouter.use(async (req, res, next) => {
  try {
    await connectToDatabase();
  } catch (err) {
    //
  }
  next();
});

// 1. GET /api/admin/status - MongoDB cluster status & statistics
adminRouter.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await getMongoStatus();
    return res.json({ success: true, ...status });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST /api/admin/mongodb-uri - Switch/connect to custom MongoDB URI
adminRouter.post('/mongodb-uri', async (req: Request, res: Response) => {
  try {
    const { uri } = req.body;
    if (!uri || typeof uri !== 'string') {
      return res.status(400).json({ success: false, error: 'Valid MongoDB URI string is required' });
    }

    setCustomMongoUri(uri);
    await connectToDatabase();
    const status = await getMongoStatus();

    return res.json({
      success: true,
      message: 'MongoDB URI updated and database connected successfully!',
      status
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. GET /api/admin/bets - Fetch all bets directly from MongoDB
adminRouter.get('/bets', async (req: Request, res: Response) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    const bets = await BetModel.find().sort({ createdAt: -1 });
    return res.json({
      success: true,
      count: bets.length,
      bets
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. DELETE /api/admin/bets/:id - Delete a bet directly from MongoDB
adminRouter.delete('/bets/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ success: false, error: 'Bet ID or Ticket ID required' });
    }

    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    // Direct deletion from MongoDB
    const result = await BetModel.deleteOne({
      $or: [{ id }, { ticketId: id }]
    });

    // Also clean from memory cache if present
    for (const [phone, list] of db.openBets.entries()) {
      db.openBets.set(phone, list.filter(b => b.id !== id && b.ticketId !== id));
    }
    for (const [phone, list] of db.betHistory.entries()) {
      db.betHistory.set(phone, list.filter(b => b.id !== id && b.ticketId !== id));
    }

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, error: `Bet ${id} not found in MongoDB` });
    }

    console.log(`[MongoDB Admin] Bet ${id} deleted directly from MongoDB.`);
    return res.json({
      success: true,
      message: `Bet ${id} permanently deleted from MongoDB database!`,
      deletedId: id
    });
  } catch (err: any) {
    console.error('[Admin Delete Bet Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. POST /api/admin/bets/mark-green - Mark all bets or specific bet green in MongoDB
adminRouter.post('/bets/mark-green', async (req: Request, res: Response) => {
  try {
    const { betId } = req.body;
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    const query = betId && betId !== 'all' ? { $or: [{ id: betId }, { ticketId: betId }] } : {};
    const bets = await BetModel.find(query);

    for (const bet of bets) {
      const updatedSelections = bet.selections.map((sel: BetSelection) => {
        const details = resolveWinningPredictionDetails(sel);
        return {
          ...sel,
          isWon: true,
          predictionStatus: 'won',
          ftScore: details.ftScore,
          outcome: details.outcome,
          gameDate: details.gameDate
        };
      });

      bet.isAllGreen = true;
      bet.selections = updatedSelections as any;
      await bet.save();
    }

    console.log(`[MongoDB Admin] Marked ${bets.length} bet(s) GREEN in MongoDB.`);
    return res.json({
      success: true,
      message: `Marked ${bets.length} bet slip(s) GREEN in MongoDB!`,
      updatedCount: bets.length
    });
  } catch (err: any) {
    console.error('[Admin Mark Green Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. POST /api/admin/bets/settle-won - Settle bet(s) as won and credit user balance in MongoDB
adminRouter.post('/bets/settle-won', async (req: Request, res: Response) => {
  try {
    const { betId } = req.body;
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    const query = betId && betId !== 'all'
      ? { $or: [{ id: betId }, { ticketId: betId }], status: 'open' }
      : { status: 'open' };

    const betsToSettle = await BetModel.find(query);
    let totalPayout = 0;

    for (const bet of betsToSettle) {
      const updatedSelections = bet.selections.map((sel: BetSelection) => {
        const details = resolveWinningPredictionDetails(sel);
        return {
          ...sel,
          isWon: true,
          predictionStatus: 'won',
          ftScore: details.ftScore,
          outcome: details.outcome,
          gameDate: details.gameDate
        };
      });

      bet.status = 'won';
      bet.isAllGreen = true;
      bet.cashoutAvailable = false;
      bet.settledAt = new Date().toISOString();
      bet.winningsPaid = true;
      bet.selections = updatedSelections as any;
      await bet.save();

      totalPayout += bet.potentialWin;

      // Log transaction in MongoDB
      await TransactionModel.create({
        id: `tx-won-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        transactionId: `TX-WON-${Math.floor(100000000 + Math.random() * 900000000)}`,
        userPhone: bet.userPhone || '20******5',
        type: 'bet_won',
        amount: bet.potentialWin,
        currency: 'GHS',
        reference: bet.ticketId,
        status: 'completed',
        date: new Date().toISOString(),
        description: `Winnings for Ticket ${bet.ticketId}`
      });
    }

    // Credit user's wallet in MongoDB directly
    let newBalance = 5000.00;
    const userDoc = await UserModel.findOne({ phone: '20******5' });
    if (userDoc) {
      userDoc.balance = parseFloat((userDoc.balance + totalPayout).toFixed(2));
      await userDoc.save();
      newBalance = userDoc.balance;
    }

    console.log(`[MongoDB Admin] Settled ${betsToSettle.length} bets as WON in MongoDB. Credited GHS ${totalPayout.toFixed(2)}.`);
    return res.json({
      success: true,
      message: `Settled ${betsToSettle.length} bet(s) as WON! GHS ${totalPayout.toFixed(2)} credited in MongoDB.`,
      settledCount: betsToSettle.length,
      creditedAmount: totalPayout,
      newBalance
    });
  } catch (err: any) {
    console.error('[Admin Settle Won Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7. POST /api/admin/bets/reset - Reset bets in MongoDB to initial open state
adminRouter.post('/bets/reset', async (req: Request, res: Response) => {
  try {
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    await BetModel.deleteMany({});
    await seedDefaultDatabase();

    const bets = await BetModel.find().sort({ createdAt: -1 });
    console.log('[MongoDB Admin] Reset all bets to initial state in MongoDB.');

    return res.json({
      success: true,
      message: 'All bets reset in MongoDB database to standard live/pending state!',
      bets
    });
  } catch (err: any) {
    console.error('[Admin Reset Bets Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 8. POST /api/admin/wallet/balance - Adjust or set user balance in MongoDB directly
adminRouter.post('/wallet/balance', async (req: Request, res: Response) => {
  try {
    const { balance, addAmount } = req.body;
    if (!isDbConnected()) {
      return res.status(503).json({ success: false, error: 'MongoDB is not connected' });
    }

    let userDoc = await UserModel.findOne({ phone: '20******5' });
    if (!userDoc) {
      userDoc = await UserModel.findOne();
    }
    if (!userDoc) {
      userDoc = await UserModel.create({
        phone: '20******5',
        firstName: 'Nana',
        lastName: 'Kojo',
        balance: 5000.00,
        currency: 'GHS'
      });
    }

    if (balance !== undefined) {
      userDoc.balance = parseFloat(parseFloat(balance).toFixed(2));
    } else if (addAmount !== undefined) {
      userDoc.balance = parseFloat((userDoc.balance + parseFloat(addAmount)).toFixed(2));
    }

    await userDoc.save();
    console.log(`[MongoDB Admin] User balance updated in MongoDB to GHS ${userDoc.balance.toFixed(2)}.`);

    return res.json({
      success: true,
      message: `Balance updated in MongoDB to GHS ${userDoc.balance.toFixed(2)}!`,
      balance: userDoc.balance
    });
  } catch (err: any) {
    console.error('[Admin Update Balance Error]', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 9. GET /api/admin/aviator/state - Master authoritative engine state (Synced to all phones)
adminRouter.get('/aviator/state', (req: Request, res: Response) => {
  const state = serverAviatorEngine.getState();
  return res.json({
    success: true,
    ...state
  });
});

// 9b. GET /api/admin/aviator/next-round - Backward-compatibility endpoint
adminRouter.get('/aviator/next-round', (req: Request, res: Response) => {
  const state = serverAviatorEngine.getState();
  return res.json({
    success: true,
    roundId: state.nextRound.roundId,
    crashPoint: state.nextRound.crashPoint,
    speedMultiplier: state.nextRound.speedMultiplier,
    estimatedDurationSec: state.nextRound.estimatedDurationSec,
    signTier: state.nextRound.sign.tier,
    isOverridden: state.adminOverrideActive,
    updatedAt: new Date(state.serverTime).toISOString()
  });
});

// 10. POST /api/admin/aviator/override - Force next Aviator fly speed and crash multiplier across all phones
adminRouter.post('/aviator/override', (req: Request, res: Response) => {
  const { crashPoint, speedMultiplier } = req.body;
  const numCrash = crashPoint !== undefined ? parseFloat(crashPoint) : undefined;
  const numSpeed = speedMultiplier !== undefined ? parseFloat(speedMultiplier) : undefined;

  const updated = serverAviatorEngine.overrideNextRound({
    crashPoint: !isNaN(numCrash as number) ? numCrash : undefined,
    speedMultiplier: !isNaN(numSpeed as number) ? numSpeed : undefined
  });

  console.log(`[Aviator Master Engine] Next round ${updated.roundId} rigged to ${updated.crashPoint}x at ${updated.speedMultiplier}x speed across all devices.`);

  return res.json({
    success: true,
    message: `Next Aviator flight set to ${updated.crashPoint}x (${updated.speedMultiplier}x speed) on all phones!`,
    nextRound: updated,
    state: serverAviatorEngine.getState()
  });
});

// 11. POST /api/admin/aviator/force-next - Force advance to next round immediately across all phones
adminRouter.post('/aviator/force-next', (req: Request, res: Response) => {
  const advanced = serverAviatorEngine.advanceToNextRound();
  return res.json({
    success: true,
    message: `Advanced to round ${advanced.roundId} across all connected devices!`,
    currentRound: advanced,
    state: serverAviatorEngine.getState()
  });
});

// 12. POST /api/admin/aviator/reset - Reset to algorithmic natural Aviator outcome across all phones
adminRouter.post('/aviator/reset', (req: Request, res: Response) => {
  serverAviatorEngine.resetNatural();
  return res.json({
    success: true,
    message: 'Reset Aviator engine to natural RNG distribution on all phones.',
    state: serverAviatorEngine.getState()
  });
});

