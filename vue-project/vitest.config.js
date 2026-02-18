import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,        // чтобы использовать describe, it, expect без импорта
    environment: 'jsdom',  // эмуляция браузера для работы с DOM
    // setupFiles: ['./src/test-setup.js'], // (опционально) файл для глобальной настройки
  },
})