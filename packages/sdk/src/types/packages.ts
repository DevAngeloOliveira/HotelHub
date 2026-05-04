export interface TravelPackage {
  id: string
  hotelId: string
  name: string
  description: string
  highlightedServices: string[]
  discountPercentage: number
  validFrom: string
  validTo: string
  status: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export interface TravelPackageFilters {
  hotelId?: string
  status?: 'ACTIVE' | 'INACTIVE'
  page?: number
  size?: number
}

export interface CreateTravelPackageRequest {
  hotelId: string
  name: string
  description: string
  highlightedServices?: string[]
  discountPercentage?: number
  validFrom: string
  validTo: string
}

export interface UpdateTravelPackageRequest extends Omit<CreateTravelPackageRequest, 'hotelId'> {}

export interface UpdateTravelPackageStatusRequest {
  status: 'ACTIVE' | 'INACTIVE'
}
