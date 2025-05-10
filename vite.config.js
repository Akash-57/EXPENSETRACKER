import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

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
})
