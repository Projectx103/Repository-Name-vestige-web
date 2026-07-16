import { z } from 'zod';
import { centsSchema } from './common';
import type { FirestoreTimestamp } from './common';

const cartItemSchema = z.object({
  listingId: z.string().min(1),
  priceCentsAtAdd: centsSchema,
});

/** Fields a client submits when adding/removing a cart item (08 - Firestore Schema.md §6.8). addedAt is server-set. */
export const cartItemInputSchema = z.object({
  listingId: z.string().min(1),
});
export type CartItemInput = z.infer<typeof cartItemInputSchema>;

export interface CartDocument {
  items: (z.infer<typeof cartItemSchema> & { addedAt: FirestoreTimestamp })[];
  updatedAt: FirestoreTimestamp;
}
