/** Mirrors 08 - Firestore Schema.md §6.10-6.11. */
export type {
  OrderDocument,
  OrderItemDocument,
  OrderStatus,
  PaymentStatus,
  OrderStatusUpdateInput,
} from '@vestige/shared-schemas';
export {
  orderStatusUpdateInputSchema,
  orderStatusSchema,
  VALID_ORDER_STATUS_TRANSITIONS,
} from '@vestige/shared-schemas';
