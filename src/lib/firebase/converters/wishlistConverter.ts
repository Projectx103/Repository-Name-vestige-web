import type { WishlistDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/** wishlists/{uid} — natural key, not auto-ID (08 - Firestore Schema.md §6.9). */
export const wishlistConverter = createConverter<WithId<WishlistDocument>>();
