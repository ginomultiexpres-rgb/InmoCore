import { Outlet, NavLink, useLocation } from "react-router";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/properties", label: "Mis Propiedades", icon: BuildingIcon },
  { to: "/portfolio", label: "Mi Portafolio", icon: PortfolioIcon },
  { to: "/crm", label: "CRM", icon: CRMIcon },
  { to: "/agenda", label: "Agenda", icon: AgendaIcon },
  { to: "/analytics", label: "Analíticas", icon: AnalyticsIcon },
  { to: "/branding", label: "Configuración", icon: ConfigIcon },
];

export default function Layout() {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);

  return (
    <div className="flex h-full bg-[#F5F7FA]">
      {/* Sidebar */}
      <aside className="w-56 shrink-0 bg-white border-r border-[#E0E0E0] flex flex-col py-6">
        <div className="px-5 mb-8">
          <span className="text-[22px] font-bold text-[#1E88E5] tracking-tight">InmoCore</span>
        </div>
        <nav className="flex-1 px-3 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                  isActive
                    ? "bg-[#1E88E5] text-white"
                    : "text-[#757575] hover:bg-[#F5F7FA] hover:text-[#212121]"
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="px-5 mt-4 border-t border-[#E0E0E0] pt-4">
          <NavLink
            to="/qr"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-colors ${
                isActive
                  ? "bg-[#1E88E5] text-white"
                  : "text-[#757575] hover:bg-[#F5F7FA] hover:text-[#212121]"
              }`
            }
          >
            <QRIcon className="w-4 h-4 shrink-0" />
            Códigos QR
          </NavLink>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="h-14 bg-white border-b border-[#E0E0E0] flex items-center px-6 gap-4 shrink-0">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" />
              <input
                type="text"
                placeholder="Buscar propiedades, leads..."
                className="w-full pl-9 pr-4 py-2 text-[14px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F5F7FA] transition-colors"
            >
              <BellIcon className="w-5 h-5 text-[#757575]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F44336] rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#1E88E5] flex items-center justify-center text-white text-[12px] font-semibold">
                JP
              </div>
              <span className="text-[14px] font-medium text-[#212121]">Juan Pérez</span>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <rect x="1" y="1" width="6" height="6" rx="1" /><rect x="9" y="1" width="6" height="6" rx="1" />
      <rect x="1" y="9" width="6" height="6" rx="1" /><rect x="9" y="9" width="6" height="6" rx="1" />
    </svg>
  );
}
function BuildingIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="3" width="12" height="11" rx="1" /><path d="M5 14V9h6v5" /><path d="M5 6h2M9 6h2M5 3V1h6v2" />
    </svg>
  );
}
function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="8" cy="8" r="6" /><path d="M8 4v4l3 2" />
    </svg>
  );
}
function CRMIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <path d="M3 4h10M3 8h7M3 12h5" strokeLinecap="round" />
    </svg>
  );
}
function AgendaIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <rect x="2" y="3" width="12" height="11" rx="1" /><path d="M5 1v4M11 1v4M2 7h12" />
    </svg>
  );
}
function AnalyticsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2 12l4-4 3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ConfigIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="8" cy="8" r="2.5" /><path d="M8 1v2M8 13v2M1 8h2M13 8h2M3 3l1.5 1.5M11.5 11.5L13 13M3 13l1.5-1.5M11.5 4.5L13 3" strokeLinecap="round" />
    </svg>
  );
}
function QRIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <rect x="1" y="1" width="6" height="6" rx="0.5" /><rect x="9" y="1" width="6" height="6" rx="0.5" />
      <rect x="1" y="9" width="6" height="6" rx="0.5" /><rect x="3" y="3" width="2" height="2" fill="currentColor" stroke="none" />
      <rect x="11" y="3" width="2" height="2" fill="currentColor" stroke="none" /><rect x="3" y="11" width="2" height="2" fill="currentColor" stroke="none" />
      <path d="M9 9h2v2H9zM11 11h2v2h-2zM13 9v2M9 11v2h2" strokeLinecap="round" />
    </svg>
  );
}
function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
      <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" strokeLinecap="round" />
    </svg>
  );
}
function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path d="M10 2a6 6 0 00-6 6v3l-1.5 2.5h15L16 11V8a6 6 0 00-6-6z" /><path d="M8 16a2 2 0 004 0" strokeLinecap="round" />
    </svg>
  );
}
