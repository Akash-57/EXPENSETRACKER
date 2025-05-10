import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
  },
  resolve: {
    alias: {
      '@': '/src',  // Optional: Alias for your source directory
    },
  },
  build: {
    outDir: 'dist',  // Ensure the output directory is compatible with Vercel
  },
  server: {
    port: 3000,  // Use port 3000 to align with Vercel's environment
    host: true,  // Allow network access during development
  },
  base: './',  // Relative paths for assets
});
