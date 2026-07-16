import type { OrderDocument } from '@vestige/shared-schemas';
import { createReadOnlyConverter, type WithId } from './createConverter';

/** orders — Cloud-Function-only writes, every role, no exceptions (11 - Security.md §11). Readable (a buyer reads their own order), never client-written. */
export const orderConverter = createReadOnlyConverter<WithId<OrderDocument>>('orders');
