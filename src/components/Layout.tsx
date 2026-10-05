import { useEffect, useRef, useState } from "react";
import { Outlet, NavLink, useLocation } from "react-router";

const navItems = [
  { to: "/", label: "Dashboard", icon: DashboardIcon },
  { to: "/properties", label: "Mis Propiedades", icon: BuildingIcon },
  { to: "/portfolio", label: "Mi Portafolio", icon: PortfolioIcon },
  { to: "/crm", label: "CRM", icon: CRMIcon },
  { to: "/agenda", label: "Agenda", icon: AgendaIcon },
  { to: "/analytics", label: "Analíticas", icon: AnalyticsIcon },
  { to: "/branding", label: "Configuración", icon: ConfigIcon },
];

const NOTIFICATIONS = [
  { id: 1, text: "Nuevo lead: María García (Miraflores)", time: "Hace 2 h", color: "#1E88E5" },
  { id: 2, text: "Visita confirmada: Carlos R. — Casa La Molina", time: "Hace 4 h", color: "#4CAF50" },
  { id: 3, text: "18 escaneos al QR de tu portafolio hoy", time: "Hoy", color: "#FF9800" },
];

export default function Layout() {
  const location = useLocation();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Cerrar el panel de notificaciones al hacer clic fuera o con Escape
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setNotifOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [notifOpen]);

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
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? "bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white shadow-sm"
                    : "text-[#757575] hover:bg-[#F5F7FA] hover:text-[#212121] hover:translate-x-0.5"
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
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all duration-200 active:scale-[0.98] ${
                isActive
                  ? "bg-gradient-to-r from-[#1E88E5] to-[#1976D2] text-white shadow-sm"
                  : "text-[#757575] hover:bg-[#F5F7FA] hover:text-[#212121] hover:translate-x-0.5"
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
            <div className="relative group">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD] group-focus-within:text-[#1E88E5] transition-colors" />
              <input
                type="text"
                placeholder="Buscar propiedades, leads..."
                className="w-full pl-9 pr-4 py-2 text-[14px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,136,229,0.12)] transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 ml-auto relative" ref={notifRef}>
            <button
              onClick={() => setNotifOpen((open) => !open)}
              aria-expanded={notifOpen}
              aria-label="Notificaciones"
              className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#F5F7FA] active:scale-95 transition-all"
            >
              <BellIcon className="w-5 h-5 text-[#757575]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#F44336] rounded-full animate-pulse-dot" />
            </button>
            {notifOpen && (
              <div className="absolute top-11 right-14 w-80 bg-white rounded-xl border border-[#E0E0E0] shadow-modal p-2 z-50 animate-slide-down origin-top-right">
                <p className="text-[13px] font-semibold text-[#212121] px-2 py-1.5">Notificaciones</p>
                {NOTIFICATIONS.map((n) => (
                  <div
                    key={n.id}
                    className="flex items-start gap-2.5 px-2 py-2 rounded-lg hover:bg-[#F5F7FA] transition-colors cursor-pointer"
                  >
                    <span className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: n.color }} />
                    <div className="min-w-0">
                      <p className="text-[12px] text-[#212121] leading-snug">{n.text}</p>
                      <p className="text-[11px] text-[#BDBDBD] mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="flex items-center gap-2 cursor-pointer group">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1E88E5] to-[#1565C0] flex items-center justify-center text-white text-[12px] font-semibold ring-2 ring-transparent group-hover:ring-[#BBDEFB] transition-all">
                JP
              </div>
              <span className="text-[14px] font-medium text-[#212121]">Juan Pérez</span>
            </div>
          </div>
        </header>

        {/* Page content: la key fuerza remontar para animar la entrada en cada navegación */}
        <main className="flex-1 overflow-auto">
          <div key={location.pathname} className="page-enter h-full">
            <Outlet />
          </div>
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
