/**
 * Tipos de Destinos (domain: Destinations)
 */

export interface Destination {
  id: string
  name: string
  description: string
  country: string
  state?: string
  city?: string
  category?: string
  imageUrl?: string
  createdAt: string
  updatedAt: string
}

export interface DestinationDetail extends Destination {
  hotelCount: number
  hotels?: Hotel[]
}

export interface DestinationFilters {
  page?: number
  size?: number
  name?: string
  category?: string
  country?: string
  state?: string
}

export interface CreateDestinationRequest {
  name: string
  description: string
  country: string
  state?: string
  city?: string
  category?: string
  imageUrl?: string
}

export interface UpdateDestinationRequest extends Partial<CreateDestinationRequest> {}

// Re-export Hotel para facilitar imports
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
