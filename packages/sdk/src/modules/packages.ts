import { httpClient } from '../core/http'
import type { PaginatedResponse } from '../types/common'
import type {
  CreateTravelPackageRequest,
  TravelPackage,
  TravelPackageFilters,
  UpdateTravelPackageRequest,
  UpdateTravelPackageStatusRequest,
} from '../types/packages'

export const packagesModule = {
  async list(filters?: TravelPackageFilters): Promise<PaginatedResponse<TravelPackage>> {
    return httpClient.get<PaginatedResponse<TravelPackage>>('/packages', {
      page: filters?.page ?? 0,
      size: filters?.size ?? 20,
      ...(filters?.hotelId && { hotelId: filters.hotelId }),
    })
  },

  async getDetail(id: string): Promise<TravelPackage> {
    return httpClient.get<TravelPackage>(`/packages/${id}`)
  },

  async listAdmin(filters?: TravelPackageFilters): Promise<PaginatedResponse<TravelPackage>> {
    return httpClient.get<PaginatedResponse<TravelPackage>>('/admin/packages', {
      page: filters?.page ?? 0,
      size: filters?.size ?? 20,
      ...(filters?.hotelId && { hotelId: filters.hotelId }),
      ...(filters?.status && { status: filters.status }),
    })
  },

  async create(request: CreateTravelPackageRequest): Promise<TravelPackage> {
    return httpClient.post<TravelPackage>('/admin/packages', request)
  },

  async update(id: string, request: UpdateTravelPackageRequest): Promise<TravelPackage> {
    return httpClient.put<TravelPackage>(`/admin/packages/${id}`, request)
  },

  async updateStatus(
    id: string,
    request: UpdateTravelPackageStatusRequest,
  ): Promise<TravelPackage> {
    return httpClient.patch<TravelPackage>(`/admin/packages/${id}/status`, request)
  },
}
