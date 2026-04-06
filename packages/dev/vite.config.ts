import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  resolve: {
    dedupe: ['vue'],
    conditions: ['development'],
  },
  server: {
    port: 4200,
  },
})
