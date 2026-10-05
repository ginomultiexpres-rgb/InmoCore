import { createHashRouter } from "react-router";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Properties from "./pages/Properties";
import Portfolio from "./pages/Portfolio";
import CRM from "./pages/CRM";
import Agenda from "./pages/Agenda";
import Analytics from "./pages/Analytics";
import Branding from "./pages/Branding";
import QRCodes from "./pages/QRCodes";
import NewProperty from "./pages/NewProperty";

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
