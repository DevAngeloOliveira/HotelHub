/**
 * Tratamento centralizado de erros
 */

import { ApiError, HttpError } from '../types/common'

export class ErrorHandler {
  static async parseError(response: Response): Promise<ApiError> {
    let apiError: ApiError = {
      code: 'UNKNOWN_ERROR',
      message: `HTTP ${response.status}: ${response.statusText}`,
      timestamp: new Date().toISOString(),
      path: response.url,
    }

    try {
      const json = await response.json()
      if (json.error) {
        apiError = { ...json.error, timestamp: new Date().toISOString() }
      } else if (json.message) {
        apiError.message = json.message
        apiError.code = json.code || 'API_ERROR'
      }
    } catch {
      // Falhou parsing JSON, manter erro padrão
    }

    return apiError
  }

  static createHttpError(statusCode: number, apiError: ApiError): HttpError {
    const messages: Record<number, string> = {
      400: 'Requisição inválida',
      401: 'Não autenticado',
      403: 'Acesso negado',
      404: 'Recurso não encontrado',
      409: 'Conflito',
      500: 'Erro interno do servidor',
      503: 'Serviço indisponível',
    }

    return new HttpError(statusCode, apiError, messages[statusCode])
  }

  static isHttpError(error: unknown): error is HttpError {
    return error instanceof HttpError
  }

  static isNetworkError(error: unknown): boolean {
    return error instanceof TypeError && error.message.includes('fetch')
  }
}
