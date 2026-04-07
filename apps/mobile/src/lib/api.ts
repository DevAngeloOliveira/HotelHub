import { accessToken, apiBaseUrl, features } from "./config";
import {
  calculateReservationTotal,
  canCancelReservation,
  currentUserId,
  destinations,
  getAvailableRoomsByHotel,
  getDestinationById,
  getHotelsByDestination,
  getHotelById,
  getOverlappingConfirmedCount,
  getRoomsByHotel,
  initialProfile,
  initialReservations,
  nextReservationId,
  type Destination,
  type Hotel,
  type Reservation,
  type Room,
  type UserProfile,
  type AvailableRoom,
  validateReservationWindow,
} from "../domain/hotelhub";

export type DestinationFilters = {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  size?: number;
};

export type ReservationInput = {
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
};

export class MobileApiError extends Error {
  constructor(public readonly status: number, message: string) {
    super(message);
    this.name = "MobileApiError";
  }
}

type DestinationResponse = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  category: string;
  description: string;
  featuredImageUrl?: string;
  imageUrl?: string;
  status?: string;
};

type HotelResponse = {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  address: string;
  category: string;
  amenities?: string[] | string;
  contactPhone?: string;
  contactEmail?: string;
  status?: string;
};

type RoomResponse = {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  quantity: number;
  status?: string;
  availableUnits?: number;
};

type ReservationResponse = {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
  createdAt: string;
  updatedAt?: string;
  cancelledAt?: string;
};

type UserResponse = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "CLIENT" | "ADMIN";
  status: "ACTIVE" | "INACTIVE";
};

type PageResponse<T> = {
  content: T[];
  totalElements: number;
};

function normalizeAmenities(value: HotelResponse["amenities"]): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function mapDestination(source: DestinationResponse): Destination {
  return {
    id: source.id,
    name: source.name,
    city: source.city,
    state: source.state,
    country: source.country,
    category: source.category,
    description: source.description,
    imageUrl: source.imageUrl ?? source.featuredImageUrl ?? "",
    status: source.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    featured: true,
  };
}

function mapHotel(source: HotelResponse): Hotel {
  return {
    id: source.id,
    destinationId: source.destinationId,
    name: source.name,
    description: source.description,
    address: source.address,
    category: source.category,
    amenities: normalizeAmenities(source.amenities),
    status: source.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
  };
}

function mapRoom(source: RoomResponse): Room & Partial<AvailableRoom> {
  return {
    id: source.id,
    hotelId: source.hotelId,
    name: source.name,
    type: source.type,
    description: source.description,
    capacity: source.capacity,
    pricePerNight: source.pricePerNight,
    quantity: source.quantity,
    status: source.status === "INACTIVE" ? "INACTIVE" : "ACTIVE",
    availableUnits: source.availableUnits,
  };
}

function mapReservation(source: ReservationResponse): Reservation {
  return {
    id: source.id,
    userId: source.userId,
    hotelId: source.hotelId,
    roomId: source.roomId,
    checkInDate: source.checkInDate,
    checkOutDate: source.checkOutDate,
    guestCount: source.guestCount,
    totalAmount: source.totalAmount,
    status: source.status,
    createdAt: source.createdAt,
    cancelledAt: source.cancelledAt,
  };
}

function mapUser(source: UserResponse): UserProfile {
  return {
    id: source.id,
    name: source.name,
    email: source.email,
    phone: source.phone,
    role: source.role,
    status: source.status,
  };
}

async function apiFetch<T>(path: string, init?: RequestInit, auth = false): Promise<T> {
  if (!apiBaseUrl) throw new MobileApiError(503, "API base URL is not configured.");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init?.headers as Record<string, string> | undefined),
  };

  if (auth) {
    if (!accessToken) throw new MobileApiError(401, "Access token is not configured.");
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${apiBaseUrl}${path}`, { ...init, headers });
  if (!response.ok) {
    let message = response.statusText;
    try {
      const body = await response.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // ignore parsing errors
    }
    throw new MobileApiError(response.status, message);
  }

  return response.json() as Promise<T>;
}

function filterMockDestinations(filters?: DestinationFilters): Destination[] {
  return destinations
    .filter((destination) => destination.status === "ACTIVE")
    .filter((destination) => {
      if (filters?.name && !destination.name.toLowerCase().includes(filters.name.toLowerCase())) return false;
      if (filters?.city && !destination.city.toLowerCase().includes(filters.city.toLowerCase())) return false;
      if (filters?.state && !destination.state.toLowerCase().includes(filters.state.toLowerCase())) return false;
      if (filters?.country && !destination.country.toLowerCase().includes(filters.country.toLowerCase())) return false;
      if (filters?.category && !destination.category.toLowerCase().includes(filters.category.toLowerCase())) return false;
      return true;
    });
}

export async function listDestinations(filters?: DestinationFilters): Promise<Destination[]> {
  if (features.publicApiEnabled) {
    const qs = new URLSearchParams();
    if (filters?.name) qs.set("name", filters.name);
    if (filters?.city) qs.set("city", filters.city);
    if (filters?.state) qs.set("state", filters.state);
    if (filters?.country) qs.set("country", filters.country);
    if (filters?.category) qs.set("category", filters.category);
    if (filters?.size) qs.set("size", String(filters.size));
    const result = await apiFetch<PageResponse<DestinationResponse>>(`/destinations${qs.toString() ? `?${qs.toString()}` : ""}`);
    return result.content.map(mapDestination);
  }

  const result = filterMockDestinations(filters);
  return filters?.size ? result.slice(0, filters.size) : result;
}

export async function getDestinationDetails(id: string): Promise<Destination & { hotels: Hotel[] }> {
  if (features.publicApiEnabled) {
    const result = await apiFetch<DestinationResponse & { hotels: HotelResponse[] }>(`/destinations/${id}`);
    return { ...mapDestination(result), hotels: (result.hotels ?? []).map(mapHotel) };
  }

  const destination = getDestinationById(id);
  if (!destination || destination.status !== "ACTIVE") {
    throw new MobileApiError(404, "Destination not found.");
  }
  return { ...destination, hotels: getHotelsByDestination(destination.id) };
}

export async function getHotelDetails(id: string): Promise<Hotel & { rooms: Room[] }> {
  if (features.publicApiEnabled) {
    const result = await apiFetch<HotelResponse & { rooms: RoomResponse[] }>(`/hotels/${id}`);
    return { ...mapHotel(result), rooms: (result.rooms ?? []).map((room) => mapRoom(room) as Room) };
  }

  const hotel = getHotelById(id);
  if (!hotel || hotel.status !== "ACTIVE") {
    throw new MobileApiError(404, "Hotel not found.");
  }
  return { ...hotel, rooms: getRoomsByHotel(hotel.id) };
}

export async function getHotelAvailability(
  hotelId: string,
  params: { checkInDate: string; checkOutDate: string; guestCount: number },
  reservations: Reservation[] = initialReservations,
): Promise<AvailableRoom[]> {
  if (features.publicApiEnabled) {
    const qs = new URLSearchParams({
      checkInDate: params.checkInDate,
      checkOutDate: params.checkOutDate,
      guestCount: String(params.guestCount),
    });
    const result = await apiFetch<RoomResponse[]>(`/hotels/${hotelId}/rooms?${qs.toString()}`);
    return result.map((room) => mapRoom(room) as AvailableRoom);
  }

  return getAvailableRoomsByHotel(
    hotelId,
    params.checkInDate,
    params.checkOutDate,
    params.guestCount,
    reservations,
  );
}

export async function getProfile(): Promise<UserProfile> {
  if (features.protectedApiEnabled) {
    return mapUser(await apiFetch<UserResponse>("/users/me", undefined, true));
  }
  return initialProfile;
}

export async function updateProfile(input: { name: string; phone: string }, currentProfile: UserProfile): Promise<UserProfile> {
  if (features.protectedApiEnabled) {
    return mapUser(
      await apiFetch<UserResponse>(
        "/users/me",
        {
          method: "PUT",
          body: JSON.stringify({ name: input.name, phone: input.phone }),
        },
        true,
      ),
    );
  }

  return {
    ...currentProfile,
    name: input.name.trim() || currentProfile.name,
    phone: input.phone.trim() || currentProfile.phone,
  };
}

export async function listMyReservations(reservations: Reservation[]): Promise<Reservation[]> {
  if (features.protectedApiEnabled) {
    const result = await apiFetch<PageResponse<ReservationResponse>>("/reservations/me", undefined, true);
    return result.content.map(mapReservation);
  }

  return reservations
    .filter((reservation) => reservation.userId === currentUserId)
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt));
}

export async function createReservation(
  input: ReservationInput,
  reservations: Reservation[],
  userId: string,
): Promise<Reservation> {
  if (features.protectedApiEnabled) {
    return mapReservation(
      await apiFetch<ReservationResponse>(
        "/reservations",
        {
          method: "POST",
          body: JSON.stringify(input),
        },
        true,
      ),
    );
  }

  const hotel = getHotelById(input.hotelId);
  const room = getRoomsByHotel(input.hotelId).find((candidate) => candidate.id === input.roomId);
  if (!hotel || !room) {
    throw new MobileApiError(404, "Hotel or room not found.");
  }

  const destination = getDestinationById(hotel.destinationId);
  if (!destination || destination.status !== "ACTIVE" || hotel.status !== "ACTIVE" || room.status !== "ACTIVE") {
    throw new MobileApiError(409, "Inactive entity for reservation.");
  }

  const dateError = validateReservationWindow(input.checkInDate, input.checkOutDate);
  if (dateError) {
    throw new MobileApiError(400, dateError);
  }

  if (input.guestCount > room.capacity) {
    throw new MobileApiError(400, "Guest count exceeds room capacity.");
  }

  const overlaps = getOverlappingConfirmedCount(room.id, input.checkInDate, input.checkOutDate, reservations);
  if (overlaps >= room.quantity) {
    throw new MobileApiError(409, "No availability for this period.");
  }

  return {
    id: nextReservationId(),
    userId,
    hotelId: input.hotelId,
    roomId: input.roomId,
    checkInDate: input.checkInDate,
    checkOutDate: input.checkOutDate,
    guestCount: input.guestCount,
    totalAmount: calculateReservationTotal(room, input.checkInDate, input.checkOutDate),
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  };
}

export async function cancelReservation(
  reservationId: string,
  reservations: Reservation[],
): Promise<Reservation> {
  if (features.protectedApiEnabled) {
    return mapReservation(
      await apiFetch<ReservationResponse>(
        `/reservations/${reservationId}/cancel`,
        { method: "PATCH" },
        true,
      ),
    );
  }

  const reservation = reservations.find((item) => item.id === reservationId && item.userId === currentUserId);
  if (!reservation) {
    throw new MobileApiError(404, "Reservation not found.");
  }
  if (!canCancelReservation(reservation)) {
    throw new MobileApiError(400, "Cancellation is allowed only before check-in.");
  }

  return {
    ...reservation,
    status: "CANCELLED",
    cancelledAt: new Date().toISOString(),
  };
}
