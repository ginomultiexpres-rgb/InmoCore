/**
 * Componente de filtros avanzados con paginación de servidor
 * Envía filtros al backend vía API con limit/offset para paginación eficiente
 */
import { useState, useEffect } from "react";

export interface PropertyFilters {
  city?: string;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  featured?: boolean;
  search?: string;
}

interface FilterOption {
  value: string;
  label: string;
}

interface PropertyForStats {
  id: string;
  name: string;
  price: string;
  beds: number;
  baths: number;
  sqm: number;
  status: 'Activa' | 'Reservada' | 'Vendida' | 'Alquilada';
  views: number;
  wa: number;
  img: string;
  city?: string;
  property_type?: string;
  bedrooms?: number;
  featured?: boolean;
  price_num?: number;
}

export function PropertyFiltersServer({
  initialFilters,
  onFilterChange,
  onClear,
}: {
  initialFilters: PropertyFilters;
  /** El padre persiste filtros+paginación en la URL (deep-linking) y dispara la fetch. */
  onFilterChange: (filters: PropertyFilters, params: { limit: number; offset: number }) => void;
  onClear: () => void;
}) {
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const defaultLimit = 12;
  const [limit, setLimit] = useState(defaultLimit);
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onFilterChange(filters, { limit, offset });
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters, limit, offset, onFilterChange]);

  const handleChange = (key: keyof PropertyFilters, value: string | number | boolean | undefined) => {
    if (value === "" || value === null || value === undefined || value === false) {
      // Remove the key by creating a new object without it
      const { [key]: removed, ...restFilters } = filters;
      setFilters(restFilters as PropertyFilters);
    } else {
      setFilters({
        ...filters,
        [key]: value as string | number | boolean
      });
    }
  }

  const hasActiveFilters = Object.values(filters).some(
    (v) => v !== undefined && v !== null && v !== "" && v !== false
  );

  return (
    <div className="bg-white rounded-[12px] border border-[#E0E0E0] p-4 mb-5 shadow-sm">
      {/* Búsqueda principal */}
      <div className="relative mb-4">
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#BDBDBD]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          placeholder="Buscar por dirección, título, código..."
          value={filters.search ?? ""}
          onChange={(e) => handleChange("search", e.target.value || undefined)}
          className="w-full pl-10 pr-4 py-3 text-[14px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-xl outline-none focus:border-[#1E88E5] focus:bg-white focus:shadow-[0_0_0_3px_rgba(30,136,229,0.12)] transition-all"
        />
      </div>

      {/* Filtros rápidos */}
      <div className="flex flex-wrap gap-2 mb-4">
        {[
          { key: "status" as keyof PropertyFilters, options: [], label: "Estado" },
          { key: "property_type" as keyof PropertyFilters, options: [], label: "Tipo" },
          { key: "city" as keyof PropertyFilters, options: [], label: "Ciudad" },
        ].map(({ key, options, label }) => (
          <div key={key} className="flex-1 min-w-[140px]">
            <label className="block text-[11px] font-medium text-[#757575] uppercase tracking-wide mb-1.5">
              {label}
            </label>
            <select
              value={filters[key] ? String(filters[key]) : ""}
              onChange={(e) =>
                handleChange(key, e.target.value || undefined)
              }
              className="w-full px-3 py-2 text-[13px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-xl outline-none focus:border-[#1E88E5] focus:bg-white transition-all appearance-none cursor-pointer"
            >
              <option value="">Todos</option>
              {/* Options se poblarán dinámicamente si es necesario */ }
            </select>
          </div>
        ))}
      </div>

      {/* Botón para filtros avanzados */}
      <button
        type="button"
        onClick={() => setShowAdvanced(!showAdvanced)}
        className={`flex items-center gap-2 px-4 py-2 text-[13px] font-medium rounded-xl transition-all duration-200 ${
          showAdvanced
            ? "bg-[#E3F2FD] text-[#1E88E5]"
            : "bg-[#F5F7FA] text-[#757575] hover:bg-[#E0E0E0]"
        }`}
      >
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showAdvanced ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {showAdvanced ? "Ocultar filtros avanzados" : "Mostrar filtros avanzados"}
      </button>

      {/* Filtros avanzados */}
      {showAdvanced && (
        <div className="mt-4 animate-slide-down pt-4 border-t border-[#E0E0E0]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {/* Rango de precios */}
            <div className="md:col-span-2">
              <label className="block text-[11px] font-medium text-[#757575] uppercase tracking-wide mb-1.5">
                Rango de precios (PEN)
              </label>
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Mínimo"
                    value={filters.min_price || ""}
                    onChange={(e) =>
                      handleChange(
                        "min_price",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 text-[13px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-xl outline-none focus:border-[#1E88E5] focus:bg-white transition-all"
                    min="0"
                    step="10000"
                  />
                </div>
                <span className="text-[#BDBDBD]">–</span>
                <div className="flex-1">
                  <input
                    type="number"
                    placeholder="Máximo"
                    value={filters.max_price || ""}
                    onChange={(e) =>
                      handleChange(
                        "max_price",
                        e.target.value ? parseInt(e.target.value) : undefined
                      )
                    }
                    className="w-full px-3 py-2 text-[13px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-xl outline-none focus:border-[#1E88E5] focus:bg-white transition-all"
                    min="0"
                    step="10000"
                  />
                </div>
              </div>
            </div>

            {/* Dormitorios */}
            <div>
              <label className="block text-[11px] font-medium text-[#757575] uppercase tracking-wide mb-1.5">
                Dormitorios mín.
              </label>
              <select
                value={filters.min_bedrooms || ""}
                onChange={(e) =>
                  handleChange(
                    "min_bedrooms",
                    e.target.value ? parseInt(e.target.value) : undefined
                  )
                }
                className="w-full px-3 py-2 text-[13px] bg-[#F5F7FA] border border-[#E0E0E0] rounded-xl outline-none focus:border-[#1E88E5] focus:bg-white transition-all appearance-none cursor-pointer"
              >
                <option value="">Cualquiera</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>

            {/* Destacadas */}
            <div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.featured || false}
                  onChange={(e) =>
                    handleChange("featured", e.target.checked || undefined)
                  }
                  className="w-4 h-4 text-[#1E88E5] border-[#E0E0E0] rounded focus:ring-2 focus:ring-[#1E88E5] focus:ring-offset-2 cursor-pointer"
                />
                <span className="text-[13px] text-[#424242]">Solo destacadas</span>
              </label>
            </div>
          </div>

          {/* Acciones */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={onClear}
              className="w-full px-4 py-2 text-[13px] font-medium text-[#F44336] bg-[#FDECEA] border border-[#F57B7B] rounded-xl hover:bg-[#FCE4EC] transition-all"
            >
              Limpiar todos los filtros
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* Componente de paginación inferior - se usará en la página Properties */
export function PropertyPagination({
  totalItems,
  currentPage,
  setCurrentPage,
  onPageLinkClick,
}: {
  totalItems: number;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  onPageLinkClick: (page: number) => void;
}) {
  const totalPages = Math.ceil(totalItems / 12);
  const maxVisiblePages = 5;
  const startPage =
    currentPage > Math.ceil(maxVisiblePages / 2)
      ? currentPage - Math.floor(maxVisiblePages / 2)
      : 1;
  const endPage =
    startPage + maxVisiblePages - 1 > totalPages
      ? Math.min(startPage + maxVisiblePages - 1, totalPages)
      : startPage + maxVisiblePages - 1;

  return (
    <nav aria-label="Page navigation" className="mt-6">
      <ul className="flex gap-1 justify-center">
        {/* Anterior */}
        <li>
          <button
            onClick={() => {
              if (currentPage > 1) {
                setCurrentPage(currentPage - 1);
                onPageLinkClick(currentPage - 1);
              }
            }}
            disabled={currentPage <= 1}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E0E0E0] text-[13px] hover:bg-[#F5F7FA] transition-colors"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Anterior
          </button>
        </li>

        {/* Páginas numeradas */}
        {[...Array(endPage - startPage + 1).keys()].map((i) => {
          const page = startPage + i;
          return (
            <li key={page}>
              <button
                onClick={() => {
                  setCurrentPage(page);
                  onPageLinkClick(page);
                }}
                disabled={page === currentPage}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  page === currentPage
                    ? "bg-[#1E88E5] text-white"
                    : "text-[#212121] bg-transparent hover:bg-[#F5F7FA] transition-colors border border-[#E0E0E0]"
                }`}
              >
                {page}
              </button>
            </li>
          );
        })}

        {/* Siguiente */}
        <li>
          <button
            onClick={() => {
              if (currentPage < totalPages) {
                setCurrentPage(currentPage + 1);
                onPageLinkClick(currentPage + 1);
              }
            }}
            disabled={currentPage >= totalPages}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-[#E0E0E0] text-[13px] hover:bg-[#F5F7FA] transition-colors"
          >
            Siguiente
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export interface PropertyFilters {
  city?: string;
  property_type?: string;
  status?: string;
  min_price?: number;
  max_price?: number;
  min_bedrooms?: number;
  featured?: boolean;
  search?: string;
}

export function PropertyFilters({
  filters,
  onChange,
  onClear,
}: {
  filters: PropertyFilters;
  onChange: React.Dispatch<React.SetStateAction<PropertyFilters>>;
  onClear: () => void;
}) {
  return <PropertyFiltersServer initialFilters={filters} onFilterChange={onChange} onClear={onClear} />;
}

/**
 * Estadísticas rápidas de propiedades
 * @param properties - Lista de propiedades mapeadas (PropertyForStats)
 */
export function PropertyStats({ properties }: { properties: PropertyForStats[] }) {
  const total = properties.length;
  const active = properties.filter((p) => p.status === "Activa").length;
  const pending = properties.filter((p) => p.status === "Reservada").length;
  const sold = properties.filter((p) => p.status === "Vendida").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
      <div className="bg-white p-3 rounded-xl border border-[#E0E0E0]">
        <div className="text-[20px] font-bold text-[#212121]">{total}</div>
        <div className="text-[11px] text-[#757575]">Total</div>
      </div>
      <div className="bg-white p-3 rounded-xl border border-[#E0E0E0]">
        <div className="text-[20px] font-bold text-[#4CAF50]">{active}</div>
        <div className="text-[11px] text-[#757575]">Activas</div>
      </div>
      <div className="bg-white p-3 rounded-xl border border-[#E0E0E0]">
        <div className="text-[20px] font-bold text-[#FF9800]">{pending}</div>
        <div className="text-[11px] text-[#757575]">Reservadas</div>
      </div>
      <div className="bg-white p-3 rounded-xl border border-[#E0E0E0]">
        <div className="text-[20px] font-bold text-[#F44336]">{sold}</div>
        <div className="text-[11px] text-[#757575]">Vendidas</div>
      </div>
    </div>
  );
}