// EssentiElles Modern Design System — Color Palette
export const Colors = {
  // Brand - Modern Gradients
  primary: '#FF6B9D',
  primaryLight: '#FFB3D1',
  primaryDark: '#E8578C',
  primaryPale: '#FFF0F5',
  secondary: '#8B5CF6',
  accent: '#F59E0B',

  // Backgrounds - Clean & Minimal
  background: '#F9FAFB',
  surface: '#FFFFFF',
  surfaceAlt: '#F3F4F6',
  card: '#FFFFFF',
  cardHover: '#FAFAFA',

  // Glassmorphism
  glass: 'rgba(255, 255, 255, 0.8)',
  glassAlt: 'rgba(255, 255, 255, 0.6)',

  // Text - High Contrast
  textPrimary: '#1F2937',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textInverse: '#FFFFFF',
  textPlaceholder: '#D1D5DB',

  // Borders - Subtle
  borderLight: '#E5E7EB',
  borderMedium: '#D1D5DB',
  borderDark: '#9CA3AF',

  // Feedback - Vibrant
  success: '#10B981',
  successBg: '#D1FAE5',
  successLight: '#6EE7B7',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  errorLight: '#FCA5A5',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningLight: '#FCD34D',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoLight: '#93C5FD',

  // Status badges - Modern
  statusActive: '#10B981',
  statusActiveBg: '#D1FAE5',
  statusPaused: '#F59E0B',
  statusPausedBg: '#FEF3C7',
  statusCancelled: '#EF4444',
  statusCancelledBg: '#FEE2E2',
  statusDelivered: '#10B981',
  statusShipped: '#3B82F6',
  statusPending: '#F59E0B',
  statusConfirmed: '#8B5CF6',

  // Categories - Vibrant
  categoryFeminine: '#FF6B9D',
  categoryBaby: '#10B981',
  categoryPacks: '#8B5CF6',
  categoryPromo: '#F59E0B',
  categoryHygiene: '#EC4899',
  categoryHealth: '#3B82F6',

  // Modern Gradients
  gradientStart: '#FF6B9D',
  gradientMid: '#8B5CF6',
  gradientEnd: '#3B82F6',
  gradientPrimary: 'linear-gradient(135deg, #FF6B9D 0%, #8B5CF6 100%)',
  gradientSuccess: 'linear-gradient(135deg, #10B981 0%, #3B82F6 100%)',
  gradientWarning: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',

  // Overlay - Modern
  overlay: 'rgba(0, 0, 0, 0.6)',
  overlayLight: 'rgba(0, 0, 0, 0.2)',
  overlayStrong: 'rgba(0, 0, 0, 0.8)',

  // Dark Mode Support
  dark: {
    background: '#111827',
    surface: '#1F2937',
    card: '#374151',
    textPrimary: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    border: '#4B5563',
  },

  // Special Effects
  shimmer: '#E5E7EB',
  shimmerHighlight: '#F9FAFB',

  // Transparent
  transparent: 'transparent',
};

export type ColorKey = keyof typeof Colors;
