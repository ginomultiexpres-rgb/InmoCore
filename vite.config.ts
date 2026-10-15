import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(() => {
  const basePath = '/InmoCore/';
  return {
    base: basePath,
    build: {
      sourcemap: false,
      minify: true,
    },
    plugins: [tailwindcss(), react()],
    test: {
      environment: 'jsdom',
      setupFiles: 'tests/setup.ts',
      globals: true,
    },
  };
});
