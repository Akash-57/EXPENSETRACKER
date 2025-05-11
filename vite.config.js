import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': '/src', // Simplified alias for src
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000, // Increased size limit to avoid warnings
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Efficient vendor chunking
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('chart.js')) return 'vendor-chartjs';
            return 'vendor'; // General vendor chunk
          }
        },
      },
    },
  },
  server: {
    port: 3000,
  },
  // Set base to '/' for correct asset loading on Vercel
  base: '/',
});
