import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../../lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 disabled:pointer-events-none disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8b5cf6]/50 active:scale-[0.97]",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-white hover:opacity-90 shadow-[0_0_20px_rgba(139,92,246,0.35)]",
        secondary:
          "bg-[#1a1a1a] border border-[#2a2a2a] text-[#d1d5db] hover:bg-[#222222] hover:text-white",
        outline:
          "border border-[#2a2a2a] bg-transparent text-[#a1a1aa] hover:border-[#8b5cf6]/50 hover:text-white",
        ghost:
          "bg-transparent text-[#a1a1aa] hover:bg-white/5 hover:text-white",
        destructive:
          "bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] hover:bg-[#ef4444]/25",
        accent:
          "bg-[#34d399]/15 border border-[#34d399]/30 text-[#34d399] hover:bg-[#34d399]/25",
        link:
          "text-[#8b5cf6] underline-offset-4 hover:underline p-0 h-auto",
      },
      size: {
        default: "h-10 px-5 py-2.5",
        sm: "h-8 px-3.5 py-1.5 text-xs rounded-lg",
        lg: "h-12 px-7 py-3 text-base",
        icon: "h-9 w-9 p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
