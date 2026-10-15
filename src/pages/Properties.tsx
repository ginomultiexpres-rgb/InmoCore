import { getProperties, type Property, type PropertyFilters } from '../services/api';
import { PropertyFilters as PropertyFiltersComponent } from '../components/PropertyFilters.tsx';
import { Reveal, ProgressBar } from '../components/ui.tsx';
import { PropertyStats } from '../components/PropertyFilters.tsx';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

// Helper: map status from API to UI
function mapStatus(status: string | undefined): string {
  if (!status) return 'Disponible';
  const lower = status.toLowerCase();
  if (lower === 'available') return 'Activa';
  if (lower === 'pending') return 'Reservada';
  if (lower === 'sold') return 'Vendida';
  if (lower === 'rented') return 'Alquilada';
  return lower;
}

// Helper: map status from filters to API
function mapFilterStatus(filterStatus: string | undefined): string | undefined {
  if (!filterStatus) return undefined;
  if (filterStatus === 'Disponible') return 'available';
  if (filterStatus === 'Reservada') return 'pending';
  if (filterStatus === 'Vendida') return 'sold';
  if (filterStatus === 'Alquilada') return 'rented';
  return filterStatus;
}

interface PropertyUI {
  id: string;
  name: string;
  price_str: string;
  beds: number;
  baths: number;
  sqm: number;
  mapped_status: string;
  views: number;
  wa: number;
  img: string;
  city?: string;
  property_type?: string;
  bedrooms?: number;
  featured?: boolean;
  price_num?: number;
  description?: string;
}

function toPropertyUI(p: Property): PropertyUI {
  const priceNum = p.price ?? 0;
  return {
    id: p.id,
    name: p.title ?? '',
    price_str: `S/ ${Number(priceNum).toLocaleString()}`,
    beds: p.bedrooms ?? 0,
    baths: p.bathrooms ?? 0,
    sqm: Math.round(p.area ?? 0),
    mapped_status: mapStatus(p.status),
    views: p.views_count ?? 0,
    wa: Math.floor(Math.random() * 30) + 5,
    img: p.image_url ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format',
    city: p.city,
    property_type: p.property_type,
    bedrooms: p.bedrooms,
    featured: p.featured,
    price_num: priceNum,
    description: p.description,
  };
}

/* ---- Sincronización filtros <-> URL (deep-linking + botón atrás) ---- */
const FILTER_KEYS = ['city', 'property_type', 'status', 'min_price', 'max_price', 'min_bedrooms', 'featured', 'search'] as const;

function filtersFromParams(params: URLSearchParams): PropertyFilters {
  const num = (k: string) => (params.get(k) ? parseFloat(params.get(k)!) : undefined);
  return {
    city: params.get('city') || undefined,
    property_type: params.get('property_type') || undefined,
    status: params.get('status') || undefined,
    min_price: num('min_price'),
    max_price: num('max_price'),
    min_bedrooms: num('min_bedrooms'),
    featured: params.get('featured') ? params.get('featured') === 'true' : undefined,
    search: params.get('search') || undefined,
    page: num('page') || 1,
    limit: num('limit') || 20,
  };
}

function paramsFromFilters(f: PropertyFilters): URLSearchParams {
  const p = new URLSearchParams();
  for (const k of FILTER_KEYS) {
    const v = f[k];
    if (v !== undefined && v !== null && v !== '' && v !== false) p.set(k, String(v));
  }
  if (f.page && f.page > 1) p.set('page', String(f.page));
  return p;
}

const prev_limit = 20;

export default function Properties() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [properties, setProperties] = useState<PropertyUI[]>([]);
  // Estado inicial leído de la URL: #/properties?city=Arequipa&min_price=100000 funciona al recargar.
  const [filters, setFilters] = useState<PropertyFilters>(() => filtersFromParams(searchParams));
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; active: number; pending: number; sold: number } | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Función para obtener propiedades con filtros y paginación SERVER-SIDE
  const fetchProperties: (page: number, append: boolean) => Promise<void> = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const result = await getProperties({
        city: filters.city,
        property_type: filters.property_type,
        status: filters.status ? mapFilterStatus(filters.status) : undefined,
        min_price: filters.min_price,
        max_price: filters.max_price,
        min_bedrooms: filters.min_bedrooms,
        featured: filters.featured,
        search: filters.search,
        page,
        limit: filters.limit ?? 20,
      });

      const mappedProperties = result.data.map(toPropertyUI);

      if (append) {
        setProperties((prev) => [...prev, ...mappedProperties]);
      } else {
        setProperties(mappedProperties);
      }
      setHasMore(result.hasMore);

      setStats({
        total: result.total,
        active: mappedProperties.filter(p => p.mapped_status === 'Activa').length,
        pending: mappedProperties.filter(p => p.mapped_status === 'Reservada').length,
        sold: mappedProperties.filter(p => p.mapped_status === 'Vendida').length,
      });
    } catch (err) {
      console.error('Error fetching properties:', err);
      setProperties([]);
      setStats({ total: 0, active: 0, pending: 0, sold: 0 });
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    // Sincroniza filtros -> URL (sin ensuciar el historial en cada keystroke).
    setSearchParams(paramsFromFilters(filters), { replace: true });
  }, [filters, setSearchParams]);

  useEffect(() => {
    fetchProperties(filters.page ?? 1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.city, filters.property_type, filters.status, filters.min_price, filters.max_price, filters.min_bedrooms, filters.featured, filters.search, filters.page, filters.limit]);

  const loadMore = useCallback(() => {
    if (hasMore && !loading && filters.page !== undefined) {
      const nextPage = (filters.page ?? 0) + 1;
      setFilters(prev => ({ ...prev, page: nextPage }));
      fetchProperties(nextPage, true);
    }
  }, [filters.page, hasMore, loading, fetchProperties]);

  const filtered = useMemo(() => {
    return properties.filter(p => {
      const matchCity = !filters.city || (p.city && p.city.toLowerCase() === filters.city.toLowerCase());
      const matchType = !filters.property_type || (p.property_type && p.property_type.toLowerCase() === filters.property_type.toLowerCase());
      const matchStatus = !filters.status || p.mapped_status === filters.status;
      const matchBeds = !filters.min_bedrooms || (p.beds && p.beds > 0 && p.beds >= filters.min_bedrooms);
      const matchPriceMin = !filters.min_price || (p.price_num && p.price_num > 0 && p.price_num >= filters.min_price);
      const matchPriceMax = !filters.max_price || (p.price_num && p.price_num > 0 && p.price_num <= filters.max_price);
      const matchFeatured = filters.featured === undefined || p.featured === filters.featured;
      const matchSearch = !filters.search || (p.name && p.name.toLowerCase().includes(filters.search.toLowerCase())) || (p.description && p.description.toLowerCase().includes(filters.search.toLowerCase()));
      return matchCity && matchType && matchStatus && matchBeds && matchPriceMin && matchPriceMax && matchFeatured && matchSearch;
    });
  }, [properties, filters]);

  if (loading && properties.length === 0) {
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
            <span className="text-[13px] text-[#757575]">{stats?.active ?? 0} activas · {properties.length} publicadas</span>
            <ProgressBar pct={(stats?.active ?? 0) / Math.max(properties.length, 1) * 100} className="w-32" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {hasMore && !loading && (
            <button
              onClick={loadMore}
              className="px-4 py-2 text-[13px] font-medium bg-[#1E88E5] text-white rounded-xl hover:bg-[#1565C0] transition-all"
            >
              Cargar más
            </button>
          )}
          <Link
            to="/properties/new"
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1E88E5] text-white text-[14px] font-medium rounded-lg hover:bg-[#1565C0] hover:shadow-elevated hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <span className="text-lg leading-none">+</span> Nueva Propiedad
          </Link>
        </div>
      </div>

      {/* UI de filtros: server-side + sincronizados con la URL */}
      <PropertyFiltersComponent
        filters={{
          city: filters.city,
          property_type: filters.property_type,
          status: filters.status,
          min_price: filters.min_price,
          max_price: filters.max_price,
          min_bedrooms: filters.min_bedrooms,
          featured: filters.featured,
          search: filters.search,
        }}
        onChange={(next) => setFilters((prev) => ({ ...prev, ...next, page: 1 }))}
        onClear={() =>
          setFilters({
            city: undefined,
            property_type: undefined,
            status: undefined,
            min_price: undefined,
            max_price: undefined,
            min_bedrooms: undefined,
            featured: undefined,
            search: '',
            page: 1,
            limit: prev_limit,
          })
        }
      />

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E88E5] mx-auto" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-[#E0E0E0]">
          <p className="text-[40px] mb-2">🔍</p>
          <p className="text-[15px] font-medium text-[#212121]">No hay propiedades con estos filtros</p>
          <p className="text-[13px] text-[#757575] mt-1">Prueba a ampliar el rango de precio o quitar la ciudad.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((prop) => (
            <Reveal key={prop.id}>
              <article className="bg-white rounded-[12px] border border-[#E0E0E0] overflow-hidden shadow-card hover:shadow-elevated transition-shadow duration-300">
                <img src={prop.img} alt={prop.name} className="w-full h-40 object-cover" loading="lazy" />
                <div className="p-4">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-[15px] font-semibold text-[#212121] truncate">{prop.name}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#E3F2FD] text-[#1E88E5] whitespace-nowrap">
                      {prop.mapped_status}
                    </span>
                  </div>
                  <p className="text-[16px] font-bold text-[#1E88E5] mb-2">{prop.price_str}</p>
                  <p className="text-[12px] text-[#757575]">
                    🛏 {prop.beds} · 🛁 {prop.baths} · 📐 {prop.sqm} m² · 👁 {prop.views} visitas
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      )}

      {hasMore && !loading && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            className="px-5 py-2.5 text-[13px] font-medium bg-[#1E88E5] text-white rounded-xl hover:bg-[#1565C0] transition-all"
          >
            Cargar más ({stats?.total ?? 0} en total)
          </button>
        </div>
      )}
    </div>
  );
}