import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'node:path'

// Vite config — https://vitejs.dev/config/
// Despliegue exclusivo en GitHub Pages (https://<usuario>.github.io/<repo>/).
export default defineConfig(() => {
  // En local se usa "/". En CI, GitHub Actions inyecta GITHUB_REPOSITORY
  // ("usuario/repo") y la base se calcula con la convención de Pages:
  // sitios cuyo repo coincide con el propietario se sirven en la raíz
  // ("/"), los demás en "/<repo>/". Puede forzarse con PUBLIC_URL.
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
  const ownerName = process.env.GITHUB_REPOSITORY?.split('/')[0] ?? ''
  const isUserSite =
    repositoryName.toLowerCase() === ownerName.toLowerCase() ||
    repositoryName.toLowerCase() === `${ownerName.toLowerCase()}.github.io`
  const basePath =
    process.env.PUBLIC_URL ??
    (repositoryName ? (isUserSite ? '/' : `/${repositoryName}/`) : '/')

  return {
    base: `${basePath.replace(/\/+$/, '')}/`,
    build: {
      sourcemap: false,
      minify: true,
    },
    // public/404.html se copia a dist/ con la ruta base ya sustituida
    // (la sustitución la realiza el workflow del CI).
    publicDir: 'public',
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: '0.0.0.0',
      port: 5173,
      strictPort: true,
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
    },
  }
})
