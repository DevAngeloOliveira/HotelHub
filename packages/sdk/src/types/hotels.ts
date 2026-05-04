/**
 * Tipos de Hotéis e Quartos (domain: Hotels)
 */

export interface Hotel {
  id: string
  destinationId: string
  name: string
  description?: string
  address?: string
  category?: string
  amenities?: string[]
  imageUrls?: string[]
  contactPhone?: string
  contactEmail?: string
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
  updatedAt?: string
}

export interface HotelDetail extends Hotel {
  rooms?: Room[]
}

export interface Room {
  id: string
  hotelId: string
  name: string
  type: string
  description: string
  capacity: number
  pricePerNight: number
  quantity: number
  imageUrls: string[]
  status?: 'ACTIVE' | 'INACTIVE'
  available?: boolean
  availableUnits?: number
  createdAt?: string
  updatedAt?: string
}

export interface RoomAvailability extends Room {}

export interface RoomAvailabilityFilters {
  checkInDate: string // ISO date
  checkOutDate: string // ISO date
  guestCount: number
  page?: number
  size?: number
}

export interface CreateRoomRequest {
  hotelId: string
  name: string
  type: string
  description: string
  pricePerNight: number
  capacity: number
  quantity: number
  imageUrls?: string[]
}

export interface UpdateRoomRequest extends CreateRoomRequest {}

export interface CreateHotelRequest {
  name: string
  description: string
  address: string
  category: string
  destinationId: string
  amenities: string[]
  imageUrls?: string[]
  contactPhone: string
  contactEmail: string
}

export interface UpdateHotelRequest extends CreateHotelRequest {}

export interface HotelFilters {
  destinationId?: string
  page?: number
  size?: number
}
