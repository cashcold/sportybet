import express from 'express';
import { authRouter } from './routes/authRoutes';
import { walletRouter } from './routes/walletRoutes';
import { betRouter } from './routes/betRoutes';
import { matchesRouter } from './routes/matchesRoutes';
import { footballRouter } from './footballApi';

export const app = express();

// Middleware
app.use(express.json());

// Enable CORS for API routes
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Root API Health & Capabilities Info
app.get('/api', (req, res) => {
  res.json({
    status: 'online',
    platform: 'SportyBet Ghana Full-Stack Serverless API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      auth: [
        'POST /api/auth/register',
        'POST /api/auth/login',
        'GET /api/auth/me',
        'POST /api/auth/logout',
        'PUT /api/auth/profile',
        'POST /api/auth/daily-streak'
      ],
      wallet: [
        'GET /api/wallet/balance',
        'POST /api/wallet/deposit',
        'POST /api/wallet/withdraw',
        'GET /api/wallet/transactions'
      ],
      bets: [
        'POST /api/bets/place',
        'GET /api/bets/open',
        'GET /api/bets/history',
        'POST /api/bets/cashout',
        'POST /api/bets/booking-code',
        'GET /api/bets/booking-code/:code'
      ],
      matches: [
        'GET /api/matches',
        'GET /api/matches/:id',
        'POST /api/matches/simulate-live'
      ],
      football_live_feed: [
        'GET /api/football/status',
        'GET /api/football/live'
      ]
    }
  });
});

// Mount Routes
app.use('/api/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/api/bets', betRouter);
app.use('/api/matches', matchesRouter);
app.use('/api/football', footballRouter);

export default app;
