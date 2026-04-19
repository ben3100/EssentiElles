/**
 * EssentiElles Design System — Spacing & Layout
 * Mobile-first · Clean · Airy
 */

// ─── Base Spacing Scale ────────────────────────────────────────────────────────
export const Spacing = {
  xxs: 4,
  xs: 8,
  sm: 12,
  smd: 14,  // between sm and md — used for button vertical padding
  md: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 40,
  huge: 48,
  giant: 64,
  // Semantic aliases used throughout the app
  screen: 20,   // horizontal screen padding
  section: 32,
};

// ─── Border Radius ─────────────────────────────────────────────────────────────
export const Radius = {
  xs: 6,
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,   // main card radius
  xxl: 32,
  full: 9999, // pill / circle
};

/** @deprecated Use Radius instead */
export const BorderRadius = {
  ...Radius,
  pill: 9999, // alias for full
};

// ─── Typography Scale ──────────────────────────────────────────────────────────
// Font: Poppins (loaded via expo-google-fonts)
export const Typography = {
  // New semantic names
  screenTitle: {
    fontSize: 26,
    fontWeight: '600' as const,
    lineHeight: 34,
    letterSpacing: -0.3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '500' as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
  },
  body: {
    fontSize: 15,
    fontWeight: '400' as const,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
    lineHeight: 18,
  },
  button: {
    fontSize: 16,
    fontWeight: '500' as const,
    lineHeight: 22,
    letterSpacing: 0.1,
  },
  label: {
    fontSize: 12,
    fontWeight: '500' as const,
    lineHeight: 16,
    letterSpacing: 0.6,
    textTransform: 'uppercase' as const,
  },
  // Legacy aliases used by existing screens
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    lineHeight: 36,
    letterSpacing: -0.5,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    lineHeight: 26,
    letterSpacing: -0.1,
  },
  h4: {
    fontSize: 16,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  small: {
    fontSize: 12,
    fontWeight: '400' as const,
    lineHeight: 16,
  },
  bodyEmphasis: {
    fontSize: 15,
    fontWeight: '600' as const,
    lineHeight: 22,
  },
  subtitle: {
    fontSize: 17,
    fontWeight: '600' as const,
    lineHeight: 24,
    letterSpacing: -0.1,
  },
};

// ─── Shadow Presets ────────────────────────────────────────────────────────────
export const Shadows = {
  none: {},
  soft: {
    shadowColor: '#B5838D',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  card: {
    shadowColor: '#2B2D42',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 3,
  },
  elevated: {
    shadowColor: '#2B2D42',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 24,
    elevation: 6,
  },
  button: {
    shadowColor: '#B5838D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.20,
    shadowRadius: 12,
    elevation: 4,
  },
};

// ─── Icon Sizes ────────────────────────────────────────────────────────────────
export const IconSize = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
  xl: 32,
};

// ─── Animation Durations ──────────────────────────────────────────────────────
export const Duration = {
  fast: 150,
  normal: 220,
  slow: 350,
};

/** @deprecated Use Shadows instead */
export const Shadow = Shadows;

export default Spacing;
