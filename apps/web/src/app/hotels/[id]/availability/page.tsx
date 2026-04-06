import { notFound } from "next/navigation";
import { EmptyState, RoomCard, SectionHeader } from "@/components/ui";
import { addDays, toIsoDate } from "@/lib/date-utils";
import { getAvailableRoomsByHotel, getHotelById } from "@/lib/mock-data";

type AvailabilityPageProps = {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
  }>;
};

export default async function HotelAvailabilityPage({
  params,
  searchParams,
}: AvailabilityPageProps) {
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const hotel = getHotelById(id);
  if (!hotel) {
    notFound();
  }

  const today = new Date();
  const checkInDate = resolvedSearchParams?.checkInDate ?? toIsoDate(addDays(today, 7));
  const checkOutDate = resolvedSearchParams?.checkOutDate ?? toIsoDate(addDays(today, 10));
  const guestCount = Number(resolvedSearchParams?.guestCount ?? "2");
  const rooms = getAvailableRoomsByHotel(hotel.id, checkInDate, checkOutDate, guestCount);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="WEB/RoomAvailability"
        subtitle={`${hotel.name} - periodo ${checkInDate} ate ${checkOutDate} - ${guestCount} hospedes`}
      />

      <form className="hh-card grid gap-3 p-4 md:grid-cols-4">
        <input
          type="date"
          name="checkInDate"
          defaultValue={checkInDate}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <input
          type="date"
          name="checkOutDate"
          defaultValue={checkOutDate}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <input
          type="number"
          min={1}
          name="guestCount"
          defaultValue={guestCount}
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <button
          type="submit"
          className="rounded-xl bg-[var(--hh-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hh-green-700)]"
        >
          Atualizar
        </button>
      </form>

      {rooms.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2">
          {rooms.map((room) => (
            <RoomCard
              key={room.id}
              room={room}
              availableUnits={room.availableUnits}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guestCount={guestCount}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Sem quartos disponiveis no periodo"
          message="Tente ajustar datas ou quantidade de hospedes."
        />
      )}
    </div>
  );
}
