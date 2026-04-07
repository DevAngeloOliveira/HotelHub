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
    title: "Smart search",
    description: "Filter by price, rating, amenities and cancellation policy in seconds.",
    iconClassName: "bg-[rgba(59,102,255,0.20)]",
  },
  {
    icon: "$",
    title: "Best price guarantee",
    description: "We match any lower rate found elsewhere, no questions asked.",
    iconClassName: "bg-[rgba(201,151,28,0.20)]",
  },
  {
    icon: "C",
    title: "Free cancellation",
    description: "Most properties offer free cancellation up to 24 hours before check-in.",
    iconClassName: "bg-[rgba(31,169,113,0.20)]",
  },
  {
    icon: "24",
    title: "24/7 support",
    description: "Our team is always available to help you before, during and after your stay.",
    iconClassName: "bg-[rgba(214,69,69,0.20)]",
  },
] as const;

const testimonials = [
  {
    rating: "5/5",
    quote:
      '"Absolutely stunning stay. The booking was effortless and the hotel exceeded every expectation. Will definitely use HotelHub again."',
    initials: "S",
    name: "Sarah Mitchell",
    hotel: "Grand Palace Resort, Santorini",
    avatarClassName: "from-[#1F4FD6] to-[#3366FF]",
  },
  {
    rating: "5/5",
    quote:
      '"The platform is incredibly intuitive. I found and booked a 5-star hotel in under 3 minutes. The price was unbeatable."',
    initials: "J",
    name: "James Thornton",
    hotel: "Maison Elegante, Paris",
    avatarClassName: "from-[#C9971C] to-[#E6B93A]",
  },
  {
    rating: "5/5",
    quote:
      '"Amazing service. The filters helped me find exactly what I needed: pet-friendly, free breakfast, and ocean view. Perfect."',
    initials: "A",
    name: "Ana Ferreira",
    hotel: "Azure Maldives Overwater",
    avatarClassName: "from-[#1FA971] to-[#22D68F]",
  },
] as const;

export function HomeHero({ defaults }: Readonly<{ defaults: HomeSearchDefaults }>) {
  return (
    <section className="relative min-h-[700px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80)",
        }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,33,87,0.55)_0%,rgba(14,33,87,0.30)_60%,rgba(14,33,87,0.70)_100%)]" />

      <div className="relative mx-auto flex min-h-[700px] w-full max-w-[1440px] flex-col items-center justify-center gap-5 px-5 text-center md:px-8 xl:px-[120px]">
        <div className="rounded-full border border-[rgba(201,151,28,0.50)] bg-[rgba(201,151,28,0.20)] px-[17px] py-[7px]">
          <span className="text-[12px] uppercase tracking-[1px] text-[#F4CB57]">
            Luxury stays, smart booking
          </span>
        </div>

        <h1 className="hh-display max-w-[760px] text-[42px] leading-[48px] text-white md:text-[56px] md:leading-[64px] xl:text-[64px] xl:leading-[72px]">
          Find your perfect stay anywhere in the world
        </h1>

        <p className="max-w-[520px] text-[18px] leading-[28px] text-white/80">
          Search premium hotels, compare rooms and complete your reservation with clarity and confidence.
        </p>

        <form
          action="/destinations"
          className="mt-2 w-full max-w-[900px] rounded-[20px] bg-white p-2 shadow-[0_20px_50px_rgba(20,24,31,0.30)]"
        >
          <div className="grid gap-2 lg:grid-cols-[1.35fr_1fr_1fr_0.78fr_auto]">
            <SearchField
              label="Destination"
              name="name"
              type="text"
              defaultValue={defaults.destination}
              placeholder="Where are you going?"
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
              label="Guests"
              name="guestCount"
              type="number"
              defaultValue={defaults.guestCount}
              min={1}
              placeholder="2 guests"
            />
            <div className="flex items-center justify-center px-1 py-1">
              <button
                type="submit"
                className="inline-flex h-14 items-center justify-center rounded-[14px] bg-[#1F4FD6] px-7 text-[15px] font-medium leading-[22.5px] text-white transition hover:bg-[#173ea9]"
              >
                Search stays
              </button>
            </div>
          </div>
        </form>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-6 text-[13px] leading-[19.5px] text-white/70">
          <span>+ Free cancellation</span>
          <span>+ Best price guarantee</span>
          <span>+ 24/7 support</span>
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
            "text-[11px] uppercase tracking-[1.2px]",
            inverted ? "text-[#8CB2FF]" : "text-[#7A8799]",
          )}
        >
          {eyebrow}
        </p>
        <h2 className={cx("hh-display text-[40px] leading-[60px]", inverted ? "text-white" : "text-[#14181F]")}> 
          {title}
        </h2>
      </div>
      {linkLabel && linkHref ? (
        <Link
          href={linkHref}
          className={cx(
            "text-[14px] leading-[21px] transition hover:opacity-80",
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
      className="group overflow-hidden rounded-[20px] bg-white shadow-[var(--hh-shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--hh-shadow-md)]"
    >
      <div
        className="relative h-[220px] bg-cover bg-center"
        style={{ backgroundImage: `url(${destination.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,24,31,0.08),rgba(20,24,31,0.20))]" />
        <div className="absolute left-3 top-3 rounded-full bg-white/95 px-[10px] py-1 text-[11px] leading-[16.5px] text-[#14181F]">
          {destination.country}
        </div>
      </div>
      <div className="space-y-1 px-5 py-4">
        <h3 className="text-[18px] font-bold leading-[27px] text-[#14181F]">{destination.city}</h3>
        <p className="text-[13px] leading-[19.5px] text-[#7A8799]">{destination.availabilityLabel}</p>
        <p className="pt-2 text-[13px] leading-[19.5px] text-[#5C6675]">
          From <span className="text-[16px] font-bold leading-[24px] text-[#1F4FD6]">{destination.priceLabel}</span>/night
        </p>
      </div>
    </Link>
  );
}

export function RecommendedHotelCard({
  hotel,
}: Readonly<{ hotel: HomeRecommendedHotel }>) {
  return (
    <article className="overflow-hidden rounded-[20px] bg-white shadow-[var(--hh-shadow-sm)] transition hover:-translate-y-1 hover:shadow-[var(--hh-shadow-md)]">
      <div
        className="relative h-[240px] bg-cover bg-center"
        style={{ backgroundImage: `url(${hotel.imageUrl})` }}
      >
        <div
          className={cx(
            "absolute left-4 top-4 rounded-full px-3 py-[5px] text-[11px] font-bold leading-[16.5px]",
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
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[16px] text-[#14181F] shadow-[var(--hh-shadow-sm)]"
        >
          Fav
        </button>
      </div>

      <div className="space-y-3 px-6 py-5">
        <div className="flex items-start gap-3">
          <h3 className="flex-1 text-[18px] font-bold leading-[27px] text-[#14181F]">{hotel.name}</h3>
          <div className="flex items-center gap-1 text-[13px] leading-[19.5px]">
            <span className="text-[#E6B93A]">*</span>
            <span className="text-[#14181F]">{hotel.rating}</span>
            <span className="text-[12px] leading-[18px] text-[#7A8799]">({hotel.reviews})</span>
          </div>
        </div>

        <p className="text-[13px] leading-[19.5px] text-[#7A8799]">{hotel.location}</p>

        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <span
              key={amenity}
              className="rounded-full bg-[#F1F3F7] px-[10px] py-1 text-[11px] font-medium leading-[16.5px] text-[#5C6675]"
            >
              {amenity}
            </span>
          ))}
        </div>

        <div className="flex items-center justify-between gap-4 pt-1">
          <p className="text-[13px] leading-[19.5px] text-[#7A8799]">
            <span className="text-[22px] font-bold leading-[33px] text-[#14181F]">{hotel.priceLabel}</span>/night
          </p>
          <Link href={hotel.href} className={cx(buttonClassName("primary", "sm"), "rounded-[12px] px-5 text-[13px] font-normal")}>
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export function WhyHotelHubSection() {
  return (
    <section id="why-hotelhub" className="scroll-mt-28 bg-[#0E2157] px-5 py-20 md:px-8 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14">
        <HomeSectionHeader
          eyebrow="WHY HOTELHUB"
          title="Travel smarter, stay better"
          inverted
          centered
        />

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
          {whyHotelHub.map((feature) => (
            <article
              key={feature.title}
              className="flex flex-col items-center gap-[10px] rounded-[20px] border border-white/8 bg-white/6 px-[25px] py-[33px] text-center"
            >
              <div className={cx("flex h-14 w-14 items-center justify-center rounded-[16px] text-[24px] font-semibold leading-[36px] text-white", feature.iconClassName)}>
                {feature.icon}
              </div>
              <h3 className="text-[18px] leading-[27px] text-white">{feature.title}</h3>
              <p className="text-[14px] leading-[22px] text-white/60">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  return (
    <section id="guest-reviews" className="scroll-mt-28 px-5 py-20 md:px-8 xl:px-[120px]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-14">
        <HomeSectionHeader
          eyebrow="GUEST REVIEWS"
          title="What travelers are saying"
          centered
        />

        <div className="grid gap-6 xl:grid-cols-3">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-[20px] border border-[#E4E8EF] bg-white px-[29px] py-[29px] shadow-[var(--hh-shadow-sm)]"
            >
              <div className="space-y-4">
                <p className="text-[16px] leading-[24px] text-[#E6B93A]">{testimonial.rating}</p>
                <p className="text-[15px] leading-[24px] text-[#424A57] italic">{testimonial.quote}</p>
                <div className="flex items-center gap-3">
                  <div className={cx("flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r text-[16px] font-bold text-white", testimonial.avatarClassName)}>
                    {testimonial.initials}
                  </div>
                  <div>
                    <p className="text-[14px] leading-[21px] text-[#14181F]">{testimonial.name}</p>
                    <p className="text-[12px] leading-[18px] text-[#7A8799]">{testimonial.hotel}</p>
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
    <section id="home-cta" className="scroll-mt-28 px-5 pb-20 pt-0 md:px-8 xl:px-[120px]">
      <div className="mx-auto w-full max-w-[1440px]">
        <div className="rounded-[24px] bg-[linear-gradient(90deg,#1F4FD6_0%,#0E2157_100%)] px-6 py-16 text-center md:px-10">
          <h2 className="hh-display text-[40px] leading-[60px] text-white">
            Ready for your next adventure?
          </h2>
          <p className="mx-auto mt-2 max-w-[480px] text-[18px] leading-[27px] text-white/75">
            Join over 2 million travelers who trust HotelHub for every stay.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/destinations" className="inline-flex h-[52px] items-center justify-center rounded-[12px] bg-white px-8 text-[16px] font-bold leading-[24px] text-[#1F4FD6] transition hover:bg-[#EEF4FF]">
              Search stays
            </Link>
            <Link href="/login" className="inline-flex h-[52px] items-center justify-center rounded-[12px] border border-white/30 bg-white/15 px-[33px] text-[16px] leading-[24px] text-white transition hover:bg-white/20">
              Learn more
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
        "flex min-h-[67px] flex-col justify-center gap-1 px-5 py-3 text-left",
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