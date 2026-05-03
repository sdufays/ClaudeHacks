/**
 * Design tokens — Inloopd-inspired editorial language.
 * Used by all RN components. Don't hardcode colors elsewhere.
 */

export const colors = {
  page: '#F2F7FA',
  pageDark: '#0A0A0F',

  navy: {
    top: '#294259',
    bottom: '#1A2936',
    deep: '#080A12',
  },

  card: {
    white: '#FFFFFF',
    dark: '#171C2E',
  },

  headline: { light: '#1A242E', dark: '#F5F7FC' },
  body: { light: '#1F3345', dark: '#EDF0F5' },
  muted: { light: '#617585', dark: '#A8B3C2' },
  accent: { light: '#304D63', dark: '#619EDB' },

  // Translucent helpers
  whiteAlpha: (alpha: number) => `rgba(255,255,255,${alpha})`,
  navyAlpha: (alpha: number) => `rgba(10,10,15,${alpha})`,
} as const;

export const radius = {
  mini: 20,
  card: 32,
  hero: 44,
  pill: 999,
} as const;

export const fonts = {
  /** Newsreader 700 — display headlines */
  serifBold: 'Newsreader_700Bold',
  /** Newsreader 500 — body serif (rare) */
  serifMedium: 'Newsreader_500Medium',
  /** Newsreader 400 — body serif */
  serif: 'Newsreader_400Regular',
  /** Nunito 700 — eyebrows, CTAs */
  sansBold: 'Nunito_700Bold',
  /** Nunito 600 — interactive labels */
  sansSemibold: 'Nunito_600SemiBold',
  /** Nunito 500 — body */
  sans: 'Nunito_500Medium',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const shadows = {
  cardSoft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 10,
    elevation: 2,
  },
  cardLift: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 4,
  },
} as const;

/** Signature midnight-navy gradient stops — for use with expo-linear-gradient */
export const navyGradient = ['#294259', '#1A2936'] as const;
export const navyGradientDeep = ['#171C2E', '#080A12'] as const;
