/**
 * Interceptador de autenticação com renovação automática de token
 * Gerencia access token e refresh token
 */

import { authModule } from '../modules/auth'

interface TokenPayload {
  accessToken: string
  refreshToken: string
  expiresIn?: number | undefined
}

export class AuthInterceptor {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private isRefreshing = false
  private refreshQueue: Array<(token: string) => void> = []

  private storageKey = {
    accessToken: '@hotelhub:access_token',
    refreshToken: '@hotelhub:refresh_token',
  }

  /**
   * Inicializar a partir do armazenamento
   */
  initialize(): void {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      this.accessToken = localStorage.getItem(this.storageKey.accessToken)
      this.refreshToken = localStorage.getItem(this.storageKey.refreshToken)
    }
  }

  /**
   * Obter access token atual
   */
  getAccessToken(): string | null {
    return this.accessToken
  }

  /**
   * Obter refresh token atual
   */
  getRefreshToken(): string | null {
    return this.refreshToken
  }

  /**
   * Verificar se usuário está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.accessToken
  }

  /**
   * Armazenar tokens após login/register
   */
  setTokens(payload: TokenPayload): void {
    this.accessToken = payload.accessToken
    this.refreshToken = payload.refreshToken

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey.accessToken, payload.accessToken)
      if (payload.refreshToken) {
        localStorage.setItem(
          this.storageKey.refreshToken,
          payload.refreshToken
        )
      }
    }
  }

  /**
   * Limpar tokens (logout)
   */
  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey.accessToken)
      localStorage.removeItem(this.storageKey.refreshToken)
    }
  }

  /**
   * Renovar token de acesso
   * Executa apenas uma renovação por vez (deduplicação)
   */
  async refreshAccessToken(): Promise<string | null> {
    if (!this.refreshToken) {
      this.clearTokens()
      return null
    }

    // Se já está refrescando, aguardar resultado
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push((token) => resolve(token))
      })
    }

    this.isRefreshing = true

    try {
      const response = await authModule.refreshToken(this.refreshToken)
      this.setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken || this.refreshToken,
        expiresIn: response.expiresIn,
      })

      // Processar fila de requisições aguardando renovação
      this.refreshQueue.forEach((callback) =>
        callback(response.accessToken)
      )
      this.refreshQueue = []

      return response.accessToken
    } catch (error) {
      this.clearTokens()
      this.refreshQueue = []
      throw error
    } finally {
      this.isRefreshing = false
    }
  }
}

export const authInterceptor = new AuthInterceptor()
