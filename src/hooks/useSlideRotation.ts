import { useState, useEffect, useCallback } from 'react'
import type { SlideType } from '../types/weather'

const SLIDE_DURATION_MS = 30_000

export function useSlideRotation(slides: SlideType[]): {
  current: SlideType
  index: number
  advance: () => void
  goTo: (i: number) => void
} {
  const [index, setIndex] = useState(0)

  // Reset to 0 if slides array shrinks and index goes out of bounds
  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [slides, index])

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % slides.length)
  }, [slides.length])

  const goTo = useCallback((i: number) => {
    setIndex(i % slides.length)
  }, [slides.length])

  useEffect(() => {
    const timer = setInterval(advance, SLIDE_DURATION_MS)
    return () => clearInterval(timer)
  }, [advance])

  const safeIndex = Math.min(index, slides.length - 1)
  return { current: slides[safeIndex] ?? 'hourly', index: safeIndex, advance, goTo }
}
