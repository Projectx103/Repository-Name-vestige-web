import type { PricingRules, MarkdownSchedule } from '@vestige/shared-schemas';
import { createConverter } from './createConverter';

/** config/pricingRules and config/markdownSchedule — Owner-only write (06 - User Roles.md §1), fixed singleton doc IDs, not auto-ID documents, so no `id` merge needed here unlike the other converters. */
export const pricingRulesConverter = createConverter<PricingRules>();
export const markdownScheduleConverter = createConverter<MarkdownSchedule>();
