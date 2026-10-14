import { getProperties, Property, PropertyFilters, getPropertiesWithFilters } from '../services/api.ts';
import { PropertyFilters as PropertyFiltersComponent } from '../components/PropertyFilters.tsx';
import { Reveal, ProgressBar } from '../components/ui.tsx';
import { PropertyStats } from '../components/PropertyFilters.tsx';
import { ProtectedRoute } from '../hooks/useAuth.tsx';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';

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
  const priceNum = p.price_num ?? p.price ?? 0;
  return {
    id: p.id,
    name: p.title ?? '',
    price_str: `S/ ${Number(priceNum).toLocaleString()}`,
    beds: p.beds ?? 0,
    baths: p.baths ?? 0,
    sqm: Math.round(p.sqm ?? 0),
    mapped_status: mapStatus(p.status),
    views: p.views ?? 0,
    wa: Math.floor(Math.random() * 30) + 5,
    img: p.img ?? 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop&auto=format',
    city: p.city,
    property_type: p.property_type,
    bedrooms: p.bedrooms,
    featured: p.featured,
    price_num: priceNum,
    description: p.description,
  };
}

export default function Properties() {
  const [properties, setProperties] = useState<PropertyUI[]>([]);
  const [filters, setFilters] = useState<PropertyFilters>({
    city: undefined,
    property_type: undefined,
    status: undefined,
    min_price: undefined,
    max_price: undefined,
    min_bedrooms: undefined,
    featured: undefined,
    search: '',
    page: 1,
    limit: 20,
  });
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{ total: number; active: number; pending: number; sold: number } | null>(null);
  const [hasMore, setHasMore] = useState(true);

  // Función para obtener propiedades con filtros y paginación
  const fetchProperties: (page: number, append: boolean) => Promise<void> = useCallback(async (page: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filters.city) queryParams.append('city', filters.city);
      if (filters.property_type) queryParams.append('property_type', filters.property_type);
      if (filters.status) queryParams.append('status', mapFilterStatus(filters.status) || '');
      if (filters.min_price !== undefined) queryParams.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) queryParams.append('max_price', filters.max_price.toString());
      if (filters.min_bedrooms !== undefined) queryParams.append('min_bedrooms', filters.min_bedrooms.toString());
      if (filters.featured !== undefined) queryParams.append('featured', filters.featured.toString());
      if (filters.search) queryParams.append('search', filters.search);
      queryParams.append('page', page.toString());
      queryParams.append('limit', filters.limit?.toString() ?? '20');

      const filteredProperties = await getPropertiesWithFilters(queryParams.toString());
      const mappedProperties = filteredProperties.map(toPropertyUI);

      if (append) {
        setProperties((prev) => [...prev, ...mappedProperties]);
      } else {
        setProperties(mappedProperties);
      }
      setHasMore(mappedProperties.length >= (filters.limit ?? 20));

      setStats({
        total: mappedProperties.length,
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
    fetchProperties(1, false);
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

      {stats && <PropertyStats properties={properties as any} />}
    </div>
  );
}