import type { DailyForecast } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'

interface Props {
  data: DailyForecast[]
}

export function SevenDayForecast({ data }: Props) {
  const days = data.slice(0, 7)

  // Compute overall high/low for the bar scale
  const allHighs = days.map((d) => d.highF)
  const allLows = days.map((d) => d.lowF)
  const maxTemp = Math.max(...allHighs)
  const minTemp = Math.min(...allLows)
  const range = maxTemp - minTemp || 1

  return (
    <div className="flex flex-col h-full">
      <div
        className="text-center py-2 text-sm font-bold tracking-widest uppercase"
        style={{ color: '#00aaff', borderBottom: '2px solid #1a4070', background: 'rgba(0,51,102,0.3)' }}
      >
        7-Day Forecast
      </div>

      <div className="flex-1 overflow-hidden flex flex-col justify-around py-1">
        {days.map((d, i) => {
          const dayLabel = i === 0
            ? 'Today'
            : d.date.toLocaleDateString('en-US', { weekday: 'short' })
          const highPct = ((d.highF - minTemp) / range) * 100
          const lowPct = ((d.lowF - minTemp) / range) * 100
          const barLeft = `${lowPct}%`
          const barWidth = `${Math.max(highPct - lowPct, 2)}%`

          return (
            <div
              key={d.date.toISOString()}
              className="flex items-center gap-2 px-3 py-0.5"
              style={{ borderBottom: '1px solid #0d2a40' }}
            >
              {/* Day */}
              <span
                className="text-xs font-bold w-10 uppercase"
                style={{ color: i === 0 ? '#ffcc00' : '#88bbdd' }}
              >
                {dayLabel}
              </span>

              {/* Icon */}
              <WeatherIcon code={d.conditionCode} isDay className="text-base w-6 text-center" />

              {/* Low */}
              <span
                className="text-xs font-bold w-10 text-right"
                style={{ color: '#6699bb', fontFamily: 'Courier New, monospace' }}
              >
                {d.lowF}°
              </span>

              {/* Temp bar */}
              <div className="flex-1 relative h-2 rounded-full" style={{ background: '#0d2a40' }}>
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    left: barLeft,
                    width: barWidth,
                    background: 'linear-gradient(90deg, #0077cc, #ffcc00)',
                  }}
                />
              </div>

              {/* High */}
              <span
                className="text-xs font-bold w-10"
                style={{ color: '#ffcc00', fontFamily: 'Courier New, monospace' }}
              >
                {d.highF}°
              </span>

              {/* Precip */}
              {d.precipChancePct > 0 && (
                <span className="text-xs w-8 text-right" style={{ color: '#0099dd' }}>
                  {d.precipChancePct}%
                </span>
              )}
              {d.precipChancePct === 0 && <span className="w-8" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
