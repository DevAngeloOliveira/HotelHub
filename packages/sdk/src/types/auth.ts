/**
 * Tipos de Autenticação (domain: Auth)
 */

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  phone: string
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken?: string
  expiresIn?: number
  tokenType: string
  user: User
}

export interface User {
  id: string
  name: string
  email: string
  phone: string
  role: 'CLIENT' | 'ADMIN'
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  token: AuthTokenResponse
  isAuthenticated: boolean
}
