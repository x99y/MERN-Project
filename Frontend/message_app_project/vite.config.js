import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 5173,      // Define port
    watch: {
      usePolling: true, // Needed for Docker
    },
    hmr: {
      host: 'localhost', // HMR host for Docker
    },
  },
  envDir: '../../',
});