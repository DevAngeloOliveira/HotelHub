/**
 * Configuração e gerenciamento de variáveis de ambiente
 */

export interface SdkConfig {
  baseUrl: string
  timeout: number
  retryAttempts: number
  retryDelay: number
}

class SdkConfigManager {
  private config: SdkConfig

  constructor() {
    this.config = {
      baseUrl: this.resolveBaseUrl(),
      timeout: 8000,
      retryAttempts: 1,
      retryDelay: 1000,
    }
  }

  private resolveBaseUrl(): string {
    // Cliente (browser/mobile)
    if (globalThis.window !== undefined) {
      return (
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        process.env.EXPO_PUBLIC_API_BASE_URL ||
        '/api/v1'
      )
    }

    // Servidor (Node.js SSR)
    return process.env.API_INTERNAL_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '/api/v1'
  }

  getConfig(): SdkConfig {
    return { ...this.config }
  }

  setConfig(partial: Partial<SdkConfig>): void {
    this.config = { ...this.config, ...partial }
  }

  getBaseUrl(): string {
    return this.config.baseUrl
  }
}

export const configManager = new SdkConfigManager()
