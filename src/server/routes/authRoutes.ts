import { Router, Request, Response } from 'express';
import { db } from '../db';
import { UserProfile } from '../../types';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', (req: Request, res: Response) => {
  const { phone, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  // Find or create user session
  let user = db.users.get(phone);
  if (!user) {
    // Auto-create for demo/testing convenience with initial balance
    user = {
      username: `user_${phone.slice(-4)}`,
      balance: 9544500.00,
      currency: 'GHC',
      loyaltyTier: 'Tier 1',
      loyaltyProgress: 96,
      nextUpdate: '01 Oct',
      dailyStreak: 5,
      unreadNotifications: 1,
      phone,
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      location: 'Accra, Ghana',
      email: '',
      isEmailVerified: false,
      avatarUrl: '/user_beach_avatar.jpg',
      isLoggedIn: true
    };
    db.users.set(phone, user);
  } else {
    user.isLoggedIn = true;
  }

  const token = `sporty-session-${Buffer.from(phone + Date.now()).toString('base64')}`;
  db.userSessions.set(token, phone);

  return res.json({
    success: true,
    token,
    user
  });
});

// POST /api/auth/register
authRouter.post('/register', (req: Request, res: Response) => {
  const { phone, password } = req.body;
  if (!phone) {
    return res.status(400).json({ success: false, error: 'Phone number is required' });
  }

  const newUser: UserProfile = {
    username: `user_${phone.slice(-4)}`,
    balance: 50.00, // Welcome signup bonus GHS 50.00
    currency: 'GHS',
    loyaltyTier: 'Tier 1',
    loyaltyProgress: 10,
    nextUpdate: '01 Oct',
    dailyStreak: 1,
    unreadNotifications: 1,
    phone,
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    location: 'Accra, Ghana',
    email: '',
    isEmailVerified: false,
    avatarUrl: '/user_beach_avatar.jpg',
    isLoggedIn: true
  };

  db.users.set(phone, newUser);
  const token = `sporty-session-${Buffer.from(phone + Date.now()).toString('base64')}`;
  db.userSessions.set(token, phone);

  return res.json({
    success: true,
    token,
    message: 'Registration successful! Welcome bonus of GHS 50.00 credited.',
    user: newUser
  });
});

// GET /api/auth/me
authRouter.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  return res.json({
    success: true,
    user
  });
});

// POST /api/auth/logout
authRouter.post('/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.replace('Bearer ', '').trim();
    const phone = db.userSessions.get(token);
    if (phone) {
      const user = db.users.get(phone);
      if (user) user.isLoggedIn = false;
      db.userSessions.delete(token);
    }
  }
  return res.json({ success: true, message: 'Logged out successfully' });
});

// PUT /api/auth/profile
authRouter.put('/profile', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  const { firstName, lastName, email, dateOfBirth, username } = req.body;
  if (firstName !== undefined) user.firstName = firstName;
  if (lastName !== undefined) user.lastName = lastName;
  if (email !== undefined) user.email = email;
  if (dateOfBirth !== undefined) user.dateOfBirth = dateOfBirth;
  if (username !== undefined) user.username = username;

  return res.json({
    success: true,
    message: 'Profile updated successfully',
    user
  });
});

// POST /api/auth/daily-streak
authRouter.post('/daily-streak', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const user = db.getUserByToken(authHeader);

  if (!user) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  user.dailyStreak = (user.dailyStreak || 0) + 1;
  user.balance = parseFloat((user.balance + 1.00).toFixed(2)); // Daily streak 1 GHS bonus reward

  return res.json({
    success: true,
    message: `Daily streak claimed! Streak is now ${user.dailyStreak} days. +1.00 GHS bonus added!`,
    dailyStreak: user.dailyStreak,
    balance: user.balance
  });
});
