import Link from "next/link";
import { redirect } from "next/navigation";
import { AlertBanner, Badge, Button, MetricCard, SectionHeader, SurfaceCard } from "@/components/ui";
import { getMe, listAdminReservations, listAdminUsers, listDestinations, listHotels } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  let user: Awaited<ReturnType<typeof getMe>> | undefined;
  try {
    user = await getMe(token);
  } catch {
    redirect("/login");
  }

  if (user?.role !== "ADMIN") {
    return (
      <SurfaceCard className="mx-auto flex max-w-170 flex-col items-center gap-4 p-10 text-center" variant="default">
        <Badge tone="error">Acesso restrito</Badge>
        <h2 className="hh-display text-9 leading-10.5 text-(--hh-text)">Area administrativa bloqueada</h2>
        <p className="max-w-xl text-3.75 leading-6 text-(--hh-text-muted)">
          Apenas perfis ADMIN podem consultar operacoes, estoque e acesso rapido aos endpoints internos.
        </p>
        <Button href="/" variant="primary">Voltar para a home</Button>
      </SurfaceCard>
    );
  }

  const [destinationsResult, hotelsResult, reservationsResult, usersResult] = await Promise.allSettled([
    listDestinations({ size: 1 }),
    listHotels({ size: 1 }),
    listAdminReservations(token, { size: 1 }),
    listAdminUsers(token, { size: 1 }),
  ]);

  const totalDestinations = destinationsResult.status === "fulfilled" ? destinationsResult.value.totalElements : 0;
  const totalHotels = hotelsResult.status === "fulfilled" ? hotelsResult.value.totalElements : 0;
  const totalReservations = reservationsResult.status === "fulfilled" ? reservationsResult.value.totalElements : 0;
  const totalUsers = usersResult.status === "fulfilled" ? usersResult.value.totalElements : 0;

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Central de operações"
        title="Painel de administração"
        subtitle="Painel inicial para operacao do catalogo, reservas e usuarios. Os CRUDs continuam expostos pela API documentada e o front fica pronto para crescer sobre estes contratos."
      />

      <AlertBanner
        tone="info"
        title="Escopo atual"
        message="Esta entrega cobre a camada visual do dashboard, navegacao e links operacionais. Os CRUDs administrativos permanecem consumiveis pela API REST ja documentada."
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <MetricCard title="Destinos" value={totalDestinations} accent="primary" />
        <MetricCard title="Hoteis" value={totalHotels} accent="accent" />
        <MetricCard title="Reservas" value={totalReservations} accent="success" />
        <MetricCard title="Usuarios" value={totalUsers} accent="primary" />
      </section>

      <section className="grid gap-5 xl:grid-cols-3">
        <AdminActionCard
          title="Destinos"
          description="Criação, atualização e inativação de destinos do catálogo público."
          href="/api/v1/swagger-ui.html#/admin-destination-controller"
          cta="Abrir endpoints"
          tone="primary"
        />
        <AdminActionCard
          title="Hotéis e quartos"
          description="Catálogo, capacidade e status operacional de hotéis e quartos."
          href="/api/v1/swagger-ui.html#/admin-hotel-controller"
          cta="Abrir endpoints"
          tone="accentGold"
        />
        <AdminActionCard
          title="Reservas e usuários"
          description="Consulta global de reservas, propriedade e usuários cadastrados."
          href="/api/v1/swagger-ui.html#/admin-reservation-controller"
          cta="Abrir swagger"
          tone="secondary"
        />
      </section>
    </div>
  );
}

function AdminActionCard({
  title,
  description,
  href,
  cta,
  tone,
}: Readonly<{
  title: string;
  description: string;
  href: string;
  cta: string;
  tone: "primary" | "secondary" | "accentGold";
}>) {
  return (
    <SurfaceCard className="space-y-5" variant="default">
      <div className="space-y-3">
        <p className="text-3 font-semibold uppercase tracking-[0.24em] text-(--hh-text-subtle)">Modulo</p>
        <h3 className="text-6 font-semibold text-(--hh-text)">{title}</h3>
        <p className="text-3.75 leading-6 text-(--hh-text-muted)">{description}</p>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-(--hh-border) pt-4">
        <Link href={href} target="_blank" rel="noreferrer" className="text-sm font-medium text-(--hh-primary-action) hover:text-(--hh-primary-action-hover)">
          Swagger
        </Link>
        <Button href={href} variant={tone}>
          {cta}
        </Button>
      </div>
    </SurfaceCard>
  );
}
