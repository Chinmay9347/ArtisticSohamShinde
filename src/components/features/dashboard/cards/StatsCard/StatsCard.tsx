import { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  description?: string;
}

export function StatsCard({
  title,
  value,
  icon,
  description,
}: StatsCardProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:-translate-y-2 hover:shadow-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-zinc-500">
            {title}
          </p>

          <h3 className="mt-2 text-4xl font-bold tracking-tight text-zinc-900">
            {value}
          </h3>

          {description && (
            <p className="mt-2 text-sm text-zinc-500">
              {description}
            </p>
          )}
        </div>

        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
          {icon}
        </div>
      </div>
    </div>
  );
}