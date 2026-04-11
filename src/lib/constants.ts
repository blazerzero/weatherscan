/** Query refresh / stale-time intervals (milliseconds) */
export const FIVE_MIN = 5 * 60 * 1000
export const THIRTY_MIN = 30 * 60 * 1000

/**
 * Design-token color palette.
 * These values mirror the CSS custom properties in index.css so that
 * React inline styles reference the same source of truth.
 */
export const COLORS = {
  // Blues
  blueDarkest: '#000d1a',
  blueDark: '#001433',
  blueMid: '#003366',
  blueLight: '#0055a0',
  blueBright: '#0077cc',
  blueAccent: '#0099dd',   // precipitation indicators, subtle accents

  // Highlights
  cyan: '#00aaff',
  gold: '#ffcc00',
  goldDark: '#cc8800',     // used in text-shadow tones
  orange: '#ff8800',
  red: '#ff3300',
  green: '#00cc44',

  // Text
  textPrimary: '#e8f4ff',
  textSecondary: '#88bbdd',
  textTertiary: '#6699bb', // low-temp values, muted labels
  textDim: '#557799',

  // Borders & surfaces
  border: '#1a4070',
  borderDark: '#0d2a40',   // inner row borders, temp-bar backgrounds
} as const

/** Monospace font stack used for numeric readouts */
export const MONO_FONT = 'Courier New, monospace' as const
