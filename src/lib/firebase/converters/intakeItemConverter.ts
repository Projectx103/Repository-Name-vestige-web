import type { IntakeItemDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

export const intakeItemConverter = createConverter<WithId<IntakeItemDocument>>();
