import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // Прямой IP вместо localhost
    port: 5173,
    strictPort: true,
    open: true // Автоматически откроет браузер при запуске
  }
})