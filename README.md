# SaaS-Inmobiliario

Aplicación React + Vite + Tailwind CSS v4 lista para desplegarse en **GitHub Pages** mediante GitHub Actions.

## Scripts

```bash
pnpm install        # instalar dependencias
pnpm dev            # servidor de desarrollo (http://localhost:8443)
pnpm build          # compila la app estática en dist/
pnpm preview        # previsualiza el build de producción
```

## Despliegue en GitHub Pages

1. Sube este repositorio a GitHub.
2. En el repositorio: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Haz push a la rama `main` (o ejecuta el workflow manualmente). El workflow
   [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) compila y publica
   el contenido de `dist/` en Pages.
4. La URL será `https://<usuario>.github.io/<repo>/` (o la raíz si el repo se
   llama `<usuario>.github.io`).

### Cómo funciona

- **Ruta base**: `vite.config.ts` calcula `base` automáticamente a partir de la
  variable `GITHUB_REPOSITORY` que inyecta GitHub Actions (`/nombre-repo/`), por lo
  que los assets cargan correctamente desde la subruta de Pages. En local se usa `/`.
  Puedes forzarla con `PUBLIC_URL` o `FIGMA_PUBLIC_URL`.
- **Enrutamiento**: la app usa `createHashRouter` (URLs tipo `#/crm`, `#/analytics`…),
  porque GitHub Pages es un hosting estático sin reescritura de URLs.
- **Redirección 404**: `public/404.html` captura rutas "limpias" (p. ej. `/repo/crm`)
  y las reenvía al hash-router correspondiente. El workflow sustituye `__BASE_URL__`
  por la base real al publicar.
- **Indexación**: `.figma/make/site.json` marca `robots.index: false`, así que el build
  genera `robots.txt`/meta `noindex`. Si quieres que Google indexe el sitio, cambia
  `"index": false` por `"index": true`.

## Estructura

- `src/main.tsx` — punto de entrada de React
- `src/App.tsx` / `src/routes.tsx` — router (hash-routing) y layout
- `src/pages/` — páginas (Dashboard, Properties, Portfolio, CRM, Agenda, Analytics, Branding, QRCodes, NewProperty)
- `src/components/Layout.tsx` — navegación lateral
- `public/404.html` — redireccionador SPA para GitHub Pages
- `.github/workflows/deploy.yml` — CI/CD de despliegue
