import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, res) => {
            // When backend server (localhost:5000) is offline during dev, return a friendly JSON error
            // so Vite does not spam noisy stack traces and frontend gracefully falls back to catalogData.js
            if (res && !res.headersSent) {
              res.writeHead(503, {
                'Content-Type': 'application/json',
              });
              res.end(JSON.stringify({
                message: 'Backend server is offline on port 5000. Running in local fallback mode.'
              }));
            }
          });
        }
      }
    }
  }
});
