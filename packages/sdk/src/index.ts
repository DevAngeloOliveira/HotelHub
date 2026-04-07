/**
 * @hotelhub/sdk - Barrel export
 * Exporta tudo o que web e mobile precisam
 */

// ===== CORE =====
export { httpClient } from './core/http'
export { configManager } from './core/config'
export type { SdkConfig } from './core/config'
export { ErrorHandler } from './core/errors'
export { authInterceptor } from './core/auth-interceptor'
export type { AuthInterceptor } from './core/auth-interceptor'
export { initializeHotelHubSDK, logout } from './core/initialize'

// ===== TYPES =====
// Common
export type { PaginatedResponse, ApiError, ApiResponse, FetchOptions } from './types/common'
export { HttpError } from './types/common'

// Auth
export type { LoginRequest, RegisterRequest, AuthTokenResponse, User, AuthSession } from './types/auth'

// Destinations
export type {
  Destination,
  DestinationDetail,
  DestinationFilters,
  CreateDestinationRequest,
  UpdateDestinationRequest,
} from './types/destinations'

// Hotels
export type {
  Hotel,
  HotelDetail,
  Room,
  RoomAvailability,
  CreateHotelRequest,
  UpdateHotelRequest,
  CreateRoomRequest,
  UpdateRoomRequest,
  HotelFilters,
  RoomAvailabilityFilters,
} from './types/hotels'

// Reservations
export type {
  Reservation,
  ReservationDetail,
  CreateReservationRequest,
  CancelReservationRequest,
  ReservationFilters,
} from './types/reservations'

// Profile
export type { UserProfile, UpdateProfileRequest, ChangePasswordRequest } from './types/profile'

// ===== MODULES =====
export { authModule } from './modules/auth'
export { destinationsModule } from './modules/destinations'
export { hotelsModule } from './modules/hotels'
export { reservationsModule } from './modules/reservations'
export { profileModule } from './modules/profile'

// ===== HOOKS UTILITIES =====
export { queryKeys } from './hooks/query-keys'
