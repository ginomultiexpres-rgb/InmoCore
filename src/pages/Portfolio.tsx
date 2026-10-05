import { useState } from "react";

const PROPERTIES = [
  { id: 1, price: "S/ 950,000", name: "Departamento en Miraflores", beds: 2, baths: 2, sqm: 85, img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&auto=format" },
  { id: 2, price: "S/ 1,800,000", name: "Casa en San Isidro", beds: 3, baths: 2, sqm: 150, img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format" },
  { id: 3, price: "S/ 680,000", name: "Depa en Surco", beds: 1, baths: 1, sqm: 60, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format" },
  { id: 4, price: "S/ 2,400,000", name: "Casa en La Molina", beds: 4, baths: 3, sqm: 210, img: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&h=400&fit=crop&auto=format" },
];

export default function Portfolio() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("Venta");
  const [tipoFilter, setTipoFilter] = useState("Tipo");
  const [activeCard, setActiveCard] = useState<number | null>(null);

  const filtered = PROPERTIES.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 max-w-[480px] mx-auto">
      {/* Agent header */}
      <div className="flex items-center justify-between mb-4 bg-white rounded-[12px] px-4 py-3" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E88E5] flex items-center justify-center text-white text-[14px] font-semibold shrink-0">
            JP
          </div>
          <div>
            <p className="text-[15px] font-semibold text-[#212121]">Juan Pérez</p>
            <p className="text-[12px] text-[#757575]">Asesor Inmobiliario · Lima</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-9 h-9 rounded-full bg-[#25D366] flex items-center justify-center text-white hover:bg-green-600 transition-colors">
            <WAIcon />
          </button>
          <button className="w-9 h-9 rounded-full bg-[#1E88E5] flex items-center justify-center text-white hover:bg-[#1565C0] transition-colors">
            <PhoneIcon />
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex gap-2 mb-4">
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar propieta..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5]"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] cursor-pointer"
        >
          <option>Venta</option>
          <option>Renta</option>
        </select>
        <select
          value={tipoFilter}
          onChange={(e) => setTipoFilter(e.target.value)}
          className="px-3 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] cursor-pointer"
        >
          <option>Tipo</option>
          <option>Casa</option>
          <option>Departamento</option>
          <option>Local</option>
        </select>
      </div>

      {/* Property cards */}
      <div className="space-y-4">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-[12px] overflow-hidden transition-shadow hover:shadow-md"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}
          >
            <div className="relative">
              <img src={p.img} alt={p.name} className="w-full h-52 object-cover" />
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-[#1E88E5]" : "bg-white opacity-70"}`} />
                ))}
              </div>
            </div>
            <div className="p-4">
              <div className="text-[20px] font-bold text-[#212121]">{p.price}</div>
              <div className="text-[15px] font-semibold text-[#212121] mt-0.5">{p.name}</div>
              <div className="text-[13px] text-[#757575] mt-0.5">
                {p.beds} rec · {p.baths} baños · {p.sqm} m²
              </div>
              <div className="flex gap-3 mt-3">
                <button className="flex items-center justify-center w-10 h-10 bg-[#25D366] rounded-full text-white hover:bg-green-600 transition-colors shrink-0">
                  <WAIcon />
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
                    <rect x="2" y="3" width="12" height="11" rx="1" /><path d="M5 1v4M11 1v4M2 7h12" />
                  </svg>
                  Reservar Visita
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[#E0E0E0] text-center">
        <p className="text-[14px] font-semibold text-[#212121]">Juan Pérez</p>
        <p className="text-[12px] text-[#757575] mt-0.5">+51 1 234 5678 · juan@inmocore.pe</p>
      </div>
    </div>
  );
}

function WAIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
function PhoneIcon() {
  return (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 20 20" stroke="currentColor" strokeWidth={1.5}>
      <path d="M2 3.5A1.5 1.5 0 013.5 2h2.5l1 4-2 1a12 12 0 005.5 5.5l1-2 4 1v2.5A1.5 1.5 0 0114 15.5C7.6 15.5 2 9.9 2 3.5z" strokeLinejoin="round" />
    </svg>
  );
}
