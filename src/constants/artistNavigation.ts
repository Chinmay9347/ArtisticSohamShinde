import { LayoutDashboard, Palette, User, Settings, Globe, Image, Gift } from "lucide-react";
export const ARTIST_NAVIGATION = [
  { label: "Dashboard", href: "/artist", icon: LayoutDashboard },
  { label: "My Commissions", href: "/artist/commissions", icon: Palette },
  { label: "Artwork Manager", href: "/artist/artworks", icon: Image },
  { label: "Rewards", href: "/artist/rewards", icon: Gift },
  { label: "Profile", href: "/artist/profile", icon: User },
  { label: "Settings", href: "/artist/settings", icon: Settings },
  { label: "Public Website", href: "/", icon: Globe },
] as const;
