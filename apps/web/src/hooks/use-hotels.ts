/**
 * Hooks para Hotéis
 * useHotelsList, useHotelDetail, useRoomAvailability
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { hotelsModule, queryKeys } from '@hotelhub/sdk'
import type { HotelFilters, RoomAvailabilityFilters } from '@hotelhub/sdk'

/**
 * Hook para listar hotéis
 */
export function useHotelsList(filters?: HotelFilters) {
  return useQuery({
    queryKey: queryKeys.hotels.list(filters),
    queryFn: () => hotelsModule.list(filters),
    staleTime: 1000 * 60 * 5,
  })
}

/**
 * Hook para obter detalhes de um hotel
 */
export function useHotelDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.hotels.detail(id || ''),
    queryFn: () => hotelsModule.getDetail(id!),
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  })
}

/**
 * Hook para obter quartos com disponibilidade
 */
export function useRoomAvailability(id?: string, filters?: RoomAvailabilityFilters) {
  return useQuery({
    queryKey: queryKeys.hotels.availability(id || '', filters),
    queryFn: () => hotelsModule.getRoomAvailability(id!, filters!),
    enabled: !!id && !!filters,
    staleTime: 30000, // 30 segundos (crítico)
  })
}
