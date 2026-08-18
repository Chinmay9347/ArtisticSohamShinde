// import { BREAKPOINTS } from "@/constants/breakpoints";
// import { COLORS } from "@/constants/colors";
// import { RADIUS } from "@/constants/radius";
// import { SHADOWS } from "@/constants/shadows";
// import { SPACING } from "@/constants/spacing";
// import { TYPOGRAPHY } from "@/constants/typography";
import {
  COLORS,
  TYPOGRAPHY,
  SPACING,
  RADIUS,
  SHADOWS,
  BREAKPOINTS,
} from "./design-tokens";

export const theme = {
  colors: COLORS,

  typography: TYPOGRAPHY,

  spacing: SPACING,

  radius: RADIUS,

  shadows: SHADOWS,

  breakpoints: BREAKPOINTS,
} as const;