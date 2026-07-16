import { z } from 'zod';
import type { FirestoreTimestamp } from './common';

/** A wishlist toggle submits just the listing id being added/removed (08 - Firestore Schema.md §6.9). */
export const wishlistToggleInputSchema = z.object({
  listingId: z.string().min(1),
});
export type WishlistToggleInput = z.infer<typeof wishlistToggleInputSchema>;

export interface WishlistDocument {
  listingIds: string[];
  updatedAt: FirestoreTimestamp;
}
