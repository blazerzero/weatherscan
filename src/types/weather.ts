export interface Coordinates {
  lat: number
  lon: number
}

export interface LocationInfo {
  coords: Coordinates
  city: string
  state: string
  country: string
  isUS: boolean
  timezone: string
  /** NWS grid office (US only) */
  nwsOffice?: string
  nwsGridX?: number
  nwsGridY?: number
  /** NWS zone ID for alerts (US only), e.g. "PAZ021" */
  nwsZoneId?: string
}

export interface CurrentConditions {
  temperatureF: number
  feelsLikeF: number
  dewpointF: number
  humidityPct: number
  visibilityMiles: number
  windDirDeg: number
  windDirCardinal: string
  windSpeedMph: number
  windGustMph: number | null
  pressureInHg: number
  uvIndex: number
  conditionCode: number
  conditionLabel: string
  isDay: boolean
  observedAt: Date
}

export interface HourlyPoint {
  time: Date
  tempF: number
  conditionCode: number
  conditionLabel: string
  precipChancePct: number
  isDay: boolean
}

export interface DailyForecast {
  date: Date
  highF: number
  lowF: number
  conditionCode: number
  conditionLabel: string
  precipChancePct: number
  sunrise: Date
  sunset: Date
}

export interface WeatherAlert {
  id: string
  headline: string
  description: string
  severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
  urgency: string
  event: string
  onset: Date | null
  expires: Date | null
  areaDesc: string
}

export interface WeatherData {
  location: LocationInfo
  current: CurrentConditions
  hourly: HourlyPoint[]
  daily: DailyForecast[]
  alerts: WeatherAlert[]
}

export type SlideType = 'hourly' | '7day' | 'radar' | 'alerts'
