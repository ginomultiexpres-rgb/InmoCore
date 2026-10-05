import { useState } from "react";
import { Link } from "react-router";

const PROPERTIES = [
  { id: 1, name: "Depa Miraflores", price: "S/ 950,000", beds: 2, baths: 2, sqm: 85, status: "Activa", views: 120, wa: 8, img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600&h=400&fit=crop&auto=format" },
  { id: 2, name: "Casa San Isidro", price: "S/ 1,800,000", beds: 3, baths: 2, sqm: 150, status: "Reservada", views: 98, wa: 14, img: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=600&h=400&fit=crop&auto=format" },
  { id: 3, name: "Local Barranco", price: "S/ 420,000", beds: 0, baths: 1, sqm: 45, status: "Vendida", views: 64, wa: 5, img: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop&auto=format" },
  { id: 4, name: "Depa Surco", price: "S/ 680,000", beds: 1, baths: 1, sqm: 60, status: "Activa", views: 87, wa: 11, img: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop&auto=format" },
  { id: 5, name: "Casa La Molina", price: "S/ 2,400,000", beds: 4, baths: 3, sqm: 210, status: "Activa", views: 203, wa: 22, img: "https://images.unsplash.com/photo-1416331108676-a22ccb276e35?w=600&h=400&fit=crop&auto=format" },
  { id: 6, name: "Depa San Borja", price: "S/ 1,100,000", beds: 2, baths: 2, sqm: 95, status: "Reservada", views: 45, wa: 7, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600&h=400&fit=crop&auto=format" },
];

const FILTERS = ["Todas", "Activas", "Reservadas", "Vendidas"];

const statusStyle: Record<string, string> = {
  Activa: "bg-[#4CAF50] text-white",
  Reservada: "bg-[#FF9800] text-white",
  Vendida: "bg-[#F44336] text-white",
};

export default function Properties() {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  const filtered = PROPERTIES.filter((p) => {
    const matchFilter = filter === "Todas" || p.status + "s" === filter || p.status === filter.slice(0, -1);
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-[#212121]">Mis Propiedades</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[13px] text-[#757575]">15 de 20</span>
            <div className="w-32 h-1.5 bg-[#E0E0E0] rounded-full overflow-hidden">
              <div className="h-full bg-[#1E88E5] rounded-full" style={{ width: "75%" }} />
            </div>
          </div>
        </div>
        <Link
          to="/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] transition-colors"
        >
          <span className="text-lg leading-none">+</span> Nueva Propiedad
        </Link>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-colors ${
                filter === f
                  ? "bg-[#1E88E5] text-white border-[#1E88E5]"
                  : "bg-white text-[#757575] border-[#E0E0E0] hover:border-[#1E88E5] hover:text-[#1E88E5]"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#BDBDBD]" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
            <circle cx="7" cy="7" r="4.5" /><path d="M10.5 10.5L14 14" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Buscar por dirección o título..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] w-64 transition-colors"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map((p) => (
          <PropertyCard key={p.id} property={p} />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ property: p }: { property: typeof PROPERTIES[0] }) {
  return (
    <div className="bg-white rounded-[12px] overflow-hidden hover:shadow-md transition-shadow" style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06)" }}>
      <div className="relative">
        <img src={p.img} alt={p.name} className="w-full h-44 object-cover" />
        <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-semibold ${statusStyle[p.status]}`}>
          {p.status}
        </span>
      </div>
      <div className="p-4">
        <div className="text-[20px] font-bold text-[#212121]">{p.price}</div>
        <div className="text-[16px] font-semibold text-[#212121] mt-0.5">{p.name}</div>
        <div className="text-[13px] text-[#757575] mt-0.5">
          {p.beds > 0 ? `${p.beds} rec · ` : ""}{p.baths} baños · {p.sqm} m²
        </div>
        <div className="flex items-center gap-4 mt-2 text-[12px] text-[#757575]">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={1.5}>
              <path d="M2 8s3-5 6-5 6 5 6 5-3 5-6 5-6-5-6-5z" /><circle cx="8" cy="8" r="2" />
            </svg>
            {p.views} visitas
          </span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5 text-[#25D366]" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 1C4.13 1 1 4.13 1 8c0 1.3.35 2.52.95 3.57L1 15l3.54-.94A6.963 6.963 0 008 15c3.87 0 7-3.13 7-7s-3.13-7-7-7zm3.12 9.94c-.12.34-.7.66-1.01.7-.28.03-.64.04-.97-.06-.22-.07-.51-.16-.88-.31-1.54-.66-2.55-2.22-2.63-2.32-.07-.1-.58-.77-.58-1.47 0-.7.37-1.05.5-1.19.13-.14.29-.17.38-.17.1 0 .19 0 .27.01.09 0 .21-.03.33.26l.47 1.14c.04.09.06.19.01.3-.05.1-.08.17-.16.25l-.24.28c-.08.08-.16.17-.07.33.09.16.4.66.86 1.07.59.52 1.09.69 1.25.76.16.07.25.06.34-.04.09-.1.39-.45.49-.61.1-.16.2-.13.34-.08.14.05.88.42 1.03.49.15.07.25.1.29.16.04.06.04.37-.08.71z" />
            </svg>
            {p.wa} clics
          </span>
        </div>
        <div className="flex gap-2 mt-3 pt-3 border-t border-[#F5F7FA]">
          <button className="flex-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] transition-colors">
            Editar
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
              <path d="M6 1v6M3 4l3-3 3 3M2 9h8v2H2z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Compartir
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] transition-colors">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
              <rect x="1" y="1" width="4" height="4" rx="0.5" /><rect x="7" y="1" width="4" height="4" rx="0.5" />
              <rect x="1" y="7" width="4" height="4" rx="0.5" /><rect x="7" y="7" width="4" height="4" rx="0.5" />
            </svg>
            QR
          </button>
        </div>
      </div>
    </div>
  );
}
