// Design tokens for The Peptide App
// LIGHT THEME — white/salmon-pink backgrounds, dark text, orange CTAs

export const Colors = {
  // Backgrounds — light theme
  base: '#FFFFFF',
  backgroundSecondary: '#FFF5F2',
  surface: '#F5F0ED',
  surfaceElevated: '#FFFFFF',
  surfaceBorder: '#E8E0DB',

  // Primary accent
  primaryOrange: '#E8622A',
  primaryOrangeLight: '#FFF0EA',
  accentGreen: '#2ECC71',
  accentTeal: '#4ECDC4',
  accentRed: '#E74C3C',

  // Legacy aliases (keep for backwards compat)
  accentOrange: '#E8622A',
  accentOrangeLight: '#FFF0EA',
  accentViolet: '#7B4FFF',
  accentVioletLight: '#9B6FFF',

  // Text
  textPrimary: '#1A1A1A',
  textSecondary: '#6B6B6B',
  textTertiary: '#999999',

  // Semantic
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',

  // Gradients
  gradientOrange: ['#E8622A', '#FF4500'] as const,
  gradientViolet: ['#7B4FFF', '#5B2FDF'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.75)'] as const,
  gradientSurface: ['#FFF5F2', '#FFFFFF'] as const,
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
