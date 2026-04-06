import path from 'node:path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    dedupe: ['vue'],
    conditions: ['development'],
    alias: {
      '@': path.resolve(__dirname, '../core/src'),
    },
  },
  server: {
    port: 4200,
  },
})
