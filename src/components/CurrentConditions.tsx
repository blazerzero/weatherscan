import type { CurrentConditions as CC } from '../types/weather'
import { WeatherIcon } from './WeatherIcon'

interface Props {
  data: CC
}

interface RowProps {
  label: string
  value: string
  highlight?: boolean
}

function Row({ label, value, highlight }: RowProps) {
  return (
    <div
      className="flex justify-between items-baseline py-1 px-2"
      style={{ borderBottom: '1px solid #1a4070' }}
    >
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: '#557799', minWidth: '5.5rem' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-bold text-right"
        style={{ color: highlight ? '#ffcc00' : '#e8f4ff', textShadow: highlight ? '0 0 8px #cc8800' : undefined }}
      >
        {value}
      </span>
    </div>
  )
}

export function CurrentConditions({ data }: Props) {
  const windStr =
    data.windSpeedMph === 0
      ? 'Calm'
      : `${data.windDirCardinal} ${data.windSpeedMph} mph${data.windGustMph ? ` G${data.windGustMph}` : ''}`

  return (
    <section
      className="flex flex-col h-full"
      style={{ borderRight: '2px solid #1a4070' }}
    >
      {/* Big temperature + condition */}
      <div
        className="flex flex-col items-center justify-center py-4 px-2 gap-1"
        style={{ borderBottom: '2px solid #1a4070', background: 'rgba(0,51,102,0.25)' }}
      >
        <WeatherIcon
          code={data.conditionCode}
          isDay={data.isDay}
          className="text-4xl leading-none"
        />
        <div
          className="text-6xl font-bold leading-none"
          style={{
            color: '#e8f4ff',
            textShadow: '0 0 20px #0077cc, 0 0 6px #00aaff',
            fontFamily: 'Courier New, monospace',
          }}
        >
          {data.temperatureF}°
        </div>
        <div
          className="text-sm font-bold uppercase tracking-widest mt-1"
          style={{ color: '#00aaff' }}
        >
          {data.conditionLabel}
        </div>
      </div>

      {/* Data rows */}
      <div className="flex flex-col flex-1 justify-center py-2">
        <Row label="Feels Like" value={`${data.feelsLikeF}°F`} />
        <Row label="Dewpoint" value={`${data.dewpointF}°F`} />
        <Row label="Humidity" value={`${data.humidityPct}%`} />
        <Row label="Visibility" value={`${data.visibilityMiles} mi`} />
        <Row label="Wind" value={windStr} />
        <Row label="Barometer" value={`${data.pressureInHg} inHg`} />
        <Row label="UV Index" value={uvLabel(data.uvIndex)} highlight={data.uvIndex >= 6} />
      </div>

      {/* Observed at */}
      <div
        className="text-center text-xs py-1"
        style={{ color: '#557799', borderTop: '1px solid #1a4070' }}
      >
        Obs: {data.observedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
    </section>
  )
}

function uvLabel(uv: number): string {
  if (uv <= 2) return `${uv} Low`
  if (uv <= 5) return `${uv} Moderate`
  if (uv <= 7) return `${uv} High`
  if (uv <= 10) return `${uv} V.High`
  return `${uv} Extreme`
}
