import { z } from 'zod';
import type { FirestoreTimestamp } from './common';

/** buyer is deliberately excluded — it's the default and never explicitly "granted" (08 - Firestore Schema.md §6.12). */
export const grantableRoleSchema = z.enum(['procurement_staff', 'curator', 'ops_admin', 'super_admin']);
export type GrantableRole = z.infer<typeof grantableRoleSchema>;

/** Fields submitted via Role Management (17 - Screen Inventory.md §7.2). Append-only — this is Cloud-Function input for setUserRole, never a direct client write to this collection. */
export const roleGrantInputSchema = z.object({
  subjectUid: z.string().min(1),
  action: z.enum(['granted', 'revoked']),
  role: grantableRoleSchema,
});
export type RoleGrantInput = z.infer<typeof roleGrantInputSchema>;

export interface RoleGrantDocument extends RoleGrantInput {
  grantedByUid: string;
  createdAt: FirestoreTimestamp;
}
