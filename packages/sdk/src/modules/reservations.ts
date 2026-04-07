/**
 * Módulo de Reservas
 * GET /reservations*
 * POST /reservations
 * PATCH /reservations/:id/cancel
 * GET /admin/reservations (admin)
 */

import { httpClient } from '../core/http'
import type {
  Reservation,
  ReservationDetail,
  CreateReservationRequest,
  CancelReservationRequest,
  ReservationFilters,
} from '../types/reservations'
import type { PaginatedResponse } from '../types/common'

export const reservationsModule = {
  /**
   * POST /reservations
   * Criar nova reserva
   */
  async create(
    request: CreateReservationRequest
  ): Promise<ReservationDetail> {
    return httpClient.post<ReservationDetail>('/reservations', request)
  },

  /**
   * GET /reservations/:id
   * Obter detalhes de uma reserva
   */
  async getDetail(id: string): Promise<ReservationDetail> {
    return httpClient.get<ReservationDetail>(`/reservations/${id}`)
  },

  /**
   * GET /reservations/me
   * Listar minhas reservas (usuário autenticado)
   */
  async listMine(
    filters?: ReservationFilters
  ): Promise<PaginatedResponse<Reservation>> {
    return httpClient.get<PaginatedResponse<Reservation>>(
      '/reservations/me',
      {
        page: filters?.page ?? 0,
        size: filters?.size ?? 20,
        ...(filters?.status && { status: filters.status }),
      }
    )
  },

  /**
   * PATCH /reservations/:id/cancel
   * Cancelar uma reserva
   */
  async cancel(
    id: string,
    request?: CancelReservationRequest
  ): Promise<Reservation> {
    return httpClient.patch<Reservation>(
      `/reservations/${id}/cancel`,
      request || {}
    )
  },

  /**
   * [ADMIN] GET /admin/reservations
   * Listar todas as reservas
   */
  async listAll(
    filters?: ReservationFilters
  ): Promise<PaginatedResponse<Reservation>> {
    return httpClient.get<PaginatedResponse<Reservation>>(
      '/admin/reservations',
      {
        page: filters?.page ?? 0,
        size: filters?.size ?? 20,
        ...(filters?.status && { status: filters.status }),
      }
    )
  },
}
