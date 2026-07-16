import type { CategoryDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/** Reference data — read by everyone, written by Admin/Owner via Category Management (17 - Screen Inventory.md §7.3). */
export const categoryConverter = createConverter<WithId<CategoryDocument>>();
