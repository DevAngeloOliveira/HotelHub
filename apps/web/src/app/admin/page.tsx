import { SectionHeader } from "@/components/ui";
import { destinations, hotels, myReservations, rooms } from "@/lib/mock-data";

const adminCards = [
  { title: "Destinos", value: destinations.length, accent: "blue" },
  { title: "Hotéis", value: hotels.length, accent: "green" },
  { title: "Quartos", value: rooms.length, accent: "blue" },
  {
    title: "Reservas Ativas",
    value: myReservations.filter((item) => item.status === "CONFIRMED").length,
    accent: "green",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <SectionHeader
        title="WEB/AdminDashboard"
        subtitle="Visão operacional para gestão de destinos, hotéis, quartos, reservas e usuários."
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {adminCards.map((card) => (
          <article key={card.title} className="hh-card p-5">
            <p className="text-sm text-slate-500">{card.title}</p>
            <p
              className={[
                "mt-2 text-3xl font-extrabold",
                card.accent === "blue" ? "text-[var(--hh-blue)]" : "text-[var(--hh-green)]",
              ].join(" ")}
            >
              {card.value}
            </p>
          </article>
        ))}
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        <article className="hh-card p-5">
          <h3 className="text-lg font-semibold text-slate-900">CRUD Destinos</h3>
          <p className="mt-2 text-sm text-slate-600">
            Criar, editar e inativar destinos do catálogo público.
          </p>
          <button className="mt-4 rounded-lg bg-[var(--hh-blue)] px-3 py-2 text-xs font-semibold text-white">
            Gerenciar destinos
          </button>
        </article>

        <article className="hh-card p-5">
          <h3 className="text-lg font-semibold text-slate-900">CRUD Hotéis e Quartos</h3>
          <p className="mt-2 text-sm text-slate-600">
            Operações de catálogo, preço e capacidade por unidade.
          </p>
          <button className="mt-4 rounded-lg bg-[var(--hh-green)] px-3 py-2 text-xs font-semibold text-white">
            Gerenciar hotéis/quartos
          </button>
        </article>

        <article className="hh-card p-5">
          <h3 className="text-lg font-semibold text-slate-900">Reservas e Usuários</h3>
          <p className="mt-2 text-sm text-slate-600">
            Acompanhar reservas por status e consultar usuários cadastrados.
          </p>
          <button className="mt-4 rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700">
            Abrir gestão
          </button>
        </article>
      </section>
    </div>
  );
}
