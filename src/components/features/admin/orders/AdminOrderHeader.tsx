import AdminCard from "../shared/AdminCard";
import AdminStatusBadge from "./AdminStatusBadge";
import type { Order } from "@/types/order";

interface AdminOrderHeaderProps {
    order: Order;
}

export default function AdminOrderHeader({
  order,
}: AdminOrderHeaderProps) {
  return (
    <AdminCard>

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
            Order
          </p>

          <h1 className="mt-2 font-cinzel text-4xl">
            {order.orderNumber}
          </h1>

          <p className="mt-3 text-zinc-500">
            {order.customer.fullName}
          </p>

        </div>

        <AdminStatusBadge status={order.status} />

      </div>

    </AdminCard>
  );
}