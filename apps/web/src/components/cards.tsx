import Image from "next/image";
import { Button } from "./buttons";
import { cx } from "@/lib/cx";

type HotelCardProps = Readonly<{
  image?: string;
  title: string;
  location: string;
  rating: number;
  reviewCount: number;
  price: number;
  amenities: string[];
  badge?: "featured" | "best-value" | "popular" | "fully-booked";
  onViewDetails?: () => void;
  className?: string;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
}>;

export function HotelCard({
  image,
  title,
  location,
  rating,
  reviewCount,
  price,
  amenities,
  badge,
  onViewDetails,
  className,
  isFavorite,
  onToggleFavorite,
}: HotelCardProps) {
  const badgeStyles: Record<"featured" | "best-value" | "popular" | "fully-booked", { bg: string; text: string; label: string }> = {
    featured: {
      bg: "bg-(--hh-accent-gold-600)",
      text: "text-white",
      label: "✦ Featured",
    },
    "best-value": {
      bg: "bg-(--hh-success-500)",
      text: "text-white",
      label: "Best Value",
    },
    popular: {
      bg: "bg-(--hh-primary-600)",
      text: "text-white",
      label: "Popular",
    },
    "fully-booked": {
      bg: "bg-(--hh-error-50)",
      text: "text-(--hh-error-700)",
      label: "Fully Booked",
    },
  };

  const badgeStyle = badge && badgeStyles[badge];

  return (
    <div
      className={cx(
        "bg-white rounded-[20px] overflow-hidden shadow-sm hover:shadow-lg transition-shadow",
        className
      )}
    >
      <div className="relative h-55 bg-linear-to-br from-(--hh-primary-600) via-(--hh-primary-700) to-(--hh-primary-900) overflow-hidden">
        {image ? (
          <Image src={image} alt={title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-30" aria-hidden="true">🏖</div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 to-transparent" aria-hidden="true" />

        {badgeStyle && (
          <div
            className={cx(
              "absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold",
              badgeStyle.bg,
              badgeStyle.text
            )}
          >
            {badgeStyle.label}
          </div>
        )}

        <button
          type="button"
          aria-label={isFavorite ? `Remove ${title} from favorites` : `Add ${title} to favorites`}
          onClick={onToggleFavorite}
          className="absolute top-3 right-3 bg-white rounded-full size-8 flex items-center justify-center hover:bg-neutral-50 transition-colors"
        >
          <span className="text-lg" aria-hidden="true">{isFavorite ? "♥" : "♡"}</span>
        </button>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div className="flex gap-3 items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-neutral-900 leading-tight">{title}</h3>
          </div>
          <div className="flex items-center gap-1 whitespace-nowrap">
            <span className="text-amber-400 text-sm" aria-hidden="true">★</span>
            <span className="font-semibold text-sm text-neutral-900">{rating}</span>
            <span className="text-xs text-neutral-500">({reviewCount})</span>
          </div>
        </div>

        <div className="text-sm text-neutral-500">
          <span aria-hidden="true">📍</span>
          {" "}{location}
        </div>

        {amenities.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {amenities.slice(0, 4).map((amenity) => (
              <span key={amenity} className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full">
                {amenity}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between gap-3 pt-2 border-t border-neutral-200">
          <div>
            <div className="text-2xl font-bold text-neutral-900">
              ${price}
              <span className="text-sm font-normal text-neutral-500">/night</span>
            </div>
          </div>
          <Button size="sm" onClick={onViewDetails}>
            View details
          </Button>
        </div>
      </div>
    </div>
  );
}

type DestinationCardProps = Readonly<{
  image?: string;
  name: string;
  country: string;
  hotelCount?: number;
  className?: string;
  onClick?: () => void;
}>;

export function DestinationCard({
  image,
  name,
  country,
  hotelCount,
  className,
  onClick,
}: DestinationCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "text-left bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer hover:scale-105 w-full",
        className
      )}
    >
      <div className="relative h-40 bg-linear-to-br from-(--hh-primary-600) via-(--hh-primary-700) to-(--hh-primary-900) overflow-hidden">
        {image ? (
          <Image src={image} alt={name} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl opacity-30">🌍</div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-neutral-900/40 to-transparent" />
      </div>

      <div className="p-4">
        <h3 className="font-bold text-neutral-900">{name}</h3>
        <p className="text-sm text-neutral-500">{country}</p>
        {hotelCount != null && hotelCount > 0 && <p className="text-xs text-neutral-400 mt-2">{hotelCount} hotels</p>}
      </div>
    </button>
  );
}
