import { Suspense } from "react";
import { createHashRouter } from "react-router";
import Layout from "./components/Layout";

// Pantalla de carga mostrada mientras el chunk lazy de cada página se descarga.
function PageLoader() {
  return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-500/30 border-t-indigo-500" />
    </div>
  );
}

function withSuspense(el: React.ReactNode) {
  return <Suspense fallback={<PageLoader />}>{el}</Suspense>;
}
import {
  Dashboard,
  Properties,
  NewProperty,
  Portfolio,
  CRM,
  Agenda,
  Analytics,
  Branding,
  QRCodes,
} from "./pages.lazy";

export const router = createHashRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, element: withSuspense(<Dashboard />) },
      { path: "properties", element: withSuspense(<Properties />) },
      { path: "properties/new", element: withSuspense(<NewProperty />) },
      { path: "portfolio", element: withSuspense(<Portfolio />) },
      { path: "crm", element: withSuspense(<CRM />) },
      { path: "agenda", element: withSuspense(<Agenda />) },
      { path: "analytics", element: withSuspense(<Analytics />) },
      { path: "branding", element: withSuspense(<Branding />) },
      { path: "qr", element: withSuspense(<QRCodes />) },
    ],
  },
]);
