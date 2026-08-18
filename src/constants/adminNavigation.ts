import {
  LayoutDashboard,
  ShoppingBag,
  Palette,
  Image,
  Truck,
  Settings,
  Layers,
  MessageSquare,
  Info,
  User,
  FileText,
  Sparkles,
} from "lucide-react";

export const ADMIN_NAVIGATION = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Orders",
    href: "/admin/orders",
    icon: ShoppingBag,
  },
  {
    label: "Invoices",
    href: "/admin/invoices",
    icon: FileText,
  },
  {
    label: "Artwork",
    href: "/admin/artworks",
    icon: Palette,
  },
  {
    label: "Artwork Queue",
    href: "/admin/artwork",
    icon: Layers,
  },
  {
    label: "Gallery",
    href: "/admin/gallery",
    icon: Image,
  },
  {
    label: "Shipping",
    href: "/admin/shipping",
    icon: Truck,
  },
  {
    label: "Contact Messages",
    href: "/admin/contact",
    icon: MessageSquare,
  },
  {
    label: "About Content",
    href: "/admin/about",
    icon: Info,
  },
  {
    label: "Profile",
    href: "/admin/profile",
    icon: User,
  },
  { label: "AI & Promotion Studio", href: "/admin/ai", icon: Sparkles },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
] as const;

// import { LayoutDashboard, ShoppingBag, Palette, Image, Truck, Settings, Layers, MessageSquare, Info, User } from "lucide-react";
// export const ADMIN_NAVIGATION = [
//   { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
//   { label: "Orders", href: "/admin/orders", icon: ShoppingBag },
//   { label: "Artwork", href: "/admin/artworks", icon: Palette },
//   { label: "Artwork Queue", href: "/admin/artwork", icon: Layers },
//   { label: "Gallery", href: "/admin/gallery", icon: Image },
//   { label: "Shipping", href: "/admin/shipping", icon: Truck },
//   { label: "Contact Messages", href: "/admin/contact", icon: MessageSquare },
//   { label: "About Content", href: "/admin/about", icon: Info },
//   { label: "Profile", href: "/admin/profile", icon: User },
//   { label: "Settings", href: "/admin/settings", icon: Settings },
// ] as const;
