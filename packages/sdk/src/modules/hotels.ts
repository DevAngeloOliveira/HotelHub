/**
 * Módulo de Hotéis
 * GET /hotels*
 * POST/PUT/DELETE /admin/hotels*
 */

import { httpClient } from '../core/http'
import type {
  Hotel,
  HotelDetail,
  Room,
  RoomAvailability,
  CreateHotelRequest,
  UpdateHotelRequest,
  CreateRoomRequest,
  UpdateRoomRequest,
  HotelFilters,
  RoomAvailabilityFilters,
} from '../types/hotels'
import type { PaginatedResponse } from '../types/common'

export const hotelsModule = {
  // ===== HOTELS =====

  /**
   * GET /hotels
   * Listar hotéis com paginação e filtros
   */
  async list(
    filters?: HotelFilters
  ): Promise<PaginatedResponse<Hotel>> {
    return httpClient.get<PaginatedResponse<Hotel>>('/hotels', {
      page: filters?.page ?? 0,
      size: filters?.size ?? 20,
      ...(filters?.destinationId && { destinationId: filters.destinationId }),
      ...(filters?.minRating && { minRating: filters.minRating }),
      ...(filters?.maxPrice && { maxPrice: filters.maxPrice }),
    })
  },

  /**
   * GET /hotels/:id
   * Obter detalhes de um hotel
   */
  async getDetail(id: string): Promise<HotelDetail> {
    return httpClient.get<HotelDetail>(`/hotels/${id}`)
  },

  /**
   * GET /hotels/:id/rooms
   * Obter quartos com disponibilidade
   */
  async getRoomAvailability(
    id: string,
    filters: RoomAvailabilityFilters
  ): Promise<PaginatedResponse<RoomAvailability>> {
    return httpClient.get<PaginatedResponse<RoomAvailability>>(
      `/hotels/${id}/rooms`,
      {
        checkInDate: filters.checkInDate,
        checkOutDate: filters.checkOutDate,
        guestCount: filters.guestCount,
        page: filters.page ?? 0,
        size: filters.size ?? 20,
      }
    )
  },

  /**
   * [ADMIN] POST /admin/hotels
   */
  async createHotel(request: CreateHotelRequest): Promise<Hotel> {
    return httpClient.post<Hotel>('/admin/hotels', request)
  },

  /**
   * [ADMIN] PUT /admin/hotels/:id
   */
  async updateHotel(id: string, request: UpdateHotelRequest): Promise<Hotel> {
    return httpClient.put<Hotel>(`/admin/hotels/${id}`, request)
  },

  /**
   * [ADMIN] DELETE /admin/hotels/:id
   */
  async deleteHotel(id: string): Promise<void> {
    return httpClient.delete<void>(`/admin/hotels/${id}`)
  },

  // ===== ROOMS =====

  /**
   * [ADMIN] POST /admin/rooms
   */
  async createRoom(request: CreateRoomRequest): Promise<Room> {
    return httpClient.post<Room>('/admin/rooms', request)
  },

  /**
   * [ADMIN] PUT /admin/rooms/:id
   */
  async updateRoom(id: string, request: UpdateRoomRequest): Promise<Room> {
    return httpClient.put<Room>(`/admin/rooms/${id}`, request)
  },

  /**
   * [ADMIN] DELETE /admin/rooms/:id
   */
  async deleteRoom(id: string): Promise<void> {
    return httpClient.delete<void>(`/admin/rooms/${id}`)
  },
}
