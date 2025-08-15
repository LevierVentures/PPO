import * as esbuild from 'esbuild';

async function buildServer() {
  await esbuild.build({
    entryPoints: ['server/index.ts'],
    bundle: true,
    platform: 'node',
    target: 'node18',
    format: 'esm',
    outfile: 'dist/index.js',
    external: [
      // Keep all node modules external to avoid bundling issues
      /node_modules/,
      'pg-native',
      'cpu-features',
      'cardinal',
      '@google-cloud/storage',
      '@anthropic-ai/sdk',
      '@babel/*',
      'lightningcss',
      'tailwindcss',
      'postcss',
      'vite',
      'drizzle-orm',
      'drizzle-kit',
      'express',
      'express-session',
      'passport',
      'passport-local',
      'connect-pg-simple',
      'memorystore',
      'ws',
      'zod',
      'memoizee'
    ],
    define: {
      'import.meta.env.MODE': '"production"',
    },
    banner: {
      js: `
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const require = createRequire(import.meta.url);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
`,
    },
    minify: false,
    sourcemap: true,
    resolveExtensions: ['.ts', '.js'],
    packages: 'external', // Keep all packages external
  });
  
  console.log('Server built successfully!');
}

buildServer().catch((error) => {
  console.error('Build failed:', error);
  process.exit(1);
});