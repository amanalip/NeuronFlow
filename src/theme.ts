export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCanvas: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  success: string;
  warning: string;
  error: string;
  badgeBeginnerBg: string;
  badgeBeginnerText: string;
  badgeIntermediateBg: string;
  badgeIntermediateText: string;
  badgeAdvancedBg: string;
  badgeAdvancedText: string;
}

export const themes: Record<ThemeMode, ThemeColors> = {
  dark: {
    bgPrimary: '#0a0d14',
    bgSecondary: '#111827',
    bgTertiary: '#1f2937',
    bgCanvas: '#05070a',
    border: '#1f293d',
    textPrimary: '#f9fafb',
    textSecondary: '#9ca3af',
    textMuted: '#6b7280',
    accent: '#38bdf8',
    accentHover: '#0ea5e9',
    accentMuted: 'rgba(56, 189, 248, 0.15)',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    badgeBeginnerBg: 'rgba(16, 185, 129, 0.15)',
    badgeBeginnerText: '#34d399',
    badgeIntermediateBg: 'rgba(245, 158, 11, 0.15)',
    badgeIntermediateText: '#fbbf24',
    badgeAdvancedBg: 'rgba(239, 68, 68, 0.15)',
    badgeAdvancedText: '#f87171',
  },
  light: {
    bgPrimary: '#ffffff',
    bgSecondary: '#f8fafc',
    bgTertiary: '#f1f5f9',
    bgCanvas: '#ffffff',
    border: '#e2e8f0',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accent: '#0284c7',
    accentHover: '#0369a1',
    accentMuted: 'rgba(2, 132, 199, 0.12)',
    success: '#059669',
    warning: '#d97706',
    error: '#dc2626',
    badgeBeginnerBg: 'rgba(5, 150, 105, 0.12)',
    badgeBeginnerText: '#047857',
    badgeIntermediateBg: 'rgba(217, 119, 6, 0.12)',
    badgeIntermediateText: '#b45309',
    badgeAdvancedBg: 'rgba(220, 38, 38, 0.12)',
    badgeAdvancedText: '#b91c1c',
  },
};
