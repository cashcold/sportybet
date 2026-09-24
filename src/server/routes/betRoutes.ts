import { Router, Request, Response } from 'express';
import { db, WalletTransaction } from '../db';
import { PlacedBet, BetSelection } from '../../types';
import { BetModel } from '../models/BetModel';
import { BookingCodeModel } from '../models/BookingCodeModel';
import { TransactionModel } from '../models/TransactionModel';
import { UserModel } from '../models/UserModel';
import { connectToDatabase, isDbConnected } from '../mongodb';

export const betRouter = Router();

// Helper to generate SportyBet booking code (6 alphanumeric characters)
function generateBookingCode(): string {
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Helper to generate a random transaction ID
function generateRandomTransactionId(): string {
  const randomDigits = Math.floor(100000000 + Math.random() * 900000000);
  return `TX-GH-${randomDigits}`;
}

// Helper to generate SportyBet Ticket ID
function generateTicketId(): string {
  const randomDigits = Math.floor(10000000 + Math.random() * 90000000);
  return `B-GH-${randomDigits}`;
}

// POST /api/bets/place
betRouter.post('/place', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const authHeader = req.headers.authorization;
    const cleanToken = authHeader ? authHeader.replace('Bearer ', '').trim() : '';

    let userDoc: any = null;
    let userPhone = '20******5';

    if (isDbConnected()) {
      if (cleanToken) {
        userDoc = await UserModel.findOne({ sessionTokens: cleanToken });
      }
      if (!userDoc) {
        const cachedPhone = db.userSessions.get(cleanToken);
        if (cachedPhone) userDoc = await UserModel.findOne({ phone: cachedPhone });
      }
      if (!userDoc) {
        userDoc = await UserModel.findOne({ phone: '20******5' });
      }
      if (userDoc) {
        userPhone = userDoc.phone;
      }
    }

    const cachedUser = db.getUserByToken(authHeader);
    const balance = userDoc ? userDoc.balance : (cachedUser ? cachedUser.balance : 5000.00);
    const currency = userDoc ? userDoc.currency : (cachedUser ? cachedUser.currency : 'GHC');

    const { selections, stake } = req.body;
    const numStake = parseFloat(stake);

    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ success: false, error: 'At least one selection is required' });
    }

    if (isNaN(numStake) || numStake < 1.0) {
      return res.status(400).json({ success: false, error: 'Minimum stake is GHC 1.00' });
    }

    if (numStake > balance) {
      return res.status(400).json({
        success: false,
        error: `Insufficient balance. Available: ${currency} ${balance.toFixed(2)}`
      });
    }

    // Calculate total odds
    let totalOdds = 1.0;
    selections.forEach((s: BetSelection) => {
      totalOdds *= s.odd;
    });
    totalOdds = parseFloat(totalOdds.toFixed(2));

    // Multibet bonus: +5% per selection after 3 selections
    let bonusMultiplier = 1.0;
    if (selections.length >= 3) {
      bonusMultiplier += (selections.length - 2) * 0.05;
    }
    const potentialWin = parseFloat((numStake * totalOdds * bonusMultiplier).toFixed(2));

    // Generate unique SportyBet Ticket ID, random transaction ID, and booking code
    const ticketId = generateTicketId();
    const transactionId = generateRandomTransactionId();
    const bookingCode = generateBookingCode();
    const betId = `bet-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newBalance = parseFloat((balance - numStake).toFixed(2));

    // Deduct user balance in MongoDB
    if (isDbConnected() && userDoc) {
      userDoc.balance = newBalance;
      await userDoc.save();
    }
    if (cachedUser) {
      cachedUser.balance = newBalance;
    }

    const newBet: PlacedBet = {
      id: betId,
      ticketId,
      transactionId,
      bookingCode,
      type: selections.length > 1 ? 'Multiple' : 'Single',
      date:
        new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) +
        ' ' +
        new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
      isLive: selections.some((s: BetSelection) => s.isLive),
      selections,
      stake: numStake,
      totalOdds,
      potentialWin,
      status: 'open',
      cashoutAvailable: true,
      cashoutAmount: parseFloat((numStake * 0.95).toFixed(2)),
      canRebet: true
    };

    // Save bet in MongoDB
    if (isDbConnected()) {
      await BetModel.create({
        id: betId,
        ticketId,
        transactionId,
        bookingCode,
        userPhone,
        type: newBet.type,
        date: newBet.date,
        isLive: newBet.isLive,
        selections: newBet.selections,
        stake: newBet.stake,
        totalOdds: newBet.totalOdds,
        potentialWin: newBet.potentialWin,
        status: 'open',
        cashoutAvailable: true,
        cashoutAmount: newBet.cashoutAmount,
        canRebet: true
      });

      // Save Booking Code in MongoDB so friend can load it
      await BookingCodeModel.create({
        code: bookingCode,
        userPhone,
        ticketId,
        transactionId,
        totalOdds,
        selectionsCount: selections.length,
        selections,
        expiresAt: new Date(Date.now() + 86400000 * 7) // 7 days validity
      });

      // Save transaction with random transaction ID in MongoDB
      await TransactionModel.create({
        id: `tx-${Date.now()}`,
        transactionId,
        userPhone,
        type: 'bet_placed',
        amount: numStake,
        currency,
        reference: ticketId,
        status: 'completed',
        date: new Date().toISOString(),
        description: `${newBet.type} Bet (${selections.length} selections)`
      });
    }

    // Save in memory cache
    const openBets = db.openBets.get(userPhone) || [];
    openBets.unshift(newBet);
    db.openBets.set(userPhone, openBets);

    db.bookingCodes.set(bookingCode, {
      code: bookingCode,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 86400000 * 7).toISOString(),
      selections,
      totalOdds
    });

    const newTx: WalletTransaction = {
      id: `tx-${Date.now()}`,
      type: 'bet_placed',
      amount: numStake,
      currency,
      reference: ticketId,
      status: 'completed',
      date: new Date().toISOString(),
      description: `${newBet.type} Bet (${selections.length} selections)`
    };
    const txs = db.transactions.get(userPhone) || [];
    txs.unshift(newTx);
    db.transactions.set(userPhone, txs);

    return res.json({
      success: true,
      message: 'Bet placed successfully!',
      ticketId,
      transactionId,
      bookingCode,
      bet: newBet,
      remainingBalance: newBalance
    });
  } catch (err: any) {
    console.error('[Place Bet Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Error placing bet' });
  }
});

// GET /api/bets/open
betRouter.get('/open', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const authHeader = req.headers.authorization;
    const cleanToken = authHeader ? authHeader.replace('Bearer ', '').trim() : '';

    let userPhone = '20******5';
    if (isDbConnected()) {
      if (cleanToken) {
        const u = await UserModel.findOne({ sessionTokens: cleanToken });
        if (u) userPhone = u.phone;
      }
    } else {
      const cached = db.getUserByToken(authHeader);
      if (cached && cached.phone) userPhone = cached.phone;
    }

    let bets: PlacedBet[] = [];

    if (isDbConnected()) {
      const mongoBets = await BetModel.find({ userPhone, status: 'open' }).sort({ createdAt: -1 });
      if (mongoBets.length > 0) {
        bets = mongoBets.map((doc: any) => ({
          id: doc.id,
          ticketId: doc.ticketId,
          transactionId: doc.transactionId,
          bookingCode: doc.bookingCode,
          type: doc.type,
          date: doc.date,
          isLive: doc.isLive,
          selections: doc.selections,
          stake: doc.stake,
          totalOdds: doc.totalOdds,
          potentialWin: doc.potentialWin,
          status: doc.status,
          cashoutAvailable: doc.cashoutAvailable,
          cashoutAmount: doc.cashoutAmount,
          canRebet: doc.canRebet
        }));
      }
    }

    if (bets.length === 0) {
      bets = db.openBets.get(userPhone) || [];
    }

    return res.json({
      success: true,
      count: bets.length,
      bets
    });
  } catch (err: any) {
    console.error('[Get Open Bets Error]', err);
    const cached = db.openBets.get('20******5') || [];
    return res.json({ success: true, count: cached.length, bets: cached });
  }
});

// GET /api/bets/history
betRouter.get('/history', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const authHeader = req.headers.authorization;
    const cleanToken = authHeader ? authHeader.replace('Bearer ', '').trim() : '';

    let userPhone = '20******5';
    if (isDbConnected()) {
      if (cleanToken) {
        const u = await UserModel.findOne({ sessionTokens: cleanToken });
        if (u) userPhone = u.phone;
      }
    } else {
      const cached = db.getUserByToken(authHeader);
      if (cached && cached.phone) userPhone = cached.phone;
    }

    let bets: PlacedBet[] = [];

    if (isDbConnected()) {
      const mongoBets = await BetModel.find({ userPhone, status: { $ne: 'open' } }).sort({ createdAt: -1 });
      if (mongoBets.length > 0) {
        bets = mongoBets.map((doc: any) => ({
          id: doc.id,
          ticketId: doc.ticketId,
          transactionId: doc.transactionId,
          bookingCode: doc.bookingCode,
          type: doc.type,
          date: doc.date,
          isLive: doc.isLive,
          selections: doc.selections,
          stake: doc.stake,
          totalOdds: doc.totalOdds,
          potentialWin: doc.potentialWin,
          status: doc.status,
          cashoutAvailable: doc.cashoutAvailable,
          cashoutAmount: doc.cashoutAmount,
          canRebet: doc.canRebet
        }));
      }
    }

    if (bets.length === 0) {
      bets = db.betHistory.get(userPhone) || [];
    }

    return res.json({
      success: true,
      count: bets.length,
      bets
    });
  } catch (err: any) {
    console.error('[Get Bet History Error]', err);
    const cached = db.betHistory.get('20******5') || [];
    return res.json({ success: true, count: cached.length, bets: cached });
  }
});

// POST /api/bets/cashout
betRouter.post('/cashout', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const authHeader = req.headers.authorization;
    const cleanToken = authHeader ? authHeader.replace('Bearer ', '').trim() : '';
    const { betId } = req.body;

    if (!betId) {
      return res.status(400).json({ success: false, error: 'betId is required' });
    }

    let userDoc: any = null;
    let userPhone = '20******5';

    if (isDbConnected()) {
      if (cleanToken) {
        userDoc = await UserModel.findOne({ sessionTokens: cleanToken });
      }
      if (!userDoc) {
        userDoc = await UserModel.findOne({ phone: '20******5' });
      }
      if (userDoc) userPhone = userDoc.phone;
    }

    let bet: any = null;
    if (isDbConnected()) {
      bet = await BetModel.findOne({ $or: [{ id: betId }, { ticketId: betId }] });
    }

    const openBets = db.openBets.get(userPhone) || [];
    const memoryBetIdx = openBets.findIndex(b => b.id === betId || b.ticketId === betId);
    const memoryBet = memoryBetIdx !== -1 ? openBets[memoryBetIdx] : null;

    if (!bet && !memoryBet) {
      return res.status(404).json({ success: false, error: 'Open bet not found or already settled' });
    }

    const cashoutVal = bet ? bet.cashoutAmount || (bet.stake * 0.9) : (memoryBet!.cashoutAmount || (memoryBet!.stake * 0.9));
    const randomCashoutTxId = generateRandomTransactionId();

    if (isDbConnected() && bet) {
      bet.status = 'cashed_out';
      bet.cashoutAvailable = false;
      await bet.save();

      if (userDoc) {
        userDoc.balance = parseFloat((userDoc.balance + cashoutVal).toFixed(2));
        await userDoc.save();
      }

      await TransactionModel.create({
        id: `tx-${Date.now()}`,
        transactionId: randomCashoutTxId,
        userPhone,
        type: 'cashout',
        amount: cashoutVal,
        currency: userDoc?.currency || 'GHC',
        reference: bet.ticketId,
        status: 'completed',
        date: new Date().toISOString(),
        description: `Cashout for ticket ${bet.ticketId}`
      });
    }

    // Memory cache update
    if (memoryBetIdx !== -1) {
      const b = openBets.splice(memoryBetIdx, 1)[0];
      b.status = 'cashed_out';
      b.cashoutAvailable = false;
      db.openBets.set(userPhone, openBets);

      const history = db.betHistory.get(userPhone) || [];
      history.unshift(b);
      db.betHistory.set(userPhone, history);
    }

    const cachedUser = db.getUserByToken(authHeader);
    if (cachedUser) {
      cachedUser.balance = parseFloat((cachedUser.balance + cashoutVal).toFixed(2));
    }

    const newBalance = userDoc ? userDoc.balance : (cachedUser ? cachedUser.balance : 5000.00);

    return res.json({
      success: true,
      message: `Successfully cashed out GHC ${cashoutVal.toFixed(2)}!`,
      cashoutAmount: cashoutVal,
      transactionId: randomCashoutTxId,
      newBalance,
      bet: bet || memoryBet
    });
  } catch (err: any) {
    console.error('[Cashout Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Cashout failed' });
  }
});

// POST /api/bets/booking-code
betRouter.post('/booking-code', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const { selections } = req.body;
    if (!selections || !Array.isArray(selections) || selections.length === 0) {
      return res.status(400).json({ success: false, error: 'Selections are required to generate booking code' });
    }

    let totalOdds = 1.0;
    selections.forEach((s: BetSelection) => {
      totalOdds *= s.odd;
    });

    const code = generateBookingCode();
    const expiresAt = new Date(Date.now() + 86400000 * 7);

    if (isDbConnected()) {
      await BookingCodeModel.create({
        code,
        totalOdds: parseFloat(totalOdds.toFixed(2)),
        selectionsCount: selections.length,
        selections,
        expiresAt
      });
    }

    db.bookingCodes.set(code, {
      code,
      createdAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      selections,
      totalOdds: parseFloat(totalOdds.toFixed(2))
    });

    return res.json({
      success: true,
      bookingCode: code,
      totalOdds: parseFloat(totalOdds.toFixed(2)),
      selectionsCount: selections.length,
      expiresAt: expiresAt.toISOString(),
      shareUrl: `https://sportybet.com/gh/m/?code=${code}`
    });
  } catch (err: any) {
    console.error('[Create Booking Code Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Error generating booking code' });
  }
});

// GET /api/bets/booking-code/:code
betRouter.get('/booking-code/:code', async (req: Request, res: Response) => {
  try {
    await connectToDatabase();
    const code = req.params.code.toUpperCase().trim();

    // Check MongoDB first
    if (isDbConnected()) {
      const doc = await BookingCodeModel.findOne({ code });
      if (doc) {
        return res.json({
          success: true,
          bookingCode: doc.code,
          selections: doc.selections,
          totalOdds: doc.totalOdds,
          createdAt: doc.createdAt,
          expiresAt: doc.expiresAt
        });
      }
    }

    // Fallback to memory store
    const record = db.bookingCodes.get(code);
    if (!record) {
      return res.status(404).json({
        success: false,
        error: `Booking code "${code}" not found or expired.`
      });
    }

    return res.json({
      success: true,
      bookingCode: record.code,
      selections: record.selections,
      totalOdds: record.totalOdds,
      createdAt: record.createdAt,
      expiresAt: record.expiresAt
    });
  } catch (err: any) {
    console.error('[Get Booking Code Error]', err);
    return res.status(500).json({ success: false, error: err.message || 'Error loading booking code' });
  }
});
