import type { ReactNode } from "react";

interface AdminCardProps {
  children: ReactNode;
  className?: string;
}

export default function AdminCard({
  children,
  className = "",
}: AdminCardProps) {
  return (
    <section
      className={`rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm ${className}`}
    >
      {children}
    </section>
  );
}