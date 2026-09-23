import { Router, Request, Response } from 'express';
import { db, WalletTransaction } from '../db';
import { PlacedBet, BetSelection } from '../../types';

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

// POST /api/bets/place
betRouter.post('/place', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized. Please login to place a bet.' });
  }

  const { selections, stake, type } = req.body;
  const numStake = parseFloat(stake);

  if (!selections || !Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ success: false, error: 'At least one selection is required' });
  }

  if (isNaN(numStake) || numStake < 1.0) {
    return res.status(400).json({ success: false, error: 'Minimum stake is GHS 1.00' });
  }

  if (numStake > user.balance) {
    return res.status(400).json({
      success: false,
      error: `Insufficient balance. Available: ${user.currency} ${user.balance.toFixed(2)}`
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

  // Deduct balance
  user.balance = parseFloat((user.balance - numStake).toFixed(2));

  // Generate unique SportyBet Ticket ID
  const ticketId = `B-GH-${Math.floor(10000000 + Math.random() * 90000000)}`;

  const newBet: PlacedBet = {
    id: `bet-${Date.now()}`,
    ticketId,
    type: selections.length > 1 ? 'Multiple' : 'Single',
    date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) + ' ' +
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

  const userPhone = user.phone || '20******5';
  const openBets = db.openBets.get(userPhone) || [];
  openBets.unshift(newBet);
  db.openBets.set(userPhone, openBets);

  // Record transaction
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'bet_placed',
    amount: numStake,
    currency: user.currency || 'GHS',
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
    bet: newBet,
    remainingBalance: user.balance
  });
});

// GET /api/bets/open
betRouter.get('/open', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const userPhone = user.phone || '20******5';
  let bets = db.openBets.get(userPhone) || [];

  // Update dynamic cashout amounts for active bets
  bets = bets.map(b => {
    if (b.status === 'open' && b.cashoutAvailable) {
      // Simulate live cashout fluctuation
      const fluctuation = (Math.random() * 0.1 - 0.03);
      const currentCashout = b.cashoutAmount || (b.stake * 0.9);
      const updated = Math.max(b.stake * 0.5, Math.min(b.potentialWin * 0.92, currentCashout * (1 + fluctuation)));
      return {
        ...b,
        cashoutAmount: parseFloat(updated.toFixed(2))
      };
    }
    return b;
  });
  db.openBets.set(userPhone, bets);

  return res.json({
    success: true,
    count: bets.length,
    bets
  });
});

// GET /api/bets/history
betRouter.get('/history', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const userPhone = user.phone || '20******5';
  const history = db.betHistory.get(userPhone) || [];

  return res.json({
    success: true,
    count: history.length,
    bets: history
  });
});

// POST /api/bets/cashout
betRouter.post('/cashout', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { betId } = req.body;
  if (!betId) {
    return res.status(400).json({ success: false, error: 'betId is required' });
  }

  const userPhone = user.phone || '20******5';
  const openBets = db.openBets.get(userPhone) || [];
  const betIndex = openBets.findIndex(b => b.id === betId || b.ticketId === betId);

  if (betIndex === -1) {
    return res.status(404).json({ success: false, error: 'Open bet not found or already settled' });
  }

  const bet = openBets[betIndex];
  const cashoutVal = bet.cashoutAmount || (bet.stake * 0.9);

  // Credit user balance
  user.balance = parseFloat((user.balance + cashoutVal).toFixed(2));

  // Mark bet as cashed out and move to history
  bet.status = 'cashed_out';
  bet.cashoutAvailable = false;
  openBets.splice(betIndex, 1);
  db.openBets.set(userPhone, openBets);

  const history = db.betHistory.get(userPhone) || [];
  history.unshift(bet);
  db.betHistory.set(userPhone, history);

  // Record transaction
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'cashout',
    amount: cashoutVal,
    currency: user.currency || 'GHS',
    reference: bet.ticketId,
    status: 'completed',
    date: new Date().toISOString(),
    description: `Cashout for ticket ${bet.ticketId}`
  };
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);

  return res.json({
    success: true,
    message: `Successfully cashed out ${user.currency} ${cashoutVal.toFixed(2)}!`,
    cashoutAmount: cashoutVal,
    newBalance: user.balance,
    bet
  });
});

// POST /api/bets/booking-code
betRouter.post('/booking-code', (req: Request, res: Response) => {
  const { selections } = req.body;
  if (!selections || !Array.isArray(selections) || selections.length === 0) {
    return res.status(400).json({ success: false, error: 'Selections are required to generate booking code' });
  }

  let totalOdds = 1.0;
  selections.forEach((s: BetSelection) => {
    totalOdds *= s.odd;
  });

  const code = generateBookingCode();
  const record = {
    code,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days validity
    selections,
    totalOdds: parseFloat(totalOdds.toFixed(2))
  };

  db.bookingCodes.set(code, record);

  return res.json({
    success: true,
    bookingCode: code,
    totalOdds: record.totalOdds,
    selectionsCount: selections.length,
    expiresAt: record.expiresAt,
    shareUrl: `https://sportybet.com/gh/m/?code=${code}`
  });
});

// GET /api/bets/booking-code/:code
betRouter.get('/booking-code/:code', (req: Request, res: Response) => {
  const code = req.params.code.toUpperCase().trim();
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
});
