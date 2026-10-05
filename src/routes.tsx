import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
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
]);
