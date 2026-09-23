import express from 'express';
import dotenv from 'dotenv';
import { footballRouter } from '../src/server/footballApi';

dotenv.config();

const app = express();
app.use(express.json());

// API Routes (supports /api/football/* and rewrite to /football/*)
app.use('/api/football', footballRouter);
app.use('/football', footballRouter);

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'ok', platform: 'vercel' });
});

export default app;
