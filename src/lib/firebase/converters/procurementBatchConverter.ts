import type { ProcurementBatchDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

export const procurementBatchConverter = createConverter<WithId<ProcurementBatchDocument>>();
