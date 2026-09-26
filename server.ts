import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import express from 'express';
import { app } from './src/server/app';
import { connectToDatabase } from './src/server/mongodb';

const PORT = 3000;

async function startServer() {
  // Connect to MongoDB if configured
  try {
    await connectToDatabase();
  } catch (err: any) {
    console.warn('[MongoDB Startup Notice]', err?.message || err);
  }

  const distPath = path.join(process.cwd(), 'dist');
  const indexPath = path.join(distPath, 'index.html');
  const hasDist = fs.existsSync(indexPath);

  // Mount Vite middleware in development or when dist bundle is missing
  if (process.env.NODE_ENV !== 'production' || !hasDist) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(distPath));
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) return next();
      res.sendFile(indexPath);
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SportyBet Ghana Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
