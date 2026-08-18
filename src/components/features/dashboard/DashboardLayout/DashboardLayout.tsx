"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { RoleGuard } from "@/components/auth/RoleGuard";
import type { UserRole } from "@/types/user";
import { Sidebar } from "../DashboardSidebar";
import { DashboardNavbar } from "../DashboardNavbar";
import { Footer } from "@/components/layout/Footer";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const refresh = () => router.refresh();
    window.addEventListener("focus", refresh);
    return () => window.removeEventListener("focus", refresh);
  }, [router]);

  const isInvoiceRoute = pathname === "/invoices" || pathname.startsWith("/invoices/");
  const isAdminPaymentAccountRoute = pathname.startsWith("/dashboard/payment-accounts");
  const allowedRoles: UserRole[] = pathname.startsWith("/admin") || isAdminPaymentAccountRoute
    ? ["ADMIN"]
    : pathname.startsWith("/artist")
      ? ["ARTIST"]
      : pathname.startsWith("/invoices/")
        ? ["CUSTOMER", "ARTIST", "ADMIN"]
        : ["CUSTOMER"];

  if (isInvoiceRoute) return <RoleGuard allowedRoles={allowedRoles}>{children}</RoleGuard>;

  return (
    <RoleGuard allowedRoles={allowedRoles}>
      <div className="min-h-screen bg-zinc-50">
        <DashboardNavbar onMenuClick={() => setSidebarOpen((open) => !open)} />
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-h-screen pt-16 lg:pl-72">
          <main className="min-h-[calc(100vh-4rem)] px-4 py-6 sm:px-6 lg:px-8"><div className="mx-auto w-full max-w-[1600px]">{children}</div></main>
          <Footer />
        </div>
      </div>
    </RoleGuard>
  );
}
