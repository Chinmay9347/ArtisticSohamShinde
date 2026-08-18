import { Typography } from "../Typography";
import { HeadingProps } from "./Heading.types";

export function Heading({
  children,
  level = 1,
  className,
}: HeadingProps) {
  const variantMap = {
    1: "h1",
    2: "h2",
    3: "h3",
    4: "h4",
    5: "h5",
    6: "h6",
  } as const;

  return (
    <Typography
      variant={variantMap[level]}
      className={className}
    >
      {children}
    </Typography>
  );
}