import { z } from 'zod';
import { PART_CATEGORIES } from '#config';

// no defaults here, otherwise partial updates would reset fields
const partBaseSchema = z.object({
  partNumber: z
    .string()
    .trim()
    .toUpperCase()
    .regex(/^[A-Z]{2,4}-\d{3,5}$/, 'Part number format: ABC-1234'),
  name: z.string().trim().min(2).max(100),
  category: z.enum(PART_CATEGORIES),
  description: z.string().trim().max(1000),
  compatibilityNote: z.string().trim().max(300),
  price: z.coerce.number().min(0, 'Price cannot be negative').max(100000)
});

export const partCreateSchema = partBaseSchema.extend({
  description: partBaseSchema.shape.description.default(''),
  compatibilityNote: partBaseSchema.shape.compatibilityNote.default('')
});

export const partUpdateSchema = partBaseSchema
  .partial()
  .refine(body => Object.keys(body).length > 0, 'Send at least one field to update');

// parsed in the controller (req.query is read-only in express 5)
export const partQuerySchema = z.object({
  q: z.string().trim().max(100).optional(),
  category: z.enum(PART_CATEGORIES).optional()
});

export type PartCreateDTO = z.infer<typeof partCreateSchema>;
export type PartUpdateDTO = z.infer<typeof partUpdateSchema>;
