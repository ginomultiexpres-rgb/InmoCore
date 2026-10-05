import { useState } from "react";
import { Link } from "react-router";
import { Reveal } from "../components/ui";

type Visit = {
  id: number;
  client: string;
  property: string;
  day: number; // índice en DAYS (0 = lunes)
  hour: number;
  color: string;
  status: "confirmed" | "pending";
};

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const HOURS = [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];

const INITIAL_VISITS: Visit[] = [
  { id: 1, client: "María G.", property: "Depa Miraflores", day: 0, hour: 9, color: "#1E88E5", status: "confirmed" },
  { id: 2, client: "Carlos R.", property: "Casa La Molina", day: 2, hour: 10, color: "#1E88E5", status: "confirmed" },
  { id: 3, client: "Ana L.", property: "Depa Surco", day: 3, hour: 16, color: "#1E88E5", status: "confirmed" },
  { id: 4, client: "Pedro M.", property: "Local Barranco", day: 4, hour: 10, color: "#4CAF50", status: "confirmed" },
  { id: 5, client: "Laura S.", property: "Depa San Borja", day: 4, hour: 19, color: "#FF9800", status: "pending" },
];

export default function Agenda() {
  const [view, setView] = useState<"semana" | "mes" | "lista">("semana");
  const [visits] = useState<Visit[]>(INITIAL_VISITS);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const upcoming = [...visits].sort((a, b) => a.day - b.day || a.hour - b.hour);

  // Índice del día actual con DAYS comenzando en lunes (getDay: 0 = domingo).
  const todayIdx = (new Date().getDay() + 6) % 7;

  return (
    <div className="p-6 flex gap-5 h-full">
      {/* Calendar */}
      <Reveal className="flex-1 min-w-0 h-full"><div className="bg-white rounded-[12px] overflow-hidden flex flex-col h-full shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E0E0E0]">
          <span className="text-[18px] font-bold text-[#1E88E5]">InmoCore</span>
          <h2 className="text-[18px] font-semibold text-[#212121]">Agenda de Visitas</h2>
          <div className="flex gap-1.5">
            {(["semana", "mes", "lista"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-lg text-[13px] font-medium capitalize transition-colors ${
                  view === v
                    ? "bg-[#1E88E5] text-white"
                    : "text-[#757575] hover:bg-[#F5F7FA]"
                }`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Mini sidebar */}
          <div className="w-36 border-r border-[#E0E0E0] py-4 px-3 shrink-0">
            <nav className="space-y-1">
              {[
                { to: "/agenda", label: "Agenda" },
                { to: "/crm", label: "Mis Leads" },
                { to: "/analytics", label: "Analíticas" },
              ].map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `block w-full text-left px-3 py-2 rounded-lg text-[13px] font-medium transition-all duration-200 active:scale-[0.98] ${
                      isActive ? "bg-[#E3F2FD] text-[#1E88E5]" : "text-[#757575] hover:bg-[#F5F7FA] hover:translate-x-0.5"
                    }`
                  }
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Calendar grid */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-[12px] border-collapse">
              <thead>
                <tr>
                  <th className="w-14 py-3 text-[#BDBDBD] font-normal border-b border-[#E0E0E0]" />
                  {DAYS.map((d, i) => (
                    <th key={d} className={`py-3 font-semibold border-b border-[#E0E0E0] text-center ${i === todayIdx ? "text-[#1E88E5] border-b-2 border-b-[#1E88E5]" : "text-[#757575]"}`}>
                      {d}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {HOURS.map((hour) => (
                  <tr key={hour} className="h-14">
                    <td className="text-[#BDBDBD] text-right pr-3 align-top pt-1 text-[11px]">{hour}:00</td>
                    {DAYS.map((_, dayIdx) => {
                      const visit = visits.find((v) => v.day === dayIdx && v.hour === hour);
                      return (
                        <td
                          key={dayIdx}
                          className={`border border-[#F5F7FA] relative p-0.5 ${dayIdx === todayIdx ? "bg-[#E3F2FD]/40" : ""}`}
                        >
                          {!visit && (
                            <button className="w-full h-full opacity-0 hover:opacity-100 transition-opacity text-[#BDBDBD] text-[16px] leading-none" aria-label="Agregar visita">+</button>
                          )}
                          {visit && (
                            <button
                              onClick={() => setSelectedVisit(visit)}
                              className="w-full h-12 rounded-lg px-2 py-1 text-white text-left flex flex-col justify-center gap-0.5 hover:brightness-110 hover:scale-[1.03] active:scale-100 transition-all duration-200 shadow-card animate-scale-in"
                              style={{ background: visit.color }}
                            >
                              <span className="text-[11px] font-semibold leading-tight truncate">
                                {visit.client} {visit.status === "pending" ? "🕐" : ""}
                              </span>
                              <span className="text-[10px] opacity-80 truncate">{visit.property}</span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div></Reveal>

      {/* Right panel */}
      <Reveal delay={120} className="w-64 shrink-0 space-y-4">
        <div className="bg-white rounded-[12px] p-4 shadow-card hover:shadow-elevated transition-shadow duration-300">
          <h3 className="text-[14px] font-semibold text-[#212121] mb-3">Próximas Visitas</h3>
          <div className="space-y-3">
            {upcoming.slice(0, 3).map((v) => (
              <div key={v.id} className="border border-[#E0E0E0] rounded-xl p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-[12px] text-[#757575]">{DAYS[v.day]} 23, {v.hour}:00</p>
                    <p className="text-[13px] font-semibold text-[#212121]">{v.client.replace(".", "")}</p>
                    <p className="text-[11px] text-[#757575]">+51 1 234 5678</p>
                    <p className="text-[12px] font-medium text-[#212121] mt-0.5">{v.property}</p>
                  </div>
                  <div className="w-10 h-10 rounded-lg bg-[#F5F7FA] flex items-center justify-center shrink-0">
                    <svg className="w-5 h-5 text-[#BDBDBD]" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1}>
                      <rect x="2" y="5" width="16" height="13" rx="1.5" /><path d="M6 1v4M14 1v4M2 9h16" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white"
                    style={{ background: v.status === "confirmed" ? "#4CAF50" : "#FF9800" }}
                  >
                    {v.status === "confirmed" ? "Confirmada" : "Pendiente"}
                  </span>
                  <button className="text-[11px] text-[#1E88E5] hover:underline">Confirmar</button>
                  <button className="text-[11px] text-[#F44336] hover:underline">Cancelar</button>
                </div>
              </div>
            ))}
          </div>
          <button className="text-[12px] text-[#1E88E5] hover:underline mt-2 block">
            Configurar Disponibilidad
          </button>
        </div>

        <div className="bg-white rounded-[12px] p-4 shadow-card hover:shadow-elevated transition-shadow duration-300">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-[14px] font-semibold text-[#212121]">Disponibilidad Actual</h3>
            <button className="text-[#757575] hover:text-[#1E88E5] transition-colors">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                <path d="M11 2l3 3-8 8H3v-3L11 2z" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
          <p className="text-[12px] text-[#757575]">Lun-Vie: 10:00-13:00, 16:00-19:00</p>
          <p className="text-[12px] text-[#757575]">Sáb: 10:00-14:00</p>
        </div>
      </Reveal>

      {/* Visit detail modal */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4 animate-fade-in" onClick={() => setSelectedVisit(null)}>
          <div className="bg-white rounded-2xl p-5 w-80 shadow-modal animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-[16px] font-semibold text-[#212121] mb-3">Detalles de la visita</h3>
            <div className="space-y-2 text-[13px]">
              <div className="flex justify-between"><span className="text-[#757575]">Cliente</span><span className="font-medium">{selectedVisit.client}</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Propiedad</span><span className="font-medium">{selectedVisit.property}</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Día</span><span className="font-medium">{DAYS[selectedVisit.day]}</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Hora</span><span className="font-medium">{selectedVisit.hour}:00</span></div>
              <div className="flex justify-between"><span className="text-[#757575]">Estado</span>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold text-white" style={{ background: selectedVisit.status === "confirmed" ? "#4CAF50" : "#FF9800" }}>
                  {selectedVisit.status === "confirmed" ? "Confirmada" : "Pendiente"}
                </span>
              </div>
            </div>
            <button onClick={() => setSelectedVisit(null)} className="mt-4 w-full py-2 text-[13px] font-medium bg-[#F5F7FA] rounded-lg hover:bg-[#E0E0E0] transition-colors">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
