// Design tokens for The Peptide App
// Dark theme with orange + violet accents

export const Colors = {
  // Backgrounds
  base: '#0A0A0F',
  surface: '#13131A',
  surfaceElevated: '#1C1C26',
  surfaceBorder: '#2A2A3A',

  // Accents
  accentOrange: '#FF6B2B',
  accentOrangeLight: '#FF8C55',
  accentViolet: '#7B4FFF',
  accentVioletLight: '#9B6FFF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#A0A0B8',
  textTertiary: '#60607A',

  // Semantic
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',

  // Gradients (as arrays for LinearGradient)
  gradientOrange: ['#FF6B2B', '#FF4500'] as const,
  gradientViolet: ['#7B4FFF', '#5B2FDF'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as const,
  gradientSurface: ['#1C1C26', '#13131A'] as const,
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
} as const;

export const Typography = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 17,
  lg: 20,
  xl: 24,
  xxl: 30,
  xxxl: 38,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};
