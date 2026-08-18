import { CardProps } from "./Card.types";
import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      {children}
    </div>
  );
}