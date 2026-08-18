import { ButtonProps } from "./Button.types";
import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-black text-white hover:bg-zinc-800",

  secondary:
    "bg-[#C9A227] text-white hover:opacity-90",

  outline:
    "border border-black bg-transparent hover:bg-black hover:text-white",

  ghost:
    "bg-transparent hover:bg-zinc-100",
};

const sizes = {
  sm: "px-4 py-2 text-sm",

  md: "px-6 py-3 text-base",

  lg: "px-8 py-4 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "rounded-xl transition-all duration-300 font-medium",
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    />
  );
}