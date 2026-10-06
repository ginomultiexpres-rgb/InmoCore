/**
 * Servicios API para InmoCore
 * Utiliza supabase.ts para comunicación REST
 */
import { supabase } from './lib/supabase'

export interface Property {
  id: string
  title: string
  description: string
  price: number
  address: string
  city: string
  state: string
  zip: string
  image_url: string
  created_at: string
}

export interface Lead {
  id: string
  name: string
  email: string
  phone: string
  property_id: string
  status: 'new' | 'contacted' | 'qualified' | 'closed'
  created_at: string
}

export interface AgendaEvent {
  id: string
  title: string
  start_time: string
  end_time: string
  location: string
  description: string
  created_at: string
}

/* Propiedades */
export const getProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase.from('properties').select('*')
  if (error) throw new Error(`Propiedades: ${error.message}`)
  return data as Property[]
}

export const createProperty = async (property: Omit<Property, 'id' | 'created_at'>): Promise<Property> => {
  const { data, error } = await supabase.from('properties').insert(property).single()
  if (error) throw new Error(`Crear propiedad: ${error.message}`)
  return data as Property
}

/* Leads */
export const getLeads = async (): Promise<Lead[]> => {
  const { data, error } = await supabase.from('leads').select('*')
  if (error) throw new Error(`Leads: ${error.message}`)
  return data as Lead[]
}

export const createLead = async (lead: Omit<Lead, 'id' | 'created_at'>): Promise<Lead> => {
  const { data, error } = await supabase.from('leads').insert(lead).single()
  if (error) throw new Error(`Crear lead: ${error.message}`)
  return data as Lead
}

/* Agenda */
export const getAgenda = async (): Promise<AgendaEvent[]> => {
  const { data, error } = await supabase.from('agenda_events').select('*')
  if (error) throw new Error(`Agenda: ${error.message}`)
  return data as AgendaEvent[]
}

export const createEvent = async (event: Omit<AgendaEvent, 'id' | 'created_at'>): Promise<AgendaEvent> => {
  const { data, error } = await supabase.from('agenda_events').insert(event).single()
  if (error) throw new Error(`Crear evento: ${error.message}`)
  return data as AgendaEvent
}