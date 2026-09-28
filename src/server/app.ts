import express from 'express';
import { authRouter } from './routes/authRoutes';
import { walletRouter } from './routes/walletRoutes';
import { betRouter } from './routes/betRoutes';
import { matchesRouter } from './routes/matchesRoutes';
import { footballRouter } from './footballApi';
import { sportsRouter } from './routes/sportsRoutes';
import { adminRouter } from './routes/adminRoutes';
import { serverAviatorEngine } from './aviatorServerEngine';

export const app = express();

// Serverless-safe body parsing middleware
// If Vercel has already parsed req.body, mark _body=true so express.json() does not hang waiting on consumed stream
app.use((req, res, next) => {
  if (req.body && typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    (req as any)._body = true;
  }
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enable CORS for API routes (Capacitor Android, iOS, and Web)
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', '*');
  }
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control, Pragma');
  res.header('Access-Control-Allow-Credentials', 'true');
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

// Mount Routes (supports both direct server /api/* and Vercel serverless rewrites)
app.use('/api/auth', authRouter);
app.use('/auth', authRouter);
app.use('/api/wallet', walletRouter);
app.use('/wallet', walletRouter);
app.use('/api/bets', betRouter);
app.use('/bets', betRouter);
app.use('/api/matches', matchesRouter);
app.use('/matches', matchesRouter);
app.use('/api/football', footballRouter);
app.use('/football', footballRouter);
app.use('/api/sports', sportsRouter);
app.use('/sports', sportsRouter);
app.use('/api/admin', adminRouter);

// Public Aviator synchronized multi-device state
app.get(['/api/aviator/state', '/aviator/state'], (req, res) => {
  res.json({
    success: true,
    ...serverAviatorEngine.getState()
  });
});

app.post(['/api/aviator/override', '/aviator/override'], (req, res) => {
  const { crashPoint, speedMultiplier } = req.body;
  const numCrash = crashPoint !== undefined ? parseFloat(crashPoint) : undefined;
  const numSpeed = speedMultiplier !== undefined ? parseFloat(speedMultiplier) : undefined;
  const updated = serverAviatorEngine.overrideNextRound({
    crashPoint: !isNaN(numCrash as number) ? numCrash : undefined,
    speedMultiplier: !isNaN(numSpeed as number) ? numSpeed : undefined
  });
  res.json({
    success: true,
    nextRound: updated,
    state: serverAviatorEngine.getState()
  });
});

app.post(['/api/aviator/force-next', '/aviator/force-next'], (req, res) => {
  const advanced = serverAviatorEngine.advanceToNextRound();
  res.json({
    success: true,
    currentRound: advanced,
    state: serverAviatorEngine.getState()
  });
});

app.post(['/api/aviator/reset', '/aviator/reset'], (req, res) => {
  serverAviatorEngine.resetNatural();
  res.json({
    success: true,
    state: serverAviatorEngine.getState()
  });
});

// Error middleware to handle database queries failing gracefully when MongoDB is offline
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err?.name === 'MongooseError' || err?.name === 'MongoNetworkError' || err?.message?.includes('buffering timed out')) {
    console.warn('[AI Studio] Database offline — returning mock response');
    if (req.method === 'GET') {
      return res.json(req.path.endsWith('s') || req.path.endsWith('s/') ? [] : {});
    }
    return res.status(503).json({ error: 'Service temporarily unavailable (database offline)' });
  }
  next(err);
});

export default app;
