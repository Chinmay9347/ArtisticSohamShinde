import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/features/dashboard/DashboardLayout";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
