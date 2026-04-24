import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      // Proxy Google Forms HTML requests to bypass CORS in dev.
      // Replace this with a real backend endpoint in production.
      '/google-forms-proxy': {
        target: 'https://docs.google.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/google-forms-proxy/, ''),
      },
    },
  },
});
