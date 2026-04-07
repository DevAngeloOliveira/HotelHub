import { addDays, daysBetween, rangesOverlap, toIsoDate } from "@/lib/date-utils";
import type {
  Destination,
  Hotel,
  Reservation,
  Room,
  RoomBookingWindow,
} from "@/lib/types";

const today = new Date();

export const destinations: Destination[] = [
  {
    id: "porto-seguro",
    slug: "porto-seguro",
    name: "Porto Seguro",
    city: "Porto Seguro",
    state: "BA",
    country: "Brasil",
    category: "Praia",
    description:
      "Praias com águas mornas, centro histórico e vida noturna para quem busca descanso com movimento.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "gramado",
    slug: "gramado",
    name: "Gramado",
    city: "Gramado",
    state: "RS",
    country: "Brasil",
    category: "Serra",
    description:
      "Arquitetura charmosa, gastronomia e clima de montanha com atrações para casais e famílias.",
    imageUrl:
      "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?auto=format&fit=crop&w=1200&q=80",
    featured: true,
  },
  {
    id: "bonito",
    slug: "bonito",
    name: "Bonito",
    city: "Bonito",
    state: "MS",
    country: "Brasil",
    category: "Ecoturismo",
    description:
      "Rios cristalinos, flutuação, trilhas e experiências de ecoturismo para grupos e aventureiros.",
    imageUrl:
      "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=1200&q=80",
    featured: false,
  },
];

export const hotels: Hotel[] = [
  {
    id: "hotel-atlantico",
    destinationId: "porto-seguro",
    name: "Hotel Atlântico",
    category: "4 estrelas",
    address: "Av. Beira Mar, 1200 - Porto Seguro, BA",
    description:
      "Hotel com vista para o mar, piscina externa e fácil acesso às principais praias.",
    amenities: ["Piscina", "Wi-Fi", "Café da manhã", "Academia"],
    contactPhone: "+55 73 9999-1111",
    contactEmail: "contato@atlantico.com",
  },
  {
    id: "praia-verde-resort",
    destinationId: "porto-seguro",
    name: "Praia Verde Resort",
    category: "5 estrelas",
    address: "Rua dos Coqueiros, 88 - Porto Seguro, BA",
    description:
      "Resort pé na areia com spa, beach club e opções premium para famílias e casais.",
    amenities: ["Spa", "Piscina", "Restaurante", "Transfer"],
    contactPhone: "+55 73 9999-2222",
    contactEmail: "reservas@praiaverde.com",
  },
  {
    id: "serra-bella-hotel",
    destinationId: "gramado",
    name: "Serra Bella Hotel",
    category: "4 estrelas",
    address: "Rua das Hortênsias, 456 - Gramado, RS",
    description:
      "Conforto em estilo alpino, próximo aos pontos turísticos e com estrutura para famílias.",
    amenities: ["Lareira", "Wi-Fi", "Estacionamento", "Restaurante"],
    contactPhone: "+55 54 9999-3333",
    contactEmail: "contato@serrabella.com",
  },
  {
    id: "eco-bonito-lodge",
    destinationId: "bonito",
    name: "Eco Bonito Lodge",
    category: "3 estrelas",
    address: "Estrada do Rio Azul, 50 - Bonito, MS",
    description:
      "Hospedagem para ecoturismo com foco em experiências ao ar livre e conforto essencial.",
    amenities: ["Passeios guiados", "Wi-Fi", "Café da manhã", "Transfer"],
    contactPhone: "+55 67 9999-4444",
    contactEmail: "hello@ecobonito.com",
  },
];

export const rooms: Room[] = [
  {
    id: "suite-mar",
    hotelId: "hotel-atlantico",
    name: "Suíte Vista Mar",
    type: "SUITE",
    description: "Suíte com varanda, cama queen e vista frontal para a praia.",
    capacity: 2,
    quantity: 3,
    pricePerNight: 420,
  },
  {
    id: "quarto-family",
    hotelId: "hotel-atlantico",
    name: "Quarto Family",
    type: "FAMILY",
    description: "Quarto amplo para famílias com duas camas de casal.",
    capacity: 4,
    quantity: 2,
    pricePerNight: 580,
  },
  {
    id: "bungalow-premium",
    hotelId: "praia-verde-resort",
    name: "Bungalow Premium",
    type: "BUNGALOW",
    description: "Bungalow com área privativa e acesso exclusivo ao beach club.",
    capacity: 3,
    quantity: 2,
    pricePerNight: 890,
  },
  {
    id: "suite-serra",
    hotelId: "serra-bella-hotel",
    name: "Suíte Serra",
    type: "SUITE",
    description: "Suíte aconchegante com lareira e vista para o vale.",
    capacity: 2,
    quantity: 4,
    pricePerNight: 510,
  },
  {
    id: "cabana-eco",
    hotelId: "eco-bonito-lodge",
    name: "Cabana Eco",
    type: "CABIN",
    description: "Cabana em madeira com varanda e integração com a natureza.",
    capacity: 2,
    quantity: 5,
    pricePerNight: 350,
  },
];

export const roomBookingWindows: RoomBookingWindow[] = [
  {
    roomId: "suite-mar",
    checkInDate: toIsoDate(addDays(today, 8)),
    checkOutDate: toIsoDate(addDays(today, 12)),
    activeReservations: 2,
  },
  {
    roomId: "suite-mar",
    checkInDate: toIsoDate(addDays(today, 10)),
    checkOutDate: toIsoDate(addDays(today, 13)),
    activeReservations: 1,
  },
  {
    roomId: "bungalow-premium",
    checkInDate: toIsoDate(addDays(today, 15)),
    checkOutDate: toIsoDate(addDays(today, 18)),
    activeReservations: 2,
  },
  {
    roomId: "suite-serra",
    checkInDate: toIsoDate(addDays(today, 5)),
    checkOutDate: toIsoDate(addDays(today, 9)),
    activeReservations: 1,
  },
];

export const myReservations: Reservation[] = [
  {
    id: "RSV-1001",
    userId: "mock-user",
    hotelId: "hotel-atlantico",
    roomId: "suite-mar",
    destinationId: "porto-seguro",
    checkInDate: toIsoDate(addDays(today, 16)),
    checkOutDate: toIsoDate(addDays(today, 20)),
    guestCount: 2,
    totalAmount: 1680,
    status: "CONFIRMED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "RSV-0998",
    userId: "mock-user",
    hotelId: "serra-bella-hotel",
    roomId: "suite-serra",
    destinationId: "gramado",
    checkInDate: toIsoDate(addDays(today, -12)),
    checkOutDate: toIsoDate(addDays(today, -8)),
    guestCount: 2,
    totalAmount: 2040,
    status: "CANCELLED",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
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
  return hotels.filter((hotel) => hotel.destinationId === destinationId);
}

export function getRoomsByHotel(hotelId: string): Room[] {
  return rooms.filter((room) => room.hotelId === hotelId);
}

export function calculateAvailableUnits(
  roomId: string,
  checkInDate: string,
  checkOutDate: string
): number {
  const room = getRoomById(roomId);
  if (!room) {
    return 0;
  }
  const active = roomBookingWindows
    .filter((window) => window.roomId === roomId)
    .filter((window) =>
      rangesOverlap(window.checkInDate, window.checkOutDate, checkInDate, checkOutDate)
    )
    .reduce((total, window) => total + window.activeReservations, 0);

  return Math.max(0, room.quantity - active);
}

export function getAvailableRoomsByHotel(
  hotelId: string,
  checkInDate: string,
  checkOutDate: string,
  guestCount: number
): Array<Room & { availableUnits: number }> {
  return getRoomsByHotel(hotelId)
    .filter((room) => guestCount <= room.capacity)
    .map((room) => ({
      ...room,
      availableUnits: calculateAvailableUnits(room.id, checkInDate, checkOutDate),
    }))
    .filter((room) => room.availableUnits > 0);
}

export function estimateReservationTotal(
  roomId: string,
  checkInDate: string,
  checkOutDate: string
): number {
  const room = getRoomById(roomId);
  if (!room) {
    return 0;
  }
  const nights = daysBetween(checkInDate, checkOutDate);
  return room.pricePerNight * nights;
}
