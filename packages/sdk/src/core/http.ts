/**
 * Cliente HTTP compartilhado para todas as requisições
 * Abstracts fetch API com tratamento de erro, retry, timeout
 */

import { configManager } from './config'
import { ErrorHandler } from './errors'
import { FetchOptions, HttpError } from '../types/common'

export class HttpClient {
  private defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  }

  private tokenGetter: (() => string | null) | null = null
  private onTokenExpired: (() => void) | null = null

  /**
   * Configurar função para obter token de autenticação
   */
  setTokenGetter(getter: () => string | null): void {
    this.tokenGetter = getter
  }

  /**
   * Configurar callback ao expirar token
   */
  setTokenExpiredCallback(callback: () => void): void {
    this.onTokenExpired = callback
  }

  /**
   * Construir headers com autenticação se disponível
   */
  private async buildHeaders(
    options: FetchOptions
  ): Promise<Record<string, string>> {
    const headers = {
      ...this.defaultHeaders,
      ...options.headers,
    }

    const token = this.tokenGetter?.()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    return headers
  }

  /**
   * Construir URL com query params
   */
  private buildUrl(path: string, params?: Record<string, unknown>): string {
    const baseUrl = configManager.getBaseUrl()
    const url = new URL(path, baseUrl)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, String(value))
        }
      })
    }

    return url.toString()
  }

  /**
   * Fazer requisição com retry + timeout
   */
  private async doFetch<T>(
    url: string,
    options: FetchOptions & { headers: Record<string, string> }
  ): Promise<T> {
    const config = configManager.getConfig()
    let lastError: Error | null = null

    for (let attempt = 0; attempt <= config.retryAttempts; attempt++) {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(
          () => controller.abort(),
          options.timeout || config.timeout
        )

        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: options.headers,
          body: options.body ? JSON.stringify(options.body) : undefined,
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const apiError = await ErrorHandler.parseError(response)

          if (response.status === 401) {
            this.onTokenExpired?.()
          }

          throw ErrorHandler.createHttpError(response.status, apiError)
        }

        const data = await response.json()
        return data as T
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error))

        // Não retry em erros de negócio (4xx)
        if (error instanceof HttpError && error.statusCode < 500) {
          throw error
        }

        // Retry com delay
        if (attempt < config.retryAttempts) {
          await new Promise((resolve) =>
            setTimeout(resolve, config.retryDelay * Math.pow(2, attempt))
          )
        }
      }
    }

    throw lastError || new Error('Unknown error')
  }

  /**
   * GET
   */
  async get<T>(path: string, params?: Record<string, unknown>): Promise<T> {
    const url = this.buildUrl(path, params)
    const headers = await this.buildHeaders({})

    return this.doFetch<T>(url, { method: 'GET', headers })
  }

  /**
   * POST
   */
  async post<T>(
    path: string,
    body?: unknown,
    options?: Partial<FetchOptions>
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params)
    const headers = await this.buildHeaders(options || {})

    return this.doFetch<T>(url, {
      method: 'POST',
      headers,
      body,
      ...options,
    })
  }

  /**
   * PUT
   */
  async put<T>(
    path: string,
    body?: unknown,
    options?: Partial<FetchOptions>
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params)
    const headers = await this.buildHeaders(options || {})

    return this.doFetch<T>(url, {
      method: 'PUT',
      headers,
      body,
      ...options,
    })
  }

  /**
   * PATCH
   */
  async patch<T>(
    path: string,
    body?: unknown,
    options?: Partial<FetchOptions>
  ): Promise<T> {
    const url = this.buildUrl(path, options?.params)
    const headers = await this.buildHeaders(options || {})

    return this.doFetch<T>(url, {
      method: 'PATCH',
      headers,
      body,
      ...options,
    })
  }

  /**
   * DELETE
   */
  async delete<T>(path: string, options?: Partial<FetchOptions>): Promise<T> {
    const url = this.buildUrl(path, options?.params)
    const headers = await this.buildHeaders(options || {})

    return this.doFetch<T>(url, {
      method: 'DELETE',
      headers,
      ...options,
    })
  }
}

// Singleton global
export const httpClient = new HttpClient()
