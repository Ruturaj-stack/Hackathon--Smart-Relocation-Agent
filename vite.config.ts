import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { spawn } from 'child_process';

export default defineConfig(({ mode }) => {
  // Load env variables from .env files and populate process.env
  const env = loadEnv(mode, process.cwd(), '');
  Object.assign(process.env, env);

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'start-api-server',
        configureServer(server) {
          console.log('🚀 Starting local API server via tsx api-server.ts...');
          const isWin = process.platform === 'win32';
          const apiProcess = spawn(
            isWin ? 'npx.cmd' : 'npx',
            ['tsx', 'api-server.ts'],
            {
              stdio: 'inherit',
              shell: false,
              env: { ...process.env, PORT: '3001' }
            }
          );

          server.httpServer?.on('close', () => {
            console.log('Stopping local API server...');
            apiProcess.kill();
          });
        }
      }
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      proxy: {
        '/api': 'http://localhost:3001',
      },
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
