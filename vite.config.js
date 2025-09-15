import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Для GitHub Pages: обеспечиваем относительные пути к ассетам
  base: './',
})
