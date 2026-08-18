"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";

import { OrderCard } from "../OrderCard";

export function OrderList() {
  const { user, loading } = useAuth();
  const { profile } = useUserProfile();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;

    if (!user) {
      setOrders([]);
      setIsLoading(false);
      return;
    }

    const unsubscribe = OrderService.subscribeByUser(
      user.uid,
      (nextOrders) => {
        setOrders(nextOrders);
        setIsLoading(false);
      },
      (err) => {
        console.error(err);
        setError("Failed to load your orders.");
        setIsLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user, loading]);

  if (loading || isLoading) {
    return (
      <div className="rounded-3xl border border-zinc-200 bg-white p-12 text-center">
        <h2 className="text-2xl font-semibold">
          Loading Orders...
        </h2>

        <p className="mt-3 text-zinc-600">
          Please wait while we fetch your orders.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-3xl border border-red-200 bg-red-50 p-12 text-center">
        <h2 className="text-2xl font-semibold text-red-700">
          Something went wrong
        </h2>

        <p className="mt-3 text-red-600">
          {error}
        </p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
        <h2 className="text-2xl font-semibold">
          No Orders Yet
        </h2>

        <p className="mt-3 text-zinc-600">
          Your commissioned portraits will appear here after you place your first order.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {orders.map((order) => (
        <OrderCard
          key={order.id}
          order={order}
        />
      ))}
    </div>
  );
}

// "use client";

// import type { Order } from "@/types/order";
// import { OrderCard } from "../OrderCard/OrderCard";

// const sampleOrders = [] as Order[];

// export function OrderList() {
//   if (sampleOrders.length === 0) {
//     return (
//       <div className="rounded-3xl border border-dashed border-zinc-300 bg-white p-12 text-center">
//         <h2 className="text-2xl font-semibold">
//           No Orders Yet
//         </h2>

//         <p className="mt-3 text-zinc-600">
//           Your commissioned portraits will appear here after you place your first order.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="grid gap-6">
//       {sampleOrders.map((order) => (
//         <OrderCard
//           key={order.id}
//           order={order}
//         />
//       ))}
//     </div>
//   );
// }