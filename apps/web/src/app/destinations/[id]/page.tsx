import { notFound } from "next/navigation";
import { Badge, HotelCard, SectionHeader, SurfaceCard } from "@/components/ui";
import { ApiError, getDestination } from "@/lib/api";

type DestinationDetailProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function DestinationDetailPage({ params }: DestinationDetailProps) {
  const { id } = await params;

  let destination: Awaited<ReturnType<typeof getDestination>>;
  try {
    destination = await getDestination(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  return (
    <div className="space-y-8">
      <SurfaceCard className="overflow-hidden p-0" variant="destination">
        <div
          className="relative h-72 w-full"
          style={{
            backgroundImage: `linear-gradient(120deg, rgba(23,43,103,0.84), rgba(47,91,234,0.58), rgba(216,163,23,0.24)), url(${destination.featuredImageUrl})`,
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div className="absolute inset-x-0 bottom-0 flex flex-wrap items-end justify-between gap-4 p-8 text-white">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-white/72">
                Detalhes do destino
              </p>
              <h1 className="hh-display mt-4 text-[52px] leading-14.5">{destination.name}</h1>
            </div>
            <Badge tone="premium" className="bg-white/16 text-white backdrop-blur">
              {destination.category}
            </Badge>
          </div>
        </div>

        <div className="grid gap-6 p-8 md:grid-cols-[1.4fr_0.6fr]">
          <div>
            <p className="text-[16px] leading-6.5 text-(--hh-text-muted)">
              {destination.description}
            </p>
          </div>
          <div className="grid gap-3 rounded-3xl bg-(--hh-surface-muted) p-5">
            <div>
              <p className="text-sm text-(--hh-text-subtle)">Cidade</p>
              <p className="text-[18px] font-medium text-(--hh-text)">{destination.city}</p>
            </div>
            <div>
              <p className="text-sm text-(--hh-text-subtle)">Estado</p>
              <p className="text-[18px] font-medium text-(--hh-text)">{destination.state}</p>
            </div>
            <div>
              <p className="text-sm text-(--hh-text-subtle)">País</p>
              <p className="text-[18px] font-medium text-(--hh-text)">{destination.country}</p>
            </div>
          </div>
        </div>
      </SurfaceCard>

      <section className="space-y-6">
        <SectionHeader
          eyebrow="Hotéis vinculados"
          title="Escolha sua estadia"
          subtitle="Todos os hotéis abaixo estão ativos e podem seguir para consulta de quartos e disponibilidade."
        />

        {destination.hotels.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2">
            {destination.hotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : null}
      </section>
    </div>
  );
}
