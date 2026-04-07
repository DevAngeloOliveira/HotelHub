/**
 * Hooks para Perfil do Usuário
 * useProfile, useUpdateProfile
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { profileModule, queryKeys } from '@hotelhub/sdk'
import type { UpdateProfileRequest } from '@hotelhub/sdk'

/**
 * Hook para obter perfil do usuário autenticado
 */
export function useProfile() {
  return useQuery({
    queryKey: queryKeys.profile.me(),
    queryFn: () => profileModule.getProfile(),
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

/**
 * Hook para atualizar perfil
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (request: UpdateProfileRequest) =>
      profileModule.updateProfile(request),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.profile.all,
      })
    },
  })
}
