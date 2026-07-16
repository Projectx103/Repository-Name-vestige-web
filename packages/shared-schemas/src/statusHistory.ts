import type { FirestoreTimestamp } from './common';

/**
 * listings/{listingId}/statusHistory/{eventId} and orders/{orderId}/statusHistory/{eventId}
 * (08 - Firestore Schema.md §7.1-7.2) — append-only audit trails. Security
 * Rules permit `create` but never `update`/`delete` on these (11 - Security.md
 * §11). No Zod input schema here: every entry is written by a Cloud Function
 * as a side effect of a status change, never submitted directly as a form.
 */
export interface StatusHistoryEntry {
  fromStatus: string | null;
  toStatus: string;
  actorUid: string | null;
  reason: string | null;
  createdAt: FirestoreTimestamp;
}
