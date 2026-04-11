import { useQuery } from '@tanstack/react-query'
import { fetchNationalHeadlines } from '../api/nws'

const FIVE_MIN = 5 * 60 * 1000

export function useNationalHeadlines() {
  return useQuery<string[]>({
    queryKey: ['nws-headlines'],
    queryFn: fetchNationalHeadlines,
    staleTime: FIVE_MIN,
    refetchInterval: FIVE_MIN,
    initialData: [],
  })
}
