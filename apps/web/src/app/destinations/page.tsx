import { DestinationCard, EmptyState, SectionHeader } from "@/components/ui";
import { destinations } from "@/lib/mock-data";

type DestinationsPageProps = {
  searchParams?: Promise<{
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    category?: string;
  }>;
};

function normalize(value?: string): string {
  return (value ?? "").trim().toLowerCase();
}

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;

  const name = normalize(resolvedSearchParams?.name);
  const city = normalize(resolvedSearchParams?.city);
  const state = normalize(resolvedSearchParams?.state);
  const country = normalize(resolvedSearchParams?.country);
  const category = normalize(resolvedSearchParams?.category);

  const filtered = destinations.filter((destination) => {
    if (name && !destination.name.toLowerCase().includes(name)) {
      return false;
    }
    if (city && !destination.city.toLowerCase().includes(city)) {
      return false;
    }
    if (state && !destination.state.toLowerCase().includes(state)) {
      return false;
    }
    if (country && !destination.country.toLowerCase().includes(country)) {
      return false;
    }
    if (category && !destination.category.toLowerCase().includes(category)) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <SectionHeader
        title="WEB/DestinationsList"
        subtitle="Grid paginado de destinos com filtros por nome, cidade, estado, pais e categoria."
      />

      <form className="hh-card grid gap-3 p-4 md:grid-cols-5">
        <input
          name="name"
          defaultValue={resolvedSearchParams?.name}
          placeholder="Nome"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <input
          name="city"
          defaultValue={resolvedSearchParams?.city}
          placeholder="Cidade"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <input
          name="state"
          defaultValue={resolvedSearchParams?.state}
          placeholder="Estado"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <input
          name="country"
          defaultValue={resolvedSearchParams?.country}
          placeholder="Pais"
          className="rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        />
        <div className="flex gap-2">
          <input
            name="category"
            defaultValue={resolvedSearchParams?.category}
            placeholder="Categoria"
            className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
          />
          <button
            type="submit"
            className="rounded-xl bg-[var(--hh-blue)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hh-blue-700)]"
          >
            Filtrar
          </button>
        </div>
      </form>

      {filtered.length > 0 ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="Nenhum destino encontrado"
          message="Ajuste os filtros para buscar outros destinos disponiveis."
        />
      )}
    </div>
  );
}
