/**
 * Tipos de Reservas (domain: Reservations)
 */

export interface Reservation {
  id: string
  userId: string
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guestCount: number
  status: ReservationStatus
  bookingSource: BookingSource
  totalAmount: number
  createdAt: string
  updatedAt: string
  cancelledAt?: string | null
  checkedInAt?: string | null
  checkedOutAt?: string | null
}

export interface ReservationDetail extends Reservation {
  hotel?: Hotel
  room?: Room
  user?: User
}

export interface CreateReservationRequest {
  hotelId: string
  roomId: string
  checkInDate: string
  checkOutDate: string
  guestCount: number
  bookingSource?: BookingSource
}

export interface CancelReservationRequest {
  reason?: string
}

export interface ReservationFilters {
  status?: ReservationStatus
  page?: number
  size?: number
}

export type ReservationStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CHECKED_IN'
  | 'CHECKED_OUT'
  | 'NO_SHOW'
  | 'CANCELLED'

export type BookingSource =
  | 'DIRECT'
  | 'BOOKING_COM'
  | 'EXPEDIA'
  | 'AIRBNB'
  | 'OTHER'

// Re-exports para facilitar imports
export interface Hotel {
  id: string
  name: string
  description?: string
  rating?: number
  address?: string
  imageUrl?: string
  destinationId: string
}

export interface Room {
  id: string
  hotelId: string
  name?: string
  type: string
  pricePerNight?: number
  capacity: number
  imageUrls?: string[]
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}
