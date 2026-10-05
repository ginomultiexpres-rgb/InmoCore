import { lazy } from "react";

// Code-splitting por ruta: cada página se carga bajo demanda, reduciendo el
// bundle inicial (mejor arranque en GitHub Pages). Layout se mantiene eager
// porque es el shell inmediato de la aplicación.
export const Dashboard = lazy(() => import("./pages/Dashboard"));
export const Properties = lazy(() => import("./pages/Properties"));
export const NewProperty = lazy(() => import("./pages/NewProperty"));
export const Portfolio = lazy(() => import("./pages/Portfolio"));
export const CRM = lazy(() => import("./pages/CRM"));
export const Agenda = lazy(() => import("./pages/Agenda"));
export const Analytics = lazy(() => import("./pages/Analytics"));
export const Branding = lazy(() => import("./pages/Branding"));
export const QRCodes = lazy(() => import("./pages/QRCodes"));
