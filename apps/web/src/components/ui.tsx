import type { ReactNode } from "react";
import Link from "next/link";
import type { BadgeTone, ButtonSize, ButtonVariant } from "@hotelhub/design-tokens";
import { componentTokens } from "@hotelhub/design-tokens";
import { cx } from "@/lib/cx";
import { formatCurrency } from "@/lib/format";
import type { Destination, Hotel, Room } from "@/lib/types";

const buttonVariantClass: Record<ButtonVariant, string> = {
  primary: "bg-[var(--hh-primary-action)] text-[var(--hh-text-inverse)] hover:bg-[var(--hh-primary-action-hover)]",
  secondary:
    "bg-[var(--hh-surface)] text-[var(--hh-primary-action)] ring-1 ring-[var(--hh-primary-200)] hover:bg-[var(--hh-primary-50)]",
  ghost:
    "bg-transparent text-[var(--hh-text)] ring-1 ring-[var(--hh-border)] hover:bg-[var(--hh-surface-muted)]",
  accentGold:
    "bg-[var(--hh-accent-highlight)] text-[var(--hh-neutral-900)] hover:bg-[var(--hh-accent-highlight-hover)]",
  destructive:
    "bg-[var(--hh-danger-action)] text-[var(--hh-text-inverse)] hover:bg-[var(--hh-danger-action-hover)]",
};

const buttonSizeClass: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-[18px] text-sm",
  lg: "h-[52px] px-6 text-base",
};

const badgeToneClass: Record<BadgeTone, string> = {
  info: "bg-[var(--hh-status-info-bg)] text-[var(--hh-status-info-fg)]",
  success: "bg-[var(--hh-status-success-bg)] text-[var(--hh-status-success-fg)]",
  warning: "bg-[var(--hh-status-warning-bg)] text-[var(--hh-status-warning-fg)]",
  error: "bg-[var(--hh-status-error-bg)] text-[var(--hh-status-error-fg)]",
  premium: "bg-[var(--hh-accent-gold-100)] text-[var(--hh-accent-gold-700)]",
  popular: "bg-[var(--hh-primary-100)] text-[var(--hh-primary-700)]",
  fullyBooked: "bg-[var(--hh-error-50)] text-[var(--hh-error-700)]",
  new: "bg-[var(--hh-neutral-100)] text-[var(--hh-neutral-700)]",
};

type ButtonProps = Readonly<{
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  disabled?: boolean;
  href?: string;
}>;

export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cx(
    "inline-flex items-center justify-center gap-2 rounded-[16px] font-medium transition duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--hh-primary-200)] focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-60",
    buttonSizeClass[size],
    buttonVariantClass[variant],
    className,
  );
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  type = "button",
  leadingIcon,
  trailingIcon,
  disabled,
  href,
}: ButtonProps) {
  const content = (
    <>
      {loading ? <Spinner /> : leadingIcon}
      <span>{children}</span>
      {!loading ? trailingIcon : null}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={buttonClassName(variant, size, className)}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      className={buttonClassName(variant, size, className)}
      disabled={disabled || loading}
    >
      {content}
    </button>
  );
}

type TextFieldProps = Readonly<{
  label?: string;
  name?: string;
  type?: string;
  defaultValue?: string | number;
  placeholder?: string;
  helpText?: string;
  errorText?: string;
  className?: string;
  min?: number | string;
  required?: boolean;
  autoComplete?: string;
  readOnly?: boolean;
}>;

export function TextField({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  helpText,
  errorText,
  className,
  min,
  required,
  autoComplete,
  readOnly,
}: TextFieldProps) {
  const hint = errorText ?? helpText;
  return (
    <label className={cx("flex min-w-0 flex-col gap-2", className)}>
      {label ? <span className="text-[13px] font-medium text-[var(--hh-text)]">{label}</span> : null}
      <input
        name={name}
        type={type}
        defaultValue={defaultValue}
        placeholder={placeholder}
        min={min}
        required={required}
        autoComplete={autoComplete}
        readOnly={readOnly}
        aria-invalid={Boolean(errorText)}
        className={cx(
          "h-[52px] rounded-[12px] border bg-[var(--hh-surface)] px-4 text-[15px] text-[var(--hh-text)] outline-none transition",
          "placeholder:text-[var(--hh-text-subtle)]",
          "focus:border-[var(--hh-primary-action)] focus:ring-4 focus:ring-[var(--hh-primary-100)]",
          readOnly && "cursor-not-allowed bg-[var(--hh-surface-muted)] text-[var(--hh-text-muted)]",
          errorText
            ? "border-[var(--hh-status-error-fg)] focus:border-[var(--hh-status-error-fg)] focus:ring-[var(--hh-status-error-bg)]"
            : "border-[var(--hh-border)]",
        )}
      />
      {hint ? (
        <span
          className={cx(
            "text-[12px]",
            errorText ? "text-[var(--hh-status-error-fg)]" : "text-[var(--hh-text-muted)]",
          )}
        >
          {hint}
        </span>
      ) : null}
    </label>
  );
}

type DateRangeFieldProps = Readonly<{
  checkInDefaultValue?: string;
  checkOutDefaultValue?: string;
  guestCountDefaultValue?: string | number;
  className?: string;
}>;

export function DateRangeField({
  checkInDefaultValue,
  checkOutDefaultValue,
  guestCountDefaultValue,
  className,
}: DateRangeFieldProps) {
  return (
    <div className={cx("grid gap-3 md:grid-cols-[1fr_1fr_160px]", className)}>
      <TextField
        label="Check-in"
        name="checkInDate"
        type="date"
        defaultValue={checkInDefaultValue}
      />
      <TextField
        label="Check-out"
        name="checkOutDate"
        type="date"
        defaultValue={checkOutDefaultValue}
      />
      <TextField
        label="Hospedes"
        name="guestCount"
        type="number"
        min={1}
        defaultValue={guestCountDefaultValue}
      />
    </div>
  );
}

type SurfaceCardProps = Readonly<{
  children: ReactNode;
  className?: string;
  variant?: "default" | "interactive" | "hotel" | "destination" | "reservationSummary";
}>;

export function SurfaceCard({
  children,
  className,
  variant = "default",
}: SurfaceCardProps) {
  const variantClass = {
    default: "hh-surface",
    interactive: "hh-surface hover:-translate-y-0.5 hover:shadow-[var(--hh-shadow-md)]",
    hotel: "hh-surface bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(248,250,252,0.98))]",
    destination:
      "hh-surface bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(239,244,255,0.72))]",
    reservationSummary:
      "hh-surface bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(237,249,242,0.55))]",
  }[variant];

  return (
    <article
      className={cx(
        "rounded-[20px] p-5 transition duration-200",
        variantClass,
        className,
      )}
    >
      {children}
    </article>
  );
}

type BadgeProps = Readonly<{
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}>;

export function Badge({ children, tone = "info", className }: BadgeProps) {
  return (
    <span
      className={cx(
        "inline-flex h-[26px] items-center rounded-full px-3 text-[12px] font-medium",
        badgeToneClass[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

type AlertBannerProps = Readonly<{
  title: string;
  message: string;
  tone?: "info" | "success" | "warning" | "error";
  className?: string;
}>;

export function AlertBanner({
  title,
  message,
  tone = "info",
  className,
}: AlertBannerProps) {
  const icon = {
    info: "i",
    success: "OK",
    warning: "!",
    error: "x",
  }[tone];

  return (
    <div
      className={cx(
        "flex gap-4 rounded-[20px] border p-4",
        tone === "info" && "border-[var(--hh-info-500)] bg-[var(--hh-status-info-bg)] text-[var(--hh-status-info-fg)]",
        tone === "success" &&
          "border-[var(--hh-success-500)] bg-[var(--hh-status-success-bg)] text-[var(--hh-status-success-fg)]",
        tone === "warning" &&
          "border-[var(--hh-warning-500)] bg-[var(--hh-status-warning-bg)] text-[var(--hh-status-warning-fg)]",
        tone === "error" && "border-[var(--hh-error-500)] bg-[var(--hh-status-error-bg)] text-[var(--hh-status-error-fg)]",
        className,
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/75 text-sm font-semibold">
        {icon}
      </div>
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-sm opacity-90">{message}</p>
      </div>
    </div>
  );
}

type EmptyStateProps = Readonly<{
  title: string;
  message: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}>;

export function EmptyState({
  title,
  message,
  actionLabel,
  actionHref,
  secondaryLabel,
  secondaryHref,
}: EmptyStateProps) {
  return (
    <SurfaceCard className="mx-auto flex max-w-[420px] flex-col items-center px-10 py-12 text-center" variant="default">
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-[20px] bg-[linear-gradient(180deg,var(--hh-primary-50),#ffffff)] text-3xl">
        <span aria-hidden>?</span>
      </div>
      <h3 className="hh-display mt-6 text-[34px] leading-[42px] text-[var(--hh-text)]">{title}</h3>
      <p className="mt-4 max-w-[280px] text-[15px] leading-[24px] text-[var(--hh-text-muted)]">
        {message}
      </p>
      {actionLabel && actionHref ? (
        <Button href={actionHref} className="mt-8" variant="primary">
          {actionLabel}
        </Button>
      ) : null}
      {secondaryLabel && secondaryHref ? (
        <Link
          href={secondaryHref}
          className="mt-5 text-sm font-medium text-[var(--hh-primary-action)] transition hover:text-[var(--hh-primary-action-hover)]"
        >
          {secondaryLabel}
        </Link>
      ) : null}
    </SurfaceCard>
  );
}

export function SkeletonCard() {
  return (
    <div className="overflow-hidden rounded-[20px] border border-[var(--hh-border)] bg-[var(--hh-surface)] shadow-[var(--hh-shadow-sm)]">
      <div className="h-[180px] animate-pulse bg-[linear-gradient(90deg,var(--hh-neutral-100),var(--hh-neutral-50),var(--hh-neutral-100))]" />
      <div className="space-y-3 p-5">
        <div className="h-4 w-2/3 animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
        <div className="h-3 w-1/3 animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
        <div className="flex gap-2">
          <div className="h-6 w-14 animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
          <div className="h-6 w-[72px] animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
          <div className="h-6 w-12 animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
        </div>
        <div className="flex justify-between">
          <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--hh-neutral-100)]" />
          <div className="h-10 w-24 animate-pulse rounded-[16px] bg-[var(--hh-neutral-100)]" />
        </div>
      </div>
    </div>
  );
}

type ConfirmationModalProps = Readonly<{
  title: string;
  headerTitle: string;
  headerSubtitle: string;
  ratingLine?: string;
  rows: Array<{ label: string; value: ReactNode }>;
  pricing: Array<{ label: string; value: ReactNode }>;
  total: ReactNode;
  footer: ReactNode;
}>;

export function ConfirmationModal({
  title,
  headerTitle,
  headerSubtitle,
  ratingLine,
  rows,
  pricing,
  total,
  footer,
}: ConfirmationModalProps) {
  return (
    <section className="relative mx-auto w-full max-w-[720px]">
      <div className="absolute inset-0 rounded-[32px] bg-[var(--hh-overlay)] blur-3xl opacity-30" />
      <div className="relative rounded-[32px] border border-[var(--hh-border)] bg-[var(--hh-surface)] p-8 shadow-[var(--hh-shadow-lg)]">
        <div className="flex items-start justify-between gap-4">
          <h2 className="hh-display text-[40px] leading-[48px] text-[var(--hh-text)]">{title}</h2>
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] border border-[var(--hh-border)] text-[var(--hh-text-muted)]">
            x
          </div>
        </div>

        <div className="mt-8 rounded-[20px] bg-[var(--hh-surface-muted)] p-5">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(180deg,var(--hh-primary-400),var(--hh-primary-700))] text-xl">
              HH
            </div>
            <div>
              <h3 className="text-[24px] font-semibold text-[var(--hh-text)]">{headerTitle}</h3>
              <p className="mt-1 text-sm text-[var(--hh-text-muted)]">{headerSubtitle}</p>
              {ratingLine ? (
                <p className="mt-2 text-sm text-[var(--hh-accent-gold-600)]">{ratingLine}</p>
              ) : null}
            </div>
          </div>
        </div>

        <div className="mt-8 space-y-4 border-y border-[var(--hh-border)] py-6">
          {rows.map((row) => (
            <div key={row.label} className="flex items-center justify-between gap-4">
              <span className="text-sm text-[var(--hh-text-muted)]">{row.label}</span>
              <span className="text-right text-sm font-medium text-[var(--hh-text)]">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {pricing.map((entry) => (
            <div key={entry.label} className="flex items-center justify-between gap-4 text-sm text-[var(--hh-text-muted)]">
              <span>{entry.label}</span>
              <span>{entry.value}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex items-end justify-between gap-4 border-t border-[var(--hh-border)] pt-6">
          <div>
            <p className="text-sm text-[var(--hh-text-muted)]">Total</p>
            <p className="text-[32px] font-semibold text-[var(--hh-primary-action)]">{total}</p>
          </div>
          <div className="flex items-center gap-3">{footer}</div>
        </div>
      </div>
    </section>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = "left",
}: Readonly<{
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}>) {
  return (
    <div className={cx("space-y-3", align === "center" && "text-center")}>
      {eyebrow ? (
        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--hh-text-subtle)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="hh-display text-[40px] leading-[48px] text-[var(--hh-text)]">{title}</h2>
      {subtitle ? (
        <p className="max-w-2xl text-[16px] leading-[26px] text-[var(--hh-text-muted)]">
          {subtitle}
        </p>
      ) : null}
    </div>
  );
}

export function HeroPanel() {
  return (
    <SurfaceCard
      className="relative overflow-hidden rounded-[32px] border-none bg-[linear-gradient(135deg,var(--hh-primary-700),var(--hh-primary-500)_56%,var(--hh-accent-gold-500)_140%)] px-8 py-10 text-[var(--hh-text-inverse)] shadow-[var(--hh-shadow-lg)] md:px-12 md:py-14"
      variant="default"
    >
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_58%)]" />
      <div className="absolute -top-10 -left-8 h-48 w-48 rounded-full border border-white/20" />
      <div className="absolute right-8 bottom-6 h-36 w-36 rounded-full bg-white/10 blur-3xl" />

      <div className="relative max-w-3xl">
        <Badge tone="premium" className="bg-white/15 text-white">
          Design system aplicado ao fluxo de reservas
        </Badge>
        <h1 className="hh-display mt-6 max-w-2xl text-[48px] leading-[56px] md:text-[56px] md:leading-[64px]">
          Descubra destinos com uma experiencia editorial e reserve com clareza.
        </h1>
        <p className="mt-5 max-w-2xl text-[18px] leading-[30px] text-white/82">
          HotelHub combina pesquisa rapida, feedback de disponibilidade e um checkout
          premium sem ruído visual.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/destinations" variant="accentGold" size="lg">
            Explorar destinos
          </Button>
          <Button href="/reservations" variant="ghost" size="lg" className="border-white/20 bg-white/10 text-white hover:bg-white/16">
            Minhas reservas
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function SearchStrip() {
  return (
    <SurfaceCard className="rounded-[28px]" variant="default">
      <div className="flex flex-col gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--hh-text-subtle)]">
              Buscar estadia
            </p>
            <h3 className="mt-2 text-[24px] font-semibold text-[var(--hh-text)]">
              Selecione destino, periodo e ocupacao
            </h3>
          </div>
          <Badge tone="info">No overbooking no MVP</Badge>
        </div>

        <form action="/destinations" className="grid gap-3 xl:grid-cols-[1.25fr_1fr]">
          <TextField name="name" label="Destino ou cidade" placeholder="Ex.: Porto Seguro" />
          <DateRangeField guestCountDefaultValue={2} />
          <div className="xl:col-span-2 flex justify-end">
            <Button type="submit" variant="primary" size="lg">
              Buscar disponibilidade
            </Button>
          </div>
        </form>
      </div>
    </SurfaceCard>
  );
}

export function DestinationCard({ destination }: Readonly<{ destination: Destination }>) {
  return (
    <SurfaceCard className="overflow-hidden p-0" variant="interactive">
      <div
        className="relative h-56 w-full overflow-hidden"
        style={{
          backgroundImage: destination.featuredImageUrl
            ? `linear-gradient(180deg, rgba(15,23,42,0.08), rgba(15,23,42,0.6)), url(${destination.featuredImageUrl})`
            : "linear-gradient(135deg, var(--hh-primary-500), var(--hh-primary-800))",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-4 p-5">
          <Badge tone="premium">{destination.category}</Badge>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
            {destination.country}
          </span>
        </div>
      </div>
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-[24px] font-semibold text-[var(--hh-text)]">{destination.name}</h3>
          <p className="mt-1 text-sm text-[var(--hh-text-muted)]">
            {destination.city}, {destination.state}
          </p>
        </div>
        {destination.description ? (
          <p className="text-[15px] leading-[24px] text-[var(--hh-text-muted)]">
            {destination.description}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-3">
          <Badge tone="info">Destino ativo</Badge>
          <Button href={`/destinations/${destination.id}`} variant="secondary">
            Ver destino
          </Button>
        </div>
      </div>
    </SurfaceCard>
  );
}

export function HotelCard({ hotel }: Readonly<{ hotel: Hotel }>) {
  return (
    <SurfaceCard className="space-y-4" variant="hotel">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[24px] font-semibold text-[var(--hh-text)]">{hotel.name}</h3>
          <p className="mt-1 text-sm text-[var(--hh-text-muted)]">{hotel.address}</p>
        </div>
        <Badge tone="success">{hotel.category}</Badge>
      </div>

      {hotel.description ? (
        <p className="text-[15px] leading-[24px] text-[var(--hh-text-muted)]">{hotel.description}</p>
      ) : null}

      {hotel.amenities.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {hotel.amenities.map((amenity) => (
            <Badge key={amenity} tone="new" className="h-[38px] px-4 text-[13px]">
              {amenity}
            </Badge>
          ))}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4 border-t border-[var(--hh-border)] pt-4">
        <Badge tone="popular">Popular</Badge>
        <Button href={`/hotels/${hotel.id}`} variant="primary">
          Ver hotel
        </Button>
      </div>
    </SurfaceCard>
  );
}

export function RoomCard({
  room,
  checkInDate,
  checkOutDate,
  guestCount,
}: Readonly<{
  room: Room;
  checkInDate?: string;
  checkOutDate?: string;
  guestCount?: number;
}>) {
  const href = checkInDate && checkOutDate
    ? {
        pathname: "/reservations/checkout",
        query: {
          hotelId: room.hotelId,
          roomId: room.id,
          checkInDate,
          checkOutDate,
          guestCount,
        },
      }
    : undefined;

  return (
    <SurfaceCard className="space-y-5" variant="reservationSummary">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[22px] font-semibold text-[var(--hh-text)]">{room.name}</h3>
          <p className="mt-1 text-sm text-[var(--hh-text-muted)]">{room.type}</p>
        </div>
        <div className="text-right">
          <p className="text-[28px] font-semibold text-[var(--hh-primary-action)]">
            {formatCurrency(room.pricePerNight)}
          </p>
          <p className="text-sm text-[var(--hh-text-muted)]">por noite</p>
        </div>
      </div>

      {room.description ? (
        <p className="text-[15px] leading-[24px] text-[var(--hh-text-muted)]">{room.description}</p>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Badge tone="new">Capacidade {room.capacity}</Badge>
        <Badge tone="new">Estoque {room.quantity}</Badge>
        {typeof room.availableUnits === "number" ? (
          <Badge tone={room.availableUnits > 0 ? "success" : "fullyBooked"}>
            {room.availableUnits > 0 ? `${room.availableUnits} disponiveis` : "Sem estoque"}
          </Badge>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-[var(--hh-border)] pt-4">
        <Badge tone="premium">Melhor tarifa</Badge>
        {href ? (
          <Link href={href} className={buttonClassName("primary", "md")}>
            Reservar
          </Link>
        ) : (
          <Button variant="ghost">Selecione datas</Button>
        )}
      </div>
    </SurfaceCard>
  );
}

export function MetricCard({
  title,
  value,
  accent = "primary",
}: Readonly<{
  title: string;
  value: string | number;
  accent?: "primary" | "success" | "accent";
}>) {
  return (
    <SurfaceCard variant="default">
      <p className="text-sm text-[var(--hh-text-muted)]">{title}</p>
      <p
        className={cx(
          "mt-4 text-[44px] font-semibold leading-none",
          accent === "primary" && "text-[var(--hh-primary-action)]",
          accent === "success" && "text-[var(--hh-success-action)]",
          accent === "accent" && "text-[var(--hh-accent-highlight)]",
        )}
      >
        {value}
      </p>
    </SurfaceCard>
  );
}

function Spinner() {
  const size = componentTokens.button.height.sm / 2;
  return (
    <span
      className="inline-block animate-spin rounded-full border-2 border-current border-r-transparent"
      style={{ width: size, height: size }}
      aria-hidden
    />
  );
}
