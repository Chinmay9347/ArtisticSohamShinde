import { SITE_ASSETS } from "@/constants/site-assets";

export const BRAND_LOGO_URL =
  process.env.NEXT_PUBLIC_BRAND_LOGO_URL ||
  process.env.APP_PUBLIC_LOGO_URL ||
  SITE_ASSETS.brandLogoMain;
