/**
 * Factory de query keys para TanStack Query
 * Centraliza nomes de queries para fácil invalidação
 */

export const queryKeys = {
  // Auth
  auth: {
    all: ['auth'] as const,
    me: () => [...queryKeys.auth.all, 'me'] as const,
  },

  // Destinations
  destinations: {
    all: ['destinations'] as const,
    lists: () => [...queryKeys.destinations.all, 'list'] as const,
    list: (filters?: unknown) =>
      [...queryKeys.destinations.lists(), filters] as const,
    details: () => [...queryKeys.destinations.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.destinations.details(), id] as const,
    hotels: (id: string) =>
      [...queryKeys.destinations.detail(id), 'hotels'] as const,
  },

  // Hotels
  hotels: {
    all: ['hotels'] as const,
    lists: () => [...queryKeys.hotels.all, 'list'] as const,
    list: (filters?: unknown) =>
      [...queryKeys.hotels.lists(), filters] as const,
    details: () => [...queryKeys.hotels.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.hotels.details(), id] as const,
    availability: (id: string, filters?: unknown) =>
      [...queryKeys.hotels.detail(id), 'availability', filters] as const,
  },

  // Reservations
  reservations: {
    all: ['reservations'] as const,
    lists: () => [...queryKeys.reservations.all, 'list'] as const,
    listMine: (filters?: unknown) =>
      [...queryKeys.reservations.lists(), 'mine', filters] as const,
    listAll: (filters?: unknown) =>
      [...queryKeys.reservations.lists(), 'all', filters] as const,
    details: () => [...queryKeys.reservations.all, 'detail'] as const,
    detail: (id: string) =>
      [...queryKeys.reservations.details(), id] as const,
  },

  // Profile/Users
  profile: {
    all: ['profile'] as const,
    me: () => [...queryKeys.profile.all, 'me'] as const,
  },

  users: {
    all: ['users'] as const,
    lists: () => [...queryKeys.users.all, 'list'] as const,
    list: (filters?: unknown) =>
      [...queryKeys.users.lists(), filters] as const,
  },
}
