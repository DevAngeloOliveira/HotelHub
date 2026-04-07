import type { ReactNode } from "react";
import { cx } from "@/lib/cx";

type TextInputProps = Readonly<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  icon?: ReactNode;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "number";
  className?: string;
}>;

export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  icon,
  disabled,
  type = "text",
  className,
}: TextInputProps) {
  const inputClasses = error
    ? "bg-(--hh-error-50) border border-(--hh-danger-action) text-neutral-900 placeholder:text-neutral-500"
    : disabled
      ? "bg-neutral-100 border border-neutral-200 text-neutral-500 cursor-not-allowed"
      : "bg-white border border-neutral-200 text-neutral-900 placeholder:text-neutral-500 focus:border-(--hh-primary-action) focus:outline-none focus:ring-1 focus:ring-(--hh-primary-action)";

  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {label && (
        <label className={cx("text-sm font-medium", error ? "text-(--hh-danger-action)" : "text-neutral-900")}>
          {label}
        </label>
      )}

      <div className="relative">
        {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-500">{icon}</div>}

        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cx(
            "w-full rounded-lg px-4 py-3 text-base transition-colors",
            icon ? "pl-10" : "",
            inputClasses
          )}
        />
      </div>

      {error && <p className="text-xs text-red-600">⚠ {error}</p>}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

type TextareaProps = Readonly<{
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  hint?: string;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}>;

export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  error,
  hint,
  disabled,
  rows = 4,
  maxLength,
  className,
}: TextareaProps) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-neutral-900">{label}</label>}

      <textarea
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        maxLength={maxLength}
        className={cx(
          "w-full rounded-lg px-4 py-3 text-base transition-colors resize-none",
          error
            ? "bg-(--hh-error-50) border border-(--hh-danger-action)"
            : "bg-white border border-neutral-200 focus:border-(--hh-primary-action) focus:outline-none focus:ring-1 focus:ring-(--hh-primary-action)"
        )}
      />

      {error && <p className="text-xs text-red-600">⚠ {error}</p>}
      {hint && <p className="text-xs text-neutral-500">{hint}</p>}
    </div>
  );
}

type ToggleSwitchProps = Readonly<{
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}>;

export function ToggleSwitch({ label, checked, onChange, disabled, className }: ToggleSwitchProps) {
  return (
    <div className={cx("flex items-center justify-between gap-3", className)}>
      {label && <label className="text-sm font-medium text-neutral-900">{label}</label>}

      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        disabled={disabled}
        className={cx(
          "relative inline-flex items-center h-6 rounded-full w-11 transition-colors",
          checked ? "bg-(--hh-primary-action)" : "bg-neutral-300",
          disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
      >
        <span
          className={cx(
            "inline-block h-4 w-4 transform rounded-full bg-white transition-transform",
            checked ? "translate-x-6" : "translate-x-1"
          )}
        />
      </button>
    </div>
  );
}

type CheckboxProps = Readonly<{
  label?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}>;

export function Checkbox({ label, checked, onChange, disabled, className }: CheckboxProps) {
  return (
    <div className={cx("flex items-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange?.(!checked)}
        disabled={disabled}
        className={cx(
          "flex items-center justify-center w-5 h-5 rounded-md transition-colors",
          checked
            ? "bg-(--hh-primary-action) border border-(--hh-primary-action)"
            : "bg-white border border-neutral-300 hover:border-neutral-400",
          disabled ? "opacity-50 cursor-not-allowed" : ""
        )}
      >
        {checked && <span className="text-white text-sm">✓</span>}
      </button>
      {label && <label className="text-sm text-neutral-900">{label}</label>}
    </div>
  );
}

type SelectDropdownProps = Readonly<{
  label?: string;
  options: Array<{ value: string; label: string }>;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}>;

export function SelectDropdown({
  label,
  options,
  value,
  onChange,
  placeholder,
  disabled,
  className,
}: SelectDropdownProps) {
  return (
    <div className={cx("flex flex-col gap-2", className)}>
      {label && <label className="text-sm font-medium text-neutral-900">{label}</label>}

      <select
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={cx(
          "w-full rounded-lg px-4 py-3 text-base appearance-none bg-white border border-neutral-200 text-neutral-900 transition-colors",
          "cursor-pointer hover:bg-neutral-50",
          "focus:border-(--hh-primary-action) focus:outline-none focus:ring-1 focus:ring-(--hh-primary-action)",
          "disabled:bg-neutral-100 disabled:text-neutral-500 disabled:cursor-not-allowed"
        )}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

type RangeSliderProps = Readonly<{
  label?: string;
  min: number;
  max: number;
  minValue?: number;
  maxValue?: number;
  onMinChange?: (value: number) => void;
  onMaxChange?: (value: number) => void;
  className?: string;
}>;

export function RangeSlider({
  label,
  min,
  max,
  minValue = min,
  maxValue = max,
  onMinChange,
  onMaxChange,
  className,
}: RangeSliderProps) {
  return (
    <div className={cx("flex flex-col gap-4", className)}>
      {label && <label className="text-sm font-medium text-neutral-900">{label}</label>}

      {/* Range Slider */}
      <div className="space-y-4">
        <div className="h-1 bg-neutral-300 rounded-full relative">
          <div
            className="absolute h-full bg-(--hh-primary-action) rounded-full"
            style={{
              left: `${((minValue - min) / (max - min)) * 100}%`,
              right: `${100 - ((maxValue - min) / (max - min)) * 100}%`,
            }}
          />
        </div>

        {/* Input Fields */}
        <div className="flex gap-3">
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">MIN</p>
            <input
              type="number"
              value={minValue}
              onChange={(e) => onMinChange?.(Number(e.target.value))}
              className="text-lg font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
          <div className="flex flex-col gap-1 flex-1">
            <p className="text-xs text-neutral-500 uppercase tracking-wide">MAX</p>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => onMaxChange?.(Number(e.target.value))}
              className="text-lg font-bold text-neutral-900 bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
