import type { AddressDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

export const addressConverter = createConverter<WithId<AddressDocument>>();
