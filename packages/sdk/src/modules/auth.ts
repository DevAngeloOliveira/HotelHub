/**
 * Módulo de Autenticação
 * GET/POST /auth/*
 */

import { httpClient } from '../core/http'
import type {
  LoginRequest,
  RegisterRequest,
  AuthTokenResponse,
  User,
} from '../types/auth'

export const authModule = {
  /**
   * POST /auth/login
   */
  async login(request: LoginRequest): Promise<AuthTokenResponse> {
    return httpClient.post<AuthTokenResponse>('/auth/login', request)
  },

  /**
   * POST /auth/register
   */
  async register(request: RegisterRequest): Promise<AuthTokenResponse> {
    return httpClient.post<AuthTokenResponse>('/auth/register', request)
  },

  /**
   * POST /auth/refresh
   * Renovar token de acesso
   */
  async refreshToken(refreshToken: string): Promise<AuthTokenResponse> {
    return httpClient.post<AuthTokenResponse>('/auth/refresh', {
      refreshToken,
    })
  },

  /**
   * GET /auth/me
   * Obter dados do usuário autenticado
   */
  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/me')
  },
}
