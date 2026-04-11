import { useState, useEffect } from 'react'
import type { LocationInfo } from '../types/weather'

interface Props {
  location: LocationInfo | null
}

export function Header({ location }: Props) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const tz = location?.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone

  const timeStr = now.toLocaleTimeString('en-US', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: true,
  })

  const dateStr = now.toLocaleDateString('en-US', {
    timeZone: tz,
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const locationStr = location
    ? [location.city, location.state || location.country].filter(Boolean).join(', ').toUpperCase()
    : 'ACQUIRING LOCATION...'

  return (
    <header
      className="flex items-center justify-between px-4 py-1.5 shrink-0"
      style={{
        background: 'linear-gradient(90deg, #003366 0%, #001a40 50%, #003366 100%)',
        borderBottom: '2px solid #0055a0',
      }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div
          className="text-xl font-bold tracking-widest uppercase"
          style={{ color: '#00aaff', textShadow: '0 0 12px #0077cc, 0 0 4px #00aaff', fontFamily: 'Courier New, monospace' }}
        >
          WeatherScan
        </div>
        <div
          className="text-xs px-2 py-0.5 rounded"
          style={{ background: '#0055a0', color: '#88bbdd', letterSpacing: '0.1em' }}
        >
          LOCAL
        </div>
      </div>

      {/* Location */}
      <div
        className="text-sm font-bold tracking-wider truncate max-w-xs text-center"
        style={{ color: '#ffcc00', textShadow: '0 0 8px #cc8800' }}
      >
        {locationStr}
      </div>

      {/* Clock */}
      <div className="text-right">
        <div
          className="text-lg font-bold tracking-widest"
          style={{ color: '#e8f4ff', fontFamily: 'Courier New, monospace', textShadow: '0 0 6px #0077cc' }}
        >
          {timeStr}
        </div>
        <div className="text-xs" style={{ color: '#557799', letterSpacing: '0.08em' }}>
          {dateStr}
        </div>
      </div>
    </header>
  )
}
