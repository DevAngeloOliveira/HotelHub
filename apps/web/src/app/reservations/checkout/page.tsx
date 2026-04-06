import Link from "next/link";
import { EmptyState, SectionHeader } from "@/components/ui";
import { daysBetween } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/format";
import { estimateReservationTotal, getHotelById, getRoomById } from "@/lib/mock-data";

type CheckoutPageProps = {
  searchParams?: Promise<{
    roomId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
  }>;
};

export default async function ReservationCheckoutPage({ searchParams }: CheckoutPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const roomId = resolvedSearchParams?.roomId ?? "";
  const room = getRoomById(roomId);
  const hotel = room ? getHotelById(room.hotelId) : undefined;
  const checkInDate = resolvedSearchParams?.checkInDate ?? "";
  const checkOutDate = resolvedSearchParams?.checkOutDate ?? "";
  const guestCount = Number(resolvedSearchParams?.guestCount ?? "1");

  if (!room || !hotel || !checkInDate || !checkOutDate) {
    return (
      <EmptyState
        title="Dados incompletos para checkout"
        message="Volte para disponibilidade e selecione um quarto para continuar."
      />
    );
  }

  const nights = daysBetween(checkInDate, checkOutDate);
  const total = estimateReservationTotal(room.id, checkInDate, checkOutDate);

  return (
    <div className="space-y-6">
      <SectionHeader
        title="WEB/ReservationCheckout"
        subtitle="Resumo da reserva antes de confirmar."
      />

      <section className="hh-card grid gap-6 p-6 md:grid-cols-2">
        <div className="space-y-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hh-blue)]">Hotel</p>
            <h2 className="text-2xl font-bold text-slate-900">{hotel.name}</h2>
            <p className="text-sm text-slate-600">{hotel.address}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hh-blue)]">Quarto</p>
            <p className="text-lg font-semibold text-slate-900">{room.name}</p>
            <p className="text-sm text-slate-600">
              {room.type} - capacidade {room.capacity} hospedes
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--hh-blue)]">Periodo</p>
            <p className="text-sm text-slate-700">
              {checkInDate} ate {checkOutDate} ({nights} noites)
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-lg font-bold text-slate-900">Resumo de preco</h3>
          <div className="mt-4 space-y-2 text-sm text-slate-700">
            <p>Hospedes: {guestCount}</p>
            <p>Diaria: {formatCurrency(room.pricePerNight)}</p>
            <p>Noites: {nights}</p>
            <div className="my-3 border-t border-slate-200" />
            <p className="text-base font-bold text-slate-900">Total: {formatCurrency(total)}</p>
          </div>
          <button className="mt-5 w-full rounded-xl bg-[var(--hh-green)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--hh-green-700)]">
            Confirmar reserva
          </button>
          <Link
            href={`/hotels/${hotel.id}/availability?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestCount=${guestCount}`}
            className="mt-3 block text-center text-sm font-medium text-[var(--hh-blue)] hover:underline"
          >
            Voltar para disponibilidade
          </Link>
        </div>
      </section>
    </div>
  );
}
