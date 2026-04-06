import { notFound } from "next/navigation";
import { HotelCard, SectionHeader } from "@/components/ui";
import { getDestinationById, getHotelsByDestination } from "@/lib/mock-data";

type DestinationDetailProps = {
  params: Promise<{ id: string }>;
};

export default async function DestinationDetailPage({ params }: DestinationDetailProps) {
  const { id } = await params;
  const destination = getDestinationById(id);
  if (!destination) {
    notFound();
  }

  const hotels = getHotelsByDestination(destination.id);

  return (
    <div className="space-y-6">
      <section className="hh-card overflow-hidden">
        <div
          className="h-64 w-full"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(11,95,255,.8), rgba(22,163,74,.55)), url(${destination.imageUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="p-6">
          <p className="hh-chip bg-[var(--hh-blue)]/10 text-[var(--hh-blue)]">WEB/DestinationDetail</p>
          <h1 className="mt-3 text-3xl font-extrabold text-slate-900">{destination.name}</h1>
          <p className="mt-2 text-sm text-slate-600">
            {destination.city}, {destination.state} - {destination.country}
          </p>
          <p className="mt-4 text-slate-700">{destination.description}</p>
        </div>
      </section>

      <section>
        <SectionHeader
          title="Hoteis vinculados"
          subtitle="Selecione um hotel para ver quartos e disponibilidade."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {hotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>
      </section>
    </div>
  );
}
