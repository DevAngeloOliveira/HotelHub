export type Role = "CLIENT" | "ADMIN";
export type EntityStatus = "ACTIVE" | "INACTIVE";
export type ReservationStatus = "CONFIRMED" | "CANCELLED";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  status: EntityStatus;
}

export interface Destination {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  category: string;
  description: string;
  imageUrl: string;
  status: EntityStatus;
  featured: boolean;
}

export interface Hotel {
  id: string;
  destinationId: string;
  name: string;
  description: string;
  address: string;
  category: string;
  amenities: string[];
  status: EntityStatus;
}

export interface Room {
  id: string;
  hotelId: string;
  name: string;
  type: string;
  description: string;
  capacity: number;
  pricePerNight: number;
  quantity: number;
  status: EntityStatus;
}

export interface Reservation {
  id: string;
  userId: string;
  hotelId: string;
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: ReservationStatus;
  createdAt: string;
  cancelledAt?: string;
}

export interface AvailableRoom extends Room {
  availableUnits: number;
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(baseDate: Date, days: number): Date {
  const copy = new Date(baseDate);
  copy.setDate(copy.getDate() + days);
  return copy;
}

function parseIsoDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00Z`);
}

export function todayIsoDate(): string {
  return toIsoDate(new Date());
}

export function addDaysToToday(days: number): string {
  return toIsoDate(addDays(new Date(), days));
}

export function daysBetween(checkInDate: string, checkOutDate: string): number {
  const start = parseIsoDate(checkInDate);
  const end = parseIsoDate(checkOutDate);
  const millisPerDay = 1000 * 60 * 60 * 24;
  return Math.max(0, Math.round((end.getTime() - start.getTime()) / millisPerDay));
}

export function overlapsDates(
  existingCheckInDate: string,
  existingCheckOutDate: string,
  newCheckInDate: string,
  newCheckOutDate: string
): boolean {
  return existingCheckInDate < newCheckOutDate && existingCheckOutDate > newCheckInDate;
}

export function validateReservationWindow(
  checkInDate: string,
  checkOutDate: string
): string | null {
  if (!checkInDate || !checkOutDate) {
    return "Informe check-in e check-out.";
  }

  if (checkOutDate <= checkInDate) {
    return "Check-out deve ser posterior ao check-in.";
  }

  if (checkInDate < todayIsoDate()) {
    return "Nao e permitido reservar para datas passadas.";
  }

  return null;
}

export function calculateReservationTotal(
  room: Room,
  checkInDate: string,
  checkOutDate: string
): number {
  return room.pricePerNight * daysBetween(checkInDate, checkOutDate);
}

const baseDate = new Date();

export const destinations: Destination[] = [
  {
    id: "porto-seguro",
    name: "Porto Seguro",
    city: "Porto Seguro",
    state: "BA",
    country: "Brasil",
    category: "Praia",
    description:
      "Praias com aguas mornas, centro historico e vida noturna para descanso com movimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: "gramado",
    name: "Gramado",
    city: "Gramado",
    state: "RS",
    country: "Brasil",
    category: "Serra",
    description:
      "Arquitetura charmosa, gastronomia e clima de montanha com atracoes para casais e familias.",
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    status: "ACTIVE",
    featured: true,
  },
  {
    id: "bonito",
    name: "Bonito",
    city: "Bonito",
    state: "MS",
    country: "Brasil",
    category: "Ecoturismo",
    description:
      "Rios cristalinos, flutuacao, trilhas e experiencias para quem busca aventura.",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    status: "ACTIVE",
    featured: false,
  },
];

export const hotels: Hotel[] = [
  {
    id: "hotel-atlantico",
    destinationId: "porto-seguro",
    name: "Hotel Atlantico",
    description: "Vista mar, piscina externa e localizacao premium.",
    address: "Av. Beira Mar, 1200 - Porto Seguro, BA",
    category: "4 estrelas",
    amenities: ["Piscina", "Wi-Fi", "Cafe da manha", "Academia"],
    status: "ACTIVE",
  },
  {
    id: "praia-verde-resort",
    destinationId: "porto-seguro",
    name: "Praia Verde Resort",
    description: "Resort pe na areia com spa e beach club.",
    address: "Rua dos Coqueiros, 88 - Porto Seguro, BA",
    category: "5 estrelas",
    amenities: ["Spa", "Piscina", "Restaurante", "Transfer"],
    status: "ACTIVE",
  },
  {
    id: "serra-bella-hotel",
    destinationId: "gramado",
    name: "Serra Bella Hotel",
    description: "Estilo alpino e facil acesso aos passeios locais.",
    address: "Rua das Hortensias, 456 - Gramado, RS",
    category: "4 estrelas",
    amenities: ["Lareira", "Wi-Fi", "Estacionamento", "Restaurante"],
    status: "ACTIVE",
  },
  {
    id: "eco-bonito-lodge",
    destinationId: "bonito",
    name: "Eco Bonito Lodge",
    description: "Hospedagem voltada para ecoturismo e trilhas.",
    address: "Estrada do Rio Azul, 50 - Bonito, MS",
    category: "3 estrelas",
    amenities: ["Passeios guiados", "Wi-Fi", "Cafe da manha", "Transfer"],
    status: "ACTIVE",
  },
];

export const rooms: Room[] = [
  {
    id: "suite-mar",
    hotelId: "hotel-atlantico",
    name: "Suite Vista Mar",
    type: "SUITE",
    description: "Suite com varanda e vista frontal para a praia.",
    capacity: 2,
    quantity: 3,
    pricePerNight: 420,
    status: "ACTIVE",
  },
  {
    id: "quarto-family",
    hotelId: "hotel-atlantico",
    name: "Quarto Family",
    type: "FAMILY",
    description: "Quarto amplo para familias com duas camas de casal.",
    capacity: 4,
    quantity: 2,
    pricePerNight: 580,
    status: "ACTIVE",
  },
  {
    id: "bungalow-premium",
    hotelId: "praia-verde-resort",
    name: "Bungalow Premium",
    type: "BUNGALOW",
    description: "Bungalow com area privativa e acesso ao beach club.",
    capacity: 3,
    quantity: 2,
    pricePerNight: 890,
    status: "ACTIVE",
  },
  {
    id: "suite-serra",
    hotelId: "serra-bella-hotel",
    name: "Suite Serra",
    type: "SUITE",
    description: "Suite aconchegante com lareira e vista para o vale.",
    capacity: 2,
    quantity: 4,
    pricePerNight: 510,
    status: "ACTIVE",
  },
  {
    id: "cabana-eco",
    hotelId: "eco-bonito-lodge",
    name: "Cabana Eco",
    type: "CABIN",
    description: "Cabana em madeira com varanda integrada a natureza.",
    capacity: 2,
    quantity: 5,
    pricePerNight: 350,
    status: "ACTIVE",
  },
];

export const initialProfile: UserProfile = {
  id: "user-client",
  name: "Aline Matos",
  email: "aline@example.com",
  phone: "+55 11 99999-0000",
  role: "CLIENT",
  status: "ACTIVE",
};

export const currentUserId = initialProfile.id;

export const initialReservations: Reservation[] = [
  {
    id: "RSV-1201",
    userId: currentUserId,
    hotelId: "hotel-atlantico",
    roomId: "suite-mar",
    checkInDate: toIsoDate(addDays(baseDate, 12)),
    checkOutDate: toIsoDate(addDays(baseDate, 15)),
    guestCount: 2,
    totalAmount: 1260,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "RSV-1120",
    userId: currentUserId,
    hotelId: "serra-bella-hotel",
    roomId: "suite-serra",
    checkInDate: toIsoDate(addDays(baseDate, -20)),
    checkOutDate: toIsoDate(addDays(baseDate, -16)),
    guestCount: 2,
    totalAmount: 2040,
    status: "CANCELLED",
    createdAt: new Date().toISOString(),
    cancelledAt: new Date().toISOString(),
  },
  {
    id: "RSV-0999",
    userId: "other-client",
    hotelId: "hotel-atlantico",
    roomId: "suite-mar",
    checkInDate: toIsoDate(addDays(baseDate, 12)),
    checkOutDate: toIsoDate(addDays(baseDate, 14)),
    guestCount: 2,
    totalAmount: 840,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
  {
    id: "RSV-0998",
    userId: "other-client",
    hotelId: "hotel-atlantico",
    roomId: "suite-mar",
    checkInDate: toIsoDate(addDays(baseDate, 11)),
    checkOutDate: toIsoDate(addDays(baseDate, 14)),
    guestCount: 2,
    totalAmount: 1260,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
  },
];

export function getDestinationById(destinationId: string): Destination | undefined {
  return destinations.find((item) => item.id === destinationId);
}

export function getHotelById(hotelId: string): Hotel | undefined {
  return hotels.find((item) => item.id === hotelId);
}

export function getRoomById(roomId: string): Room | undefined {
  return rooms.find((item) => item.id === roomId);
}

export function getHotelsByDestination(destinationId: string): Hotel[] {
  return hotels.filter(
    (hotel) => hotel.destinationId === destinationId && hotel.status === "ACTIVE"
  );
}

export function getRoomsByHotel(hotelId: string): Room[] {
  return rooms.filter((room) => room.hotelId === hotelId && room.status === "ACTIVE");
}

export function getOverlappingConfirmedCount(
  roomId: string,
  checkInDate: string,
  checkOutDate: string,
  reservations: Reservation[]
): number {
  return reservations
    .filter((reservation) => reservation.roomId === roomId)
    .filter((reservation) => reservation.status === "CONFIRMED")
    .filter((reservation) =>
      overlapsDates(
        reservation.checkInDate,
        reservation.checkOutDate,
        checkInDate,
        checkOutDate
      )
    ).length;
}

export function getAvailableRoomsByHotel(
  hotelId: string,
  checkInDate: string,
  checkOutDate: string,
  guestCount: number,
  reservations: Reservation[]
): AvailableRoom[] {
  return getRoomsByHotel(hotelId)
    .filter((room) => guestCount <= room.capacity)
    .map((room) => {
      const activeOverlaps = getOverlappingConfirmedCount(
        room.id,
        checkInDate,
        checkOutDate,
        reservations
      );
      const availableUnits = Math.max(0, room.quantity - activeOverlaps);
      return { ...room, availableUnits };
    })
    .filter((room) => room.availableUnits > 0);
}

export function canCancelReservation(
  reservation: Reservation,
  todayDate: string = todayIsoDate()
): boolean {
  return reservation.status === "CONFIRMED" && todayDate < reservation.checkInDate;
}

let nextReservationSequence = 1300;

export function nextReservationId(): string {
  nextReservationSequence += 1;
  return `RSV-${nextReservationSequence}`;
}
