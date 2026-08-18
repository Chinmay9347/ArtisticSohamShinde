import { ReactNode } from "react";

export type TypographyVariant =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "body"
  | "bodyLarge"
  | "small"
  | "caption";

export interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
}