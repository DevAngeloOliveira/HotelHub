/**
 * TanStack Query Client Setup
 * Configuração centralizada para data fetching e caching
 */

import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos padrão
        gcTime: 1000 * 60 * 10, // 10 minutos de cache
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
      mutations: {
        retry: 1,
      },
    },
  })
}

// Singleton para SSR/Client
let clientQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (typeof window === 'undefined') {
    // Server
    return createQueryClient()
  }

  // Client
  if (!clientQueryClient) {
    clientQueryClient = createQueryClient()
  }
  return clientQueryClient
}
