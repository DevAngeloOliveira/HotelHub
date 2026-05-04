import { httpClient } from '../core/http'
import type {
  AuthTokenResponse,
  LoginRequest,
  RegisterRequest,
  User,
} from '../types/auth'

export const authModule = {
  async login(request: LoginRequest): Promise<AuthTokenResponse> {
    return httpClient.post<AuthTokenResponse>('/auth/login', request)
  },

  async register(request: RegisterRequest): Promise<AuthTokenResponse> {
    return httpClient.post<AuthTokenResponse>('/auth/register', request)
  },

  async getMe(): Promise<User> {
    return httpClient.get<User>('/auth/me')
  },
}
