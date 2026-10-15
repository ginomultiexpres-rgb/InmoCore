/// <reference types="vitest" />
import { describe, it, expect } from 'vitest';
import { propertySchema, leadSchema } from '../src/schemas/property';

describe('propertySchema (Zod)', () => {
  const valid = {
    title: 'Depto moderno',
    description: 'Descripción larga y válida para el test',
    price: 250000,
    address: 'Av. Principal 123',
    city: 'Lima',
    state: 'Lima',
    zip: '15001',
    property_type: 'departamento',
  };

  it('acepta una propiedad válida', () => {
    const r = propertySchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it('rechaza precio no numérico o negativo', () => {
    expect(propertySchema.safeParse({ ...valid, price: -5 }).success).toBe(false);
    expect(propertySchema.safeParse({ ...valid, price: 'abc' }).success).toBe(false);
  });

  it('exige título y descripción mínimos', () => {
    expect(propertySchema.safeParse({ ...valid, title: 'x' }).success).toBe(false);
    expect(propertySchema.safeParse({ ...valid, description: 'corta' }).success).toBe(false);
  });

  it('valida enum de property_type', () => {
    expect(propertySchema.safeParse({ ...valid, property_type: 'castillo' }).success).toBe(false);
  });

  it('aplica defaults a status y featured', () => {
    const parsed = propertySchema.parse(valid);
    expect(parsed.status).toBe('available');
    expect(parsed.featured).toBe(false);
  });
});

describe('leadSchema (Zod)', () => {
  it('valida formato de email', () => {
    expect(leadSchema.safeParse({ name: 'Ana', temp: 'hot', email: 'no-es-email' }).success).toBe(false);
    expect(leadSchema.safeParse({ name: 'Ana', temp: 'hot', email: 'ana@mail.com' }).success).toBe(true);
  });
});
