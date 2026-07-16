import type { BrandDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/** Reference data — read by everyone, written by staff via Brand Management (17 - Screen Inventory.md §7.4). */
export const brandConverter = createConverter<WithId<BrandDocument>>();
