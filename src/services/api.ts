/**
 * Servicios de dominio para InmoCore.
 * Fachada tipada sobre el cliente único Supabase (src/lib/supabase.ts).
 * Filtros y paginación se ejecutan EN EL SERVIDOR (PostgREST vía SDK).
 */
import { supabase, hasValidSupabaseConfig } from '../lib/supabase';

/**
 * Modo demo: cuando Supabase no está configurado (anon key vacía/placeholder),
 * las lecturas devuelven datos locales y las escrituras se aplican en memoria,
 * de modo que la app es navegable sin credenciales. Se desactiva en cuanto
 * .env contiene una anon key JWT válida.
 */
export const IS_DEMO_MODE = !hasValidSupabaseConfig;

const DEMO_PROPERTIES: Property[] = [
  {
    id: 'demo-1',
    title: 'Departamento moderno en Miraflores',
    description: 'Luminoso depto de 2 dormitorios con balcón y vista parcial al mar.',
    price: 320000,
    address: 'Av. Larco 456',
    city: 'Lima',
    state: 'Lima',
    zip: '15074',
    image_url: '',
    created_at: new Date().toISOString(),
    property_type: 'apartment',
    bedrooms: 2,
    bathrooms: 2,
    area: 88,
    status: 'available',
    featured: true,
    views_count: 120,
  },
  {
    id: 'demo-2',
    title: 'Casa familiar con jardín',
    description: 'Amplia casa de 3 niveles con jardín y garage para 2 autos.',
    price: 540000,
    address: 'Calle Los Olivos 123',
    city: 'Arequipa',
    state: 'Arequipa',
    zip: '04001',
    image_url: '',
    created_at: new Date().toISOString(),
    property_type: 'house',
    bedrooms: 3,
    bathrooms: 3,
    area: 210,
    status: 'available',
    featured: false,
    views_count: 45,
  },
  {
    id: 'demo-3',
    title: 'Loft céntrico amoblado',
    description: 'Loft industrial listo para habitar o rentar, cerca del metro.',
    price: 180000,
    address: 'Jr. de la Unión 789',
    city: 'Lima',
    state: 'Lima',
    zip: '15001',
    image_url: '',
    created_at: new Date().toISOString(),
    property_type: 'apartment',
    bedrooms: 1,
    bathrooms: 1,
    area: 55,
    status: 'pending',
    featured: false,
    views_count: 300,
  },
];

const DEMO_LEADS: Lead[] = [
  {
    id: 'demo-l1',
    name: 'María Torres',
    email: 'maria@example.com',
    phone: '+51 987 654 321',
    property_id: 'demo-1',
    budget: '300k-350k',
    interest: 'apartment',
    temp: 'hot',
    status: 'new',
    created_at: new Date().toISOString(),
  },
  {
    id: 'demo-l2',
    name: 'Carlos Ruiz',
    email: 'carlos@example.com',
    phone: '+51 912 345 678',
    property_id: 'demo-2',
    budget: '500k+',
    interest: 'house',
    temp: 'warm',
    status: 'contacted',
    created_at: new Date().toISOString(),
  },
];

const DEMO_EVENTS: AgendaEvent[] = [
  {
    id: 'demo-e1',
    title: 'Visita guiada — Depto Miraflores',
    start_time: new Date(Date.now() + 864e5).toISOString(),
    end_time: new Date(Date.now() + 864e5 + 36e5).toISOString(),
    location: 'Av. Larco 456, Lima',
    description: 'Recorrido con cliente potencial (María Torres).',
    created_at: new Date().toISOString(),
  },
];

let demoProperties = [...DEMO_PROPERTIES];
let demoLeads = [...DEMO_LEADS];
let demoEvents = [...DEMO_EVENTS];
const uid = () => `demo-${Math.random().toString(36).slice(2, 10)}`;

/** Aplica los filtros de PropertyFilters sobre el dataset demo en memoria. */
function filterDemoProperties(filters: PropertyFilters): Property[] {
  let rows = demoProperties;
  if (filters.city) rows = rows.filter((p) => p.city === filters.city);
  if (filters.property_type) rows = rows.filter((p) => p.property_type === filters.property_type);
  if (filters.status) rows = rows.filter((p) => p.status === filters.status);
  if (filters.min_price !== undefined) rows = rows.filter((p) => p.price >= filters.min_price!);
  if (filters.max_price !== undefined) rows = rows.filter((p) => p.price <= filters.max_price!);
  if (filters.min_bedrooms !== undefined)
    rows = rows.filter((p) => (p.bedrooms ?? 0) >= filters.min_bedrooms!);
  if (filters.featured !== undefined && filters.featured !== (undefined as unknown as boolean))
    rows = rows.filter((p) => !!p.featured === (filters.featured === true));
  if (filters.search) {
    const t = filters.search.toLowerCase();
    rows = rows.filter((p) =>
      SEARCHABLE_COLUMNS.some((c) => String(p[c as keyof Property] ?? '').toLowerCase().includes(t))
    );
  }
  return [...rows].sort((a, b) => b.created_at.localeCompare(a.created_at));
}

export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  address: string;
  city: string;
  state: string;
  zip: string;
  image_url: string;
  created_at: string;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  status?: 'available' | 'pending' | 'sold' | 'rented';
  featured?: boolean;
  views_count?: number;
}

export interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  property_id?: string;
  budget?: string;
  interest?: string;
  temp: 'hot' | 'warm' | 'cold';
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  created_at: string;
  /** Campos de presentación (no persistidos en Supabase) */
  time?: string;
  avatar?: string;
  img?: string;
}

/** Payload para crear un lead (solo columnas reales de la tabla). */
export type NewLead = Pick<
  Lead,
  'name' | 'email' | 'phone' | 'property_id' | 'budget' | 'interest' | 'temp' | 'status'
>;

export interface AgendaEvent {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  location: string;
  description: string;
  created_at: string;
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
  limit?: number;
  offset?: number;
  page?: number;
}

export const PAGE_SIZE = 20;

const SEARCHABLE_COLUMNS = ['title', 'description', 'address', 'city', 'property_type'];

/** Construye una query de properties con filtros server-side + paginación. */
function buildPropertyQuery(filters: PropertyFilters) {
  const limit = filters.limit ?? PAGE_SIZE;
  const page = Math.max(1, filters.page ?? 1);
  const offset = filters.offset ?? (page - 1) * limit;

  let query = supabase
    .from('properties')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (filters.city) query = query.eq('city', filters.city);
  if (filters.property_type) query = query.eq('property_type', filters.property_type);
  if (filters.status) query = query.eq('status', filters.status);
  if (filters.min_price !== undefined) query = query.gte('price', filters.min_price);
  if (filters.max_price !== undefined) query = query.lte('price', filters.max_price);
  if (filters.min_bedrooms !== undefined) query = query.gte('bedrooms', filters.min_bedrooms);
  if (filters.featured !== undefined && filters.featured !== (undefined as unknown as boolean)) {
    query = query.eq('featured', filters.featured === true);
  }
  if (filters.search) {
    const term = filters.search.replace(/[,%()]/g, ' ').trim();
    if (term) {
      query = query.or(
        SEARCHABLE_COLUMNS.map((col) => `${col}.ilike.*${term}*`).join(',')
      );
    }
  }

  return query;
}

export interface PagedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

/** Obtiene propiedades con filtros y paginación aplicados en Supabase. */
export const getProperties = async (
  filters: PropertyFilters = {}
): Promise<PagedResult<Property>> => {
  if (IS_DEMO_MODE) {
    const rows = filterDemoProperties(filters);
    const limit = filters.limit ?? PAGE_SIZE;
    const page = Math.max(1, filters.page ?? 1);
    const start = (page - 1) * limit;
    return {
      data: rows.slice(start, start + limit),
      total: rows.length,
      page,
      pageSize: limit,
      hasMore: page * limit < rows.length,
    };
  }
  const { data, error, count } = await buildPropertyQuery(filters);
  if (error) throw new Error(`Propiedades: ${JSON.stringify(error)}`);

  const limit = filters.limit ?? PAGE_SIZE;
  const page = Math.max(1, filters.page ?? 1);
  const total = count ?? data?.length ?? 0;

  return {
    data: (data ?? []) as Property[],
    total,
    page,
    pageSize: limit,
    hasMore: page * limit < total,
  };
};

/**
 * Compatibilidad con callers antiguos que pasan un query-string.
 * Ahora delega los filtros al servidor en lugar de traer todo y filtrar en cliente.
 */
export const getPropertiesWithFilters = async (queryString: string): Promise<Property[]> => {
  const urlParams = new URLSearchParams(queryString);
  const num = (key: string) =>
    urlParams.get(key) ? parseFloat(urlParams.get(key)!) : undefined;

  const filters: PropertyFilters = {
    city: urlParams.get('city') || undefined,
    property_type: urlParams.get('property_type') || undefined,
    status: urlParams.get('status') || undefined,
    min_price: num('min_price'),
    max_price: num('max_price'),
    min_bedrooms: num('min_bedrooms'),
    featured: urlParams.get('featured') ? urlParams.get('featured') === 'true' : undefined,
    search: urlParams.get('search') || undefined,
    page: num('page') || 1,
    limit: num('limit') || PAGE_SIZE,
  };

  const result = await getProperties(filters);
  return result.data;
};

/* ---------- CRUD de propiedades ---------- */

export const createProperty = async (
  property: Omit<Property, 'id' | 'created_at'>
): Promise<Property> => {
  if (IS_DEMO_MODE) {
    const created: Property = { ...property, id: uid(), created_at: new Date().toISOString() };
    demoProperties = [created, ...demoProperties];
    return created;
  }
  const { data, error } = await supabase.from('properties').insert(property).select().single();
  if (error) throw new Error(`Crear propiedad: ${JSON.stringify(error)}`);
  return data as Property;
};

export const updateProperty = async (
  id: string,
  property: Partial<Property>
): Promise<Property> => {
  if (IS_DEMO_MODE) {
    const idx = demoProperties.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Propiedad no encontrada (demo)');
    demoProperties[idx] = { ...demoProperties[idx], ...property };
    return demoProperties[idx];
  }
  const { data, error } = await supabase
    .from('properties')
    .update(property)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Actualizar propiedad: ${JSON.stringify(error)}`);
  return data as Property;
};

export const deleteProperty = async (id: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    demoProperties = demoProperties.filter((x) => x.id !== id);
    return;
  }
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(`Eliminar propiedad: ${JSON.stringify(error)}`);
};

/* ---------- Leads ---------- */

export const getLeads = async (): Promise<Lead[]> => {
  if (IS_DEMO_MODE) return [...demoLeads].sort((a, b) => b.created_at.localeCompare(a.created_at));
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Leads: ${JSON.stringify(error)}`);
  return (data ?? []) as Lead[];
};

export const createLead = async (
  lead: NewLead
): Promise<Lead> => {
  if (IS_DEMO_MODE) {
    const created: Lead = { ...lead, id: uid(), created_at: new Date().toISOString() };
    demoLeads = [created, ...demoLeads];
    return created;
  }
  const { data, error } = await supabase.from('leads').insert(lead).select().single();
  if (error) throw new Error(`Crear lead: ${JSON.stringify(error)}`);
  return data as Lead;
};

/* ---------- Agenda ---------- */

export const getAgenda = async (): Promise<AgendaEvent[]> => {
  if (IS_DEMO_MODE) return [...demoEvents].sort((a, b) => a.start_time.localeCompare(b.start_time));
  const { data, error } = await supabase
    .from('agenda_events')
    .select('*')
    .order('start_time', { ascending: true });
  if (error) throw new Error(`Agenda: ${JSON.stringify(error)}`);
  return (data ?? []) as AgendaEvent[];
};

export const createEvent = async (
  event: Omit<AgendaEvent, 'id' | 'created_at'>
): Promise<AgendaEvent> => {
  if (IS_DEMO_MODE) {
    const created: AgendaEvent = { ...event, id: uid(), created_at: new Date().toISOString() };
    demoEvents = [...demoEvents, created];
    return created;
  }
  const { data, error } = await supabase.from('agenda_events').insert(event).select().single();
  if (error) throw new Error(`Crear evento: ${JSON.stringify(error)}`);
  return data as AgendaEvent;
};

export const updateEvent = async (
  id: string,
  event: Partial<AgendaEvent>
): Promise<AgendaEvent> => {
  if (IS_DEMO_MODE) {
    const idx = demoEvents.findIndex((x) => x.id === id);
    if (idx === -1) throw new Error('Evento no encontrado (demo)');
    demoEvents[idx] = { ...demoEvents[idx], ...event };
    return demoEvents[idx];
  }
  const { data, error } = await supabase
    .from('agenda_events')
    .update(event)
    .eq('id', id)
    .select()
    .single();
  if (error) throw new Error(`Actualizar evento: ${JSON.stringify(error)}`);
  return data as AgendaEvent;
};

export const deleteEvent = async (id: string): Promise<void> => {
  if (IS_DEMO_MODE) {
    demoEvents = demoEvents.filter((x) => x.id !== id);
    return;
  }
  const { error } = await supabase.from('agenda_events').delete().eq('id', id);
  if (error) throw new Error(`Eliminar evento: ${JSON.stringify(error)}`);
};
