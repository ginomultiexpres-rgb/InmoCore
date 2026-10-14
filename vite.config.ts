import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(() => {
  const basePath = '/InmoCore/'
  return {
    base: basePath,
    build: {
      sourcemap: false,
      minify: true,
      rollupOptions: {
        external: ['cookie', 'set-cookie-parser', 'react-is']
      }
    },
    plugins: [react()],
  }
})