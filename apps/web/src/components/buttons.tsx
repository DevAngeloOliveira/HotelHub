import type { ReactNode } from "react";
import type { BadgeTone, ButtonSize, ButtonVariant } from "@hotelhub/design-tokens";
import { cx } from "@/lib/cx";

type ButtonProps = Readonly<{
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  onClick?: () => void;
}>;

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  loading,
  type = "button",
  disabled,
  onClick,
}: ButtonProps) {
  const variantClasses: Record<ButtonVariant, string> = {
    primary: "bg-(--hh-primary-action) text-white hover:bg-(--hh-primary-action-hover) active:opacity-90",
    secondary:
      "bg-white text-(--hh-primary-action) border border-(--hh-primary-200) hover:bg-(--hh-primary-50) active:bg-(--hh-primary-50)",
    ghost: "bg-transparent text-(--hh-text) border border-(--hh-border) hover:bg-(--hh-surface-muted) active:opacity-90",
    accentGold:
      "bg-(--hh-accent-highlight) text-neutral-900 hover:bg-(--hh-accent-highlight-hover) active:opacity-90",
    destructive:
      "bg-(--hh-danger-action) text-white hover:bg-(--hh-danger-action-hover) active:opacity-90",
  };

  const sizeClasses: Record<ButtonSize, string> = {
    sm: "h-9 px-3.5 text-sm",
    md: "h-11 px-4.5 text-sm",
    lg: "h-13 px-6 text-base",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
    >
      {loading ? "..." : children}
    </button>
  );
}

type BadgeProps = Readonly<{
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}>;

export function Badge({ children, tone = "info", className }: BadgeProps) {
  const toneClasses: Record<BadgeTone, string> = {
    info: "bg-(--hh-status-info-bg) text-(--hh-status-info-fg)",
    success: "bg-(--hh-status-success-bg) text-(--hh-status-success-fg)",
    warning: "bg-(--hh-status-warning-bg) text-(--hh-status-warning-fg)",
    error: "bg-(--hh-status-error-bg) text-(--hh-status-error-fg)",
    premium: "bg-(--hh-accent-gold-100) text-(--hh-accent-gold-700)",
    popular: "bg-(--hh-primary-100) text-(--hh-primary-700)",
    fullyBooked: "bg-(--hh-error-50) text-(--hh-error-700)",
    new: "bg-(--hh-neutral-100) text-(--hh-neutral-700)",
  };

  return (
    <span
      className={cx(
        "inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-medium",
        toneClasses[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

type IconButtonProps = Readonly<{
  icon: ReactNode;
  className?: string;
  onClick?: () => void;
  variant?: "default" | "filled" | "error";
}>;

export function IconButton({ icon, className, onClick, variant = "default" }: IconButtonProps) {
  const variantClasses: Record<string, string> = {
    default: "bg-(--hh-surface) border border-(--hh-border) hover:bg-(--hh-surface-muted)",
    filled: "bg-(--hh-primary-50) hover:bg-(--hh-primary-100)",
    error: "bg-(--hh-error-50) border border-(--hh-error-50) hover:bg-(--hh-error-100)",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center size-11 rounded-xl transition-colors hover:opacity-90",
        variantClasses[variant],
        className
      )}
    >
      {icon}
    </button>
  );
}
