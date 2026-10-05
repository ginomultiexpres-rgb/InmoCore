import { useState } from "react";

type Lead = {
  id: number;
  name: string;
  budget: string;
  interest: string;
  temp: "hot" | "warm" | "cold";
  time: string;
  avatar: string;
  img: string;
};

type Column = {
  id: string;
  label: string;
  color: string;
  count: number;
};

const COLUMNS: Column[] = [
  { id: "nuevo", label: "Nuevo", color: "#1E88E5", count: 5 },
  { id: "contactado", label: "Contactado", color: "#9C27B0", count: 3 },
  { id: "visita", label: "Visita Agendada", color: "#FF9800", count: 4 },
  { id: "negociacion", label: "Negociación", color: "#FFC107", count: 2 },
  { id: "reservado", label: "Reservado", color: "#00BCD4", count: 1 },
  { id: "cerrado", label: "Cerrado", color: "#4CAF50", count: 3 },
];

const INITIAL_LEADS: Record<string, Lead[]> = {
  nuevo: [
    { id: 1, name: "María García", budget: "S/ 900–1.3M", interest: "Departamento en Miraflores", temp: "hot", time: "Hace 2h", avatar: "MG", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format" },
    { id: 2, name: "Carlos Ruiz", budget: "S/ 600–800K", interest: "Depa en Surco", temp: "warm", time: "Hace 3h", avatar: "CR", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&h=80&fit=crop&auto=format" },
    { id: 3, name: "Ana López", budget: "S/ 1.5–2M", interest: "Casa en La Molina", temp: "cold", time: "Hace 5h", avatar: "AL", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=80&fit=crop&auto=format" },
  ],
  contactado: [
    { id: 4, name: "Pedro Morales", budget: "S/ 900–1.3M", interest: "Local en Barranco", temp: "hot", time: "Hace 1h", avatar: "PM", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format" },
  ],
  visita: [
    { id: 5, name: "Laura Sánchez", budget: "S/ 2–2.5M", interest: "Casa en San Isidro", temp: "hot", time: "Hace 2h", avatar: "LS", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&h=80&fit=crop&auto=format" },
    { id: 6, name: "Roberto Silva", budget: "S/ 900–1.3M", interest: "Depa en Jesús María", temp: "warm", time: "Hace 4h", avatar: "RS", img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=80&h=80&fit=crop&auto=format" },
  ],
  negociacion: [
    { id: 7, name: "Elena Torres", budget: "S/ 1.5–2M", interest: "Depa en San Borja", temp: "hot", time: "Hace 6h", avatar: "ET", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format" },
  ],
  reservado: [
    { id: 8, name: "Miguel Castro", budget: "S/ 2.5–3.5M", interest: "Casa en La Molina", temp: "warm", time: "Hace 1d", avatar: "MC", img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=80&h=80&fit=crop&auto=format" },
  ],
  cerrado: [
    { id: 9, name: "Sofía Vega", budget: "S/ 750K", interest: "Depa en Lince", temp: "hot", time: "Hace 2d", avatar: "SV", img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=80&h=80&fit=crop&auto=format" },
    { id: 10, name: "Diego Reyes", budget: "S/ 1.8M", interest: "Casa en Surco", temp: "warm", time: "Hace 3d", avatar: "DR", img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format" },
  ],
};

const tempColor: Record<string, string> = {
  hot: "#F44336",
  warm: "#FF9800",
  cold: "#9E9E9E",
};

export default function CRM() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [dragging, setDragging] = useState<{ lead: Lead; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);

  const handleDragStart = (lead: Lead, colId: string) => {
    setDragging({ lead, fromCol: colId });
  };

  const handleDrop = (toCol: string) => {
    if (!dragging || dragging.fromCol === toCol) return;
    setLeads((prev) => {
      const from = prev[dragging.fromCol].filter((l) => l.id !== dragging.lead.id);
      const to = [...prev[toCol], dragging.lead];
      return { ...prev, [dragging.fromCol]: from, [toCol]: to };
    });
    setDragging(null);
    setDragOverCol(null);
  };

  const totalByCol = Object.fromEntries(
    Object.entries(leads).map(([k, v]) => [k, v.length])
  );

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#212121]">CRM — Pipeline de Ventas</h1>
        </div>
        <button
          onClick={() => setShowNewLead(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] transition-colors"
        >
          + Nuevo Lead
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap mb-5 p-3 bg-white rounded-xl" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
        {COLUMNS.map((col) => (
          <div key={col.id} className="flex items-center gap-1.5 text-[13px]">
            <span className="w-3 h-3 rounded-sm" style={{ background: col.color }} />
            <span className="text-[#757575]">{col.label}:</span>
            <span className="font-semibold text-[#212121]">{totalByCol[col.id] ?? 0}</span>
          </div>
        ))}
      </div>

      {/* Kanban board */}
      <div className="flex gap-3 overflow-x-auto pb-2 flex-1">
        {COLUMNS.map((col) => (
          <div
            key={col.id}
            className={`shrink-0 w-52 flex flex-col rounded-xl transition-colors ${
              dragOverCol === col.id ? "bg-[#E3F2FD]" : "bg-[#F5F7FA]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
            onDragLeave={() => setDragOverCol(null)}
            onDrop={() => handleDrop(col.id)}
          >
            {/* Column header */}
            <div className="flex items-center gap-2 p-3 pb-2">
              <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: col.color }} />
              <span className="text-[13px] font-semibold text-[#212121]">{col.label}</span>
              <span className="ml-auto text-[11px] font-semibold text-white px-1.5 py-0.5 rounded-full" style={{ background: col.color }}>
                {totalByCol[col.id] ?? 0}
              </span>
            </div>

            {/* Cards */}
            <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-2 max-h-[calc(100vh-320px)]">
              {(leads[col.id] ?? []).map((lead) => (
                <LeadCard
                  key={lead.id}
                  lead={lead}
                  onDragStart={() => handleDragStart(lead, col.id)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* New Lead Modal */}
      {showNewLead && (
        <NewLeadModal
          onClose={() => setShowNewLead(false)}
          onAdd={(lead) => {
            setLeads((prev) => ({ ...prev, nuevo: [lead, ...prev.nuevo] }));
            setShowNewLead(false);
          }}
        />
      )}
    </div>
  );
}

function LeadCard({ lead, onDragStart }: { lead: Lead; onDragStart: () => void }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white rounded-xl p-3 cursor-grab active:cursor-grabbing hover:shadow-md transition-shadow"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="w-8 h-8 rounded-full bg-[#BBDEFB] flex items-center justify-center text-[11px] font-semibold text-[#1565C0] shrink-0 overflow-hidden">
          <img src={lead.img} alt={lead.name} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
        </div>
        <span className="text-[10px] text-[#BDBDBD]">{lead.time}</span>
      </div>
      <p className="text-[13px] font-semibold text-[#212121] leading-tight">{lead.name}</p>
      <p className="text-[12px] text-[#757575] mt-0.5">{lead.budget}</p>
      <div className="flex items-center gap-1 mt-1.5">
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: tempColor[lead.temp] }} />
        <span className="text-[11px] text-[#757575]">{lead.temp}</span>
      </div>
      <p className="text-[11px] text-[#BDBDBD] mt-1 truncate">{lead.interest}</p>
    </div>
  );
}

function NewLeadModal({ onClose, onAdd }: { onClose: () => void; onAdd: (lead: Lead) => void }) {
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("");
  const [interest, setInterest] = useState("");

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({
      id: Date.now(),
      name,
      budget,
      interest,
      temp: "warm",
      time: "Ahora",
      avatar: name.slice(0, 2).toUpperCase(),
      img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format",
    });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md" style={{ boxShadow: "0 20px 25px rgba(0,0,0,0.1)" }}>
        <h3 className="text-[18px] font-semibold text-[#212121] mb-4">Nuevo Lead</h3>
        <div className="space-y-3 mb-5">
          {[
            { label: "Nombre", value: name, setter: setName, placeholder: "María García" },
            { label: "Presupuesto", value: budget, setter: setBudget, placeholder: "S/ 900K–1.3M" },
            { label: "Interés", value: interest, setter: setInterest, placeholder: "Departamento en Miraflores" },
          ].map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-[13px] font-medium text-[#212121] mb-1">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] transition-colors"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] transition-colors">
            Cancelar
          </button>
          <button onClick={handleSubmit} className="flex-1 py-2.5 text-[14px] bg-[#1E88E5] text-white rounded-lg font-medium hover:bg-[#1565C0] transition-colors">
            Agregar Lead
          </button>
        </div>
      </div>
    </div>
  );
}
