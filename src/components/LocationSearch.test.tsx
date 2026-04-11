import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LocationSearch } from './LocationSearch'

// Mock the geocodeCity function
vi.mock('../api/openMeteo', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../api/openMeteo')>()
  return {
    ...actual,
    geocodeCity: vi.fn(),
  }
})

import { geocodeCity } from '../api/openMeteo'

const MOCK_LOCATION = {
  coords: { lat: 39.95, lon: -75.16 },
  city: 'Philadelphia',
  state: 'PA',
  country: 'US',
  isUS: true,
  timezone: 'America/New_York',
}

describe('LocationSearch', () => {
  beforeEach(() => {
    vi.mocked(geocodeCity).mockReset()
  })

  it('renders the instruction text', () => {
    render(<LocationSearch onLocationFound={vi.fn()} />)
    expect(screen.getByText(/Location access was denied/i)).toBeInTheDocument()
  })

  it('renders the search input', () => {
    render(<LocationSearch onLocationFound={vi.fn()} />)
    expect(screen.getByPlaceholderText(/City, State or Zip/i)).toBeInTheDocument()
  })

  it('renders the Go button', () => {
    render(<LocationSearch onLocationFound={vi.fn()} />)
    expect(screen.getByRole('button', { name: /Go/i })).toBeInTheDocument()
  })

  it('calls onLocationFound with the resolved location on successful geocode', async () => {
    vi.mocked(geocodeCity).mockResolvedValue(MOCK_LOCATION)
    const onFound = vi.fn()
    render(<LocationSearch onLocationFound={onFound} />)

    await userEvent.type(screen.getByPlaceholderText(/City/i), 'Philadelphia')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))

    await waitFor(() => expect(onFound).toHaveBeenCalledWith(MOCK_LOCATION))
  })

  it('shows an error message when the city is not found', async () => {
    vi.mocked(geocodeCity).mockResolvedValue(null)
    render(<LocationSearch onLocationFound={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/City/i), 'xyzzy')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))

    await waitFor(() => expect(screen.getByText(/Location not found/i)).toBeInTheDocument())
  })

  it('shows a generic error message on network failure', async () => {
    vi.mocked(geocodeCity).mockRejectedValue(new Error('Network error'))
    render(<LocationSearch onLocationFound={vi.fn()} />)

    await userEvent.type(screen.getByPlaceholderText(/City/i), 'anywhere')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))

    await waitFor(() => expect(screen.getByText(/Error looking up location/i)).toBeInTheDocument())
  })

  it('does not submit on empty input', async () => {
    vi.mocked(geocodeCity).mockResolvedValue(MOCK_LOCATION)
    const onFound = vi.fn()
    render(<LocationSearch onLocationFound={onFound} />)

    await userEvent.click(screen.getByRole('button', { name: /Go/i }))
    expect(onFound).not.toHaveBeenCalled()
  })

  it('disables the button while loading', async () => {
    let resolve!: (v: typeof MOCK_LOCATION | null) => void
    vi.mocked(geocodeCity).mockReturnValue(new Promise((r) => { resolve = r }))

    render(<LocationSearch onLocationFound={vi.fn()} />)
    await userEvent.type(screen.getByPlaceholderText(/City/i), 'Philadelphia')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))

    expect(screen.getByRole('button', { name: /\.\.\./i })).toBeDisabled()
    // Resolve the pending promise inside act to flush state updates
    await act(async () => { resolve(MOCK_LOCATION) })
  })

  it('clears the error after a new successful search', async () => {
    vi.mocked(geocodeCity).mockResolvedValueOnce(null).mockResolvedValueOnce(MOCK_LOCATION)
    const onFound = vi.fn()
    render(<LocationSearch onLocationFound={onFound} />)

    await userEvent.type(screen.getByPlaceholderText(/City/i), 'xyzzy')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))
    await waitFor(() => screen.getByText(/Location not found/i))

    await userEvent.clear(screen.getByPlaceholderText(/City/i))
    await userEvent.type(screen.getByPlaceholderText(/City/i), 'Philadelphia')
    await userEvent.click(screen.getByRole('button', { name: /Go/i }))

    await waitFor(() => expect(onFound).toHaveBeenCalledWith(MOCK_LOCATION))
    expect(screen.queryByText(/Location not found/i)).not.toBeInTheDocument()
  })
})
