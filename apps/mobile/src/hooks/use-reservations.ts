/**
 * Hooks para Reservações (Mobile)
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsModule, queryKeys } from '@hotelhub/sdk'
import type { CreateReservationRequest, ReservationFilters } from '@hotelhub/sdk'

export function useMyReservations(filters?: ReservationFilters) {
  return useQuery({
    queryKey: queryKeys.reservations.listMine(filters),
    queryFn: () => reservationsModule.listMine(filters),
    staleTime: 1000 * 60 * 1,
  })
}

export function useCreateReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateReservationRequest) =>
      reservationsModule.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      })
    },
  })
}

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
