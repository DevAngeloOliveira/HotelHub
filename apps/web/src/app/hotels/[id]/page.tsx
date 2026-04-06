import Link from "next/link";
import { notFound } from "next/navigation";
import { RoomCard, SectionHeader } from "@/components/ui";
import { addDays, toIsoDate } from "@/lib/date-utils";
import { getHotelById, getRoomsByHotel } from "@/lib/mock-data";

type HotelDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function HotelDetailPage({ params }: HotelDetailProps) {
  const { id } = await params;
  const hotel = getHotelById(id);
  if (!hotel) {
    notFound();
  }

  const rooms = getRoomsByHotel(hotel.id);
  const today = new Date();
  const checkIn = toIsoDate(addDays(today, 7));
  const checkOut = toIsoDate(addDays(today, 10));

  return (
    <div className="space-y-6">
      <section className="hh-card p-6">
        <p className="hh-chip bg-[var(--hh-blue)]/10 text-[var(--hh-blue)]">WEB/HotelDetail</p>
        <div className="mt-3 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900">{hotel.name}</h1>
            <p className="mt-2 text-sm text-slate-600">{hotel.address}</p>
            <p className="mt-3 max-w-3xl text-slate-700">{hotel.description}</p>
          </div>
          <span className="hh-chip bg-[var(--hh-green)]/15 text-[var(--hh-green-700)]">
            {hotel.category}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span key={amenity} className="hh-chip bg-slate-100 text-slate-700">
              {amenity}
            </span>
          ))}
        </div>

        <div className="mt-6">
          <Link
            href={{
              pathname: `/hotels/${hotel.id}/availability`,
              query: { checkInDate: checkIn, checkOutDate: checkOut, guestCount: "2" },
            }}
            className="rounded-xl bg-[var(--hh-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hh-blue-700)]"
          >
            Ver disponibilidade
          </Link>
        </div>
      </section>

      <section>
        <SectionHeader title="Quartos do hotel" subtitle="Tipos de quarto e tarifas por diaria." />
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      </section>
    </div>
  );
}
