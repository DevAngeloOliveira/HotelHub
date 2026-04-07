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
  numberOfGuests: number
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
  totalPrice: number
  createdAt: string
  updatedAt: string
}

export interface ReservationDetail extends Reservation {
  hotel?: Hotel
  room?: Room
  user?: User
}

export interface CreateReservationRequest {
  roomId: string
  hotelId: string
  checkInDate: string
  checkOutDate: string
  numberOfGuests: number
}

export interface CancelReservationRequest {
  reason?: string
}

export interface ReservationFilters {
  status?: 'CONFIRMED' | 'PENDING' | 'CANCELLED'
  page?: number
  size?: number
}

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
  type: string
  price: number
  capacity: number
  imageUrl?: string
}

export interface User {
  id: string
  name: string
  email: string
  role: string
}
