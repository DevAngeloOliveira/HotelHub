import { useQuery } from '@tanstack/react-query'
import { packagesModule, queryKeys } from '@hotelhub/sdk'
import type { TravelPackageFilters } from '@hotelhub/sdk'

export function usePackagesList(filters?: TravelPackageFilters) {
  return useQuery({
    queryKey: queryKeys.packages.list(filters),
    queryFn: () => packagesModule.list(filters),
    staleTime: 1000 * 60 * 5,
  })
}

export function usePackageDetail(id?: string) {
  return useQuery({
    queryKey: queryKeys.packages.detail(id || ''),
    queryFn: () => packagesModule.getDetail(id!),
    enabled: Boolean(id),
    staleTime: 1000 * 60 * 10,
  })
}
