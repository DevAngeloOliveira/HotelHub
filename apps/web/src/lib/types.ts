export type Destination = {
  id: string;
  name: string;
  slug: string;
  city: string;
  state: string;
  country: string;
  category: string;
  description?: string;
  featuredImageUrl?: string;
  imageUrl?: string;
  featured?: boolean;
};

export type Hotel = {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  address: string;
  description?: string;
  amenities: string[];
  contactPhone: string;
  contactEmail: string;
};

export type Room = {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  quantity: number;
  pricePerNight: number;
  available?: boolean;
  availableUnits?: number;
};

export type Reservation = {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  destinationId?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
  cancelledAt?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CLIENT" | "ADMIN";
  status: string;
};

export type AuthTokenResponse = {
  accessToken: string;
  tokenType: string;
  user: UserProfile;
};

export type RoomBookingWindow = {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  activeReservations: number;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sort: string;
};
