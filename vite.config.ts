import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(() => {
  const basePath = '/InmoCore/';
  return {
    base: basePath,
    build: {
      sourcemap: false,
      minify: true,
    },
    plugins: [react()],
  };
});
