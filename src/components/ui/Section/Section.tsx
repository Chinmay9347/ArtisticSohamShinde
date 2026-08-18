import { cn } from "@/lib/utils";
import { SectionProps } from "./Section.types";

export function Section({
  children,
  className,
}: SectionProps) {
  return (
    <section
      className={cn(
        "py-20 md:py-28",
        className
      )}
    >
      {children}
    </section>
  );
}