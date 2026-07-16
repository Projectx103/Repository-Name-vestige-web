import type { RoleGrantDocument } from '@vestige/shared-schemas';
import { createReadOnlyConverter, type WithId } from './createConverter';

/** Append-only audit log (08 - Firestore Schema.md §6.12) — written only via the setUserRole Cloud Function, never directly. */
export const roleGrantConverter = createReadOnlyConverter<WithId<RoleGrantDocument>>('roleGrants');
