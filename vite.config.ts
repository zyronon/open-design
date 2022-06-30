import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    open: true
  },
  css: {
    // css预处理器
    preprocessorOptions: {
      scss: {
        additionalData: '@import "./src/assets/css/index.scss";',
      },
    },
  },
})
