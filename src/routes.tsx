import { createHashRouter } from 'react-router-dom';
import { lazy } from 'react';
import Layout from './components/Layout';
import { ProtectedRoute } from './hooks/useAuth';
import { Suspense } from 'react';

/* Code-splitting por ruta: cada página se carga bajo demanda. */
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Properties = lazy(() => import('./pages/Properties'));
const NewProperty = lazy(() => import('./pages/NewProperty'));
const Portfolio = lazy(() => import('./pages/Portfolio'));
const CRM = lazy(() => import('./pages/CRM'));
const Agenda = lazy(() => import('./pages/Agenda'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Branding = lazy(() => import('./pages/Branding'));
const QRCodes = lazy(() => import('./pages/QRCodes'));
const Auth = lazy(() => import('./pages/Auth'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#F5F7FA]">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#1E88E5]" />
  </div>
);

const withSuspense = (El: React.ComponentType) => (
  <Suspense fallback={<PageFallback />}>
    <El />
  </Suspense>
);

/**
 * Hash router: imprescindible para GitHub Pages (app estática servida en
 * /InmoCore/), ya que no hay servidor que haga rewrite de rutas SPA.
 * Todas las rutas de negocio quedan protegidas por sesión.
 */
export const router = createHashRouter([
  {
    path: '/auth',
    element: withSuspense(Auth),
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <Layout />,
        children: [
          { index: true, element: withSuspense(Dashboard) },
          { path: 'properties', element: withSuspense(Properties) },
          { path: 'properties/new', element: withSuspense(NewProperty) },
          { path: 'portfolio', element: withSuspense(Portfolio) },
          { path: 'crm', element: withSuspense(CRM) },
          { path: 'agenda', element: withSuspense(Agenda) },
          { path: 'analytics', element: withSuspense(Analytics) },
          { path: 'branding', element: withSuspense(Branding) },
          { path: 'qr', element: withSuspense(QRCodes) },
        ],
      },
    ],
  },
]);
