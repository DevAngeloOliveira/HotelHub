import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors border",
  {
    variants: {
      variant: {
        default:
          "bg-[#8b5cf6]/15 border-[#8b5cf6]/30 text-[#a78bfa]",
        success:
          "bg-[#34d399]/10 border-[#34d399]/20 text-[#34d399]",
        warning:
          "bg-[#f59e0b]/10 border-[#f59e0b]/20 text-[#f59e0b]",
        destructive:
          "bg-[#ef4444]/10 border-[#ef4444]/20 text-[#ef4444]",
        muted:
          "bg-[#71717a]/10 border-[#71717a]/20 text-[#71717a]",
        outline:
          "bg-transparent border-[#2a2a2a] text-[#a1a1aa]",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
