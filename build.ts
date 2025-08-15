#!/usr/bin/env tsx

import { spawn } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

async function runCommand(command: string, args: string[] = []): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command "${command} ${args.join(' ')}" failed with code ${code}`));
      }
    });
  });
}

async function ensureDistDirectory() {
  try {
    await fs.access('dist');
  } catch {
    await fs.mkdir('dist', { recursive: true });
  }
}

async function buildProject() {
  console.log('🏗️  Starting build process...');
  
  try {
    // Ensure dist directory exists
    await ensureDistDirectory();
    
    // Build client (frontend)
    console.log('📦 Building client...');
    await runCommand('vite', ['build']);
    
    // Build server (backend)
    console.log('🔧 Building server...');
    await runCommand('tsc', ['--project', 'tsconfig.server.json']);
    
    // Copy server entry point to expected location
    console.log('📋 Copying server entry point...');
    await runCommand('cp', ['dist/server/index.js', 'dist/index.js']);
    
    console.log('✅ Build completed successfully!');
    
    // Verify the build outputs
    const serverExists = await fs.access('dist/index.js').then(() => true).catch(() => false);
    const clientExists = await fs.access('dist/public/index.html').then(() => true).catch(() => false);
    
    console.log(`📋 Build verification:`);
    console.log(`   Server: ${serverExists ? '✅' : '❌'} dist/index.js`);
    console.log(`   Client: ${clientExists ? '✅' : '❌'} dist/public/index.html`);
    
    if (!serverExists || !clientExists) {
      throw new Error('Build verification failed - missing output files');
    }
    
  } catch (error) {
    console.error('❌ Build failed:', error);
    process.exit(1);
  }
}

buildProject();