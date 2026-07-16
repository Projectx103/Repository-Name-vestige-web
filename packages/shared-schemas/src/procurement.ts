import { z } from 'zod';
import type { FirestoreTimestamp } from './common';

export const procurementSourceTypeSchema = z.enum(['wholesale_lot', 'buy_outright', 'in_person_buy', 'other']);
export const procurementBatchStatusSchema = z.enum(['logged', 'in_progress', 'closed']);
export type ProcurementBatchStatus = z.infer<typeof procurementBatchStatusSchema>;

/** Fields submitted via the Procurement Intake console (08 - Firestore Schema.md §6.5) — no per-item detail required at this stage (05 - Features.md §1.6). */
export const procurementBatchInputSchema = z.object({
  sourceType: procurementSourceTypeSchema,
  sourceReference: z.string().min(1),
  itemCountLogged: z.number().int().min(1),
});
export type ProcurementBatchInput = z.infer<typeof procurementBatchInputSchema>;

export interface ProcurementBatchDocument extends ProcurementBatchInput {
  loggedByUid: string;
  status: ProcurementBatchStatus;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

export const intakeItemStatusSchema = z.enum([
  'received',
  'in_review',
  'rejected',
  'ready_for_photography',
  'photography_complete',
  'listed',
]);
export type IntakeItemStatus = z.infer<typeof intakeItemStatusSchema>;

/**
 * Only the Cloud-Function-mediated status transition is client-triggered
 * here — the rest of this document is populated at various pipeline stages
 * by staff actions, not submitted as one form (08 - Firestore Schema.md §6.6).
 */
export const intakeItemStatusUpdateSchema = z.object({
  status: intakeItemStatusSchema,
  rejectionReason: z.string().nullable(),
});
export type IntakeItemStatusUpdate = z.infer<typeof intakeItemStatusUpdateSchema>;

export interface IntakeItemDocument {
  batchId: string;
  status: IntakeItemStatus;
  rejectionReason: string | null;
  linkedListingId: string | null;
  gradedByUid: string | null;
  photographedByUid: string | null;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}
