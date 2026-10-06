/**
 * Servicios API para InmoCore
 * Utiliza supabase.ts para comunicación REST
 */
import { db } from './lib/supabase';

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
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  property_id: string;
  status: 'new' | 'contacted' | 'qualified' | 'closed';
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

/* Propiedades */
export const getProperties = async (): Promise<Property[]> => {
  const { data, error } = await db.properties.select('*');
  if (error) throw new Error(`Propiedades: ${JSON.stringify(error)}`);
  return (data || []) as Property[];
};

export const createProperty = async (property: Omit<Property, 'id' | 'created_at'>): Promise<Property> => {
  const { data, error } = await db.properties.insert(property);
  if (error) throw new Error(`Crear propiedad: ${JSON.stringify(error)}`);
  return (Array.isArray(data) ? data[0] : data) as Property;
};

/* Leads */
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await db.leads.select('*');
  if (error) throw new Error(`Leads: ${JSON.stringify(error)}`);
  return (data || []) as Lead[];
};

export const createLead = async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
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
