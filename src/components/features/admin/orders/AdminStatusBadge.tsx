interface AdminStatusBadgeProps {
  status: string;
}

export default function AdminStatusBadge({ status }: AdminStatusBadgeProps) {
  const normalized = status.includes(":") ? status.split(":")[0].trim() : status;
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    SUBMITTED: "bg-yellow-100 text-yellow-800",
    PAYMENT_PENDING: "bg-yellow-100 text-yellow-800",
    PAYMENT_SUBMITTED: "bg-yellow-100 text-yellow-800",
    VERIFIED: "bg-green-100 text-green-800",
    PAYMENT_VERIFIED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    PAYMENT_REJECTED: "bg-red-100 text-red-800",
    DRAWING: "bg-purple-100 text-purple-800",
    QUALITY_CHECK: "bg-orange-100 text-orange-800",
    PACKAGED: "bg-cyan-100 text-cyan-800",
    SHIPPED: "bg-sky-100 text-sky-800",
    DELIVERED: "bg-green-100 text-green-800",
    COMPLETED: "bg-emerald-100 text-emerald-800",
    CANCELLED: "bg-zinc-200 text-zinc-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${colors[normalized] ?? "bg-zinc-100 text-zinc-700"}`}>
      {status.replaceAll("_", " ")}
    </span>
  );
}
