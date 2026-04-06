import Link from "next/link";
import { destinations } from "@/lib/mock-data";
import { DestinationCard, HeroPanel, SearchStrip, SectionHeader } from "@/components/ui";

export default function HomePage() {
  const featured = destinations.filter((item) => item.featured);

  return (
    <div className="space-y-8">
      <HeroPanel />
      <SearchStrip />

      <section>
        <SectionHeader
          title="Destinos em destaque"
          subtitle="Seleção inicial baseada no protótipo Figma e no fluxo WEB/DestinationsList."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {featured.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      </section>

      <section className="hh-card flex flex-wrap items-center justify-between gap-4 p-5">
        <div>
          <p className="text-sm font-semibold text-[var(--hh-blue)]">WEB/AdminDashboard</p>
          <h3 className="text-xl font-bold text-slate-900">Catálogo e reservas em um painel único</h3>
          <p className="text-sm text-slate-600">
            Acompanhe destinos, hotéis, quartos e reservas em visão operacional.
          </p>
        </div>
        <Link
          href="/admin"
          className="rounded-xl bg-[var(--hh-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hh-green-700)]"
        >
          Ir para Admin
        </Link>
      </section>
    </div>
  );
}
