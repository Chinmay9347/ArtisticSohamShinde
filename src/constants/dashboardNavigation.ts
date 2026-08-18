import {
  LayoutDashboard,
  BadgeIndianRupee,
  Star,
  ShoppingBag,
  Heart,
  User,
  Settings,
  Gift,
  Palette,
  Globe,
} from "lucide-react";

export const DASHBOARD_NAVIGATION = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Commission a Portrait", href: "/commission", icon: Palette },
  { label: "My Orders", href: "/orders", icon: ShoppingBag },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Referrals", href: "/dashboard/referrals", icon: Gift },
  { label: "You Saved", href: "/dashboard/savings", icon: BadgeIndianRupee },
  { label: "Rewards", href: "/dashboard/rewards", icon: Star },
  { label: "Profile", href: "/profile", icon: User },
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Public Website", href: "/", icon: Globe },
];
