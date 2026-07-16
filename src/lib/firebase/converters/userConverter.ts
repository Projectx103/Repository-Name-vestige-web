import type { UserDocument } from '@vestige/shared-schemas';
import { createConverter, type WithId } from './createConverter';

/** users/{uid} — buyer writes own profile fields; see collections.ts for the doc reference. */
export const userConverter = createConverter<WithId<UserDocument>>();
