// Componente CRM - Pipeline de Ventas
import { useEffect, useState } from "react";
import { Reveal } from "../components/ui.tsx";
import { getLeads, createLead, Lead } from "../services/api";

// Tipo Lead está definido en src/services/api.ts

type Column = {
  id: string;
  label: string;
  color: string;
  count: number;
};

const COLUMNS: Column[] = [
  { id: "nuevo", label: "Nuevo", color: "#1E88E5", count: 0 },
  { id: "contactado", label: "Contactado", color: "#9C27B0", count: 0 },
  { id: "visita", label: "Visita Agendada", color: "#FF9800", count: 0 },
  { id: "negociacion", label: "Negociación", color: "#FFC107", count: 0 },
  { id: "reservado", label: "Reservado", color: "#00BCD4", count: 0 },
  { id: "cerrado", label: "Cerrado", color: "#4CAF50", count: 0 },
];

const tempColor: Record<string, string> = {
  hot: "#F44336",
  warm: "#FF9800",
  cold: "#9E9E9E",
};

export default function CRM() {
  const [leads, setLeads] = useState<Record<string, Lead[]>>({
    nuevo: [],
    contactado: [],
    visita: [],
    negociacion: [],
    reservado: [],
    cerrado: [],
  });
  const [dragging, setDragging] = useState<{ lead: Lead; fromCol: string } | null>(null);
  const [dragOverCol, setDragOverCol] = useState<string | null>(null);
  const [showNewLead, setShowNewLead] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Cargar leads al iniciar
  useEffect(() => {
    const loadLeads = async () => {
      try {
        const data = await getLeads();
        // Convertir array a Record<string, Lead[]>
        const leadsRecord: Record<string, Lead[]> = {
          nuevo: [],
          contactado: [],
          visita: [],
          negociacion: [],
          reservado: [],
          cerrado: [],
        };
        // Agrupar leads por su estado (asumiendo que cada lead tiene una propiedad 'status')
        data.forEach(lead => {
          const status = lead.status as keyof Record<string, Lead[]> || 'nuevo';
          if (!leadsRecord[status]) {
            leadsRecord[status] = [];
          }
          leadsRecord[status].push(lead);
        });
        setLeads(leadsRecord);
      } catch (error) {
        console.error("Error cargando leads:", error);
        // Si falla la API, usar datos iniciales vacíos
        setLeads({
          nuevo: [],
          contactado: [],
          visita: [],
          negociacion: [],
          reservado: [],
          cerrado: [],
        });
      }
    };
    loadLeads();
  }, []);

  // Cerrar el modal con la tecla Escape
  useEffect(() => {
    if (!showNewLead) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setShowNewLead(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showNewLead]);

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

  const handleAddLead = async (leadData: Omit<Lead, 'id' | 'created_at'>) => {
    setIsSaving(true);
    setSaveError(null);

    try {
      const newLead = await createLead({
        ...leadData,
        temp: 'warm',
        time: 'Ahora',
        avatar: leadData.name.slice(0, 2).toUpperCase(),
        img: `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format`,
      });

      // Agregar al estado local después de guardar exitosamente
      setLeads((prev) => ({
        ...prev,
        nuevo: [newLead, ...prev.nuevo],
      }));
    } catch (error) {
      console.error("Error creating lead:", error);
      setSaveError(error instanceof Error ? error.message : "Error desconocido al crear el lead");
      // Aún agregamos al estado local para UI, pero marcado con error
      setLeads((prev) => ({
        ...prev,
        nuevo: [
          {
            ...leadData,
            id: Date.now().toString(),
            temp: "hot" as const,
            time: "Ahora",
            avatar: leadData.name.slice(0, 2).toUpperCase(),
            img: `https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&h=80&fit=crop&auto=format`,
          } as Lead,
          ...prev.nuevo,
        ],
      }));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-[24px] font-bold text-[#212121]">CRM — Pipeline de Ventas</h1>
        </div>
        <button
          onClick={() => setShowNewLead(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          + Nuevo Lead
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-4 flex-wrap mb-5 p-3 bg-white rounded-xl shadow-card">
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
        {COLUMNS.map((col, idx) => (
          <Reveal key={col.id} delay={idx * 60} className="shrink-0 w-52 h-full">
            <div
              className={`h-full flex flex-col rounded-xl border transition-colors duration-200 ${
                              dragOverCol === col.id
                                ? "bg-[#E3F2FD] border-[#1E88E5] scale-[1.01]"
                                : "bg-[#F5F7FA] border-transparent"
                            }`}
              onDragOver={(e) => { e.preventDefault(); setDragOverCol(col.id); }}
              onDragLeave={() => setDragOverCol(null)}
              onDrop={() => handleDrop(col.id)}
            >
              {/* Column header */}
              <div className="flex items-center gap-2 p-3 pb-2">
                <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: col.color }} />
                <span className="text-[13px] font-semibold text-[#212121]">{col.label}</span>
                <span className="ml-auto text-[11px] font-semibold text-white px-1.5 py-0.5 rounded-full transition-transform" style={{ background: col.color }}>
                  {totalByCol[col.id] ?? 0}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-2 max-h-[calc(100vh-320px)]">
                {(leads[col.id] ?? []).map((lead) => (
                  <div
                    key={lead.id}
                    draggable
                    onDragStart={() => handleDragStart(lead, col.id)}
                    className="bg-white rounded-xl p-3 cursor-grab active:cursor-grabbing shadow-card hover:shadow-elevated hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200 animate-scale-in"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="w-8 h-8 rounded-full bg-[#BBDEFB] flex items-center justify-center text-[11px] font-semibold text-[#1565C0] shrink-0 overflow-hidden">
                        <img src={lead.img} alt={lead.name} loading="lazy" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
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
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>

      {/* New Lead Modal */}
      {showNewLead && (
        <div
          className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4 animate-fade-in"
          onClick={() => setShowNewLead(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-modal animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-[18px] font-semibold text-[#212121] mb-4">Nuevo Lead</h3>
            {isSaving && saveError ? (
              <div className="bg-[#FFEBEE] rounded-xl p-3 mb-3">
                <p className="text-[14px] text-[#C62828] font-medium">Error:</p>
                <p className="text-[13px] text-[#757575]">{saveError}</p>
              </div>
            ) : null}
            <div className="space-y-3 mb-5">
              {[
                { label: "Nombre", value: "", setter: (v: string) => {}, placeholder: "María García" },
                { label: "Presupuesto", value: "", setter: (v: string) => {}, placeholder: "S/ 900K–1.3M" },
                { label: "Interés", value: "", setter: (v: string) => {}, placeholder: "Departamento en Miraflores" },
              ].map(({ label, value, setter, placeholder }) => (
              <div key={label}>
                <label className="block text-[13px] font-medium text-[#212121] mb-1">{label}</label>
                <input
                                  type="text"
                                  value={value}
                                  onChange={(e) => setter(e.currentTarget.value ?? '')}
                                  onKeyDown={(e) => e.key === "Enter" && handleAddLead({ name: e.currentTarget.value } as Omit<Lead, 'id' | 'created_at'>)}
                                  placeholder={placeholder}
                                  className="w-full px-3 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] focus:shadow-[0_0_0_3px_rgba(30,136,229,0.12)] transition-all"
                                />
              </div>
            ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewLead(false)} className="flex-1 py-2.5 text-[14px] border border-[#E0E0E0] rounded-lg text-[#757575] hover:bg-[#F5F7FA] active:scale-95 transition-all">
                Cancelar
              </button>
              <button
                onClick={() => setShowNewLead(false)}
                disabled={isSaving}
                className={`flex-1 py-2.5 text-[14px] bg-[#1E88E5] text-white rounded-lg font-medium hover:bg-[#1565C0] hover:shadow-elevated active:scale-95 transition-all ${isSaving ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSaving ? "Guardando..." : "Agregar Lead"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}