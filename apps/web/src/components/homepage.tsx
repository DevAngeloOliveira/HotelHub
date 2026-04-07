"use client";

import Link from "next/link";
import { buttonClassName } from "@/components/ui";
import { cx } from "@/lib/cx";

export type HomeFeaturedDestination = {
  id: string;
  href: string;
  city: string;
  country: string;
  imageUrl: string;
  availabilityLabel: string;
  priceLabel: string;
};

export type HomeRecommendedHotel = {
  id: string;
  href: string;
  name: string;
  imageUrl: string;
  badge: string;
  badgeTone: "gold" | "success" | "primary";
  rating: string;
  reviews: string;
  location: string;
  amenities: string[];
  priceLabel: string;
};

export type HomeSearchDefaults = {
  destination?: string;
  checkInDate: string;
  checkOutDate: string;
  guestCount: number;
};

const whyHotelHub = [
  {
    icon: "S",
    title: "Busca inteligente",
    description: "Filtre por preço, classificação, comodidades e política de cancelamento em segundos.",
    iconClassName: "bg-[rgba(59,102,255,0.20)]",
  },
  {
    icon: "$",
    title: "Melhor preço garantido",
    description: "Igualamos qualquer tarifa mais baixa encontrada em outro lugar, sem exceções.",
    iconClassName: "bg-[rgba(201,151,28,0.20)]",
  },
  {
    icon: "C",
    title: "Cancelamento gratuito",
    description: "A maioria das propriedades oferece cancelamento gratuito até 24 horas antes do check-in.",
    iconClassName: "bg-[rgba(31,169,113,0.20)]",
  },
  {
    icon: "24",
    title: "Suporte 24/7",
    description: "Nossa equipe sempre está disponível para ajudá-lo antes, durante e depois da sua estadia.",
    iconClassName: "bg-[rgba(214,69,69,0.20)]",
  },
] as const;

const testimonials = [
  {
    rating: "5/5",
    quote:
      '"Hospedagem impressionante. A reserva foi perfeita e o hotel superou todas as expectativas. Definitivamente usarei o HotelHub novamente."',
    initials: "S",
    name: "Sarah Mitchell",
    hotel: "Grand Palace Resort, Santorini",
    avatarClassName: "from-[#1F4FD6] to-[#3366FF]",
  },
  {
    rating: "5/5",
    quote:
      '"A plataforma é incrivelmente intuitiva. Encontrei e reservei um hotel 5 estrelas em menos de 3 minutos. O preço era imbatível."',
    initials: "J",
    name: "James Thornton",
    hotel: "Maison Elegante, Paris",
    avatarClassName: "from-[#C9971C] to-[#E6B93A]",
  },
  {
    rating: "5/5",
    quote:
      '"Serviço incrível. Os filtros me ajudaram a encontrar exatamente o que procurava: pet-friendly, café da manhã gratuito e vista para o oceano. Perfeito."',
    initials: "A",
    name: "Ana Ferreira",
    hotel: "Azure Maldives Overwater",
    avatarClassName: "from-[#1FA971] to-[#22D68F]",
  },
] as const;

export function HomeHero({ defaults }: Readonly<{ defaults: HomeSearchDefaults }>) {
  return (
    <section className="relative min-h-175 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,33,87,0.55)_0%,rgba(14,33,87,0.30)_60%,rgba(14,33,87,0.70)_100%)]" />

      <div className="relative mx-auto flex min-h-175 w-full max-w-360 flex-col items-center justify-center gap-5 px-5 text-center md:px-8 xl:px-30">
        <div className="rounded-full border border-[rgba(201,151,28,0.50)] bg-[rgba(201,151,28,0.20)] px-4.25 py-1.75">
          <span className="text-xs uppercase tracking-wider text-[#F4CB57]">
            Hospedagens luxuosas, reservas inteligentes
          </span>
        </div>

        <h1 className="hh-display max-w-190 text-10.5 leading-12 text-white md:text-14 md:leading-16 xl:text-16 xl:leading-18">
          Encontre sua hospedagem perfeita em qualquer lugar do mundo
        </h1>

        <p className="max-w-130 text-lg leading-7 text-white/80">
          Pesquise hotéis premium, compare quartos e finalize sua reserva com clareza e confiança.
        </p>

        <form
          action="/destinations"
          className="mt-2 w-full max-w-225 rounded-2xl bg-white p-2 shadow-[0_20px_50px_rgba(20,24,31,0.30)]"
        >
          <div className="grid gap-2 lg:grid-cols-[1.35fr_1fr_1fr_0.78fr_auto]">
            <SearchField
              label="Destino"
              name="name"
              type="text"
              defaultValue={defaults.destination}
              placeholder="Para onde você vai?"
              withDivider
            />
            <SearchField
              label="Check-in"
              name="checkInDate"
              type="date"
              defaultValue={defaults.checkInDate}
              withDivider
            />
            <SearchField
              label="Check-out"
              name="checkOutDate"
              type="date"
              defaultValue={defaults.checkOutDate}
              withDivider
            />
            <SearchField
              label="Hóspedes"
              name="guestCount"
              type="number"
              defaultValue={defaults.guestCount}
              min={1}
              placeholder="2 hóspedes"
            />
            <div className="flex items-center justify-center px-1 py-1">
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-lg bg-[#1F4FD6] px-7 text-sm font-medium leading-5.625 text-white transition hover:bg-[#173ea9]"
              >
                Pesquisar
              </button>
            </div>
          </div>
        </form>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-6 text-xs leading-4.875 text-white/70">
          <span>+ Cancelamento gratuito</span>
          <span>+ Melhor preço garantido</span>
          <span>+ Suporte 24/7</span>
        </div>
      </div>
    </section>
  );
}

export function HomeSectionHeader({
  eyebrow,
  title,
  linkLabel,
  linkHref,
  inverted = false,
  centered = false,
}: Readonly<{
  eyebrow: string;
  title: string;
  linkLabel?: string;
  linkHref?: string;
  inverted?: boolean;
  centered?: boolean;
}>) {
  return (
    <div
      className={cx(
        "flex flex-col gap-4 md:flex-row md:items-end md:justify-between",
        centered && "items-center text-center md:flex-col md:items-center",
      )}
    >
      <div className="space-y-2">
        <p
          className={cx(
            "text-xs uppercase tracking-wider",
            inverted ? "text-[#8CB2FF]" : "text-[#7A8799]",
          )}
        >
          {eyebrow}
        </p>
        <h2 className={cx("hh-display text-10 leading-15", inverted ? "text-white" : "text-[#14181F]")}> 
          {title}
        </h2>
      </div>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className={cx(
            "text-sm leading-5.25 transition hover:opacity-80",
            inverted ? "text-white/80" : "text-[#1F4FD6]",
          )}
        >
          {linkLabel}
        </Link>
      ) : null}
    </div>
  );
}

export function FeaturedDestinationCard({
  destination,
}: Readonly<{ destination: HomeFeaturedDestination }>) {
  return (
    <Link
      href={destination.href}
      className="group overflow-hidden rounded-2xl bg-white shadow-(--hh-shadow-sm) transition hover:-translate-y-1 hover:shadow-(--hh-shadow-md)"
    >
      <div
        className="relative h-55 bg-cover bg-center"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,31,0.08),rgba(20,24,31,0.20))]" />
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs leading-4.125 text-[#14181F]">
          {destination.country}
        </div>
      </div>
      <div className="space-y-1 px-5 py-4">
        <h3 className="text-4.5 font-bold leading-6.75 text-[#14181F]">{destination.city}</h3>
        <p className="text-xs leading-4.875 text-[#7A8799]">{destination.availabilityLabel}</p>
        <p className="pt-2 text-xs leading-4.875 text-[#5C6675]">
          A partir de <span className="text-4 font-bold leading-6 text-[#1F4FD6]">{destination.priceLabel}</span>/noite
        </p>
      </div>
    </Link>
  );
}

export function RecommendedHotelCard({
  hotel,
}: Readonly<{ hotel: HomeRecommendedHotel }>) {
  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow-(--hh-shadow-sm) transition hover:-translate-y-1 hover:shadow-(--hh-shadow-md)">
      <div
        className="relative h-60 bg-cover bg-center"
        style={{ backgroundImage: `url(${hotel.imageUrl})` }}
      >
        <div
          className={cx(
            "absolute left-4 top-4 rounded-full px-3 py-1.25 text-xs font-bold leading-4.125",
            hotel.badgeTone === "gold" && "bg-[#C9971C] text-white",
            hotel.badgeTone === "success" && "bg-[#1FA971] text-white",
            hotel.badgeTone === "primary" && "bg-[#EEF4FF] text-[#1F4FD6]",
          )}
        >
          {hotel.badge}
        </div>
        <button
          type="button"
          aria-label={`Favorite ${hotel.name}`}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-4 text-[#14181F] shadow-(--hh-shadow-sm)"
        >
          Fav
        </button>
      </div>

      <div className="space-y-3 px-6 py-5">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-4.5 font-bold leading-6.75 text-[#14181F]">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-xs leading-4.875">
            <span className="text-[#E6B93A]">*</span>
            <span className="text-[#14181F]">{hotel.rating}</span>
            <span className="text-xs leading-4.5 text-[#7A8799]">({hotel.reviews})</span>
          </div>
        </div>

        <p className="text-xs leading-4.875 text-[#7A8799]">{hotel.location}</p>

        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-[#F1F3F7] px-2.5 py-1 text-xs font-medium leading-4.125 text-[#5C6675]"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-xs leading-4.875 text-[#7A8799]">
            <span className="text-5.5 font-bold leading-8.25 text-[#14181F]">{hotel.priceLabel}</span>/night
          </p>
          <Link href={hotel.href} className={cx(buttonClassName("primary", "sm"), "rounded-xl px-5 text-xs font-normal")}>
            Ver detalhes
          </Link>
        </div>
      </div>
    </article>
  );
}

export function WhyHotelHubSection() {
  return (
    <section id="why-hotelhub" className="scroll-mt-28 bg-[#0E2157] px-5 py-20 md:px-8 xl:px-30">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-14">
        <HomeSectionHeader
          eyebrow="POR QUE HOTELHUB"
          title="Viaje mais inteligentemente, hospede-se melhor"
          inverted
          centered
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {whyHotelHub.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col items-center gap-2.5 rounded-2xl border border-white/8 bg-white/6 px-6.25 py-8.25 text-center"
            >
              <div className={cx("flex h-14 w-14 items-center justify-center rounded-lg text-6 font-semibold leading-9 text-white", feature.iconClassName)}>
                {feature.icon}
              </div>
              <h3 className="text-4.5 leading-6.75 text-white">{feature.title}</h3>
              <p className="text-sm leading-5.5 text-white/60">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="guest-reviews" className="scroll-mt-28 px-5 py-20 md:px-8 xl:px-30">
      <div className="mx-auto flex w-full max-w-360 flex-col gap-14">
        <HomeSectionHeader
          eyebrow="Avaliação dos hóspedes"
          title="O que os viajantes estão dizendo"
          centered
        />

        <div className="grid gap-6 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-2xl border border-[#E4E8EF] bg-white px-7.25 py-7.25 shadow-(--hh-shadow-sm)"
            >
              <div className="space-y-4">
                <p className="text-base leading-6 text-[#E6B93A]">{testimonial.rating}</p>
                <p className="text-3.75 leading-6 text-[#424A57] italic">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={cx("flex h-11 w-11 items-center justify-center rounded-full bg-linear-to-r text-base font-bold text-white", testimonial.avatarClassName)}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-sm leading-5.25 text-[#14181F]">{testimonial.name}</p>
                    <p className="text-3 leading-4.5 text-[#7A8799]">{testimonial.hotel}</p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function HomeCallToAction() {
  return (
    <section id="home-cta" className="scroll-mt-28 px-5 pb-20 pt-0 md:px-8 xl:px-30">
      <div className="mx-auto w-full max-w-360">
        <div className="rounded-3xl bg-[linear-gradient(90deg,#1F4FD6_0%,#0E2157_100%)] px-6 py-16 text-center md:px-10">
          <h2 className="hh-display text-10 leading-15 text-white">
            Pronto para sua próxima aventura?
          </h2>
          <p className="mx-auto mt-2 max-w-120 text-lg leading-6.75 text-white/75">
            Junte-se a mais de 2 milhões de viajantes que confiam no HotelHub para cada hospedagem.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/destinations" className="inline-flex h-13 items-center justify-center rounded-xl bg-white px-8 text-base font-bold leading-6 text-[#1F4FD6] transition hover:bg-white/90">
              Pesquisar hospedagens
            </Link>
            <Link href="/login" className="inline-flex h-13 items-center justify-center rounded-xl border border-white/30 bg-white/15 px-8.25 text-base leading-6 text-white transition hover:bg-white/20">
              Saber mais
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchField({
  label,
  name,
  type,
  defaultValue,
  placeholder,
  min,
  withDivider = false,
}: Readonly<{
  label: string;
  name: string;
  type: string;
  defaultValue?: string | number;
  placeholder?: string;
  min?: number;
  withDivider?: boolean;
}>) {
  return (
    <label
      className={cx(
        "flex min-h-16.75 flex-col justify-center gap-1 px-5 py-3 text-left",
        withDivider && "lg:border-r lg:border-[#E4E8EF]",
      )}
    >
      <span className="text-[11px] uppercase tracking-[0.8px] text-[#7A8799]">{label}</span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        min={min}
        placeholder={placeholder}
        className="border-none p-0 text-[15px] font-medium leading-[22.5px] text-[#14181F] outline-none placeholder:text-[#A8B3C2]"
      />
    </label>
  );
}