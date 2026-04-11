import { COLORS } from '../lib/constants'

interface Props {
  title: string
  /** When true, renders in alert-red rather than the standard cyan. */
  alert?: boolean
}

/**
 * Shared section header used at the top of every rotating slide panel.
 * Keeps the className + inline style consistent across HourlyForecast,
 * SevenDayForecast, RadarSlide, and AlertsSlide.
 */
export function SlideHeader({ title, alert = false }: Props) {
  return (
    <div
      className="text-center py-2 text-sm font-bold tracking-widest uppercase shrink-0"
      style={{
        color: alert ? COLORS.red : COLORS.cyan,
        borderBottom: `2px solid ${alert ? COLORS.red : COLORS.border}`,
        background: alert ? 'rgba(255,51,0,0.1)' : 'rgba(0,51,102,0.3)',
      }}
    >
      {title}
    </div>
  )
}
