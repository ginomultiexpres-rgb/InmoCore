import { useState } from "react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";

const TRAFFIC_DATA = [
  { date: "1/02", visits: 280 }, { date: "4/02", visits: 320 }, { date: "8/02", visits: 290 },
  { date: "10/02", visits: 340 }, { date: "15/02", visits: 300 }, { date: "20/02", visits: 380 },
  { date: "22/02", visits: 420 }, { date: "25/02", visits: 395 }, { date: "27/02", visits: 360 },
  { date: "28/02", visits: 385 },
];

const ORIGIN_DATA = [
  { name: "WhatsApp", value: 45, color: "#25D366" },
  { name: "Instagram", value: 25, color: "#9C27B0" },
  { name: "QR Code", value: 20, color: "#1E88E5" },
  { name: "Directo", value: 10, color: "#9E9E9E" },
];

const TOP_PROPERTIES = [
  { name: "Depa Miraflores", visits: 321 },
  { name: "Casa San Isidro", visits: 287 },
  { name: "Depa Surco", visits: 264 },
  { name: "Casa La Molina", visits: 247 },
  { name: "Depa San Borja", visits: 217 },
];

const FUNNEL = [
  { label: "Visitas", value: 1245, pct: null, color: "#BBDEFB" },
  { label: "Clics WhatsApp", value: 328, pct: "26.3%", color: "#90CAF9" },
  { label: "Reservas", value: 47, pct: "14.3%", color: "#64B5F6" },
  { label: "Leads CRM", value: 12, pct: "25.5%", color: "#1E88E5" },
];

const RANGES = ["Últimos 7 días", "Últimos 30 días", "Últimos 3 meses"];

export default function Analytics() {
  const [range, setRange] = useState("Últimos 30 días");

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-[24px] font-semibold text-[#212121]">Analíticas</h1>
        <div className="flex items-center gap-3">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="px-4 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] cursor-pointer"
          >
            {RANGES.map((r) => <option key={r}>{r}</option>)}
          </select>
          <button className="w-9 h-9 bg-[#1E88E5] text-white rounded-lg flex items-center justify-center hover:bg-[#1565C0] transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <path d="M8 2v8M4 7l4 4 4-4M2 13h12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        {[
          { icon: "👁", value: "1,245", label: "Visitas al Portafolio", trend: "+12%", up: true },
          { icon: "💬", value: "328", label: "Clics en WhatsApp", trend: "+8%", up: true },
          { icon: "📅", value: "47", label: "Reservas de Visita", trend: "+23%", up: true },
          { icon: "👤", value: "12", label: "Leads Nuevos", trend: "-3%", up: false },
        ].map((k) => (
          <div key={k.label} className="bg-white rounded-[12px] p-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
            <div className="flex items-center gap-3">
              <span className="text-[24px]">{k.icon}</span>
              <div className="flex-1">
                <div className="text-[22px] font-bold text-[#212121] leading-none">{k.value}</div>
                <div className="text-[11px] text-[#757575] mt-0.5">{k.label}</div>
              </div>
              <span className={`text-[11px] font-semibold ${k.up ? "text-[#4CAF50]" : "text-[#F44336]"}`}>
                {k.up ? "↑" : "↓"} {k.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        <div className="lg:col-span-2 bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Visitas al Portafolio</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TRAFFIC_DATA}>
              <defs>
                <linearGradient id="visitsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1E88E5" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#1E88E5" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#BDBDBD" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ border: "none", borderRadius: 8, fontSize: 12, boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}
                formatter={(v: number) => [`${v} visitas`, ""]}
              />
              <Area type="monotone" dataKey="visits" stroke="#1E88E5" strokeWidth={2} fill="url(#visitsGrad)" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 className="text-[15px] font-semibold text-[#212121] mb-3">Origen del Tráfico</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={ORIGIN_DATA} cx="50%" cy="50%" innerRadius={48} outerRadius={70} paddingAngle={2} dataKey="value">
                {ORIGIN_DATA.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip contentStyle={{ border: "none", borderRadius: 8, fontSize: 12 }} formatter={(v: number) => [`${v}%`, ""]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-1">
            {ORIGIN_DATA.map((d) => (
              <div key={d.name} className="flex items-center justify-between text-[12px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <span className="text-[#757575]">{d.name}</span>
                </div>
                <span className="font-semibold text-[#212121]">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Top 5 Propiedades Más Vistas</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={TOP_PROPERTIES} layout="vertical" barSize={14}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" width={120} axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#757575" }} />
              <Tooltip contentStyle={{ border: "none", borderRadius: 8, fontSize: 12 }} />
              <Bar dataKey="visits" fill="#1E88E5" radius={[0, 4, 4, 0]}>
                {TOP_PROPERTIES.map((_, i) => (
                  <Cell key={i} fill={`hsl(210,${80 - i * 10}%,${55 + i * 5}%)`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
          <h3 className="text-[15px] font-semibold text-[#212121] mb-4">Embudo de Conversión</h3>
          <div className="space-y-2">
            {FUNNEL.map((f, i) => (
              <div key={f.label} className="flex items-center gap-3">
                <div className="flex-1">
                  <div
                    className="flex items-center justify-between px-4 py-2.5 rounded-lg"
                    style={{
                      background: f.color,
                      width: `${100 - i * 15}%`,
                      minWidth: "60%",
                    }}
                  >
                    <span className="text-[13px] font-medium text-[#212121]">{f.label}</span>
                    <span className="text-[13px] font-bold text-[#212121]">{f.value.toLocaleString()}</span>
                  </div>
                </div>
                {f.pct && (
                  <div className="flex items-center gap-1 text-[11px] text-[#4CAF50] font-semibold shrink-0">
                    <span>↗</span>{f.pct}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
