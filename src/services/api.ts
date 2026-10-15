/**
 * Servicios de dominio para InmoCore.
 * Fachada tipada sobre el cliente único Supabase (src/lib/supabase.ts).
 * Filtros y paginación se ejecutan EN EL SERVIDOR (PostgREST vía SDK).
 */
import { supabase } from '../lib/supabase';

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
}

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
  const { data, error } = await supabase.from('properties').insert(property).select().single();
  if (error) throw new Error(`Crear propiedad: ${JSON.stringify(error)}`);
  return data as Property;
};

export const updateProperty = async (
  id: string,
  property: Partial<Property>
): Promise<Property> => {
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
  const { error } = await supabase.from('properties').delete().eq('id', id);
  if (error) throw new Error(`Eliminar propiedad: ${JSON.stringify(error)}`);
};

/* ---------- Leads ---------- */

export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Leads: ${JSON.stringify(error)}`);
  return (data ?? []) as Lead[];
};

export const createLead = async (
  lead: Omit<Lead, 'id' | 'created_at'>
): Promise<Lead> => {
  const { data, error } = await supabase.from('leads').insert(lead).select().single();
  if (error) throw new Error(`Crear lead: ${JSON.stringify(error)}`);
  return data as Lead;
};

/* ---------- Agenda ---------- */

export const getAgenda = async (): Promise<AgendaEvent[]> => {
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
  const { data, error } = await supabase.from('agenda_events').insert(event).select().single();
  if (error) throw new Error(`Crear evento: ${JSON.stringify(error)}`);
  return data as AgendaEvent;
};

export const updateEvent = async (
  id: string,
  event: Partial<AgendaEvent>
): Promise<AgendaEvent> => {
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
  const { error } = await supabase.from('agenda_events').delete().eq('id', id);
  if (error) throw new Error(`Eliminar evento: ${JSON.stringify(error)}`);
};
