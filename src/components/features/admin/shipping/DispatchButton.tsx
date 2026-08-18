"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShippingService } from "@/services/order/shipping.service";

import type { Order } from "@/types/order";

interface Props {
  order: Order;
}

export default function DispatchButton({
  order,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function dispatch() {
    const courier = prompt("Courier Name");

    if (!courier) return;

    const trackingNumber = prompt("Tracking Number");

    if (!trackingNumber) return;

    const trackingUrl =
      prompt("Tracking URL (Optional)") ?? "";

    try {
      setLoading(true);

      await ShippingService.createShipment(
        order.id,
        {
          courier,
          trackingNumber,
          trackingUrl,
        }
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      disabled={loading}
      onClick={dispatch}
      className="rounded-xl bg-[#C9A227] px-4 py-2 text-white"
    >
      {loading ? "Dispatching..." : "Dispatch"}
    </button>
  );
}