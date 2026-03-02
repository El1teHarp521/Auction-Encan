import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Конфигурация для гарантированного запуска на локальном IP
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: '127.0.0.1', // Используем явный IP адрес
    port: 5173,
    strictPort: true,
  }
})