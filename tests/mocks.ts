/// <reference types="vitest" />
import { vi, beforeAll, afterAll } from 'vitest';

const mockSupabaseUrl = 'https://example.supabase.co';
const mockSupabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock';

// Mockear Supabase antes de cargar cualquier módulo
vi.mock('../src/lib/supabase.ts', () => ({
  createSupabaseClient: vi.fn(() => ({
    from: vi.fn().mockReturnValue({
      select: vi.fn().mockResolvedValueOnce({ data: [], error: null }),
      insert: vi.fn().mockResolvedValueOnce({ data: [{ id: '1' }], error: null }),
      update: vi.fn().mockResolvedValueOnce({ data: [{ id: '1' }], error: null }),
      delete: vi.fn().mockResolvedValueOnce({ data: [{ id: '1' }], error: null }),
    }),
  })),
}));