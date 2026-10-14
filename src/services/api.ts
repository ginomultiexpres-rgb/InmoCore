/**
 * Servicios API para InmoCore
 * Utiliza supabase.ts para comunicación REST
 */
import { db } from "../lib/supabase.ts";

export interface Property {
  id: string;
  title: string;
  name?: string; // Alias para title en el frontend
  description: string;
  price: number;
  price_num?: number; // Alias para price numérico
  address: string;
  city: string;
  state: string;
  zip: string;
  image_url: string;
  img?: string; // Alias para image_url
  created_at: string;
  property_type?: string;
  bedrooms?: number;
  beds?: number; // Alias para bedrooms
  bathrooms?: number;
  baths?: number; // Alias para bathrooms
  area?: number;
  sqm?: number; // Alias para area
  status?: 'available' | 'pending' | 'sold' | 'rented';
  featured?: boolean;
  views_count?: number;
  views?: number; // Alias para views_count
  wa?: number; // Clics de WhatsApp
}

export interface Lead {
  id: string;
  name: string;
  email?: string; // Opcional para uso interno
  phone?: string;
  property_id?: string;
  budget?: string;
  interest?: string;
  temp: "hot" | "warm" | "cold";
  status?: 'new' | 'contacted' | 'qualified' | 'closed';
  time?: string;
  avatar?: string;
  img?: string;
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

/* Funciones de filtrado y paginación */
/**
 * Obtiene propiedades con filtros aplicados y paginación en el servidor
 * @param filters - Objeto con filtros opcionales para city, property_type, status, etc.
 * @returns Promesa con arreglo de propiedades que coinciden con los filtros
 */
export const getPropertiesWithFilters = async (queryString: string): Promise<Property[]> => {
  // Parsear el query string para obtener los filtros
  const urlParams = new URLSearchParams(queryString);
  const filters: PropertyFilters = {
    city: urlParams.get('city') || undefined,
    property_type: urlParams.get('property_type') || undefined,
    status: urlParams.get('status') || undefined,
    min_price: urlParams.get('min_price') ? parseFloat(urlParams.get('min_price')!) : undefined,
    max_price: urlParams.get('max_price') ? parseFloat(urlParams.get('max_price')!) : undefined,
    min_bedrooms: urlParams.get('min_bedrooms') ? parseInt(urlParams.get('min_bedrooms')!) : undefined,
    featured: urlParams.get('featured') === 'true' || undefined,
    search: urlParams.get('search') || '',
    page: parseInt(urlParams.get('page')!) || 1,
    limit: parseInt(urlParams.get('limit')!) || 20,
    offset: parseInt(urlParams.get('offset')!) || 0,
  };

  // Construir la consulta de filtrado con mapeo de propiedades a campos de Supabase
  const queryParams: Record<string, any> = {};

  if (filters.city) queryParams.city = filters.city;
  if (filters.property_type) queryParams.property_type = filters.property_type;
  if (filters.status) queryParams.status = filters.status;
  if (filters.min_price !== undefined) queryParams.min_price = filters.min_price;
  if (filters.max_price !== undefined) queryParams.max_price = filters.max_price;
  if (filters.min_bedrooms !== undefined) queryParams.min_bedrooms = filters.min_bedrooms;
  if (filters.featured !== undefined) queryParams.featured = filters.featured;

  // El cliente solo soporta select/insert/update/delete con limit y offset,
  // así que aplicamos los filtros en el cliente de forma segura.
  const { data, error } = await db.properties.select('*', {
    limit: filters.limit,
    offset: filters.offset,
  });
  if (error) throw new Error(`Propiedades con filtros: ${JSON.stringify(error)}`);

  // Tipos: data viene sin tipar, así que usamos as unknown para evitar problemas
  let result = (data || []) as unknown as Property[];

  // Aplicar filtros de servidor en el cliente (seguro con validación de tipos)
  if (filters.city) {
    result = result.filter((p) => p.city?.toLowerCase() === filters.city?.toLowerCase());
  }
  if (filters.property_type) {
    result = result.filter((p) =>
      p.property_type?.toLowerCase() === filters.property_type?.toLowerCase()
    );
  }
  if (filters.status) {
    result = result.filter((p) => p.status === filters.status);
  }
  if (filters.min_price !== undefined) {
    result = result.filter((p) => (p.price || 0) >= (filters.min_price ?? 0));
  }
  if (filters.max_price !== undefined) {
    result = result.filter((p) => (p.price || 0) <= (filters.max_price ?? 0));
  }
  if (filters.min_bedrooms !== undefined) {
    result = result.filter((p) => (p.bedrooms || 0) >= (filters.min_bedrooms ?? 0));
  }
  if (filters.featured !== undefined) {
    result = result.filter((p) => (p.featured || false) === filters.featured);
  }

  // Aplicar búsqueda en cliente para texto completo (si es necesario)
  if (filters.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(search)) ||
        (p.description && p.description.toLowerCase().includes(search)) ||
        (p.address && p.address.toLowerCase().includes(search)) ||
        (p.city && p.city.toLowerCase().includes(search)) ||
        (p.property_type && p.property_type.toLowerCase().includes(search))
    );
  }

  return result;
};

export const getProperties = async (
  filters?: PropertyFilters
): Promise<Property[]> => {
  // Construir la consulta de filtrado
  const queryParams: Record<string, string> = {};

  if (filters?.city) queryParams.city = filters.city;
  if (filters?.property_type) queryParams.property_type = filters.property_type;
  if (filters?.status) queryParams.status = filters.status;
  if (filters?.min_price !== undefined) queryParams.min_price = filters.min_price.toString();
  if (filters?.max_price !== undefined) queryParams.max_price = filters.max_price.toString();
  if (filters?.min_bedrooms !== undefined) queryParams.min_bedrooms = filters.min_bedrooms.toString();
  if (filters?.featured !== undefined) queryParams.featured = filters.featured.toString();
  if (filters?.limit) queryParams.limit = filters.limit.toString();
  if (filters?.offset) queryParams.offset = filters.offset.toString();

  // Construir URL de consulta
  const queryString = new URLSearchParams(queryParams).toString();
  let url = queryString ? `?${queryString}` : '';

  const { data, error } = await db.properties.select('*', { limit: filters?.limit, offset: filters?.offset });
  if (error) throw new Error(`Propiedades: ${JSON.stringify(error)}`);

  let result = (data || []) as Property[];

  // Aplicar filtros adicionales en cliente si es necesario
  if (filters?.search) {
    const search = filters.search.toLowerCase();
    result = result.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(search)) ||
        (p.description && p.description.toLowerCase().includes(search)) ||
        (p.address && p.address.toLowerCase().includes(search))
    );
  }

  return result;
};

export const createProperty = async (
  property: Omit<Property, 'id' | 'created_at'>
): Promise<Property> => {
  const { data, error } = await db.properties.insert(property);
  if (error) throw new Error(`Crear propiedad: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as Property;
};

export const updateProperty = async (
  id: string,
  property: Partial<Property>
): Promise<Property> => {
  const { data, error } = await db.properties.update(id, property);
  if (error) throw new Error(`Actualizar propiedad: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as Property;
};

export const deleteProperty = async (id: string): Promise<void> => {
  const { error } = await db.properties.delete(id);
  if (error) throw new Error(`Eliminar propiedad: ${JSON.stringify(error)}`);
};

/* Leads */
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await db.leads.select('*');
  if (error) throw new Error(`Leads: ${JSON.stringify(error)}`);
  return (data || []) as Lead[];
};

export const createLead = async (
  lead: Omit<Lead, 'id' | 'created_at'>
): Promise<Lead> => {
  const { data, error } = await db.leads.insert(lead);
  if (error) throw new Error(`Crear lead: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as Lead;
};

/* Agenda */
export const getAgenda = async (): Promise<AgendaEvent[]> => {
  const { data, error } = await db.agenda_events.select('*');
  if (error) throw new Error(`Agenda: ${JSON.stringify(error)}`);
  return (data || []) as AgendaEvent[];
};

export const createEvent = async (event: Omit<AgendaEvent, 'id' | 'created_at'>): Promise<AgendaEvent> => {
  const { data, error } = await db.agenda_events.insert(event);
  if (error) throw new Error(`Crear evento: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as AgendaEvent;
};

export const updateEvent = async (
  id: string,
  event: Partial<AgendaEvent>
): Promise<AgendaEvent> => {
  const { data, error } = await db.agenda_events.update(id, event);
  if (error) throw new Error(`Actualizar evento: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as AgendaEvent;
};

export const deleteEvent = async (id: string): Promise<void> => {
  const { error } = await db.agenda_events.delete(id);
  if (error) throw new Error(`Eliminar evento: ${JSON.stringify(error)}`);
};