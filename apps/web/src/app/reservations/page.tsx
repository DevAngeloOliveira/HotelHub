import { redirect } from "next/navigation";
import { Badge, EmptyState, SectionHeader, SurfaceCard } from "@/components/ui";
import { CancelButton } from "@/components/cancel-button";
import { listMyReservations } from "@/lib/api";
import { getAuthToken } from "@/lib/auth";
import { formatCurrency } from "@/lib/format";

export default async function MyReservationsPage() {
  const token = await getAuthToken();
  if (!token) redirect("/login");

  let reservations: Awaited<ReturnType<typeof listMyReservations>>["content"] = [];
  try {
    const result = await listMyReservations(token);
    reservations = result.content;
  } catch {
    reservations = [];
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        eyebrow="Historico"
        title="Minhas reservas"
        subtitle="Acompanhe o status das reservas confirmadas e cancele apenas as reservas cujo check-in ainda nao ocorreu."
      />

      {reservations.length === 0 ? (
        <EmptyState
          title="Nenhuma reserva encontrada"
          message="Suas proximas reservas aparecerao aqui assim que um checkout for concluido."
          actionLabel="Explorar destinos"
          actionHref="/destinations"
        />
      ) : (
        <div className="grid gap-5">
          {reservations.map((reservation) => {
            const isCancelled = reservation.status === "CANCELLED";
            return (
              <SurfaceCard key={reservation.id} className="grid gap-6 lg:grid-cols-[1.4fr_0.6fr]" variant="default">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--hh-text-subtle)]">
                        Reserva {reservation.id}
                      </p>
                      <h3 className="mt-3 text-[24px] font-semibold text-[var(--hh-text)]">
                        {reservation.checkInDate} ate {reservation.checkOutDate}
                      </h3>
                    </div>
                    <Badge tone={isCancelled ? "error" : "success"}>{reservation.status}</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                    <InfoItem label="Hotel ID" value={reservation.hotelId} />
                    <InfoItem label="Quarto ID" value={reservation.roomId} />
                    <InfoItem label="Hospedes" value={reservation.guestCount} />
                    <InfoItem label="Criada em" value={reservation.createdAt.slice(0, 10)} />
                  </div>
                </div>

                <div className="flex flex-col justify-between gap-4 rounded-[24px] bg-[var(--hh-surface-muted)] p-5">
                  <div>
                    <p className="text-sm text-[var(--hh-text-muted)]">Valor total</p>
                    <p className="mt-2 text-[32px] font-semibold text-[var(--hh-primary-action)]">
                      {formatCurrency(reservation.totalAmount)}
                    </p>
                    {reservation.cancelledAt ? (
                      <p className="mt-2 text-sm text-[var(--hh-text-muted)]">
                        Cancelada em {reservation.cancelledAt.slice(0, 10)}
                      </p>
                    ) : null}
                  </div>

                  {isCancelled ? (
                    <span className="inline-flex h-11 items-center justify-center rounded-[16px] bg-white px-4 text-sm font-medium text-[var(--hh-text-muted)]">
                      Reserva encerrada
                    </span>
                  ) : (
                    <CancelButton reservationId={reservation.id} />
                  )}
                </div>
              </SurfaceCard>
            );
          })}
        </div>
      )}
    </div>
  );
}

function InfoItem({ label, value }: Readonly<{ label: string; value: string | number }>) {
  return (
    <div className="rounded-[20px] bg-[var(--hh-surface-muted)] p-4">
      <p className="text-xs uppercase tracking-[0.16em] text-[var(--hh-text-subtle)]">{label}</p>
      <p className="mt-2 break-all text-sm font-medium text-[var(--hh-text)]">{value}</p>
    </div>
  );
}
