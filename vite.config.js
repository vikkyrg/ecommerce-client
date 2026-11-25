import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const { VITE_API_URL } = loadEnv(mode, process.cwd(), 'VITE_');
  if (!VITE_API_URL?.trim()) {
    throw new Error('VITE_API_URL must be set to the backend origin.');
  }
  const apiUrl = new URL(VITE_API_URL);
  if (!['http:', 'https:'].includes(apiUrl.protocol)) {
    throw new Error('VITE_API_URL must use HTTP or HTTPS.');
  }
  if (apiUrl.pathname !== '/' || apiUrl.search || apiUrl.hash) {
    throw new Error('VITE_API_URL must be a backend origin without an API path or query string.');
  }
  if (mode === 'production') {
    const hostname = apiUrl.hostname;
    if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname.includes('your-backend-domain')) {
      throw new Error('Production VITE_API_URL must be the deployed backend origin, not localhost or a placeholder.');
    }
  }

  return {
    plugins: [react(), tailwindcss()],
    server: { port: 5173 }
  };
});
