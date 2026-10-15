import { z } from 'zod';

/** Validación del formulario NewProperty con Zod. */
export const propertySchema = z.object({
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.coerce
    .number('El precio debe ser un número')
    .positive('El precio debe ser mayor que 0')
    .max(100_000_000, 'El precio supera el máximo permitido'),
  address: z.string().min(5, 'La dirección es obligatoria (mín. 5 caracteres)'),
  city: z.string().min(2, 'La ciudad es obligatoria'),
  state: z.string().min(2, 'La provincia/estado es obligatorio'),
  zip: z.string().min(3, 'El código postal es obligatorio'),
  property_type: z.enum(['casa', 'departamento', 'terreno', 'local', 'oficina'], {
    message: 'Selecciona un tipo de propiedad válido',
  }),
  bedrooms: z.coerce.number().int().min(0).max(30).optional(),
  bathrooms: z.coerce.number().int().min(0).max(30).optional(),
  area: z.coerce.number().positive('El área debe ser mayor que 0').optional(),
  image_url: z.url('Debe ser una URL válida de imagen').optional().or(z.literal('')),
  status: z.enum(['available', 'pending', 'sold', 'rented']).default('available'),
  featured: z.boolean().default(false),
});

export type PropertyFormValues = z.infer<typeof propertySchema>;

/** Validación de leads (email con formato correcto). */
export const leadSchema = z.object({
  name: z.string().min(2, 'Nombre demasiado corto'),
  email: z.email('Formato de email inválido').optional().or(z.literal('')),
  phone: z
    .string()
    .regex(/^[0-9+\s()-]{7,15}$/, 'Teléfono inválido')
    .optional()
    .or(z.literal('')),
  temp: z.enum(['hot', 'warm', 'cold']),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
