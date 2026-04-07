/**
 * Mutations para Admin - Destinos
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { destinationsModule, queryKeys } from '@hotelhub/sdk'
import type { CreateDestinationRequest, UpdateDestinationRequest } from '@hotelhub/sdk'

/**
 * Mutation para criar destino (admin)
 */
export function useCreateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateDestinationRequest) =>
      destinationsModule.create(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.all,
      })
    },
  })
}

/**
 * Mutation para atualizar destino (admin)
 */
export function useUpdateDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateDestinationRequest & { id: string }) =>
      destinationsModule.update(request.id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.detail(variables.id),
      })
    },
  })
}

/**
 * Mutation para deletar destino (admin)
 */
export function useDeleteDestination() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (destinationId: string) =>
      destinationsModule.delete(destinationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.destinations.all,
      })
    },
  })
}
