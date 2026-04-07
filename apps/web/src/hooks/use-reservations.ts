/**
 * Hooks para Reservações
 * useMyReservations, useCreateReservation, useCancelReservation
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsModule, queryKeys } from '@hotelhub/sdk'
import type { CreateReservationRequest, ReservationFilters } from '@hotelhub/sdk'

/**
 * Hook para listar minhas reservações
 */
export function useMyReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: queryKeys.reservations.listMine(filters),
    queryFn: () => reservationsModule.listMine(filters),
    staleTime: 1000 * 60 * 1, // 1 minuto (pessoal, muda frequentemente)
  })
}

/**
 * Hook para criar nova reservação
 */
export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateReservationRequest) =>
      reservationsModule.create(request),
    onSuccess: () => {
      // Invalidar minhas reservas para atualizar UI
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      })
    },
  })
}

/**
 * Hook para cancelar reservação
 */
export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => reservationsModule.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      })
    },
  })
}
