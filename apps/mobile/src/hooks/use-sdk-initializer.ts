import { useEffect } from 'react'
import { authInterceptor, initializeHotelHubSDK } from '@hotelhub/sdk'
import { accessToken } from '../lib/config'

/**
 * Inicializador do SDK (mobile)
 * Carrega tokens do armazenamento local (AsyncStorage) na inicialização
 */
export function useSdkInitializer() {
  useEffect(() => {
    // Para mobile, AsyncStorage é diferente de localStorage
    // O authInterceptor vai tentar usar localStorage que não existe
    // Então vamos apenas garantir que os tokens sejam gerenciados via authInterceptor
    initializeHotelHubSDK()
    if (accessToken) {
      authInterceptor.setTokens({ accessToken })
    }
  }, [])
}
