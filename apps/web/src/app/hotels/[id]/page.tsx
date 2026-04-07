import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertBanner, Badge, Button, RoomCard, SectionHeader, SurfaceCard } from "@/components/ui";
import { addDays, toIsoDate } from "@/lib/date-utils";
import { ApiError, getHotel } from "@/lib/api";

type HotelDetailProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function HotelDetailPage({ params }: HotelDetailProps) {
  const { id } = await params;

  let hotel: Awaited<ReturnType<typeof getHotel>>;
  try {
    hotel = await getHotel(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const today = new Date();
  const checkInDate = toIsoDate(addDays(today, 7));
  const checkOutDate = toIsoDate(addDays(today, 10));

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden p-0" variant="hotel">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="bg-[linear-gradient(135deg,var(--hh-primary-700),var(--hh-primary-500)_60%,var(--hh-accent-gold-500)_140%)] px-8 py-10 text-white md:px-10 md:py-12">
            <div className="max-w-2xl space-y-5">
              <Badge tone="premium" className="bg-white/15 text-white">
                {hotel.category}
              </Badge>
              <h1 className="hh-display text-[44px] leading-12.5 md:text-[52px] md:leading-14.5">
                {hotel.name}
              </h1>
              <p className="max-w-xl text-[16px] leading-6.5 text-white/78">{hotel.address}</p>
              {hotel.description ? (
                <p className="max-w-2xl text-[16px] leading-7 text-white/84">{hotel.description}</p>
              ) : null}
              <div className="flex flex-wrap gap-3">
                <Button
                  href={`/hotels/${hotel.id}/availability?checkInDate=${checkInDate}&checkOutDate=${checkOutDate}&guestCount=2`}
                  variant="accentGold"
                  size="lg"
                >
                  Ver disponibilidade
                </Button>
                <Button href="/destinations" variant="ghost" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/16">
                  Voltar ao catálogo
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-6 bg-(--hh-surface-muted) px-8 py-10 md:px-10 md:py-12">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-(--hh-text-subtle)">
                Amenidades
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {hotel.amenities.length > 0 ? (
                  hotel.amenities.map((amenity) => (
                    <Badge key={amenity} tone="new" className="h-9.5 px-4 text-[13px]">
                      {amenity}
                    </Badge>
                  ))
                ) : (
                  <Badge tone="info">Sem amenidades cadastradas</Badge>
                )}
              </div>
            </div>

            <div className="grid gap-4 rounded-3xl bg-white p-5 shadow-(--hh-shadow-sm)">
              <div>
                <p className="text-sm text-(--hh-text-subtle)">Contato</p>
                <p className="mt-2 text-[16px] font-medium text-(--hh-text)">{hotel.contactPhone}</p>
                <p className="text-[16px] text-(--hh-text-muted)">{hotel.contactEmail}</p>
              </div>
              <AlertBanner
                tone="info"
                title="Consulta em tempo real"
                message="A disponibilidade considera quantidade por tipo de quarto e bloqueia overbooking no checkout."
              />
            </div>
          </div>
        </div>
      </SurfaceCard>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Inventário"
          title="Quartos deste hotel"
          subtitle="Consulte as categorias disponíveis e avance para o filtro de datas quando quiser validar estoque real."
        />

        {hotel.rooms.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {hotel.rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        ) : (
          <SurfaceCard className="flex min-h-55 flex-col items-center justify-center gap-4 text-center">
            <p className="hh-display text-[32px] leading-9.5 text-(--hh-text)">Sem quartos ativos</p>
            <p className="max-w-md text-[15px] leading-6 text-(--hh-text-muted)">
              O inventário deste hotel ainda não foi publicado para consulta pública.
            </p>
            <Link href="/destinations" className="text-sm font-medium text-(--hh-primary-action) hover:text-(--hh-primary-action-hover)">
              Explorar outros destinos
            </Link>
          </SurfaceCard>
        )}
      </section>
    </div>
  );
}
