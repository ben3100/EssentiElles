// Livrella Design System — Spacing (8pt grid)
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
  screen: 20,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  pill: 100,
  full: 9999,
};

export const Shadow = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  button: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 5,
  },
  strong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
  glow: {
    shadowColor: '#FF6B9D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
};

export const Typography = {
  h1: { fontSize: 32, lineHeight: 40, fontFamily: 'Poppins_700Bold' },
  h2: { fontSize: 24, lineHeight: 32, fontFamily: 'Poppins_600SemiBold' },
  h3: { fontSize: 20, lineHeight: 28, fontFamily: 'Poppins_600SemiBold' },
  h4: { fontSize: 18, lineHeight: 26, fontFamily: 'Poppins_600SemiBold' },
  subtitle: { fontSize: 16, lineHeight: 24, fontFamily: 'Poppins_500Medium' },
  body: { fontSize: 15, lineHeight: 22, fontFamily: 'Poppins_400Regular' },
  bodySmall: { fontSize: 13, lineHeight: 20, fontFamily: 'Poppins_400Regular' },
  caption: { fontSize: 11, lineHeight: 16, fontFamily: 'Poppins_500Medium' },
  button: { fontSize: 15, lineHeight: 22, fontFamily: 'Poppins_600SemiBold' },
  price: { fontSize: 20, lineHeight: 28, fontFamily: 'Poppins_700Bold' },
};
