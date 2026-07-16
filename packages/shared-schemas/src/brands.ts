import { z } from 'zod';

/** Feeds the brand-tier × condition pricing multiplier (01 - PRD.md §1.8). */
export const brandTierSchema = z.enum(['value', 'premium', 'luxury']);
export type BrandTier = z.infer<typeof brandTierSchema>;

/** Fields submitted via the Brand Management form (08 - Firestore Schema.md §6.3). */
export const brandInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  tier: brandTierSchema,
  logoUrl: z.string().url().nullable(),
});
export type BrandInput = z.infer<typeof brandInputSchema>;

export type BrandDocument = BrandInput;
