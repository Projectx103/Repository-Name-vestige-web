import type { StatusHistoryEntry } from '@vestige/shared-schemas';
import { createReadOnlyConverter, type WithId } from './createConverter';

/**
 * listings/{id}/statusHistory and orders/{id}/statusHistory — append-only
 * audit trails (11 - Security.md §11). The frontend never writes to these at
 * all; every entry is created by a Cloud Function (via the admin SDK, which
 * doesn't go through this converter). Read-only here is exactly correct for
 * the frontend's perspective, not an approximation of a finer-grained rule.
 */
export const statusHistoryConverter =
  createReadOnlyConverter<WithId<StatusHistoryEntry>>('statusHistory');
