import { z } from 'zod';

export const ProductFormSchema = z.object({
  name: z.string().min(2).max(50),
  price: z.coerce.number().nonnegative(),
  stock: z.coerce.number().int().nonnegative().default(0),
  description: z.string().min(2).max(1000),
  sku: z.string().optional(),
  isActive: z.boolean().default(true),
});

export type ProductFormValues = z.infer<typeof ProductFormSchema>;
