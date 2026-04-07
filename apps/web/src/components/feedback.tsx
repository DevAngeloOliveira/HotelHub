import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type AlertTone = "success" | "warning" | "error" | "info";

type AlertProps = Readonly<{
  title: string;
  description?: string;
  tone?: AlertTone;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}>;

export function Alert({ title, description, tone = "info", onClose, action, className }: AlertProps) {
  const toneStyles: Record<AlertTone, { bg: string; border: string; icon: string; title: string; text: string }> = {
    success: {
      bg: "bg-(--hh-status-success-bg)",
      border: "border-l-4 border-(--hh-success-500)",
      icon: "✅",
      title: "text-(--hh-success-700)",
      text: "text-(--hh-success-700)",
    },
    warning: {
      bg: "bg-(--hh-status-warning-bg)",
      border: "border-l-4 border-(--hh-warning-500)",
      icon: "⚠️",
      title: "text-(--hh-warning-700)",
      text: "text-(--hh-warning-700)",
    },
    error: {
      bg: "bg-(--hh-status-error-bg)",
      border: "border-l-4 border-(--hh-error-500)",
      icon: "🚨",
      title: "text-(--hh-error-700)",
      text: "text-(--hh-error-700)",
    },
    info: {
      bg: "bg-(--hh-status-info-bg)",
      border: "border-l-4 border-(--hh-info-500)",
      icon: "ℹ️",
      title: "text-(--hh-info-700)",
      text: "text-(--hh-info-700)",
    },
  };

  const style = toneStyles[tone];

  return (
    <div className={cx("rounded-lg p-4 flex gap-3", style.bg, style.border, className)}>
      <div className="shrink-0 text-xl">{style.icon}</div>

      <div className="flex-1">
        <h3 className={cx("font-semibold text-sm", style.title)}>{title}</h3>
        {description && <p className={cx("text-sm mt-1", style.text)}>{description}</p>}
      </div>

      {(onClose || action) && (
        <div className="flex items-start gap-2">
          {action && (
            <button type="button" onClick={action.onClick} className={cx("text-sm font-medium", style.text)}>
              {action.label}
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className={cx("text-lg", style.text)}>
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type ToastProps = Readonly<{
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
  className?: string;
}>;

export function Toast({ icon, title, description, action, onClose, className }: ToastProps) {
  return (
    <div
      className={cx(
        "bg-neutral-900 text-white rounded-xl p-4 shadow-lg flex gap-3 items-start max-w-sm",
        className
      )}
    >
      {icon && <div className="shrink-0 text-xl">{icon}</div>}

      <div className="flex-1">
        <p className="font-medium text-sm">{title}</p>
        {description && <p className="text-xs opacity-80 mt-1">{description}</p>}
      </div>

      {(action || onClose) && (
        <div className="flex items-center gap-2">
          {action && (
            <button type="button" onClick={action.onClick} className="text-xs font-medium text-blue-300 hover:text-blue-200">
              {action.label}
            </button>
          )}
          {onClose && (
            <button type="button" onClick={onClose} className="text-opacity-60 hover:opacity-100">
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
}

type EmptyStateProps = Readonly<{
  icon?: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}>;

export function EmptyState({ icon = "🔍", title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cx("flex flex-col items-center justify-center text-center py-12 px-6", className)}>
      <div className="text-6xl mb-4">{icon}</div>
      <h3 className="text-2xl font-bold text-neutral-900 mb-2">{title}</h3>
      <p className="text-neutral-600 mb-6 max-w-md">{description}</p>
      {action && (
        <button
          type="button"
          onClick={action.onClick}
          className="px-6 py-2 bg-(--hh-primary-action) text-white rounded-lg font-medium hover:opacity-90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

type SkeletonProps = Readonly<{
  type?: "card" | "text" | "avatar" | "button";
  width?: string;
  height?: string;
  className?: string;
}>;

export function Skeleton({ type = "text", width, height, className }: SkeletonProps) {
  const typeClasses: Record<string, string> = {
    card: "rounded-lg h-32 w-full",
    text: "rounded h-4 w-full",
    avatar: "rounded-full size-10",
    button: "rounded-lg h-10 w-24",
  };

  return (
    <div
      className={cx(
        "bg-linear-to-r from-neutral-200 via-neutral-100 to-neutral-200 animate-pulse",
        typeClasses[type],
        width,
        height,
        className
      )}
    />
  );
}

type LoadingStateProps = Readonly<{
  message?: string;
  className?: string;
}>;

export function LoadingState({ message = "Loading...", className }: LoadingStateProps) {
  return (
    <div className={cx("flex flex-col items-center justify-center py-12 gap-4", className)}>
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-4 border-neutral-200" />
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-(--hh-primary-action) animate-spin" />
      </div>
      {message && <p className="text-neutral-600 text-sm">{message}</p>}
    </div>
  );
}

type BadgeAlertProps = Readonly<{
  status: "confirmed" | "pending" | "cancelled" | "check-in" | "completed";
  className?: string;
}>;

export function BadgeAlert({ status, className }: BadgeAlertProps) {
  const statusStyles: Record<string, { bg: string; text: string; icon: string }> = {
    confirmed: {
      bg: "bg-(--hh-status-success-bg)",
      text: "text-(--hh-success-700)",
      icon: "●",
    },
    pending: {
      bg: "bg-(--hh-status-warning-bg)",
      text: "text-(--hh-warning-700)",
      icon: "●",
    },
    cancelled: {
      bg: "bg-(--hh-status-error-bg)",
      text: "text-(--hh-error-700)",
      icon: "●",
    },
    "check-in": {
      bg: "bg-(--hh-status-info-bg)",
      text: "text-(--hh-info-700)",
      icon: "●",
    },
    completed: {
      bg: "bg-neutral-100",
      text: "text-neutral-600",
      icon: "●",
    },
  };

  const style = statusStyles[status];
  const label = status.charAt(0).toUpperCase() + status.slice(1).replace("-", "-In");

  return (
    <div className={cx("inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium", style.bg, style.text, className)}>
      <span>{style.icon}</span>
      <span>{label}</span>
    </div>
  );
}
