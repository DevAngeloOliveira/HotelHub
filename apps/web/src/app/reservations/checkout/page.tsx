import Link from "next/link";
import { redirect } from "next/navigation";
import {
  AlertBanner,
  Button,
  ConfirmationModal,
  EmptyState,
  SectionHeader,
  SurfaceCard,
} from "@/components/ui";
import { createReservationCheckoutAction } from "@/actions/reservation-actions";
import { getHotel, getHotelAvailability } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { daysBetween } from "@/lib/date-utils";
import { formatCurrency } from "@/lib/format";

type CheckoutPageProps = Readonly<{
  searchParams?: Promise<{
    hotelId?: string;
    roomId?: string;
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
  }>;
}>;

export default async function ReservationCheckoutPage({ searchParams }: CheckoutPageProps) {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  const sp = searchParams ? await searchParams : undefined;
  const hotelId = sp?.hotelId ?? "";
  const roomId = sp?.roomId ?? "";
  const checkInDate = sp?.checkInDate ?? "";
  const checkOutDate = sp?.checkOutDate ?? "";
  const guestCount = Number(sp?.guestCount ?? "1");

  if (!hotelId || !roomId || !checkInDate || !checkOutDate) {
    return (
      <EmptyState
        title="Checkout incompleto"
        message="Volte para a disponibilidade do hotel e selecione um quarto para continuar."
        actionLabel="Ir para destinos"
        actionHref="/destinations"
      />
    );
  }

  let hotel: Awaited<ReturnType<typeof getHotel>> | undefined;
  let room: Awaited<ReturnType<typeof getHotelAvailability>>[number] | undefined;

  try {
    hotel = await getHotel(hotelId);
    const rooms = await getHotelAvailability(hotelId, { checkInDate, checkOutDate, guestCount });
    room = rooms.find((item) => item.id === roomId);
  } catch {
    return (
      <EmptyState
        title="Nao foi possivel carregar os dados"
        message="Atualize a consulta de disponibilidade e tente novamente."
        actionLabel="Voltar ao hotel"
        actionHref={`/hotels/${hotelId}`}
      />
    );
  }

  if (!hotel || !room) {
    return (
      <EmptyState
        title="Quarto indisponivel"
        message="O quarto selecionado nao esta mais disponivel para este periodo."
        actionLabel="Buscar outro quarto"
        actionHref={`/hotels/${hotelId}/availability?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestCount=${guestCount}`}
      />
    );
  }

  const nights = daysBetween(checkInDate, checkOutDate);
  const total = room.pricePerNight * nights;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Checkout"
        title="Confirme sua reserva"
        subtitle="Revise os detalhes da estadia antes de emitir a confirmacao. O valor final ja considera o numero de noites informado."
      />

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] xl:items-start">
        <div className="space-y-5">
          <AlertBanner
            tone="success"
            title="Reserva confirmada na origem"
            message="No MVP a reserva e criada diretamente com status CONFIRMED, sem etapa de pagamento."
          />
          <SurfaceCard className="space-y-4" variant="reservationSummary">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--hh-text-subtle)">
                Politica de cancelamento
              </p>
              <p className="mt-3 text-[16px] leading-[26px] text-(--hh-text-muted)">
                O cancelamento fica disponivel apenas antes da data de check-in. Depois disso a reserva permanece historica e nao pode ser alterada no MVP.
              </p>
            </div>
            <div className="grid gap-3 rounded-[24px] bg-(--hh-surface) p-5 shadow-(--hh-shadow-sm)">
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-(--hh-text-muted)">Valor da diaria</span>
                <span className="font-medium text-(--hh-text)">{formatCurrency(room.pricePerNight)}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-(--hh-text-muted)">Noites</span>
                <span className="font-medium text-(--hh-text)">{nights}</span>
              </div>
              <div className="flex items-center justify-between gap-4 text-sm">
                <span className="text-(--hh-text-muted)">Hospedes</span>
                <span className="font-medium text-(--hh-text)">{guestCount}</span>
              </div>
            </div>
          </SurfaceCard>
        </div>

        <ConfirmationModal
          title="Resumo da estadia"
          headerTitle={hotel.name}
          headerSubtitle={hotel.address}
          ratingLine={`${hotel.category}  •  ${room.name}`}
          rows={[
            { label: "Quarto", value: room.name },
            { label: "Tipo", value: room.type },
            { label: "Check-in", value: checkInDate },
            { label: "Check-out", value: checkOutDate },
            { label: "Hospedes", value: guestCount },
          ]}
          pricing={[
            {
              label: `${formatCurrency(room.pricePerNight)} x ${nights} noite${nights === 1 ? "" : "s"}`,
              value: formatCurrency(total),
            },
            { label: "Taxas adicionais", value: "Incluidas no MVP" },
          ]}
          total={formatCurrency(total)}
          footer={(
            <>
              <Link
                href={`/hotels/${hotelId}/availability?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestCount=${guestCount}`}
                className="inline-flex h-11 items-center justify-center rounded-[16px] border border-(--hh-border) px-4 text-sm font-medium text-(--hh-text) transition hover:bg-(--hh-surface-muted)"
              >
                Voltar
              </Link>
              <form action={createReservationCheckoutAction}>
                <input type="hidden" name="hotelId" value={hotelId} />
                <input type="hidden" name="roomId" value={roomId} />
                <input type="hidden" name="checkInDate" value={checkInDate} />
                <input type="hidden" name="checkOutDate" value={checkOutDate} />
                <input type="hidden" name="guestCount" value={guestCount} />
                <Button type="submit" variant="primary" size="lg">
                  Confirmar reserva
                </Button>
              </form>
            </>
          )}
        />
      </div>
    </div>
  );
}
