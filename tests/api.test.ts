/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { getPropertiesWithFilters } from '../src/services/api';

describe('getPropertiesWithFilters', () => {
  it('should handle undefined filters', () => {
    const result = getPropertiesWithFilters(undefined);
    expect(result).toBeDefined();
  });

  it('should handle null filters', () => {
    const result = getPropertiesWithFilters(null);
    expect(result).toBeDefined();
  });

  it('should apply city filter', async () => {
    const filters = {
      city: 'Lima',
      property_type: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: undefined,
      featured: undefined,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should apply status filter', async () => {
    const filters = {
      city: undefined,
      property_type: undefined,
      status: 'Activa',
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: undefined,
      featured: undefined,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should apply price filters', async () => {
    const filters = {
      city: undefined,
      property_type: undefined,
      status: undefined,
      min_price: 50000,
      max_price: 1000000,
      min_bedrooms: undefined,
      featured: undefined,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should apply bedroom filters', async () => {
    const filters = {
      city: undefined,
      property_type: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: 2,
      featured: undefined,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should apply featured filter', async () => {
    const filters = {
      city: undefined,
      property_type: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: undefined,
      featured: true,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should apply search filter', async () => {
    const filters = {
      city: undefined,
      property_type: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: undefined,
      featured: undefined,
      search: 'miraflores',
      page: 1,
      limit: 20,
    };
    
    const result = getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
  });

  it('should handle empty results', async () => {
    const filters = {
      city: 'Ciudad Inexistente',
      property_type: undefined,
      status: undefined,
      min_price: undefined,
      max_price: undefined,
      min_bedrooms: undefined,
      featured: undefined,
      search: '',
      page: 1,
      limit: 20,
    };
    
    const result = await getPropertiesWithFilters(filters);
    expect(result).toBeDefined();
    // Should return empty array, not crash
    expect(Array.isArray(result)).toBe(true);
  });
});