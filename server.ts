import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';

const isTsxEnvironment = Boolean(
  process.env.TSX_READY ||
  process.env.npm_lifecycle_script?.includes('tsx') ||
  process.execArgv.some(arg => arg.includes('tsx'))
);

if (!isTsxEnvironment) {
  const distServer = path.join(process.cwd(), 'dist', 'server.cjs');
  if (fs.existsSync(distServer) && process.env.NODE_ENV === 'production') {
    const child = spawn('node', [distServer], { stdio: 'inherit', env: process.env });
    process.on('SIGTERM', () => child.kill('SIGTERM'));
    process.on('SIGINT', () => child.kill('SIGINT'));
    child.on('exit', (code) => process.exit(code ?? 0));
  } else {
    const child = spawn('node', ['--import', 'tsx', 'server.ts', ...process.argv.slice(2)], {
      stdio: 'inherit',
      env: { ...process.env, TSX_READY: '1' }
    });
    process.on('SIGTERM', () => child.kill('SIGTERM'));
    process.on('SIGINT', () => child.kill('SIGINT'));
    child.on('exit', (code) => process.exit(code ?? 0));
  }
} else {
  await import('./src/server/startServer');
}
