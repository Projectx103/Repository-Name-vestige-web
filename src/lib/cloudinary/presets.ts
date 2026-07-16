/**
 * Named transformation presets (09 - Cloudinary Strategy.md §9-10) — every
 * dimension/cropping string used anywhere in the product lives here, once,
 * so a future sizing-strategy change is a single-file edit, not a
 * find-and-replace across every image usage.
 *
 * Every preset includes f_auto,q_auto (§5) as a baseline — no image is ever
 * delivered without it.
 */
export type CloudinaryPreset = 'thumb_300' | 'card_600' | 'pdp_1200' | 'pdp_zoom_2000';

const presetTransforms: Record<CloudinaryPreset, string> = {
  // 4:5, gravity-aware crop — never a naive center-crop (§10).
  thumb_300: 'f_auto,q_auto,w_300,ar_4:5,c_fill,g_auto',
  card_600: 'f_auto,q_auto,w_600,ar_4:5,c_fill,g_auto',
  pdp_1200: 'f_auto,q_auto,w_1200,ar_4:5,c_fill,g_auto',
  // Source aspect ratio preserved, not forced to 4:5 — the one preset shown at full fidelity (§10).
  pdp_zoom_2000: 'f_auto,q_auto,w_2000',
};

export function getPresetTransform(preset: CloudinaryPreset): string {
  return presetTransforms[preset];
}
