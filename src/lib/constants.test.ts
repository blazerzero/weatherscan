import { describe, it, expect } from 'vitest'
import { FIVE_MIN, THIRTY_MIN, COLORS, MONO_FONT } from './constants'

describe('time interval constants', () => {
  it('FIVE_MIN is 300 000 ms', () => expect(FIVE_MIN).toBe(300_000))
  it('THIRTY_MIN is 1 800 000 ms', () => expect(THIRTY_MIN).toBe(1_800_000))
  it('THIRTY_MIN is exactly 6× FIVE_MIN', () => expect(THIRTY_MIN).toBe(FIVE_MIN * 6))
})

describe('COLORS', () => {
  it('contains all expected keys', () => {
    const keys: (keyof typeof COLORS)[] = [
      'blueDarkest', 'blueDark', 'blueMid', 'blueLight', 'blueBright', 'blueAccent',
      'cyan', 'gold', 'goldDark', 'orange', 'red', 'green',
      'textPrimary', 'textSecondary', 'textTertiary', 'textDim',
      'border', 'borderDark',
    ]
    for (const key of keys) {
      expect(COLORS).toHaveProperty(key)
    }
  })

  it('all values are valid hex color strings', () => {
    for (const value of Object.values(COLORS)) {
      expect(value).toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it('cyan matches the CSS custom property value', () => expect(COLORS.cyan).toBe('#00aaff'))
  it('gold matches the CSS custom property value', () => expect(COLORS.gold).toBe('#ffcc00'))
  it('red matches the CSS custom property value', () => expect(COLORS.red).toBe('#ff3300'))
  it('border matches the CSS custom property value', () => expect(COLORS.border).toBe('#1a4070'))
})

describe('MONO_FONT', () => {
  it('contains Courier New', () => expect(MONO_FONT).toContain('Courier New'))
  it('includes a monospace fallback', () => expect(MONO_FONT).toContain('monospace'))
})
