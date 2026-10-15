/// <reference types="vitest" />
import { describe, it, expect, beforeEach } from 'vitest';
import './mocks';
import { getProperties, getPropertiesWithFilters } from '../src/services/api';
import { lastQueryCalls, mockSupabase } from './mocks';

describe('getProperties (filtros server-side)', () => {
  beforeEach(() => {
    lastQueryCalls.length = 0;
    mockSupabase.from.mockClear();
  });

  it('consulta la tabla properties con count exacto', async () => {
    await getProperties();
    expect(mockSupabase.from).toHaveBeenCalledWith('properties');
    expect(lastQueryCalls.some((c) => c.startsWith('select'))).toBe(true);
    expect(lastQueryCalls.some((c) => c.includes('"exact"'))).toBe(true);
  });

  it('aplica eq/gte/lte en el servidor según filtros', async () => {
    await getProperties({ city: 'Lima', min_price: 50000, max_price: 1000000, status: 'available' });
    expect(lastQueryCalls).toContain('eq("city","Lima")');
    expect(lastQueryCalls).toContain('gte("price",50000)');
    expect(lastQueryCalls).toContain('lte("price",1000000)');
    expect(lastQueryCalls).toContain('eq("status","available")');
  });

  it('usa range() para paginación backend', async () => {
    await getProperties({ page: 3, limit: 20 });
    expect(lastQueryCalls).toContain('range(40,59)');
  });

  it('construye or() para búsqueda de texto', async () => {
    await getProperties({ search: 'departamento' });
    const orCall = lastQueryCalls.find((c) => c.startsWith('or('));
    expect(orCall).toBeDefined();
    expect(orCall).toContain('title.ilike.*departamento*');
  });

  it('devuelve estructura PagedResult', async () => {
    const result = await getProperties();
    expect(result).toMatchObject({ data: [], total: 0, page: 1, pageSize: 20 });
    expect(typeof result.hasMore).toBe('boolean');
  });
});

describe('getPropertiesWithFilters (compat query-string)', () => {
  it('delega filtros al servidor desde un query string', async () => {
    lastQueryCalls.length = 0;
    await getPropertiesWithFilters('city=Lima&min_price=100&page=2');
    expect(lastQueryCalls).toContain('eq("city","Lima")');
    expect(lastQueryCalls).toContain('gte("price",100)');
    expect(lastQueryCalls).toContain('range(20,39)');
  });
});
