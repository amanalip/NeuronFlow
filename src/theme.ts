export type ThemeMode = 'dark' | 'light';

export interface ThemeColors {
  bgPrimary: string;
  bgSecondary: string;
  bgTertiary: string;
  bgCanvas: string;
  bgElevated: string;
  border: string;
  borderHover: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  accent: string;
  accentHover: string;
  accentMuted: string;
  accentGlow: string;
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
    bgPrimary: '#0d1321',
    bgSecondary: '#121a2d',
    bgTertiary: '#1a243d',
    bgCanvas: '#090d16',
    bgElevated: '#1f2c48',
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(56, 189, 248, 0.35)',
    textPrimary: '#f8fafc',
    textSecondary: '#94a3b8',
    textMuted: '#64748b',
    accent: '#38bdf8',
    accentHover: '#0ea5e9',
    accentMuted: 'rgba(56, 189, 248, 0.12)',
    accentGlow: '0 0 16px rgba(56, 189, 248, 0.3)',
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
    bgSecondary: '#ffffff',
    bgTertiary: '#f1f5f9',
    bgCanvas: '#f8fafc',
    bgElevated: '#f8fafc',
    border: '#e2e8f0',
    borderHover: '#cbd5e1',
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    accent: '#0284c7',
    accentHover: '#0369a1',
    accentMuted: 'rgba(2, 132, 199, 0.08)',
    accentGlow: '0 0 12px rgba(2, 132, 199, 0.2)',
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
