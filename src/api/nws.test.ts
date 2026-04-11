import { describe, it, expect, vi, beforeEach } from 'vitest'
import { normalizeSeverity, fetchAlerts, fetchNationalHeadlines, enrichWithNWS } from './nws'
import type { LocationInfo } from '../types/weather'

// ---------------------------------------------------------------------------
// normalizeSeverity
// ---------------------------------------------------------------------------

describe('normalizeSeverity', () => {
  it('maps "Extreme" correctly', () => expect(normalizeSeverity('Extreme')).toBe('Extreme'))
  it('maps "Severe" correctly', () => expect(normalizeSeverity('Severe')).toBe('Severe'))
  it('maps "Moderate" correctly', () => expect(normalizeSeverity('Moderate')).toBe('Moderate'))
  it('maps "Minor" correctly', () => expect(normalizeSeverity('Minor')).toBe('Minor'))
  it('maps undefined to "Unknown"', () => expect(normalizeSeverity(undefined)).toBe('Unknown'))
  it('maps empty string to "Unknown"', () => expect(normalizeSeverity('')).toBe('Unknown'))
  it('maps unrecognized value to "Unknown"', () => expect(normalizeSeverity('Critical')).toBe('Unknown'))
})

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

const US_LOCATION: LocationInfo = {
  coords: { lat: 40.7128, lon: -74.006 },
  city: 'New York',
  state: 'New York',
  country: 'US',
  isUS: true,
  timezone: 'America/New_York',
}

const NON_US_LOCATION: LocationInfo = {
  coords: { lat: 51.5, lon: -0.1 },
  city: 'London',
  state: 'England',
  country: 'GB',
  isUS: false,
  timezone: 'Europe/London',
}

const MOCK_ALERT = {
  id: 'alert-001',
  headline: 'Tornado Watch in effect until 9 PM EDT',
  description: 'A tornado watch has been issued.',
  severity: 'Severe',
  urgency: 'Expected',
  event: 'Tornado Watch',
  onset: '2024-06-01T18:00:00Z',
  expires: '2024-06-02T01:00:00Z',
  areaDesc: 'New York County',
}

// ---------------------------------------------------------------------------
// fetchAlerts
// ---------------------------------------------------------------------------

describe('fetchAlerts', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ '@graph': [MOCK_ALERT] }),
    }))
  })

  it('returns empty array for non-US locations without calling fetch', async () => {
    const alerts = await fetchAlerts(NON_US_LOCATION)
    expect(alerts).toEqual([])
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('returns parsed alerts for US locations', async () => {
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts).toHaveLength(1)
    expect(alerts[0]!.event).toBe('Tornado Watch')
    expect(alerts[0]!.severity).toBe('Severe')
    expect(alerts[0]!.areaDesc).toBe('New York County')
  })

  it('parses onset and expires as Date objects', async () => {
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts[0]!.onset).toBeInstanceOf(Date)
    expect(alerts[0]!.expires).toBeInstanceOf(Date)
  })

  it('handles null onset/expires gracefully', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ '@graph': [{ ...MOCK_ALERT, onset: undefined, expires: undefined }] }),
    }))
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts[0]!.onset).toBeNull()
    expect(alerts[0]!.expires).toBeNull()
  })

  it('returns empty array on HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts).toEqual([])
  })

  it('returns empty array on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts).toEqual([])
  })

  it('returns empty array when @graph is missing', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({}),
    }))
    const alerts = await fetchAlerts(US_LOCATION)
    expect(alerts).toEqual([])
  })

  it('uses the correct NWS API endpoint with lat/lon', async () => {
    await fetchAlerts(US_LOCATION)
    const url = (global.fetch as ReturnType<typeof vi.fn>).mock.calls[0][0] as string
    expect(url).toContain('api.weather.gov/alerts/active')
    expect(url).toContain('40.7128')
    expect(url).toContain('-74.0060')
  })
})

// ---------------------------------------------------------------------------
// fetchNationalHeadlines
// ---------------------------------------------------------------------------

describe('fetchNationalHeadlines', () => {
  it('returns an array of formatted headline strings', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        '@graph': [
          { event: 'Flash Flood Warning', areaDesc: 'Harris County, TX' },
          { event: 'Tornado Warning', areaDesc: 'Moore, OK' },
        ],
      }),
    }))
    const headlines = await fetchNationalHeadlines()
    expect(headlines).toHaveLength(2)
    expect(headlines[0]).toContain('Flash Flood Warning')
    expect(headlines[1]).toContain('Tornado Warning')
  })

  it('returns empty array on HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    expect(await fetchNationalHeadlines()).toEqual([])
  })

  it('returns empty array on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    expect(await fetchNationalHeadlines()).toEqual([])
  })
})

// ---------------------------------------------------------------------------
// enrichWithNWS
// ---------------------------------------------------------------------------

describe('enrichWithNWS', () => {
  it('returns the location unchanged for non-US locations', async () => {
    const result = await enrichWithNWS(NON_US_LOCATION)
    expect(result).toBe(NON_US_LOCATION)
  })

  it('adds NWS grid data for US locations', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        forecastGridData: 'https://api.weather.gov/gridpoints/OKX/33,37',
        county: 'https://api.weather.gov/zones/county/NYC061',
        timeZone: 'America/New_York',
      }),
    }))
    const result = await enrichWithNWS(US_LOCATION)
    expect(result.nwsOffice).toBe('OKX')
    expect(result.nwsGridX).toBe(33)
    expect(result.nwsGridY).toBe(37)
    expect(result.timezone).toBe('America/New_York')
  })

  it('returns original location on HTTP error', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await enrichWithNWS(US_LOCATION)
    expect(result).toEqual(US_LOCATION)
  })

  it('returns original location on network failure', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('timeout')))
    const result = await enrichWithNWS(US_LOCATION)
    expect(result).toEqual(US_LOCATION)
  })
})
