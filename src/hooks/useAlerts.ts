import { useQuery } from '@tanstack/react-query'
import { fetchNationalHeadlines } from '../api/nws'
import { FIVE_MIN } from '../lib/constants'

export function useNationalHeadlines() {
  return useQuery<string[]>({
    queryKey: ['nws-headlines'],
    queryFn: fetchNationalHeadlines,
    staleTime: FIVE_MIN,
    refetchInterval: FIVE_MIN,
    initialData: [],
  })
}
