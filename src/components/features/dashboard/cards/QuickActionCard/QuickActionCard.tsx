import Link from "next/link";
import { ReactNode } from "react";

interface QuickActionCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
}

export function QuickActionCard({
  title,
  description,
  href,
  icon,
}: QuickActionCardProps) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-md"
    >
      <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#C9A227]/10 text-[#C9A227] transition group-hover:bg-[#C9A227] group-hover:text-white">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-zinc-900">
        {title}
      </h3>

      <p className="mt-2 text-sm text-zinc-500">
        {description}
      </p>
    </Link>
  );
}