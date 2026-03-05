/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  base: '/linux-learning-game/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-zustand': ['zustand'],
          'modules-base': [
            './src/data/modules/cli-basics',
            './src/data/modules/pipes-streams',
            './src/data/modules/files-navigation',
            './src/data/modules/process-mgmt',
            './src/data/modules/text-processing',
            './src/data/modules/data-wrangling',
            './src/data/modules/system-admin',
            './src/data/modules/one-liner-legend',
          ],
          'modules-sb': [
            './src/data/modules/sb-shell-tricks',
            './src/data/modules/sb-permissions',
            './src/data/modules/sb-shell-functions',
            './src/data/modules/sb-advanced-find',
            './src/data/modules/sb-vim',
            './src/data/modules/sb-tmux',
            './src/data/modules/sb-disk',
            './src/data/modules/sb-git',
            './src/data/modules/sb-cron',
            './src/data/modules/sb-logs',
            './src/data/modules/sb-monitoring',
            './src/data/modules/sb-curl',
            './src/data/modules/sb-networking',
            './src/data/modules/sb-ssh',
            './src/data/modules/sb-docker',
            './src/data/modules/sb-packages',
            './src/data/modules/sb-hardening',
            './src/data/modules/sb-oneliners',
          ],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
