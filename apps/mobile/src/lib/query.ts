/**
 * TanStack Query Client Setup para React Native (Expo)
 */

import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutos
        gcTime: 1000 * 60 * 10, // 10 minutos
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

let clientQueryClient: QueryClient | undefined

export const getQueryClient = () => {
  if (!clientQueryClient) {
    clientQueryClient = createQueryClient()
  }
  return clientQueryClient
}
