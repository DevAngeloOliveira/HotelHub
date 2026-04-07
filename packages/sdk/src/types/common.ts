/**
 * tipos compartilhados COMUNS a todos os módulos
 */

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
  empty: boolean
}

export interface ApiError {
  code: string
  message: string
  timestamp: string
  path?: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: ApiError
}

export class HttpError extends Error {
  constructor(
    public statusCode: number,
    public apiError: ApiError,
    message?: string
  ) {
    super(message || apiError.message)
    this.name = 'HttpError'
  }
}

export interface FetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  headers?: Record<string, string>
  body?: unknown
  timeout?: number
  params?: Record<string, unknown>
}
