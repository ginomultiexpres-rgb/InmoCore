import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout.tsx";
import { Dashboard, Properties, NewProperty, Portfolio, CRM, Agenda, Analytics, Branding, QRCodes } from "./pages.lazy.ts";
import { lazy } from "react";

/* Lazy load Auth page */
const Auth = lazy(() => import("./pages/Auth.tsx"));

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: "properties", Component: Properties },
      { path: "properties/new", Component: NewProperty },
      { path: "portfolio", Component: Portfolio },
      { path: "crm", Component: CRM },
      { path: "agenda", Component: Agenda },
      { path: "analytics", Component: Analytics },
      { path: "branding", Component: Branding },
      { path: "qr", Component: QRCodes },
    ],
  },
  {
    path: "/auth",
    Component: Auth,
  },
]);