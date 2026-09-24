import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import express from 'express';
import { app } from './src/server/app';
import { connectToDatabase } from './src/server/mongodb';

dotenv.config();

const PORT = 3000;

async function startServer() {
  // Connect to MongoDB
  connectToDatabase().catch((err) => {
    console.error('[MongoDB Startup Error]', err);
  });
  // Mount Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SportyBet Ghana Full-Stack Server running on port ${PORT}`);
  });
}

startServer();
