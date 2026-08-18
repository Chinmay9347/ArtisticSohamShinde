import Link from "next/link";
import type { Order } from "@/types/order";
import AssignArtistDialog from "./AssignArtistDialog";
import ArtworkProgress from "./ArtworkProgress";

interface Props {
  order: Order;
}

export default function ArtworkStatusCard({
  order,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-6 shadow-sm">

      <p className="text-sm text-zinc-500">
        {order.orderNumber}
      </p>

      <h2 className="mt-2 text-xl font-semibold">
        {order.customer.fullName}
      </h2>

      <div className="mt-5 space-y-2 text-sm">

        <p>
          <strong>Status:</strong> {order.status}
        </p>

        <p>
          <strong>Payment:</strong> {order.payment.status}
        </p>

      </div>

      <div className="mt-4">
        <p className="text-sm">
          <strong>Artist:</strong>{" "}
          {order.artist?.name ?? "Not Assigned"}
        </p>
      </div>

      <ArtworkProgress status={order.status} />

      <div className="mt-6 flex flex-wrap gap-3">
        {!order.artist && (
          <AssignArtistDialog orderId={order.id} />
        )}

        <Link
          href={`/admin/orders/${order.id}`}
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          View Order
        </Link>
      </div>
            {/* <div className="mt-6 flex gap-3">

        <Link
          href={`/admin/orders/${order.id}`}
          className="rounded-xl bg-black px-5 py-2 text-white"
        >
          View Order
        </Link>

      </div> */}

    </div>
  );
}