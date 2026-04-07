import { Button, DestinationCard, EmptyState, SectionHeader, SurfaceCard, TextField } from "@/components/ui";
import { listDestinations } from "@/lib/api";

type DestinationsPageProps = Readonly<{
  searchParams?: Promise<{
    name?: string;
    city?: string;
    state?: string;
    country?: string;
    category?: string;
  }>;
}>;

export default async function DestinationsPage({ searchParams }: DestinationsPageProps) {
  const sp = searchParams ? await searchParams : undefined;

  let destinations: Awaited<ReturnType<typeof listDestinations>>["content"] = [];
  let totalElements = 0;

  try {
    const result = await listDestinations({
      name: sp?.name?.trim() || undefined,
      city: sp?.city?.trim() || undefined,
      state: sp?.state?.trim() || undefined,
      country: sp?.country?.trim() || undefined,
      category: sp?.category?.trim() || undefined,
      size: 24,
    });
    destinations = result.content;
    totalElements = result.totalElements;
  } catch {
    // API unavailable
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Pesquisa"
        title="Encontre o destino certo"
        subtitle={`${totalElements} destino${totalElements === 1 ? "" : "s"} encontrado${totalElements === 1 ? "" : "s"} com os filtros atuais.`}
      />

      <SurfaceCard className="rounded-[28px]">
        <form className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <TextField name="name" label="Nome" defaultValue={sp?.name} placeholder="Buscar por nome" />
          <TextField name="city" label="Cidade" defaultValue={sp?.city} placeholder="Buscar por cidade" />
          <TextField name="state" label="Estado" defaultValue={sp?.state} placeholder="UF" />
          <TextField name="country" label="Pais" defaultValue={sp?.country} placeholder="Brasil" />
          <div className="flex flex-col gap-3">
            <TextField
              name="category"
              label="Categoria"
              defaultValue={sp?.category}
              placeholder="Praia, Serra..."
            />
            <Button type="submit" variant="primary" className="w-full">
              Filtrar catalogo
            </Button>
          </div>
        </form>
      </SurfaceCard>

      {destinations.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {destinations.map((destination) => (
            <DestinationCard key={destination.id} destination={destination} />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No results found"
          message="Nao encontramos destinos compativeis com a combinacao atual. Ajuste cidade, pais ou categoria."
          actionLabel="Clear all filters"
          actionHref="/destinations"
          secondaryLabel="Browse all destinations ->"
          secondaryHref="/destinations"
        />
      )}
    </div>
  );
}
