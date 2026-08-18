"use client";

import { useEffect, useMemo, useState } from "react";

import ShippingQueue from "@/components/features/admin/shipping/ShippingQueue";
import { OrderService } from "@/services/order";

import type { Order } from "@/types/order";

export default function ShippingPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const unsubscribe = OrderService.subscribeAll(
      (nextOrders) => {
        setOrders(nextOrders);
        setLoading(false);
      },
      (subscriptionError) => {
        console.error(
          "Failed to subscribe to shipping orders:",
          subscriptionError,
        );
        setError(
          subscriptionError.message ||
            "Unable to load shipping orders.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  const shippingOrders = useMemo(
    () =>
      orders.filter(
        (order) =>
          order.status === "PACKAGED" ||
          order.status === "SHIPPED",
      ),
    [orders],
  );

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
          Administration
        </p>

        <h1 className="mt-2 font-cinzel text-4xl">
          Shipping
        </h1>

        <p className="mt-2 text-sm text-neutral-500">
          Manage packed and shipped orders, courier details,
          tracking information, and delivery updates.
        </p>
      </div>

      {loading && (
        <div className="rounded-2xl border border-neutral-200 bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-neutral-200 border-t-[#C9A227]" />

          <p className="text-sm text-neutral-500">
            Loading shipping orders...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="font-semibold text-red-800">
            Unable to load shipping orders
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <ShippingQueue orders={shippingOrders} />
      )}
    </main>
  );
}

// import ShippingQueue from "@/components/features/admin/shipping/ShippingQueue";
// import { OrderService } from "@/services/order";

// export default async function ShippingPage() {
//   const orders = await OrderService.getAll();

//   const shippingOrders = orders.filter(
//     (order) =>
//       order.status === "PACKAGED" ||
//       order.status === "SHIPPED"
//   );

//   return (
//     <main className="mx-auto max-w-7xl space-y-8">

//       <div>
//         <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">
//           Administration
//         </p>

//         <h1 className="mt-2 font-cinzel text-4xl">
//           Shipping
//         </h1>
//       </div>

//       <ShippingQueue
//         orders={shippingOrders}
//       />

//     </main>
//   );
// }