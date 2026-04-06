import Link from "next/link";
import { formatCurrency } from "@/lib/format";
import type { Destination, Hotel, Room } from "@/lib/types";

export function SectionHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-5">
      <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
    </div>
  );
}

export function HeroPanel() {
  return (
    <section className="hh-card relative overflow-hidden p-8">
      <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-[var(--hh-green)]/15" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-56 w-56 rounded-full bg-[var(--hh-blue)]/15" />

      <div className="relative">
        <p className="hh-chip bg-[var(--hh-blue)]/10 text-[var(--hh-blue)]">WEB/Home</p>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold tracking-tight text-slate-900">
          Descubra destinos, compare hotéis e reserve com segurança.
        </h1>
        <p className="mt-3 max-w-2xl text-slate-600">
          Interface baseada no protótipo Figma com foco em navegação rápida para web e futura
          integração com a API HotelHub.
        </p>
      </div>
    </section>
  );
}

export function SearchStrip() {
  return (
    <section className="hh-card mt-6 grid gap-3 p-4 md:grid-cols-5">
      <input
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        placeholder="Destino"
      />
      <input
        type="date"
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
      />
      <input
        type="date"
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
      />
      <input
        type="number"
        min={1}
        className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-[var(--hh-blue)] focus:ring-2 focus:ring-[var(--hh-blue)]/20"
        placeholder="Hóspedes"
      />
      <button className="rounded-xl bg-[var(--hh-green)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--hh-green-700)]">
        Buscar
      </button>
    </section>
  );
}

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <article className="hh-card overflow-hidden">
      <div
        className="h-40 w-full bg-slate-300"
        style={{
          backgroundImage: `linear-gradient(to top, rgba(15,23,42,.55), rgba(15,23,42,.15)), url(${destination.imageUrl})`,
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      />
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-900">{destination.name}</h3>
          <span className="hh-chip bg-[var(--hh-blue)]/10 text-[var(--hh-blue)]">
            {destination.category}
          </span>
        </div>
        <p className="text-sm text-slate-600">
          {destination.city}, {destination.state} • {destination.country}
        </p>
        <p className="mt-2 line-clamp-2 text-sm text-slate-600">{destination.description}</p>
        <div className="mt-4 flex gap-2">
          <Link
            href={`/destinations/${destination.id}`}
            className="rounded-lg bg-[var(--hh-blue)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--hh-blue-700)]"
          >
            Ver destino
          </Link>
          <Link
            href={`/destinations?name=${destination.name}`}
            className="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Similar
          </Link>
        </div>
      </div>
    </article>
  );
}

export function HotelCard({ hotel }: { hotel: Hotel }) {
  return (
    <article className="hh-card p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-slate-900">{hotel.name}</h3>
        <span className="hh-chip bg-[var(--hh-green)]/15 text-[var(--hh-green-700)]">
          {hotel.category}
        </span>
      </div>
      <p className="text-sm text-slate-600">{hotel.address}</p>
      <p className="mt-2 line-clamp-2 text-sm text-slate-600">{hotel.description}</p>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {hotel.amenities.map((amenity) => (
          <span key={amenity} className="hh-chip bg-slate-100 text-slate-700">
            {amenity}
          </span>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <Link
          href={`/hotels/${hotel.id}`}
          className="rounded-lg bg-[var(--hh-blue)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--hh-blue-700)]"
        >
          Ver hotel
        </Link>
      </div>
    </article>
  );
}

export function RoomCard({
  room,
  availableUnits,
  checkInDate,
  checkOutDate,
  guestCount,
}: {
  room: Room;
  availableUnits?: number;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
}) {
  return (
    <article className="hh-card p-4">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{room.name}</h3>
          <p className="text-sm text-slate-600">{room.type}</p>
        </div>
        <span className="hh-chip bg-[var(--hh-blue)]/10 text-[var(--hh-blue)]">
          {formatCurrency(room.pricePerNight)}/noite
        </span>
      </div>

      <p className="text-sm text-slate-600">{room.description}</p>
      <p className="mt-2 text-sm text-slate-700">
        Capacidade: <strong>{room.capacity}</strong> • Estoque: <strong>{room.quantity}</strong>
      </p>

      {typeof availableUnits === "number" ? (
        <p className="mt-2 text-sm text-[var(--hh-green-700)]">
          Disponíveis no período: <strong>{availableUnits}</strong>
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-2">
        <Link
          href={{
            pathname: "/reservations/checkout",
            query: {
              roomId: room.id,
              checkInDate,
              checkOutDate,
              guestCount,
            },
          }}
          className="rounded-lg bg-[var(--hh-green)] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[var(--hh-green-700)]"
        >
          Reservar
        </Link>
      </div>
    </article>
  );
}

export function EmptyState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <div className="hh-card flex flex-col items-center justify-center gap-2 p-10 text-center">
      <div className="rounded-full bg-[var(--hh-blue)]/10 px-3 py-1 text-xs font-semibold text-[var(--hh-blue)]">
        EmptyState
      </div>
      <h3 className="text-xl font-semibold text-slate-900">{title}</h3>
      <p className="max-w-xl text-sm text-slate-600">{message}</p>
    </div>
  );
}
