"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  TrackingHeader,
  OrderTrackingCard,
  OrderProgress,
  ShippingTracker,
  CustomerTimeline,
} from "@/components/features/orders/tracking";

import { OrderService } from "@/services/order";
import { useAuth } from "@/context/AuthContext";
import type { Order } from "@/types/order";

export default function CustomerOrderPage() {
  const params =
    useParams<{ id: string }>();
  const router = useRouter();
  const { user, loading } = useAuth();

  const [order, setOrder] =
    useState<Order | null>(null);
  const [loadingOrder, setLoadingOrder] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  const orderId = params?.id;

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(
          `/customer/orders/${orderId}`,
        )}`,
      );
      return;
    }

    if (!orderId) {
      setError("Order ID is missing.");
      setLoadingOrder(false);
      return;
    }

    const unsubscribe =
      OrderService.subscribe(
        orderId,
        (nextOrder) => {
          if (!nextOrder) {
            setError("Order not found.");
            setOrder(null);
          } else if (
            nextOrder.customer.uid !==
            user.uid
          ) {
            setError(
              "You do not have access to this order.",
            );
            setOrder(null);
          } else {
            setOrder(nextOrder);
            setError(null);
          }

          setLoadingOrder(false);
        },
        (subscriptionError) => {
          console.error(
            "Customer tracking subscription failed:",
            subscriptionError,
          );
          setError(
            subscriptionError.message ||
              "Unable to load order tracking.",
          );
          setLoadingOrder(false);
        },
      );

    return () => unsubscribe();
  }, [
    loading,
    user,
    orderId,
    router,
  ]);

  if (loading || loadingOrder) {
    return (
      <main className="mx-auto max-w-7xl py-16">
        <div className="rounded-3xl border bg-white p-10 text-center">
          Loading order tracking...
        </div>
      </main>
    );
  }

  if (!order || error) {
    return (
      <main className="mx-auto max-w-7xl py-16">
        <div className="rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Unable to load order
          </h1>
          <p className="mt-3 text-sm text-red-700">
            {error ?? "Order not found."}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-7xl space-y-8">
      <TrackingHeader
        orderNumber={order.orderNumber}
      />

      <OrderTrackingCard order={order} />
      <OrderProgress status={order.status} />

      <ShippingTracker
        courier={order.shipping?.courier}
        trackingNumber={
          order.shipping?.trackingNumber
        }
        trackingUrl={
          order.shipping?.trackingUrl
        }
      />

      <CustomerTimeline
        timeline={order.timeline}
      />
    </main>
  );
}
