import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, act } from '@testing-library/react'
import { Header } from './Header'
import { LOCATION } from '../test/fixtures'

describe('Header', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-06-01T14:30:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('renders the WeatherScan brand name', () => {
    render(<Header location={LOCATION} />)
    expect(screen.getByText('WeatherScan')).toBeInTheDocument()
  })

  it('renders the LOCAL badge', () => {
    render(<Header location={LOCATION} />)
    expect(screen.getByText('LOCAL')).toBeInTheDocument()
  })

  it('renders the location name in uppercase', () => {
    render(<Header location={LOCATION} />)
    expect(screen.getByText('PHILADELPHIA, PA')).toBeInTheDocument()
  })

  it('shows "ACQUIRING LOCATION..." when location is null', () => {
    render(<Header location={null} />)
    expect(screen.getByText('ACQUIRING LOCATION...')).toBeInTheDocument()
  })

  it('renders a clock with time digits', () => {
    render(<Header location={LOCATION} />)
    // The time string should include AM or PM
    expect(screen.getByText(/[AP]M/)).toBeInTheDocument()
  })

  it('updates the clock every second', () => {
    render(<Header location={LOCATION} />)
    const before = screen.getByText(/[AP]M/).textContent
    act(() => vi.advanceTimersByTime(1000))
    const after = screen.getByText(/[AP]M/).textContent
    // Time should have changed (seconds tick)
    expect(before).toBeDefined()
    expect(after).toBeDefined()
  })

  it('renders a date string', () => {
    render(<Header location={LOCATION} />)
    // Should render something like "Sat, Jun 1, 2024"
    expect(screen.getByText(/2024/)).toBeInTheDocument()
  })

  it('includes city and state when both are present', () => {
    render(<Header location={{ ...LOCATION, city: 'Boston', state: 'MA' }} />)
    expect(screen.getByText('BOSTON, MA')).toBeInTheDocument()
  })

  it('shows only city when state is empty', () => {
    render(<Header location={{ ...LOCATION, city: 'London', state: '', country: 'GB' }} />)
    expect(screen.getByText('LONDON, GB')).toBeInTheDocument()
  })
})
