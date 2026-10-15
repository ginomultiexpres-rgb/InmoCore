/// <reference types="vitest" />
import { vi } from 'vitest';

/**
 * Mock del módulo src/lib/supabase (cliente único SDK).
 * `from()` devuelve un builder chainable que registra los filtros aplicados
 * y resuelve con datos de ejemplo al terminal (`range`, `single`, etc.).
 */
export const lastQueryCalls: string[] = [];

function makeChainable(result: Record<string, unknown> = {}) {
  const chain: any = {};
  const methods = [
    'select', 'eq', 'gte', 'lte', 'or', 'order', 'range', 'limit',
    'insert', 'update', 'delete', 'single',
  ];
  for (const m of methods) {
    chain[m] = vi.fn((...args: unknown[]) => {
      lastQueryCalls.push(`${m}(${args.map((a) => JSON.stringify(a)).join(',')})`);
      return chain;
    });
  }
  // Terminales que resuelven promesa
  chain.then = (resolve: (v: unknown) => void) =>
    resolve({ data: [], error: null, count: 0, ...result });
  return chain;
}

export const mockSupabase = {
  from: vi.fn(() => makeChainable()),
  auth: {
    getUser: vi.fn().mockResolvedValue({ data: { user: null } }),
    signInWithPassword: vi.fn(),
    signUp: vi.fn().mockResolvedValue({ data: { user: { id: 'u1' } }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  },
};

vi.mock('../src/lib/supabase', () => ({
  supabase: mockSupabase,
  // true → modo demo OFF en tests: los servicios usan el cliente (mock) real.
  hasValidSupabaseConfig: true,
  signIn: vi.fn(),
  signUp: vi.fn(),
  signOut: vi.fn(),
  getCurrentUser: vi.fn().mockResolvedValue(null),
  getProfile: vi.fn().mockResolvedValue({ data: null, error: null }),
}));
