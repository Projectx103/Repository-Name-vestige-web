import { z } from 'zod';
import { brandTierSchema } from './brands';
import { conditionGradeSchema } from './listings';

/** config/pricingRules — Owner-only write (06 - User Roles.md §1). Feeds the rule-based pricing suggestion: suggested price = brand tier multiplier × condition multiplier (01 - PRD.md §1.8). */
export const pricingRulesSchema = z.object({
  brandTierMultipliers: z.record(brandTierSchema, z.number().positive()),
  conditionMultipliers: z.record(conditionGradeSchema, z.number().positive()),
});
export type PricingRules = z.infer<typeof pricingRulesSchema>;

/** config/markdownSchedule — Owner-only write. */
export const markdownScheduleSchema = z.object({
  thresholds: z.array(
    z.object({
      days: z.number().int().positive(),
      markdownPct: z.number().min(0).max(100),
    }),
  ),
});
export type MarkdownSchedule = z.infer<typeof markdownScheduleSchema>;
