import type { WeatherAlert } from '../types/weather'

interface Props {
  alerts: WeatherAlert[]
}

const SEVERITY_COLORS: Record<WeatherAlert['severity'], { text: string; border: string; bg: string }> = {
  Extreme: { text: '#ff3300', border: '#ff3300', bg: 'rgba(255,51,0,0.1)' },
  Severe:  { text: '#ff8800', border: '#ff8800', bg: 'rgba(255,136,0,0.1)' },
  Moderate:{ text: '#ffcc00', border: '#ffcc00', bg: 'rgba(255,204,0,0.1)' },
  Minor:   { text: '#00cc44', border: '#00cc44', bg: 'rgba(0,204,68,0.1)' },
  Unknown: { text: '#88bbdd', border: '#1a4070', bg: 'transparent' },
}

function formatTime(d: Date | null): string {
  if (!d) return '--'
  return d.toLocaleString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

export function AlertsSlide({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2">
        <div className="text-4xl">✅</div>
        <div className="text-sm font-bold uppercase tracking-widest" style={{ color: '#00cc44' }}>
          No Active Alerts
        </div>
        <div className="text-xs" style={{ color: '#557799' }}>No warnings or advisories for your area.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <div
        className="text-center py-2 text-sm font-bold tracking-widest uppercase"
        style={{ color: '#ff3300', borderBottom: '2px solid #ff3300', background: 'rgba(255,51,0,0.1)' }}
      >
        ⚠ Active Alerts ({alerts.length})
      </div>
      <div className="flex-1 overflow-y-auto">
        {alerts.map((a) => {
          const colors = SEVERITY_COLORS[a.severity]
          return (
            <div
              key={a.id}
              className="mx-2 my-1.5 p-2 rounded"
              style={{ border: `1px solid ${colors.border}`, background: colors.bg }}
            >
              <div className="flex items-start justify-between gap-2">
                <div
                  className="text-xs font-bold uppercase tracking-wide"
                  style={{ color: colors.text }}
                >
                  {a.event}
                </div>
                <div
                  className="text-xs px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0"
                  style={{ color: colors.text, border: `1px solid ${colors.border}` }}
                >
                  {a.severity}
                </div>
              </div>
              <div className="text-xs mt-1" style={{ color: '#88bbdd' }}>
                {a.areaDesc}
              </div>
              <div className="text-xs mt-0.5" style={{ color: '#557799' }}>
                Until: {formatTime(a.expires)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
