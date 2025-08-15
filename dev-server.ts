#!/usr/bin/env tsx

import { spawn } from 'child_process';

function startServer() {
  console.log('Starting Express server...');
  const server = spawn('tsx', ['server/index.ts'], {
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: 'development' }
  });

  server.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
    process.exit(code || 0);
  });

  // Handle shutdown gracefully
  process.on('SIGTERM', () => {
    console.log('Received SIGTERM, shutting down server...');
    server.kill('SIGTERM');
  });

  process.on('SIGINT', () => {
    console.log('Received SIGINT, shutting down server...');
    server.kill('SIGINT');
  });
}

startServer();