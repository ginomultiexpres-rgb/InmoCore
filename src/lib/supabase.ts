// Conexión Supabase para InmoCore
// Proyecto: cgscbiqhzmsfmxieschl

// Vite: variables con prefijo VITE_ están disponibles como import.meta.env
// https://vitejs.dev/guide/env.html#env-mode
interface ImportMeta {
  env: {
    VITE_SUPABASE_URL?: string
    VITE_SUPABASE_ANON_KEY?: string
  }
}

const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/';
const ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || '';

// Cliente REST helper
function supabaseFrom(table: string) {
  const headers: Record<string, string> = {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation',
  };

  return {
    select: async (columns = '*') => {
      const res = await fetch(`${SUPABASE_URL}${table}?select=${encodeURIComponent(columns)}`, { headers });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [], error: res.ok ? null : data };
    },
    insert: async (payload: unknown) => {
      const res = await fetch(`${SUPABASE_URL}${table}`, {
        method: 'POST', headers, body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data };
    },
    update: async (id: string | number, payload: unknown) => {
      const res = await fetch(`${SUPABASE_URL}${table}?id=eq.${id}`, {
        method: 'PATCH', headers, body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data };
    },
    delete: async (id: string | number) => {
      const res = await fetch(`${SUPABASE_URL}${table}?id=eq.${id}`, { method: 'DELETE', headers });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data };
    },
  };
}

export const db = {
  properties: supabaseFrom('properties'),
  leads: supabaseFrom('leads'),
  agenda_events: supabaseFrom('agenda_events'),
  property_inquiries: supabaseFrom('property_inquiries'),
  analytics: supabaseFrom('analytics'),
  user_profiles: supabaseFrom('user_profiles'),
};