import { notFound } from "next/navigation";
import { AlertBanner, Button, DateRangeField, EmptyState, RoomCard, SectionHeader, SurfaceCard } from "@/components/ui";
import { addDays, toIsoDate } from "@/lib/date-utils";
import { ApiError, getHotel, getHotelAvailability } from "@/lib/api";

type AvailabilityPageProps = Readonly<{
  params: Promise<{ id: string }>;
  searchParams?: Promise<{
    checkInDate?: string;
    checkOutDate?: string;
    guestCount?: string;
  }>;
}>;

export default async function HotelAvailabilityPage({ params, searchParams }: AvailabilityPageProps) {
  const { id } = await params;
  const sp = searchParams ? await searchParams : undefined;

  let hotel: Awaited<ReturnType<typeof getHotel>>;
  try {
    hotel = await getHotel(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const today = new Date();
  const checkInDate = sp?.checkInDate ?? toIsoDate(addDays(today, 7));
  const checkOutDate = sp?.checkOutDate ?? toIsoDate(addDays(today, 10));
  const guestCount = Number(sp?.guestCount ?? "2");

  let rooms: Awaited<ReturnType<typeof getHotelAvailability>> = [];
  try {
    rooms = await getHotelAvailability(id, { checkInDate, checkOutDate, guestCount });
  } catch {
    rooms = [];
  }

  return (
    <div className="space-y-8">
      <SurfaceCard className="rounded-[28px]" variant="reservationSummary">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <div className="space-y-4">
            <SectionHeader
              eyebrow="Disponibilidade"
              title={hotel.name}
              subtitle="Selecione o período e a ocupação. O retorno desta tela já considera quantidade disponível por tipo de quarto."
            />
            <AlertBanner
              tone="warning"
              title="Regra de estoque"
              message="Apenas quartos reserváveis no período informado são exibidos. Reservas confirmadas sobrepostas reduzem o saldo disponível."
            />
          </div>

          <form className="grid gap-4 rounded-3xl bg-(--hh-surface) p-5 shadow-(--hh-shadow-sm)">
            <DateRangeField
              className="md:grid-cols-1"
              checkInDefaultValue={checkInDate}
              checkOutDefaultValue={checkOutDate}
              guestCountDefaultValue={guestCount}
            />
            <Button type="submit" variant="primary" size="lg" className="w-full">
              Atualizar consulta
            </Button>
          </form>
        </div>
      </SurfaceCard>

      {rooms.length > 0 ? (
        <section className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-(--hh-text-muted)">
              {rooms.length} categoria{rooms.length === 1 ? "" : "s"} encontrada{rooms.length === 1 ? "" : "s"} para {guestCount} hospede{guestCount === 1 ? "" : "s"}.
            </p>
            <Button href={`/hotels/${hotel.id}`} variant="secondary">
              Ver detalhes do hotel
            </Button>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {rooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                checkInDate={checkInDate}
                checkOutDate={checkOutDate}
                guestCount={guestCount}
              />
            ))}
          </div>
        </section>
      ) : (
        <EmptyState
          title="Nenhum quarto disponível"
          message="Tente um período diferente ou reduza a ocupação para encontrar novas opções."
          actionLabel="Ajustar filtros"
          actionHref={`/hotels/${hotel.id}/availability?checkInDate=${toIsoDate(addDays(today, 14))}&checkOutDate=${toIsoDate(addDays(today, 17))}&guestCount=2`}
          secondaryLabel="Voltar para o hotel"
          secondaryHref={`/hotels/${hotel.id}`}
        />
      )}
    </div>
  );
}
