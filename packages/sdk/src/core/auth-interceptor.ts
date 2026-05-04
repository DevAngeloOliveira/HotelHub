interface TokenPayload {
  accessToken: string
  refreshToken?: string
  expiresIn?: number | undefined
}

export class AuthInterceptor {
  private accessToken: string | null = null
  private refreshToken: string | null = null
  private isRefreshing = false
  private refreshQueue: Array<(token: string | null) => void> = []

  private storageKey = {
    accessToken: '@hotelhub:access_token',
    refreshToken: '@hotelhub:refresh_token',
  }

  initialize(): void {
    if (typeof localStorage !== 'undefined') {
      this.accessToken = localStorage.getItem(this.storageKey.accessToken)
      this.refreshToken = localStorage.getItem(this.storageKey.refreshToken)
    }
  }

  getAccessToken(): string | null {
    return this.accessToken
  }

  getRefreshToken(): string | null {
    return this.refreshToken
  }

  isAuthenticated(): boolean {
    return Boolean(this.accessToken)
  }

  setTokens(payload: TokenPayload): void {
    this.accessToken = payload.accessToken
    this.refreshToken = payload.refreshToken ?? null

    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.storageKey.accessToken, payload.accessToken)
      if (payload.refreshToken) {
        localStorage.setItem(this.storageKey.refreshToken, payload.refreshToken)
      } else {
        localStorage.removeItem(this.storageKey.refreshToken)
      }
    }
  }

  clearTokens(): void {
    this.accessToken = null
    this.refreshToken = null

    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.storageKey.accessToken)
      localStorage.removeItem(this.storageKey.refreshToken)
    }
  }

  async refreshAccessToken(): Promise<string | null> {
    if (this.isRefreshing) {
      return new Promise((resolve) => {
        this.refreshQueue.push(resolve)
      })
    }

    this.isRefreshing = true

    try {
      this.clearTokens()
      this.refreshQueue.forEach((callback) => callback(null))
      this.refreshQueue = []
      return null
    } finally {
      this.isRefreshing = false
    }
  }
}

export const authInterceptor = new AuthInterceptor()
