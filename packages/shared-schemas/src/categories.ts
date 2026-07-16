import { z } from 'zod';

/** Fields submitted via the Category Management form (08 - Firestore Schema.md §6.4). Supports a 2-level hierarchy only (e.g., Outerwear > Coats). */
export const categoryInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  parentCategoryId: z.string().nullable(),
  displayOrder: z.number().int(),
});
export type CategoryInput = z.infer<typeof categoryInputSchema>;

export type CategoryDocument = CategoryInput;
