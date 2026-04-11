const API = 'https://api.rainviewer.com/public/weather-maps.json'

export interface RadarFrame {
  time: number
  path: string
}

export interface RainViewerData {
  host: string
  radar: {
    past: RadarFrame[]
    nowcast: RadarFrame[]
  }
}

export async function fetchRadarFrames(): Promise<RainViewerData | null> {
  try {
    const res = await fetch(API)
    if (!res.ok) return null
    return await res.json() as RainViewerData
  } catch {
    return null
  }
}

/** Build a Leaflet tile URL for a given RainViewer frame */
export function radarTileUrl(host: string, path: string, colorScheme = 2, smooth = 1, snow = 0): string {
  return `${host}${path}/256/{z}/{x}/{y}/${colorScheme}/${smooth}_${snow}.png`
}
