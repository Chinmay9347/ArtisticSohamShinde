import { TypographyProps } from "./Typography.types";
import { cn } from "@/lib/utils";

const styles = {
  display:
    "font-heading text-6xl md:text-7xl font-bold tracking-tight",

  h1:
    "font-heading text-5xl md:text-6xl font-bold tracking-tight",

  h2:
    "font-heading text-4xl md:text-5xl font-semibold",

  h3:
    "font-heading text-3xl md:text-4xl font-semibold",

  h4:
    "font-heading text-2xl md:text-3xl font-semibold",

  h5:
    "font-heading text-xl md:text-2xl font-semibold",

  h6:
    "font-heading text-lg md:text-xl font-semibold",

  body:
    "font-body text-base leading-7",

  bodyLarge:
    "font-body text-lg leading-8",

  small:
    "font-body text-sm",

  caption:
    "font-body text-xs text-gray-500",
};

export function Typography({
  children,
  variant = "body",
  className,
}: TypographyProps) {
  return (
    <p className={cn(styles[variant], className)}>
      {children}
    </p>
  );
}