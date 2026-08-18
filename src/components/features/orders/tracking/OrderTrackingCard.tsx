import type { Order } from "@/types/order";

interface Props {
  order: Order;
}

export default function OrderTrackingCard({
  order,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="text-2xl font-semibold">
        {order.orderNumber}
      </h2>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-sm text-zinc-500">
            Order Status
          </p>

          <p className="font-semibold">
            {order.status.replaceAll("_", " ")}
          </p>
        </div>

        <div>
          <p className="text-sm text-zinc-500">
            Payment
          </p>

          <p className="font-semibold">
            {order.payment.status}
          </p>
        </div>
      </div>
    </div>
  );
}