import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import * as path from "path"

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  resolve: {
    alias: {
      '@': resolve('src'),
      '@components': resolve('components'),
      '@pages': resolve('src/pages')
    }
  }
})