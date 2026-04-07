/**
 * Mutations para Admin - Hotéis
 */

'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { hotelsModule, queryKeys } from '@hotelhub/sdk'
import type {
  CreateHotelRequest,
  UpdateHotelRequest,
  CreateRoomRequest,
  UpdateRoomRequest,
} from '@hotelhub/sdk'

/**
 * Mutation para criar hotel (admin)
 */
export function useCreateHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateHotelRequest) => hotelsModule.createHotel(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.all,
      })
    },
  })
}

/**
 * Mutation para atualizar hotel (admin)
 */
export function useUpdateHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateHotelRequest & { id: string }) =>
      hotelsModule.updateHotel(request.id, request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.all,
      })
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.detail(variables.id),
      })
    },
  })
}

/**
 * Mutation para deletar hotel (admin)
 */
export function useDeleteHotel() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (hotelId: string) => hotelsModule.deleteHotel(hotelId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.all,
      })
    },
  })
}

/**
 * Mutation para criar quarto (admin)
 */
export function useCreateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: CreateRoomRequest) => hotelsModule.createRoom(request),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.detail(variables.hotelId),
      })
    },
  })
}

/**
 * Mutation para atualizar quarto (admin)
 */
export function useUpdateRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateRoomRequest & { id: string }) =>
      hotelsModule.updateRoom(request.id, request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.all,
      })
    },
  })
}

/**
 * Mutation para deletar quarto (admin)
 */
export function useDeleteRoom() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (roomId: string) => hotelsModule.deleteRoom(roomId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.hotels.all,
      })
    },
  })
}
