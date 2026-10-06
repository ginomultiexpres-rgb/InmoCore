/**
 * Cliente Supabase REST para InmoCore
 * Proyecto: InmoCore (cgscbiqhzmsfmxieschl)
 * URL: https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/
 * 
 * NOTA DE SEGURIDAD: Este archivo contiene la anon key pública.
 * La service_role debe mantenerse fuera del frontend (solo backend/Edge).
 */
const SUPABASE_URL = 'https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/'
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNnc2NiaXFoem1zZm14aWVzY2hsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc2NjU1NjEsImV4cCI6MjA4MzI0MTU2MX0._p-XwHifPQ1zOkruzKof4EUcnapJmdi0Kv1Ey52aiKo'

export interface SupabaseClient {
  from: (table: string) => {
    select: (columns?: string) => Promise<{ data: unknown[]; error: unknown }>
    insert: (payload: unknown) => Promise<{ data: unknown[]; error: unknown }>
    update: (payload: unknown) => Promise<{ data: unknown[]; error: unknown }>
    delete: () => Promise<{ data: unknown[]; error: unknown }>
  }
}

function createClient(): SupabaseClient {
  const headers = {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  }

  return {
    from: (table: string) => ({
      select: async (columns = '*') => {
        const res = await fetch(`${SUPABASE_URL}${table}?select=${encodeURIComponent(columns)}`, { headers })
        const data = await res.json()
        return { data: Array.isArray(data) ? data : [], error: res.ok ? null : data }
      },
      insert: async (payload) => {
        const res = await fetch(`${SUPABASE_URL}${table}`, {
          method: 'POST', headers, body: JSON.stringify(payload),
        })
        const data = await res.json()
        return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data }
      },
      update: async (payload) => {
        const res = await fetch(`${SUPABASE_URL}${table}?id=eq.${(payload as Record<string, unknown>).id ?? ''}`, {
          method: 'PATCH', headers, body: JSON.stringify(payload),
        })
        const data = await res.json()
        return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data }
      },
      delete: async () => {
        const res = await fetch(`${SUPABASE_URL}${table}`, { method: 'DELETE', headers })
        const data = await res.json()
        return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data }
      },
    }),
  }
}

export const supabase = createClient()
