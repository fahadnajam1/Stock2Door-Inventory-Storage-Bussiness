import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/admin': {
        target: 'http://localhost:8787',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Warn at a slightly higher threshold while we split big deps into chunks
    chunkSizeWarningLimit: 600,
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('node_modules')) {
            if (id.includes('html2canvas')) return 'html2canvas';
            if (id.includes('html2pdf') || id.includes('jspdf')) return 'pdf-lib';
            if (id.includes('@supabase') || id.includes('supabase')) return 'supabase';
            // keep react/react-dom separate to allow better caching
            if (id.includes('react') || id.includes('react-dom')) return 'react-vendor';
            return 'vendor';
          }
        },
      },
    },
  },
});
