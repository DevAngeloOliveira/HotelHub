/**
 * Hooks para Destinos
 * useDestinationsList, useDestinationDetail
 */

'use client'

import { useQuery } from '@tanstack/react-query'
import { destinationsModule, queryKeys } from '@hotelhub/sdk'
import type { DestinationFilters } from '@hotelhub/sdk'

/**
 * Hook para listar destinos com paginação/filtros
 */
export function useDestinationsList(filters?: DestinationFilters) {
  return useQuery({
    queryKey: queryKeys.destinations.list(filters),
    queryFn: () => destinationsModule.list(filters),
    staleTime: 1000 * 60 * 5, // 5 minutos (dados public, mudam pouco)
  })
}

/**
 * Hook para obter detalhes de um destino
 */
export function useDestinationDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.destinations.detail(id || ''),
    queryFn: () => destinationsModule.getDetail(id!),
    enabled: !!id, // Só buscar se tiver ID
    staleTime: 1000 * 60 * 10, // 10 minutos
  })
}

/**
 * Hook para obter hotéis de um destino
 */
export function useDestinationHotels(id?: string, page = 0, size = 20) {
  return useQuery({
    queryKey: queryKeys.destinations.hotels(id || ''),
    queryFn: () => destinationsModule.getHotels(id!, page, size),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  })
}
