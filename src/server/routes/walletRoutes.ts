import { Router, Request, Response } from 'express';
import { db, WalletTransaction } from '../db';

export const walletRouter = Router();

// GET /api/wallet/balance
walletRouter.get('/balance', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  return res.json({
    success: true,
    currency: user.currency || 'GHS',
    balance: user.balance,
    bonusBalance: 0.00
  });
});

// POST /api/wallet/deposit
walletRouter.post('/deposit', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { amount, provider, accountNumber } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount < 1) {
    return res.status(400).json({ success: false, error: 'Minimum deposit amount is GHS 1.00' });
  }

  if (numAmount > 20000) {
    return res.status(400).json({ success: false, error: 'Maximum deposit amount is GHS 20,000.00' });
  }

  // Credit user balance
  user.balance = parseFloat((user.balance + numAmount).toFixed(2));

  const ref = `DEP-${Date.now().toString().slice(-8)}`;
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'deposit',
    amount: numAmount,
    currency: user.currency || 'GHS',
    provider: provider || 'MTN Mobile Money',
    accountNumber: accountNumber || user.phone,
    reference: ref,
    status: 'completed',
    date: new Date().toISOString(),
    description: `Deposit via ${provider || 'Mobile Money'}`
  };

  const userPhone = user.phone || '20******5';
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);

  return res.json({
    success: true,
    message: `Successfully deposited ${user.currency} ${numAmount.toFixed(2)} via ${provider || 'Mobile Money'}`,
    balance: user.balance,
    transaction: newTx
  });
});

// POST /api/wallet/withdraw
walletRouter.post('/withdraw', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const { amount, provider, accountNumber } = req.body;
  const numAmount = parseFloat(amount);

  if (isNaN(numAmount) || numAmount < 2) {
    return res.status(400).json({ success: false, error: 'Minimum withdrawal amount is GHS 2.00' });
  }

  if (numAmount > user.balance) {
    return res.status(400).json({
      success: false,
      error: `Insufficient balance. Available: ${user.currency} ${user.balance.toFixed(2)}`
    });
  }

  // Deduct balance
  user.balance = parseFloat((user.balance - numAmount).toFixed(2));

  const ref = `WTH-${Date.now().toString().slice(-8)}`;
  const newTx: WalletTransaction = {
    id: `tx-${Date.now()}`,
    type: 'withdrawal',
    amount: numAmount,
    currency: user.currency || 'GHS',
    provider: provider || 'Mobile Money',
    accountNumber: accountNumber || user.phone,
    reference: ref,
    status: 'completed',
    date: new Date().toISOString(),
    description: `Withdrawal to ${accountNumber || user.phone}`
  };

  const userPhone = user.phone || '20******5';
  const txs = db.transactions.get(userPhone) || [];
  txs.unshift(newTx);
  db.transactions.set(userPhone, txs);

  return res.json({
    success: true,
    message: `Withdrawal of ${user.currency} ${numAmount.toFixed(2)} processed successfully to ${accountNumber || user.phone}`,
    balance: user.balance,
    transaction: newTx
  });
});

// GET /api/wallet/transactions
walletRouter.get('/transactions', (req: Request, res: Response) => {
  const user = db.getUserByToken(req.headers.authorization);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  const userPhone = user.phone || '20******5';
  const txs = db.transactions.get(userPhone) || [];

  return res.json({
    success: true,
    count: txs.length,
    transactions: txs
  });
});
