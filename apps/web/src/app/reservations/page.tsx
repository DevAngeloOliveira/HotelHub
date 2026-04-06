import { SectionHeader } from "@/components/ui";
import { formatCurrency } from "@/lib/format";
import { getDestinationById, getHotelById, getRoomById, myReservations } from "@/lib/mock-data";

export default function MyReservationsPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="WEB/MyReservations"
        subtitle="Histórico de reservas com ações de cancelamento para reservas ativas."
      />

      <div className="space-y-4">
        {myReservations.map((reservation) => {
          const destination = getDestinationById(reservation.destinationId);
          const hotel = getHotelById(reservation.hotelId);
          const room = getRoomById(reservation.roomId);
          const isCancelled = reservation.status === "CANCELLED";

          return (
            <article key={reservation.id} className="hh-card grid gap-4 p-5 md:grid-cols-4">
              <div className="md:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hh-blue)]">
                  {reservation.id}
                </p>
                <h3 className="mt-1 text-xl font-semibold text-slate-900">{hotel?.name}</h3>
                <p className="text-sm text-slate-600">
                  {destination?.name} • {room?.name}
                </p>
                <p className="mt-2 text-sm text-slate-700">
                  {reservation.checkInDate} até {reservation.checkOutDate} • {reservation.guestCount}{" "}
                  hóspedes
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Status</p>
                <span
                  className={[
                    "mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                    isCancelled
                      ? "bg-red-100 text-[var(--hh-danger)]"
                      : "bg-[var(--hh-green)]/15 text-[var(--hh-green-700)]",
                  ].join(" ")}
                >
                  {reservation.status}
                </span>
              </div>
              <div className="flex flex-col items-start gap-3 md:items-end">
                <p className="text-lg font-bold text-slate-900">{formatCurrency(reservation.totalAmount)}</p>
                <button
                  disabled={isCancelled}
                  className={[
                    "rounded-lg px-3 py-2 text-xs font-semibold transition",
                    isCancelled
                      ? "cursor-not-allowed bg-slate-100 text-slate-400"
                      : "bg-[var(--hh-danger)] text-white hover:bg-red-700",
                  ].join(" ")}
                >
                  Cancelar reserva
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
