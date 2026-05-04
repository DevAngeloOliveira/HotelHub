import { authInterceptor } from './auth-interceptor'
import { httpClient } from './http'

export function initializeHotelHubSDK(): void {
  authInterceptor.initialize()
  httpClient.setTokenGetter(() => authInterceptor.getAccessToken())

  httpClient.setTokenExpiredCallback(() => {
    authInterceptor.refreshAccessToken().catch(() => {
      authInterceptor.clearTokens()
      if (typeof window !== 'undefined') {
        window.location.href = '/login'
      }
    })
  })
}

export function logout(): void {
  authInterceptor.clearTokens()
  if (typeof window !== 'undefined') {
    window.location.href = '/login'
  }
}

export { authInterceptor }
