// Conexión Supabase para InmoCore
// Proyecto: cgscbiqhzmsfmxieschl

const SUPABASE_URL = 'https://cgscbiqhzmsfmxieschl.supabase.co/rest/v1/';
const ANON_KEY = 'eyJhbG...aiKo';

// Cliente REST helper
function supabaseFrom(table) {
  const headers = {
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
    insert: async (payload) => {
      const res = await fetch(`${SUPABASE_URL}${table}`, {
        method: 'POST', headers, body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data };
    },
    update: async (id, payload) => {
      const res = await fetch(`${SUPABASE_URL}${table}?id=eq.${id}`, {
        method: 'PATCH', headers, body: JSON.stringify(payload),
      });
      const data = await res.json();
      return { data: Array.isArray(data) ? data : [data], error: res.ok ? null : data };
    },
    delete: async (id) => {
      const res = await fetch(`${SUPABASE_URL}${table}?id=eq.${id}`, {
        method: 'DELETE', headers,
      });
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