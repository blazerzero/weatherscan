import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CurrentConditions } from './CurrentConditions'
import { CURRENT, CURRENT_CALM } from '../test/fixtures'

describe('CurrentConditions', () => {
  it('renders the temperature in °F', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.temperatureF}°`)).toBeInTheDocument()
  })

  it('renders the condition label', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText('Partly Cloudy')).toBeInTheDocument()
  })

  it('renders feels-like temperature', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.feelsLikeF}°F`)).toBeInTheDocument()
  })

  it('renders dewpoint', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.dewpointF}°F`)).toBeInTheDocument()
  })

  it('renders humidity', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.humidityPct}%`)).toBeInTheDocument()
  })

  it('renders visibility in miles', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.visibilityMiles} mi`)).toBeInTheDocument()
  })

  it('renders wind with direction and speed', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(/W 12 mph/)).toBeInTheDocument()
  })

  it('renders "Calm" when wind speed is zero', () => {
    render(<CurrentConditions data={CURRENT_CALM} />)
    expect(screen.getByText('Calm')).toBeInTheDocument()
  })

  it('appends gust speed when present', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(/G18/)).toBeInTheDocument()
  })

  it('omits gust when windGustMph is null', () => {
    render(<CurrentConditions data={CURRENT_CALM} />)
    expect(screen.queryByText(/G\d/)).not.toBeInTheDocument()
  })

  it('renders barometric pressure in inHg', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(`${CURRENT.pressureInHg} inHg`)).toBeInTheDocument()
  })

  it('renders UV index label', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(/3 Moderate/)).toBeInTheDocument()
  })

  it('highlights UV index when ≥6', () => {
    render(<CurrentConditions data={{ ...CURRENT, uvIndex: 8 }} />)
    const uvEl = screen.getByText(/8 V\.High/)
    expect(uvEl).toHaveStyle({ color: '#ffcc00' })
  })

  it('shows the observation time', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByText(/Obs:/)).toBeInTheDocument()
  })

  it('renders a weather icon', () => {
    render(<CurrentConditions data={CURRENT} />)
    expect(screen.getByRole('img')).toBeInTheDocument()
  })
})
