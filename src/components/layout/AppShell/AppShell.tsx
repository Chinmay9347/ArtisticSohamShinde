"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

function isPrivateRoute(pathname: string) {
  return pathname === "/admin" || pathname.startsWith("/admin/")
    || pathname === "/artist" || pathname.startsWith("/artist/")
    || pathname === "/dashboard" || pathname.startsWith("/dashboard/")
    || pathname === "/orders" || pathname.startsWith("/orders/")
    || pathname === "/profile" || pathname.startsWith("/profile/")
    || pathname === "/settings" || pathname.startsWith("/settings/")
    || pathname === "/wishlist" || pathname.startsWith("/wishlist/")
    || pathname === "/payment" || pathname.startsWith("/payment/")
    || pathname === "/invoices" || pathname.startsWith("/invoices/");
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (isPrivateRoute(pathname)) return <>{children}</>;
  return <><Navbar />{children}<Footer /></>;
}
