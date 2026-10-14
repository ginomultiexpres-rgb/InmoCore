import { lazy } from "react";

// Code-splitting por ruta: cada página se carga bajo demanda, reduciendo el
// bundle inicial (mejor arranque en GitHub Pages). Layout se mantiene eager
// porque es el shell inmediato de la aplicación.
export const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
export const Properties = lazy(() => import("./pages/Properties.tsx"));
export const NewProperty = lazy(() => import("./pages/NewProperty.tsx"));
export const Portfolio = lazy(() => import("./pages/Portfolio.tsx"));
export const CRM = lazy(() => import("./pages/CRM.tsx"));
export const Agenda = lazy(() => import("./pages/Agenda.tsx"));
export const Analytics = lazy(() => import("./pages/Analytics.tsx"));
export const Branding = lazy(() => import("./pages/Branding.tsx"));
export const QRCodes = lazy(() => import("./pages/QRCodes.tsx"));
