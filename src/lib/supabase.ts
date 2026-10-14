// Conexión Supabase para InmoCore
// Proyecto: cgscbiqhzmsfmxieschl

// Vite: variables con prefijo VITE_ están disponibles como process.env
// https://vitejs.dev/guide/env.html#env-mode

// Validate required environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL ?? '';
const ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY ?? '';
if (!SUPABASE_URL || !ANON_KEY) {
  throw new Error('Faltan las variables VITE_SUPABASE_URL o VITE_SUPABASE_ANON_KEY. Por favor configúralas en tu archivo .env.');
}

// Headers for Supabase REST API
const headers = {
  'apikey': ANON_KEY,
  'Authorization': `Bearer ${ANON_KEY}`, // Corregido: sin comillas extra al principio
  'Content-Type': 'application/json',
  'Prefer': 'return=representation',
};

const BASE_URL = SUPABASE_URL.replace(/\/$/, '') + '/rest/v1/';

// Helper to construct where clauses for Supabase REST API
function buildWhereClause(conditions: Record<string, any>): string {
  const parts = Object.entries(conditions)
    .filter(([key, value]) => value !== undefined && value !== null)
    .map(([key, value]) => {
      if (value === null) return `${key}.is.null`;
      if (value === '') return `${key}.eq.''`;
      if (value === true) return `${key}.eq.true`;
      if (value === false) return `${key}.eq.false`;
      if (typeof value === 'number' || typeof value === 'string') {
        return `${key}.eq.${encodeURIComponent(value)}`;
      }
      return `${key}.eq.${value}`;
    });
  return parts.join('&');
}

// Helper to extract pagination info from Supabase response headers
function extractPaginationInfo(response: any): { total: number; page: number; limit: number; hasMore: boolean } {
  const totalHeader = response.headers.get('content-range');
  const match = totalHeader ? totalHeader.match(/\/(\d+)$/) : null;
  let total = 0;
  let page = 1;
  let limit = 20;
  if (match && match[1]) {
    total = parseInt(match[1], 10);
  }
  const range = totalHeader ? totalHeader.split('-') : [];
  if (range.length === 2) {
    limit = parseInt(range[1], 10) - parseInt(range[0], 10) + 1;
  }
  return { total, page, limit, hasMore: (page * limit) < total };
}

// Supabase client interface
export interface SupabaseClient {
  properties: {
    select: (columns?: string, options?: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    insert: (payload: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    update: (id: string, payload: any) => Promise<{ data: any | null; error: any | null }>;
    delete: (id: string) => Promise<{ data: any | null; error: any | null }>;
    upsert: (payload: any) => Promise<{ data: any | null; error: any | null }>;
  };
  leads: {
    select: (columns?: string, options?: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    insert: (payload: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    update: (id: string, payload: any) => Promise<{ data: any | null; error: any | null }>;
    delete: (id: string) => Promise<{ data: any | null; error: any | null }>;
    upsert: (payload: any) => Promise<{ data: any | null; error: any | null }>;
  };
  agenda_events: {
    select: (columns?: string, options?: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    insert: (payload: any) => Promise<{ data: any | null; error: any | null; headers?: Headers }>;
    update: (id: string, payload: any) => Promise<{ data: any | null; error: any | null }>;
    delete: (id: string) => Promise<{ data: any | null; error: any | null }>;
    upsert: (payload: any) => Promise<{ data: any | null; error: any | null }>;
  };
}

// Lazy-initialized client instance
let client: SupabaseClient | null = null;

// Inicializa la conexión al cliente usando una promesa
let clientPromise: Promise<SupabaseClient>;

function initClient(): Promise<SupabaseClient> {
  if (client) {
    return Promise.resolve(client);
  }
  clientPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const response = await fetch(`${BASE_URL}properties?select=*`, {
        method: 'GET',
        headers,
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(`Error de conexión con Supabase: ${response.status} ${response.statusText}`);
      }
      // Usar la URL base actual para crear las funciones de CRUD
      client = {
        properties: {
          select: async (columns?: string, options?: any) => {
            let url = `${BASE_URL}properties`;
            const qs: string[] = [];
            if (columns) qs.push(`select=${columns}`);
            if (options?.limit) qs.push(`limit=${options.limit}`);
            if (options?.offset) qs.push(`offset=${options.offset}`);
            if (qs.length) url += `?${qs.join('&')}`;
            const res = await fetch(url, { method: 'GET', headers });
            const { data, error, headers: resHeaders } = await res.json().catch(() => ({ data: null, error: null }));
            return { data, error, headers: resHeaders };
          },
          insert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}properties`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          update: async (id: string, payload: any) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}properties?${where}`;
            const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          delete: async (id: string) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}properties?${where}`;
            const res = await fetch(url, { method: 'DELETE', headers });
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data: null, error };
          },
          upsert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}properties`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
        },
        leads: {
          select: async (columns?: string, options?: any) => {
            let url = `${BASE_URL}leads`;
            const qs: string[] = [];
            if (columns) qs.push(`select=${columns}`);
            if (options?.limit) qs.push(`limit=${options.limit}`);
            if (options?.offset) qs.push(`offset=${options.offset}`);
            if (qs.length) url += `?${qs.join('&')}`;
            const res = await fetch(url, { method: 'GET', headers });
            const { data, error, headers: resHeaders } = await res.json().catch(() => ({ data: null, error: null }));
            return { data, error, headers: resHeaders };
          },
          insert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}leads`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          update: async (id: string, payload: any) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}leads?${where}`;
            const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          delete: async (id: string) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}leads?${where}`;
            const res = await fetch(url, { method: 'DELETE', headers });
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data: null, error };
          },
          upsert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}leads`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
        },
        agenda_events: {
          select: async (columns?: string, options?: any) => {
            let url = `${BASE_URL}agenda_events`;
            const qs: string[] = [];
            if (columns) qs.push(`select=${columns}`);
            if (options?.limit) qs.push(`limit=${options.limit}`);
            if (options?.offset) qs.push(`offset=${options.offset}`);
            if (qs.length) url += `?${qs.join('&')}`;
            const res = await fetch(url, { method: 'GET', headers });
            const { data, error, headers: resHeaders } = await res.json().catch(() => ({ data: null, error: null }));
            return { data, error, headers: resHeaders };
          },
          insert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}agenda_events`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          update: async (id: string, payload: any) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}agenda_events?${where}`;
            const res = await fetch(url, { method: 'PATCH', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
          delete: async (id: string) => {
            const where = buildWhereClause({ id });
            const url = `${BASE_URL}agenda_events?${where}`;
            const res = await fetch(url, { method: 'DELETE', headers });
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data: null, error };
          },
          upsert: async (payload: any) => {
            const res = await fetch(`${BASE_URL}agenda_events`, { method: 'POST', headers, body: JSON.stringify(payload) });
            const data = await res.json().catch(() => null);
            const error = !res.ok ? { status: res.status, message: res.statusText } : null;
            return { data, error };
          },
        },
      };
      clearTimeout(timeoutId);
      return client;
    } catch (err) {
      clearTimeout(timeoutId);
      throw err;
    }
  })();

  return clientPromise;
}

// Public API: obtener la instancia del cliente
export async function getClient(): Promise<SupabaseClient> {
  return initClient();
}

// Re-exportar la función initClient para uso interno
export { initClient };

export const db = {
  properties: {
    select: async (columns?: string, options?: any) => {
      const client = await getClient();
      return client.properties.select(columns, options);
    },
    insert: async (payload: any) => {
      const client = await getClient();
      return client.properties.insert(payload);
    },
    update: async (id: string, payload: any) => {
      const client = await getClient();
      return client.properties.update(id, payload);
    },
    delete: async (id: string) => {
      const client = await getClient();
      return client.properties.delete(id);
    },
    upsert: async (payload: any) => {
      const client = await getClient();
      return client.properties.upsert(payload);
    },
  },
  leads: {
    select: async (columns?: string, options?: any) => {
      const client = await getClient();
      return client.leads.select(columns, options);
    },
    insert: async (payload: any) => {
      const client = await getClient();
      return client.leads.insert(payload);
    },
    update: async (id: string, payload: any) => {
      const client = await getClient();
      return client.leads.update(id, payload);
    },
    delete: async (id: string) => {
      const client = await getClient();
      return client.leads.delete(id);
    },
    upsert: async (payload: any) => {
      const client = await getClient();
      return client.leads.upsert(payload);
    },
  },
  agenda_events: {
    select: async (columns?: string, options?: any) => {
      const client = await getClient();
      return client.agenda_events.select(columns, options);
    },
    insert: async (payload: any) => {
      const client = await getClient();
      return client.agenda_events.insert(payload);
    },
    update: async (id: string, payload: any) => {
      const client = await getClient();
      return client.agenda_events.update(id, payload);
    },
    delete: async (id: string) => {
      const client = await getClient();
      return client.agenda_events.delete(id);
    },
    upsert: async (payload: any) => {
      const client = await getClient();
      return client.agenda_events.upsert(payload);
    },
  },
};

export { supabase } from './supabase-client.js';