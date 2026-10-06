import { db } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Reveal, ProgressBar } from '../components/ui';

export default function Properties() {
  const [properties, setProperties] = useState([]);
  const [filter, setFilter] = useState('Todas');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const { data, error } = await db.properties.select('*');
        if (error) throw error;
        setProperties(data.map(p => ({
          id: p.id,
          name: p.title,
          price: `S/ ${Number(p.price).toLocaleString()}`,
          beds: p.bedrooms ?? 0,
          baths: p.bathrooms ?? 0,
          sqm: Math.round(p.area ?? 0),
          status: p.status === 'available' ? 'Activa' : p.status === 'pending' ? 'Reservada' : 'Vendida',
          views: p.views_count ?? 0,
          wa: Math.floor(Math.random() * 30) + 5, // placeholder clicks
          img: p.image_url || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format'
        })));
      } catch (err) {
        console.error('Error fetching properties:', err);
        setProperties([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const FILTER_TO_STATUS: Record<string, string | null> = {
    Todas: null,
    Activas: 'Activa',
    Reservadas: 'Reservada',
    Vendidas: 'Vendida',
  };

  const statusStyle: Record<string, string> = {
    Activa: 'bg-[#4CAF50] text-white',
    Reservada: 'bg-[#FF9800] text-white',
    Vendida: 'bg-[#F44336] text-white',
  };

  const activas = properties.filter(p => p.status === 'Activa').length;
  const filtered = properties.filter(p => {
    const expected = FILTER_TO_STATUS[filter];
    const matchFilter = expected === null || p.status === expected;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center py-16 animate-fade-in">
          <p className="text-[40px] mb-2">🏠</p>
          <p className="text-[15px] font-medium text-[#212121]">Cargando propiedades...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[24px] font-semibold text-[#212121]">Mis Propiedades</h1>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[13px] text-[#757575]">{activas} activas · {properties.length} publicadas</span>
            <ProgressBar pct={(activas / Math.max(properties.length, 1)) * 100} className="w-32" />
          </div>
        </div>
        <Link
          to="/properties/new"
          className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
        >
          <span className="text-lg leading-none">+</span> Nueva Propiedad
        </Link>
      </div>

      <div className="flex items-center justify-between gap-4 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {Object.keys(FILTER_TO_STATUS).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all duration-200 active:scale-95 ${
                filter === f
                  ? "bg-[#1E88E5] text-white border-[#1E88E5] shadow-sm"
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
            className="pl-9 pr-4 py-2 text-[13px] bg-white border border-[#E0E0E0] rounded-lg outline-none focus:border-[#1E88E5] focus:shadow-[0_0_0_3px_rgba(30,136,229,0.12)] w-64 transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 animate-fade-in">
          <p className="text-[40px] mb-2">🔍</p>
          <p className="text-[15px] font-medium text-[#212121]">Sin resultados</p>
          <p className="text-[13px] text-[#757575] mt-1">Prueba con otro filtro o término de búsqueda.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={i * 70}>
              <div className="bg-white rounded-[12px] overflow-hidden shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300 group h-full">
                <div className="relative overflow-hidden">
                  <img src={p.img} alt={p.name} loading="lazy" className="w-full h-44 object-cover group-hover:scale-[1.04] transition-transform duration-500" />
                  <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-[12px] font-semibold shadow-sm animate-pop ${statusStyle[p.status]}`}>
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
                    <button className="flex-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] active:scale-95 transition-all">
                      Editar
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] active:scale-95 transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
                        <path d="M6 1v6M3 4l3-3 3 3M2 9h8v2H2z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Compartir
                    </button>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-[12px] font-medium border border-[#E0E0E0] rounded-lg hover:border-[#1E88E5] hover:text-[#1E88E5] active:scale-95 transition-all">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 12 12" stroke="currentColor" strokeWidth={1.5}>
                        <rect x="1" y="1" width="4" height="4" rx="0.5" /><rect x="7" y="1" width="4" height="4" rx="0.5" />
                        <rect x="1" y="7" width="4" height="4" rx="0.5" /><rect x="7" y="7" width="4" height="4" rx="0.5" />
                      </svg>
                      QR
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}