import dotenv from 'dotenv';
import { app } from '../src/server/app';

dotenv.config();

// Basic health check endpoint on root vercel route
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel' });
});

export default app;
