import dotenv from 'dotenv';
import { app } from './app';
import { connectToDatabase } from './mongodb';

dotenv.config();

// Non-blocking initialization of database
connectToDatabase().catch((err) => {
  console.warn('[Vercel DB Init]', err?.message || err);
});

// Root health check endpoints
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel', timestamp: new Date().toISOString() });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel', timestamp: new Date().toISOString() });
});

// Export default serverless handler for Vercel
export default function handler(req: any, res: any) {
  return app(req, res);
}

export { app };
