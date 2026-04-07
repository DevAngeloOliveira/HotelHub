/**
 * Hooks para Destinos (Mobile)
 */

import { useQuery } from '@tanstack/react-query'
import { destinationsModule, queryKeys } from '@hotelhub/sdk'
import type { DestinationFilters } from '@hotelhub/sdk'

export function useDestinationsList(filters?: DestinationFilters) {
  return useQuery({
    queryKey: queryKeys.destinations.list(filters),
    queryFn: () => destinationsModule.list(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function useDestinationDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.destinations.detail(id || ''),
    queryFn: () => destinationsModule.getDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  })
}

export function useDestinationHotels(id?: string, page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.destinations.hotels(id || ''),
    queryFn: () => destinationsModule.getHotels(id!, page, size),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
