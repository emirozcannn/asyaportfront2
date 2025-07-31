import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:7190', // Doğru backend portu
        changeOrigin: true,
        secure: false, // Development için
      }
    }
  }
})