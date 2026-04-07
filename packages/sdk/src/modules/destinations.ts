/**
 * Módulo de Destinos
 * GET /destinations*
 * POST/PUT/DELETE /admin/destinations*
 */

import { httpClient } from '../core/http'
import type {
  Destination,
  DestinationDetail,
  CreateDestinationRequest,
  UpdateDestinationRequest,
  DestinationFilters,
} from '../types/destinations'
import type { PaginatedResponse } from '../types/common'

export const destinationsModule = {
  /**
   * GET /destinations
   * Listar destinos com paginação e filtros
   */
  async list(
    filters?: DestinationFilters
  ): Promise<PaginatedResponse<Destination>> {
    return httpClient.get<PaginatedResponse<Destination>>('/destinations', {
      page: filters?.page ?? 0,
      size: filters?.size ?? 20,
      ...(filters?.name && { name: filters.name }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.country && { country: filters.country }),
      ...(filters?.state && { state: filters.state }),
    })
  },

  /**
   * GET /destinations/:id
   * Obter detalhes de um destino
   */
  async getDetail(id: string): Promise<DestinationDetail> {
    return httpClient.get<DestinationDetail>(`/destinations/${id}`)
  },

  /**
   * GET /destinations/:id/hotels
   * Obter hotéis de um destino
   */
  async getHotels(id: string, page = 0, size = 20) {
    return httpClient.get(`/destinations/${id}/hotels`, { page, size })
  },

  /**
   * [ADMIN] POST /admin/destinations
   */
  async create(request: CreateDestinationRequest): Promise<Destination> {
    return httpClient.post<Destination>('/admin/destinations', request)
  },

  /**
   * [ADMIN] PUT /admin/destinations/:id
   */
  async update(
    id: string,
    request: UpdateDestinationRequest
  ): Promise<Destination> {
    return httpClient.put<Destination>(`/admin/destinations/${id}`, request)
  },

  /**
   * [ADMIN] DELETE /admin/destinations/:id
   */
  async delete(id: string): Promise<void> {
    return httpClient.delete<void>(`/admin/destinations/${id}`)
  },
}
