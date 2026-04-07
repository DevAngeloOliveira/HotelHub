/**
 * Módulo de Perfil e Usuários
 * GET /users/me
 * PUT /users/me
 * GET /admin/users (admin)
 */

import { httpClient } from '../core/http'
import type {
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
} from '../types/profile'
import type { PaginatedResponse } from '../types/common'

export const profileModule = {
  /**
   * GET /users/me
   * Obter perfil do usuário autenticado
   */
  async getProfile(): Promise<UserProfile> {
    return httpClient.get<UserProfile>('/users/me')
  },

  /**
   * PUT /users/me
   * Atualizar perfil do usuário
   */
  async updateProfile(request: UpdateProfileRequest): Promise<UserProfile> {
    return httpClient.put<UserProfile>('/users/me', request)
  },

  /**
   * POST /users/me/change-password
   * Alterar senha
   */
  async changePassword(request: ChangePasswordRequest): Promise<void> {
    return httpClient.post<void>('/users/me/change-password', request)
  },

  /**
   * [ADMIN] GET /admin/users
   * Listar todos os usuários
   */
  async listAllUsers(
    page = 0,
    size = 20
  ): Promise<PaginatedResponse<UserProfile>> {
    return httpClient.get<PaginatedResponse<UserProfile>>('/admin/users', {
      page,
      size,
    })
  },
}
