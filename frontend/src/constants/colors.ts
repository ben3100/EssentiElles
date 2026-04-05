// Livrella Design System — Color Palette
export const Colors = {
  // Brand
  primary: '#B5838D',
  primaryLight: '#E5B8BE',
  primaryDark: '#9D6B75',
  primaryPale: '#FCE8EB',
  secondary: '#FFCAD4',
  accent: '#F4ECE6',

  // Backgrounds
  background: '#FDFBF9',
  surface: '#FFFFFF',
  surfaceAlt: '#FFF8FA',
  card: '#FFFFFF',

  // Text
  textPrimary: '#2B2D42',
  textSecondary: '#6D6875',
  textTertiary: '#A09CAB',
  textInverse: '#FFFFFF',
  textPlaceholder: '#C4B5BB',

  // Borders
  borderLight: '#F0EBE6',
  borderMedium: '#E0D7D3',

  // Feedback
  success: '#84A59D',
  successBg: '#E9F2EF',
  error: '#F28482',
  errorBg: '#FDF0EF',
  warning: '#F4A261',
  warningBg: '#FEF3E8',
  info: '#74B9E8',
  infoBg: '#EBF5FD',

  // Status badges
  statusActive: '#84A59D',
  statusActiveBg: '#E9F2EF',
  statusPaused: '#F4A261',
  statusPausedBg: '#FEF3E8',
  statusCancelled: '#F28482',
  statusCancelledBg: '#FDF0EF',
  statusDelivered: '#84A59D',
  statusShipped: '#74B9E8',
  statusPending: '#F4A261',

  // Categories
  categoryFeminine: '#FFCAD4',
  categoryBaby: '#E8F5E9',
  categoryPacks: '#F3E5F5',
  categoryPromo: '#FFF3E0',

  // Gradient
  gradientStart: '#C2919B',
  gradientEnd: '#B5838D',

  // Overlay
  overlay: 'rgba(43, 45, 66, 0.5)',
  overlayLight: 'rgba(43, 45, 66, 0.1)',

  // Transparent
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
