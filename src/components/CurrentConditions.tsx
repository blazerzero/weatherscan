import type { CurrentConditions as CC } from '../types/weather'
import { COLORS, MONO_FONT } from '../lib/constants'
import { uvLabel } from '../lib/format'
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
      style={{ borderBottom: `1px solid ${COLORS.border}` }}
    >
      <span
        className="text-xs uppercase tracking-widest"
        style={{ color: COLORS.textDim, minWidth: '5.5rem' }}
      >
        {label}
      </span>
      <span
        className="text-sm font-bold text-right"
        style={{
          color: highlight ? COLORS.gold : COLORS.textPrimary,
          textShadow: highlight ? `0 0 8px ${COLORS.goldDark}` : undefined,
        }}
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
      style={{ borderRight: `2px solid ${COLORS.border}` }}
    >
      {/* Big temperature + condition */}
      <div
        className="flex flex-col items-center justify-center py-4 px-2 gap-1"
        style={{ borderBottom: `2px solid ${COLORS.border}`, background: 'rgba(0,51,102,0.25)' }}
      >
        <WeatherIcon
          code={data.conditionCode}
          isDay={data.isDay}
          className="text-4xl leading-none"
        />
        <div
          className="text-6xl font-bold leading-none"
          style={{
            color: COLORS.textPrimary,
            textShadow: `0 0 20px ${COLORS.blueBright}, 0 0 6px ${COLORS.cyan}`,
            fontFamily: MONO_FONT,
          }}
        >
          {data.temperatureF}°
        </div>
        <div
          className="text-sm font-bold uppercase tracking-widest mt-1"
          style={{ color: COLORS.cyan }}
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
        style={{ color: COLORS.textDim, borderTop: `1px solid ${COLORS.border}` }}
      >
        Obs: {data.observedAt.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </div>
    </section>
  )
}
