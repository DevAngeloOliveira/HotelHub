import { cn } from "../../../lib/utils";

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gradient-to-r from-[#111111] via-[#1a1a1a] to-[#111111] bg-[length:200%_100%]",
        className
      )}
      style={{
        animation: "skeleton-shimmer 1.5s ease-in-out infinite",
      }}
      {...props}
    />
  );
}

export { Skeleton };
