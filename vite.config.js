import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
  optimizeDeps: {
    include: ['@fullcalendar/core', '@fullcalendar/timegrid', '@fullcalendar/daygrid', '@fullcalendar/interaction', '@fullcalendar/react'],
  },
});
