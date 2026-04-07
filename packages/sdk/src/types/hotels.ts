/**
 * Tipos de Hotéis e Quartos (domain: Hotels)
 */

export interface Hotel {
  id: string
  name: string
  description?: string
  rating?: number
  address?: string
  imageUrl?: string
  destinationId: string
  createdAt: string
  updatedAt: string
}

export interface HotelDetail extends Hotel {
  roomCount: number
  rooms?: Room[]
  amenities?: string[]
}

export interface Room {
  id: string
  hotelId: string
  type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'
  description?: string
  price: number
  capacity: number
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface RoomAvailability extends Room {
  available: boolean
  booked: number
  totalRooms: number
}

export interface RoomAvailabilityFilters {
  checkInDate: string // ISO date
  checkOutDate: string // ISO date
  guestCount: number
  page?: number
  size?: number
}

export interface CreateRoomRequest {
  hotelId: string
  type: 'SINGLE' | 'DOUBLE' | 'SUITE' | 'DELUXE'
  description?: string
  price: number
  capacity: number
  imageUrl?: string
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface CreateHotelRequest {
  name: string
  description?: string
  rating?: number
  address?: string
  imageUrl?: string
  destinationId: string
  amenities?: string[]
}

export interface UpdateHotelRequest extends Partial<CreateHotelRequest> {}

export interface HotelFilters {
  destinationId?: string
  page?: number
  size?: number
  minRating?: number
  maxPrice?: number
}
