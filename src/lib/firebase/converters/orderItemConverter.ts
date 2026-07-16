import type { OrderItemDocument } from '@vestige/shared-schemas';
import { createReadOnlyConverter, type WithId } from './createConverter';

export const orderItemConverter = createReadOnlyConverter<WithId<OrderItemDocument>>('orderItems');
