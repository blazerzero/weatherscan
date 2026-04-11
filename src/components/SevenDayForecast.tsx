import type { DailyForecast } from '../types/weather'
import { COLORS, MONO_FONT } from '../lib/constants'
import { SlideHeader } from './SlideHeader'
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
      <SlideHeader title="7-Day Forecast" />

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
              style={{ borderBottom: `1px solid ${COLORS.borderDark}` }}
            >
              {/* Day */}
              <span
                className="text-xs font-bold w-10 uppercase"
                style={{ color: i === 0 ? COLORS.gold : COLORS.textSecondary }}
              >
                {dayLabel}
              </span>

              {/* Icon */}
              <WeatherIcon code={d.conditionCode} isDay className="text-base w-6 text-center" />

              {/* Low */}
              <span
                className="text-xs font-bold w-10 text-right"
                style={{ color: COLORS.textTertiary, fontFamily: MONO_FONT }}
              >
                {d.lowF}°
              </span>

              {/* Temp bar */}
              <div className="flex-1 relative h-2 rounded-full" style={{ background: COLORS.borderDark }}>
                <div
                  className="absolute top-0 h-full rounded-full"
                  style={{
                    left: barLeft,
                    width: barWidth,
                    background: `linear-gradient(90deg, ${COLORS.blueBright}, ${COLORS.gold})`,
                  }}
                />
              </div>

              {/* High */}
              <span
                className="text-xs font-bold w-10"
                style={{ color: COLORS.gold, fontFamily: MONO_FONT }}
              >
                {d.highF}°
              </span>

              {/* Precip */}
              {d.precipChancePct > 0 && (
                <span className="text-xs w-8 text-right" style={{ color: COLORS.blueAccent }}>
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
