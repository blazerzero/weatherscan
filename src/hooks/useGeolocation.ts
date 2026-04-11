import { useState, useEffect } from 'react'
import type { Coordinates } from '../types/weather'

export type GeoState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; coords: Coordinates }
  | { status: 'denied' }
  | { status: 'error'; message: string }

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({ status: 'loading' })

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ status: 'denied' })
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setState({
          status: 'success',
          coords: { lat: pos.coords.latitude, lon: pos.coords.longitude },
        })
      },
      (err) => {
        if (err.code === GeolocationPositionError.PERMISSION_DENIED) {
          setState({ status: 'denied' })
        } else {
          setState({ status: 'error', message: err.message })
        }
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 },
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  return state
}
