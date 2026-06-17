// ─── theme.ts ─────────────────────────────────────────────────────────────────
// Single source of truth for all design tokens.
// Deep dark navy palette matching the actual app design.
//
// Usage: import { Colors, Spacing, Radii, Typography, FontWeight } from '../constants/theme'
// ─────────────────────────────────────────────────────────────────────────────

// Design tokens — The Peptide App
// Deep dark navy theme matching the actual app screenshots

export const Colors = {
  // Backgrounds
  base: '#12132A',
  backgroundSecondary: '#0D0E1F',
  surface: '#1A1B3A',
  surfaceElevated: '#22244A',
  surfaceBorder: '#2E3060',

  // Primary accent
  primaryOrange: '#E8622A',
  primaryOrangeLight: 'rgba(232,98,42,0.15)',
  accentGreen: '#2ECC71',
  accentTeal: '#4ECDC4',
  accentRed: '#E74C3C',

  // Legacy aliases
  accentOrange: '#E8622A',
  accentOrangeLight: 'rgba(232,98,42,0.15)',
  accentViolet: '#7B4FFF',
  accentVioletLight: '#9B6FFF',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textTertiary: 'rgba(255,255,255,0.3)',

  // Semantic
  success: '#2ECC71',
  warning: '#F39C12',
  error: '#E74C3C',

  // Gradients
  gradientOrange: ['#E8622A', '#FF4500'] as const,
  gradientViolet: ['#7B4FFF', '#5B2FDF'] as const,
  gradientCard: ['transparent', 'rgba(0,0,0,0.85)'] as const,
  gradientSurface: ['#1C1C3A', '#12132A'] as const,
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
