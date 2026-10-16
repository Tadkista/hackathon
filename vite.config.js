import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 4568,
    strictPort: true,
  },
  preview: {
    host: '0.0.0.0',
    port: 4568,
    strictPort: true,
  }
});
