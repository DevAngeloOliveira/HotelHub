/**
 * Mutations para Reservas (Mobile)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { reservationsModule, queryKeys } from '@hotelhub/sdk'
import type { CreateReservationRequest, CancelReservationRequest } from '@hotelhub/sdk'

/**
 * Mutation para criar reserva
 */
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

/**
 * Mutation para cancelar reserva
 */
export function useCancelReservation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: { reservationId: string } & CancelReservationRequest) =>
      reservationsModule.cancel(request.reservationId, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.reservations.detail(variables.reservationId),
      })
    },
  })
}
