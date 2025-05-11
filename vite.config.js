import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['axios'],
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            // Improved vendor chunking
            if (id.includes('react')) return 'vendor-react';
            if (id.includes('axios')) return 'vendor-axios';
            if (id.includes('chart.js')) return 'vendor-chartjs';
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    // Removed host: true as it may cause issues in Vercel
  },
  // Updated base path for Vercel compatibility
  base: '/',
});
