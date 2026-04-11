import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AlertsSlide } from './AlertsSlide'
import { ALERT, EXTREME_ALERT } from '../test/fixtures'

describe('AlertsSlide', () => {
  describe('no alerts', () => {
    it('renders the "No Active Alerts" message', () => {
      render(<AlertsSlide alerts={[]} />)
      expect(screen.getByText(/No Active Alerts/i)).toBeInTheDocument()
    })

    it('renders a friendly sub-message', () => {
      render(<AlertsSlide alerts={[]} />)
      expect(screen.getByText(/No warnings or advisories/i)).toBeInTheDocument()
    })
  })

  describe('with alerts', () => {
    it('renders the alert count in the header', () => {
      render(<AlertsSlide alerts={[ALERT]} />)
      expect(screen.getByText(/Active Alerts \(1\)/i)).toBeInTheDocument()
    })

    it('renders the event name', () => {
      render(<AlertsSlide alerts={[ALERT]} />)
      expect(screen.getByText('Tornado Watch')).toBeInTheDocument()
    })

    it('renders the area description', () => {
      render(<AlertsSlide alerts={[ALERT]} />)
      expect(screen.getByText(/Philadelphia County/)).toBeInTheDocument()
    })

    it('renders the severity badge', () => {
      render(<AlertsSlide alerts={[ALERT]} />)
      expect(screen.getByText('Severe')).toBeInTheDocument()
    })

    it('renders the expiration time', () => {
      render(<AlertsSlide alerts={[ALERT]} />)
      expect(screen.getByText(/Until:/)).toBeInTheDocument()
    })

    it('renders multiple alerts', () => {
      render(<AlertsSlide alerts={[ALERT, EXTREME_ALERT]} />)
      expect(screen.getByText(/Active Alerts \(2\)/i)).toBeInTheDocument()
      expect(screen.getByText('Tornado Watch')).toBeInTheDocument()
      expect(screen.getByText('Tornado Warning')).toBeInTheDocument()
    })

    it('renders Extreme severity badge', () => {
      render(<AlertsSlide alerts={[EXTREME_ALERT]} />)
      expect(screen.getByText('Extreme')).toBeInTheDocument()
    })

    it('renders Minor severity badge', () => {
      render(<AlertsSlide alerts={[{ ...ALERT, severity: 'Minor', event: 'Wind Advisory' }]} />)
      expect(screen.getByText('Minor')).toBeInTheDocument()
    })

    it('handles null expires gracefully', () => {
      render(<AlertsSlide alerts={[{ ...ALERT, expires: null }]} />)
      expect(screen.getByText(/Until: --/)).toBeInTheDocument()
    })
  })
})
