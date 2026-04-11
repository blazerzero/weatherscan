import type { HourlyPoint } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'

interface Props {
  data: HourlyPoint[]
}

export function HourlyForecast({ data }: Props) {
  const hours = data.slice(0, 12)

  return (
    <div className="flex flex-col h-full">
      <div
        className="text-center py-2 text-sm font-bold tracking-widest uppercase"
        style={{ color: '#00aaff', borderBottom: '2px solid #1a4070', background: 'rgba(0,51,102,0.3)' }}
      >
        Hourly Forecast
      </div>

      <div className="flex-1 overflow-hidden">
        {hours.map((h, i) => {
          const timeStr = h.time.toLocaleTimeString('en-US', {
            hour: 'numeric',
            hour12: true,
          })
          const isNow = i === 0
          return (
            <div
              key={h.time.toISOString()}
              className="flex items-center justify-between px-4 py-1.5"
              style={{
                borderBottom: '1px solid #1a4070',
                background: isNow ? 'rgba(0,85,160,0.25)' : undefined,
              }}
            >
              <span
                className="text-xs font-bold w-16"
                style={{ color: isNow ? '#ffcc00' : '#88bbdd', letterSpacing: '0.05em' }}
              >
                {isNow ? 'NOW' : timeStr}
              </span>
              <WeatherIcon
                code={h.conditionCode}
                isDay={h.isDay}
                className="text-lg w-8 text-center"
              />
              <span
                className="text-xs w-20 text-center truncate"
                style={{ color: '#557799' }}
              >
                {h.conditionLabel}
              </span>
              <span
                className="text-sm font-bold w-14 text-right"
                style={{ color: '#e8f4ff', fontFamily: 'Courier New, monospace' }}
              >
                {h.tempF}°F
              </span>
              {h.precipChancePct > 0 && (
                <span
                  className="text-xs w-10 text-right"
                  style={{ color: '#0099dd' }}
                >
                  {h.precipChancePct}%
                </span>
              )}
              {h.precipChancePct === 0 && <span className="w-10" />}
            </div>
          )
        })}
      </div>
    </div>
  )
}
