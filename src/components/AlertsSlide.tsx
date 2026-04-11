import type { WeatherAlert } from '../types/weather'
import { COLORS } from '../lib/constants'
import { formatAlertTime } from '../lib/format'
import { SlideHeader } from './SlideHeader'

interface Props {
  alerts: WeatherAlert[]
}

const SEVERITY_COLORS: Record<WeatherAlert['severity'], { text: string; border: string; bg: string }> = {
  Extreme: { text: COLORS.red,           border: COLORS.red,           bg: 'rgba(255,51,0,0.1)' },
  Severe:  { text: COLORS.orange,        border: COLORS.orange,        bg: 'rgba(255,136,0,0.1)' },
  Moderate:{ text: COLORS.gold,          border: COLORS.gold,          bg: 'rgba(255,204,0,0.1)' },
  Minor:   { text: COLORS.green,         border: COLORS.green,         bg: 'rgba(0,204,68,0.1)' },
  Unknown: { text: COLORS.textSecondary, border: COLORS.border,        bg: 'transparent' },
}

export function AlertsSlide({ alerts }: Props) {
  if (alerts.length === 0) {
    return (
      <div className="flex flex-col h-full items-center justify-center gap-2">
        <div className="text-4xl">✅</div>
        <div className="text-sm font-bold uppercase tracking-widest" style={{ color: COLORS.green }}>
          No Active Alerts
        </div>
        <div className="text-xs" style={{ color: COLORS.textDim }}>No warnings or advisories for your area.</div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      <SlideHeader title={`⚠ Active Alerts (${alerts.length})`} alert />
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
              <div className="text-xs mt-1" style={{ color: COLORS.textSecondary }}>
                {a.areaDesc}
              </div>
              <div className="text-xs mt-0.5" style={{ color: COLORS.textDim }}>
                Until: {formatAlertTime(a.expires)}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
