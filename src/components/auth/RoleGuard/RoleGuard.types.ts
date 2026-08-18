import type { ReactNode } from "react";
import type { UserRole } from "@/types/user";

export interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}
