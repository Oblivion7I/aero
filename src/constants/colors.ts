/**
 * Aero Color System
 * Material Design 3 inspired, premium minimal palette.
 */

export const Colors = {
  primary: '#2563EB',
  primaryDark: '#1D4ED8',
  secondary: '#60A5FA',

  success: '#22C55E',
  warning: '#F59E0B',
  danger: '#EF4444',

  backgroundLight: '#F8FAFC',
  backgroundDark: '#0F172A',

  textPrimary: '#111827',
  textSecondary: '#6B7280',
  textOnPrimary: '#FFFFFF',

  surfaceLight: '#FFFFFF',
  surfaceDark: '#1E293B',

  border: '#E5E7EB',
  borderDark: '#334155',
} as const;

export const LightTheme = {
  background: Colors.backgroundLight,
  surface: Colors.surfaceLight,
  text: Colors.textPrimary,
  textSecondary: Colors.textSecondary,
  border: Colors.border,
  primary: Colors.primary,
};

export const DarkTheme = {
  background: Colors.backgroundDark,
  surface: Colors.surfaceDark,
  text: '#F1F5F9',
  textSecondary: '#94A3B8',
  border: Colors.borderDark,
  primary: Colors.secondary,
};

export type ThemeMode = 'light' | 'dark' | 'amoled' | 'dynamic';
