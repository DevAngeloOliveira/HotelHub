/**
 * Tipos de Destinos (domain: Destinations)
 */

export interface Destination {
  id: string
  name: string
  slug: string
  description?: string
  country: string
  state: string
  city: string
  category: string
  featuredImageUrl: string
  status?: 'ACTIVE' | 'INACTIVE'
  createdAt?: string
  updatedAt?: string
}

export interface DestinationDetail extends Destination {
  hotels?: Hotel[]
}

export interface DestinationFilters {
  page?: number
  size?: number
  name?: string
  category?: string
  country?: string
  state?: string
  city?: string
}

export interface CreateDestinationRequest {
  name: string
  slug: string
  description: string
  country: string
  state: string
  city: string
  category: string
  featuredImageUrl: string
}

export interface UpdateDestinationRequest extends CreateDestinationRequest {}

// Re-export Hotel para facilitar imports
export interface Hotel {
  id: string
  destinationId: string
  name: string
  address?: string
  category?: string
  amenities?: string[]
  imageUrls?: string[]
  contactPhone?: string
  contactEmail?: string
  createdAt?: string
  updatedAt?: string
}
