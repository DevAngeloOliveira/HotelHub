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
}

export interface AuthTokenResponse {
  accessToken: string
  refreshToken?: string
  expiresIn: number
  tokenType: string
}

export interface User {
  id: string
  name: string
  email: string
  role: 'CLIENT' | 'ADMIN'
  createdAt: string
  updatedAt: string
}

export interface AuthSession {
  user: User
  token: AuthTokenResponse
  isAuthenticated: boolean
}
