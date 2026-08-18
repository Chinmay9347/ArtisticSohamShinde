import type { ReactNode } from "react";
import { DashboardLayout } from "@/components/features/dashboard/DashboardLayout";

export default function DashboardNestedLayout({ children }: { children: ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
