import { useMemo } from 'react'
import type { WeatherAlert } from '../types/weather'
import { useNationalHeadlines } from '../hooks/useAlerts'

interface Props {
  localAlerts: WeatherAlert[]
  locationName: string
}

const FALLBACK_HEADLINES = [
  'WeatherScan — Your local weather, always on.',
  'Visit weather.gov for official forecasts and warnings.',
  'Have a weather emergency? Call 911.',
  'Turn around, don\'t drown — never drive through flooded roads.',
  'Lightning safety: if thunder roars, go indoors.',
  'Stay weather-aware — sign up for local emergency alerts.',
]

export function Chyron({ localAlerts, locationName }: Props) {
  const { data: nationalHeadlines } = useNationalHeadlines()

  const items = useMemo(() => {
    const localItems = localAlerts.map(
      (a) => `⚠ ${a.event.toUpperCase()} — ${a.areaDesc}: ${a.headline}`,
    )
    const nationalItems = (nationalHeadlines ?? []).map((h) => `🌐 ${h}`)
    const combined = [...localItems, ...nationalItems]
    return combined.length > 0 ? combined : FALLBACK_HEADLINES
  }, [localAlerts, nationalHeadlines])

  // Build a long string with separators, doubled for seamless loop
  const text = items.join('   ·   ')
  const doubled = `${text}   ·   ${text}`

  const hasAlerts = localAlerts.length > 0

  return (
    <div
      className="flex items-center shrink-0 overflow-hidden"
      style={{
        height: '2rem',
        background: hasAlerts ? 'rgba(255,51,0,0.15)' : '#001433',
        borderTop: `2px solid ${hasAlerts ? '#ff3300' : '#1a4070'}`,
      }}
    >
      {/* Label badge */}
      <div
        className="shrink-0 px-2 h-full flex items-center text-xs font-bold uppercase tracking-widest"
        style={{
          background: hasAlerts ? '#ff3300' : '#003366',
          color: '#e8f4ff',
          borderRight: `2px solid ${hasAlerts ? '#ff3300' : '#1a4070'}`,
          minWidth: '5rem',
          justifyContent: 'center',
        }}
      >
        {hasAlerts ? '⚠ ALERT' : `${locationName.toUpperCase().slice(0, 8)}`}
      </div>

      {/* Scrolling text */}
      <div className="flex-1 overflow-hidden relative h-full flex items-center">
        <div
          className="chyron-track text-xs font-bold"
          style={{
            color: hasAlerts ? '#ffcc00' : '#88bbdd',
            textShadow: hasAlerts ? '0 0 6px #cc8800' : undefined,
            letterSpacing: '0.05em',
            whiteSpace: 'nowrap',
          }}
        >
          {doubled}
        </div>
      </div>
    </div>
  )
}
