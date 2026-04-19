/**
 * EssentiElles Design System — Color Palette
 * Soft · Premium · Maternal · Minimal
 */

export const Colors = {
  // ─── Brand ──────────────────────────────────────────────────────────────────
  primary: '#B5838D',        // dusty rose taupe — main CTA, active states
  primaryLight: '#D4A8B0',   // lighter rose for hover/pressed
  primaryMuted: '#F2E4E6',   // very light rose for pill backgrounds
  primaryPale: '#F8EFF0',    // palest rose for subtle backgrounds
  primaryDark: '#8E5A63',    // deeper rose for text on light bg / contrast
  primaryDeep: '#6B3A42',    // darkest rose for strong emphasis

  // ─── Background ─────────────────────────────────────────────────────────────
  background: '#FAF7F4',     // warm ivory — main screen background
  surface: '#FFFFFF',        // white — card surfaces
  surfaceAlt: '#F5F0EB',     // warm off-white for alternate surfaces
  card: '#FFFFFF',           // alias for surface (card backgrounds)

  // ─── Secondary ──────────────────────────────────────────────────────────────
  secondary: '#EEF3ED',      // very light sage — secondary button fill

  // ─── Accent / Sage ──────────────────────────────────────────────────────────
  accent: '#A8B8A3',         // soft sage green — secondary accent
  accentSage: '#A8B8A3',     // alias for accent (sage green)
  accentSageSoft: '#EEF3ED', // very soft sage background
  accentLight: '#D6E2D3',    // light sage for tags, pills
  accentMuted: '#EEF3ED',    // very light sage backgrounds

  // ─── Text ───────────────────────────────────────────────────────────────────
  textPrimary: '#2B2D42',    // dark charcoal — headings, body
  textSecondary: '#6D6875',  // muted mauve-grey — captions, placeholders
  textTertiary: '#A09AA8',   // lightest text for hints / disabled labels
  textDisabled: '#B5B5C3',   // disabled text
  textInverse: '#FFFFFF',    // white text on dark/colored backgrounds
  textPlaceholder: '#C0B8C4',// placeholder input text
  disabledText: '#B5B5C3',   // alias for textDisabled
  disabledBg: '#EDE9E4',     // disabled button background

  // ─── Border / Divider ───────────────────────────────────────────────────────
  border: '#E8E1DB',         // warm beige border
  borderLight: '#F2EDE8',    // very subtle divider
  borderMedium: '#DDD5CE',   // slightly stronger border

  // ─── Feedback ───────────────────────────────────────────────────────────────
  success: '#7AAF8E',        // soft green
  successLight: '#E4F1E9',
  successBg: '#E4F1E9',      // alias for successLight
  warning: '#D4A96A',        // warm amber
  warningLight: '#FAF0E0',
  warningBg: '#FAF0E0',      // alias for warningLight
  error: '#C47B7B',          // muted red
  errorLight: '#FAE8E8',
  errorBg: '#FAE8E8',        // alias for errorLight
  info: '#7A9DC0',           // muted blue
  infoLight: '#E4EEF7',
  infoBg: '#E4EEF7',         // alias for infoLight

  // ─── Neutrals ───────────────────────────────────────────────────────────────
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
  overlay: 'rgba(43, 45, 66, 0.40)',  // dark scrim for modals

  // ─── Status Colors (subscription / order states) ─────────────────────────────
  statusActive: '#7AAF8E',       // active subscription — soft green
  statusActiveBg: '#E4F1E9',
  statusPaused: '#D4A96A',       // paused — warm amber
  statusPausedBg: '#FAF0E0',
  statusCancelled: '#C47B7B',    // cancelled — muted red
  statusCancelledBg: '#FAE8E8',
  statusPending: '#7A9DC0',      // pending — muted blue
  statusPendingBg: '#E4EEF7',

  // ─── Shadow ─────────────────────────────────────────────────────────────────
  shadowColor: '#B5838D',
  shadowNeutral: '#2B2D42',
};

export default Colors;
