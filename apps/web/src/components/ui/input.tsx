import * as React from "react";
import { cn } from "./utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, leftIcon, rightIcon, type, ...props }, ref) => {
    if (leftIcon || rightIcon) {
      return (
        <div className="relative flex items-center">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555] pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            type={type}
            className={cn(
              "h-10 w-full rounded-xl border border-[#222222] bg-[#0a0a0a] text-white text-sm placeholder:text-[#555]",
              "px-3.5 py-2.5 outline-none transition-all duration-200",
              "focus:border-[#8b5cf6]/60 focus:ring-1 focus:ring-[#8b5cf6]/20",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              leftIcon && "pl-10",
              rightIcon && "pr-10",
              className
            )}
            {...props}
          />
          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#555]">
              {rightIcon}
            </span>
          )}
        </div>
      );
    }

    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          "h-10 w-full rounded-xl border border-[#222222] bg-[#0a0a0a] text-white text-sm placeholder:text-[#555]",
          "px-3.5 py-2.5 outline-none transition-all duration-200",
          "focus:border-[#8b5cf6]/60 focus:ring-1 focus:ring-[#8b5cf6]/20",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
