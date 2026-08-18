import type { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: ReactNode;
}

export default function DashboardCard({
  title,
  value,
}: DashboardCardProps) {
  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">

      <p className="text-sm text-zinc-500">
        {title}
      </p>

      <h2 className="mt-3 text-4xl font-bold">
        {value}
      </h2>

    </div>
  );
}