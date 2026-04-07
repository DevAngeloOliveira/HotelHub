'use client'

import { useEffect } from 'react'
import { initializeHotelHubSDK } from '@hotelhub/sdk'

/**
 * Inicializador do SDK (client-side)
 * Deve rodar em um componente client para ter acesso a localStorage
 */
export function SDKInitializer() {
  useEffect(() => {
    initializeHotelHubSDK()
  }, [])

  return null
}
