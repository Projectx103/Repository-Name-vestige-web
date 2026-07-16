import type { CartDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/** carts/{uid} — natural key, not auto-ID (08 - Firestore Schema.md §6.8). */
export const cartConverter = createConverter<WithId<CartDocument>>();
