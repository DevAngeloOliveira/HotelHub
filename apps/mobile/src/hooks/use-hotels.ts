/**
 * Hooks para Hotéis (Mobile)
 */

import { useQuery } from '@tanstack/react-query'
import { hotelsModule, queryKeys } from '@hotelhub/sdk'
import type { HotelFilters, RoomAvailabilityFilters } from '@hotelhub/sdk'

export function useHotelsList(filters?: HotelFilters) {
  return useQuery({
    queryKey: queryKeys.hotels.list(filters),
    queryFn: () => hotelsModule.list(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function useHotelDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.hotels.detail(id || ''),
    queryFn: () => hotelsModule.getDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  })
}

export function useRoomAvailability(id?: string, filters?: RoomAvailabilityFilters) {
  return useQuery({
    queryKey: queryKeys.hotels.availability(id || '', filters),
    queryFn: () => hotelsModule.getRoomAvailability(id!, filters!),
    enabled: !!id && !!filters,
    staleTime: 30000,
  })
}
