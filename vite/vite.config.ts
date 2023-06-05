import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import * as path from "path"

function resolve(dir) {
  return path.join(__dirname, '.', dir)
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve:{
    alias:{
      '@': resolve('src'),
      '@components': resolve('components'),
      '@pages': resolve('src/pages')
    }
  }
})
