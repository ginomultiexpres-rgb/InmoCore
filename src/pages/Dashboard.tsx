import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const visitData = [
  { day: "Lun", visits: 8 },
  { day: "Mar", visits: 12 },
  { day: "Mié", visits: 15 },
  { day: "Jue", visits: 11 },
  { day: "Vie", visits: 6 },
  { day: "Sáb", visits: 9 },
  { day: "Dom", visits: 10 },
];

const leadStages = [
  { name: "Nuevo", value: 5, color: "#1E88E5" },
  { name: "Contactado", value: 3, color: "#9C27B0" },
  { name: "Visita Agendada", value: 4, color: "#FF9800" },
  { name: "Negociación", value: 2, color: "#FFC107" },
  { name: "Reservado", value: 1, color: "#00BCD4" },
  { name: "Cerrado", value: 3, color: "#4CAF50" },
];

const recentProperties = [
  { name: "Depa Miraflores", address: "Miraflores, Lima", time: "11:20", views: "119" },
  { name: "Casa San Isidro", address: "San Isidro, Lima", time: "11:05", views: "101" },
  { name: "Local Barranco", address: "Barranco, Lima", time: "12:06", views: "121" },
];

const todayVisits = [
  { time: "10:00", advisor: "Juan Pérez", client: "María García" },
  { time: "12:30", advisor: "Juan Pérez", client: "Carlos R." },
  { time: "16:00", advisor: "Juan Pérez", client: "Pedro M." },
];

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6 max-w-[1400px]">
      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={<BuildingKPIIcon />}
          value="15/20"
          label="Propiedades Activas"
          trend="+2"
        />
        <KPICard
          icon={<EyeIcon />}
          value="45"
          label="Visitas Hoy"
          trend="+8"
        />
        <KPICard
          icon={<WAIcon />}
          value="12"
          label="WhatsApps"
          trend="+3"
          iconBg="#25D366"
        />
        <KPICard
          icon={<CalendarKPIIcon />}
          value="3"
          label="Visitas Agendadas"
          trend="+1"
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
          <h3 className="text-[16px] font-semibold text-[#212121] mb-4">Visitas esta semana</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={visitData} barSize={28}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#757575" }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ border: "none", borderRadius: 8, boxShadow: "0 4px 6px rgba(0,0,0,0.1)", fontSize: 12 }}
                cursor={{ fill: "#F5F7FA" }}
              />
              <Bar dataKey="visits" radius={[4, 4, 0, 0]}>
                {visitData.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? "#1E88E5" : "#BBDEFB"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
          <h3 className="text-[16px] font-semibold text-[#212121] mb-4">Leads por etapa</h3>
          <div className="flex flex-col items-center">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={leadStages}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {leadStages.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ border: "none", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2 w-full">
              {leadStages.map((s) => (
                <div key={s.name} className="flex items-center gap-1.5 text-[11px] text-[#757575]">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: s.color }} />
                  {s.name}: {s.value}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#FF9800]">⚡</span>
            <h3 className="text-[16px] font-semibold text-[#212121]">Propiedades más vistas</h3>
          </div>
          <div className="space-y-3">
            {recentProperties.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#BBDEFB] shrink-0 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format"
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-medium text-[#212121] truncate">{p.name}</p>
                  <p className="text-[12px] text-[#757575] truncate">{p.address}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[12px] font-medium text-[#212121]">{p.time}</p>
                  <p className="text-[11px] text-[#757575]">{p.views} visitas</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-5" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[#1E88E5]">🗓</span>
            <h3 className="text-[16px] font-semibold text-[#212121]">Visitas de hoy</h3>
          </div>
          <div className="space-y-3">
            {todayVisits.map((v) => (
              <div key={v.time} className="flex items-center gap-4 py-2 border-b border-[#F5F7FA] last:border-0">
                <span className="text-[13px] font-semibold text-[#1E88E5] w-12 shrink-0">{v.time}</span>
                <span className="text-[13px] text-[#212121]">{v.advisor}</span>
                <span className="text-[13px] text-[#757575] ml-auto">{v.client}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function KPICard({ icon, value, label, trend, iconBg }: {
  icon: React.ReactNode; value: string; label: string; trend: string; iconBg?: string;
}) {
  return (
    <div className="bg-white rounded-[12px] p-4 flex items-center gap-4" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg ? `${iconBg}20` : "#E3F2FD" }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[22px] font-bold text-[#212121] leading-none">{value}</div>
        <div className="text-[12px] text-[#757575] mt-0.5">{label}</div>
      </div>
      <div className="text-[11px] font-semibold text-[#4CAF50] flex items-center gap-0.5 shrink-0">
        <span>↗</span>{trend}
      </div>
    </div>
  );
}

function BuildingKPIIcon() {
  return (
    <svg className="w-6 h-6 text-[#1E88E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="5" width="18" height="16" rx="1.5" /><path d="M8 21V12h8v9" /><path d="M3 10h18" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg className="w-6 h-6 text-[#1E88E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" />
    </svg>
  );
}
function WAIcon() {
  return (
    <svg className="w-6 h-6 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function CalendarKPIIcon() {
  return (
    <svg className="w-6 h-6 text-[#1E88E5]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  );
}
