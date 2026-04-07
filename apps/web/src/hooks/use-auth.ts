/**
 * Hooks para Autenticação
 * useAuth, useLogin, useLogout, useProfile
 */

'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { authModule, queryKeys, authInterceptor } from '@hotelhub/sdk'
import type { LoginRequest, RegisterRequest } from '@hotelhub/sdk'

/**
 * Hook para obter usuário autenticado
 */
export function useAuth() {
  return useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: () => authModule.getMe(),
    retry: false,
    staleTime: 1000 * 60 * 30, // 30 minutos
  })
}

/**
 * Hook para login
 */
export function useLogin() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: LoginRequest) => {
      const response = await authModule.login(request)
      // Armazenar tokens após login bem-sucedido
      authInterceptor.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || '',
        expiresIn: response.expiresIn,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}

/**
 * Hook para registrar
 */
export function useRegister() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (request: RegisterRequest) => {
      const response = await authModule.register(request)
      // Armazenar tokens após registro bem-sucedido
      authInterceptor.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || '',
        expiresIn: response.expiresIn,
      })
      return response
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.all })
    },
  })
}

/**
 * Hook para logout
 */
export function useLogout() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async () => {
      authInterceptor.clearTokens()
      queryClient.clear()
    },
  })
}
