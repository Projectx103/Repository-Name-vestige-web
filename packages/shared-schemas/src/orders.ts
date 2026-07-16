import { z } from 'zod';
import type { FirestoreTimestamp } from './common';

export const orderStatusSchema = z.enum([
  'pending_fulfillment',
  'packed',
  'shipped',
  'delivered',
  'return_requested',
  'refunded',
  'cancelled',
]);
export type OrderStatus = z.infer<typeof orderStatusSchema>;

export const paymentStatusSchema = z.enum(['requires_payment', 'paid', 'refunded', 'partially_refunded']);
export type PaymentStatus = z.infer<typeof paymentStatusSchema>;

/**
 * Best-effort transition map from the enum + the Returns flow description
 * (07 - User Flows.md §8-9). No skipped/out-of-order transition is valid
 * (08 - Firestore Schema.md §10) — but this exact map should be verified
 * against 07's full state-machine diagram when M8/M12 implement the actual
 * status-change Cloud Function, not treated as already-final here.
 */
export const VALID_ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending_fulfillment: ['packed', 'cancelled'],
  packed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['return_requested'],
  return_requested: ['refunded'],
  refunded: [],
  cancelled: [],
};

/** orders/orderItems are Cloud-Function-only (11 - Security.md §11) — no client ever writes these collections directly, so there is no "input schema" a form submits straight to Firestore. This is the staff-facing status-update input, consumed by the order-management Cloud Function (17 - Screen Inventory.md §5.4). */
export const orderStatusUpdateInputSchema = z.object({
  status: orderStatusSchema,
  carrier: z.string().nullable(),
  trackingNumber: z.string().nullable(),
});
export type OrderStatusUpdateInput = z.infer<typeof orderStatusUpdateInputSchema>;

const shippingAddressSnapshotSchema = z.object({
  fullName: z.string(),
  line1: z.string(),
  line2: z.string().nullable(),
  city: z.string(),
  region: z.string(),
  postalCode: z.string(),
  country: z.string(),
  phone: z.string(),
});

export interface OrderDocument {
  buyerUid: string | null;
  guestEmail: string | null;
  guestAccessToken: string | null;
  shippingAddress: z.infer<typeof shippingAddressSnapshotSchema>;
  status: OrderStatus;
  subtotalCents: number;
  shippingCents: number;
  taxCents: number;
  totalCents: number;
  paymentIntentId: string;
  paymentStatus: PaymentStatus;
  carrier: string | null;
  trackingNumber: string | null;
  handledByUid: string | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

const listingSnapshotSchema = z.object({
  title: z.string(),
  brandName: z.string(),
  size: z.string(),
  photoUrl: z.string(),
});

export interface OrderItemDocument {
  orderId: string;
  listingId: string;
  listingSnapshot: z.infer<typeof listingSnapshotSchema>;
  priceCents: number;
}
