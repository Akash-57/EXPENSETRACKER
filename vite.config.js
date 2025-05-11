import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
    exclude: ['js-big-decimal'], // Exclude if not needed
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Increased from default 500kb
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Split vendor chunks
            if (id.includes('react')) {
              return 'vendor-react';
            }
            if (id.includes('axios')) {
              return 'vendor-axios';
            }
            if (id.includes('chart.js')) {
              return 'vendor-chartjs';
            }
            return 'vendor'; // Other vendors
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    hmr: {
      overlay: false, // Disable HMR overlay to reduce noise
    },
  },
  base: './',
});