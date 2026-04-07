/**
 * Inicializador do SDK
 * Configura HttpClient com interceptador de autenticação
 */

import { httpClient } from './http'
import { authInterceptor } from './auth-interceptor'

/**
 * Inicializar SDK com autenticação
 * Deve ser chamado no ponto de entrada da aplicação
 */
export function initializeHotelHubSDK(): void {
  // Carregar tokens do armazenamento local
  authInterceptor.initialize()

  // Configurar HttpClient para injetar token
  httpClient.setTokenGetter(() => authInterceptor.getAccessToken())

  // Configurar callback para token expirado
  httpClient.setTokenExpiredCallback(() => {
    // Trigger renovação de token
    authInterceptor.refreshAccessToken().catch(() => {
      // Se refresh falhar, limpar tokens e redirecionar para login
      authInterceptor.clearTokens()
      window.location.href = '/login'
    })
  })
}

/**
 * Fazer logout
 */
export function logout(): void {
  authInterceptor.clearTokens()
  window.location.href = '/login'
}

export { authInterceptor }
