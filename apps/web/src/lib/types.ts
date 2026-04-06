export type Destination = {
  id: string;
  name: string;
  city: string;
  state: string;
  country: string;
  category: string;
  description: string;
  imageUrl: string;
  featured: boolean;
};

export type Hotel = {
  id: string;
  destinationId: string;
  name: string;
  category: string;
  address: string;
  description: string;
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
};

export type Reservation = {
  id: string;
  hotelId: string;
  roomId: string;
  destinationId: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
  totalAmount: number;
  status: "CONFIRMED" | "CANCELLED";
};

export type RoomBookingWindow = {
  roomId: string;
  checkInDate: string;
  checkOutDate: string;
  activeReservations: number;
};
