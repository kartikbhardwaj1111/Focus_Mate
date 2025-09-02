import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Dev proxy so frontend /api requests hit the backend on port 3000
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});