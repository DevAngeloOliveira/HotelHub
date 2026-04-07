import type {
  AuthTokenResponse,
  Destination,
  Hotel,
  PageResponse,
  Reservation,
  Room,
  UserProfile,
} from "@/lib/types";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getBase(): string {
  if (globalThis.window === undefined) {
    return process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
  }
  return process.env.NEXT_PUBLIC_API_BASE_URL ?? "/api/v1";
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const url = `${getBase()}${path}`;
  const timeoutSignal = AbortSignal.timeout(8000);
  const res = await fetch(url, {
    ...options,
    signal: options?.signal ? AbortSignal.any([options.signal, timeoutSignal]) : timeoutSignal,
    headers: {
      "Content-Type": "application/json",
      ...(options?.headers ?? undefined),
    },
  });

  if (!res.ok) {
    let message = res.statusText;
    try {
      const body = await res.json();
      message = body?.message ?? body?.error ?? message;
    } catch {
      // ignore JSON parse errors
    }
    throw new ApiError(res.status, message);
  }

  return res.json() as Promise<T>;
}

function authHeader(token: string): Record<string, string> {
  return { Authorization: `Bearer ${token}` };
}

// ──────────────────────────────────────────────────────────────────────────────
// Destinations
// ──────────────────────────────────────────────────────────────────────────────

export type DestinationFilters = {
  name?: string;
  city?: string;
  state?: string;
  country?: string;
  category?: string;
  page?: number;
  size?: number;
};

export async function listDestinations(
  filters?: DestinationFilters,
): Promise<PageResponse<Destination>> {
  const qs = new URLSearchParams();
  if (filters?.name) qs.set("name", filters.name);
  if (filters?.city) qs.set("city", filters.city);
  if (filters?.state) qs.set("state", filters.state);
  if (filters?.country) qs.set("country", filters.country);
  if (filters?.category) qs.set("category", filters.category);
  if (filters?.page !== undefined) qs.set("page", String(filters.page));
  if (filters?.size !== undefined) qs.set("size", String(filters.size));
  const q = qs.toString();
  const path = q ? `/destinations?${q}` : "/destinations";
  return apiFetch<PageResponse<Destination>>(path, {
    next: { revalidate: 60 },
  });
}

export async function getDestination(id: string): Promise<Destination & { hotels: Hotel[] }> {
  return apiFetch(`/destinations/${id}`, { next: { revalidate: 60 } });
}

// ──────────────────────────────────────────────────────────────────────────────
// Hotels
// ──────────────────────────────────────────────────────────────────────────────

export async function listHotels(params?: {
  destinationId?: string;
  page?: number;
  size?: number;
}): Promise<PageResponse<Hotel>> {
  const qs = new URLSearchParams();
  if (params?.destinationId) qs.set("destinationId", params.destinationId);
  if (params?.page !== undefined) qs.set("page", String(params.page));
  if (params?.size !== undefined) qs.set("size", String(params.size));
  const q = qs.toString();
  const path = q ? `/hotels?${q}` : "/hotels";
  return apiFetch<PageResponse<Hotel>>(path, {
    next: { revalidate: 60 },
  });
}

export async function getHotel(id: string): Promise<Hotel & { rooms: Room[] }> {
  return apiFetch(`/hotels/${id}`, { next: { revalidate: 60 } });
}

export async function getHotelAvailability(
  hotelId: string,
  params?: {
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: number;
  },
): Promise<Room[]> {
  const qs = new URLSearchParams();
  if (params?.checkInDate) qs.set("checkInDate", params.checkInDate);
  if (params?.checkOutDate) qs.set("checkOutDate", params.checkOutDate);
  if (params?.guestCount !== undefined) qs.set("guestCount", String(params.guestCount));
  const q = qs.toString();
  const path = q ? `/hotels/${hotelId}/rooms?${q}` : `/hotels/${hotelId}/rooms`;
  return apiFetch<Room[]>(path, {
    cache: "no-store",
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Reservations (require auth)
// ──────────────────────────────────────────────────────────────────────────────

export async function listMyReservations(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PageResponse<Reservation>> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set("page", String(params.page));
  if (params?.size !== undefined) qs.set("size", String(params.size));
  const q = qs.toString();
  const path = q ? `/reservations/me?${q}` : "/reservations/me";
  return apiFetch<PageResponse<Reservation>>(path, {
    headers: authHeader(token),
    cache: "no-store",
  });
}

export async function listAdminReservations(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PageResponse<Reservation>> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set("page", String(params.page));
  if (params?.size !== undefined) qs.set("size", String(params.size));
  const q = qs.toString();
  const path = q ? `/admin/reservations?${q}` : "/admin/reservations";
  return apiFetch<PageResponse<Reservation>>(path, {
    headers: authHeader(token),
    cache: "no-store",
  });
}

export async function listAdminUsers(
  token: string,
  params?: { page?: number; size?: number },
): Promise<PageResponse<UserProfile>> {
  const qs = new URLSearchParams();
  if (params?.page !== undefined) qs.set("page", String(params.page));
  if (params?.size !== undefined) qs.set("size", String(params.size));
  const q = qs.toString();
  const path = q ? `/admin/users?${q}` : "/admin/users";
  return apiFetch<PageResponse<UserProfile>>(path, {
    headers: authHeader(token),
    cache: "no-store",
  });
}

export async function createReservation(
  token: string,
  data: {
    hotelId: string;
    roomId: string;
    checkInDate: string;
    checkOutDate: string;
    guestCount: number;
  },
): Promise<Reservation> {
  return apiFetch<Reservation>("/reservations", {
    method: "POST",
    headers: authHeader(token),
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function cancelReservation(token: string, id: string): Promise<Reservation> {
  return apiFetch<Reservation>(`/reservations/${id}/cancel`, {
    method: "PATCH",
    headers: authHeader(token),
    cache: "no-store",
  });
}

// ──────────────────────────────────────────────────────────────────────────────
// Auth
// ──────────────────────────────────────────────────────────────────────────────

export async function loginApi(email: string, password: string): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  });
}

export async function registerApi(data: {
  name: string;
  email: string;
  password: string;
  phone: string;
}): Promise<AuthTokenResponse> {
  return apiFetch<AuthTokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
    cache: "no-store",
  });
}

export async function getMe(token: string): Promise<UserProfile> {
  return apiFetch<UserProfile>("/auth/me", {
    headers: authHeader(token),
    cache: "no-store",
  });
}
