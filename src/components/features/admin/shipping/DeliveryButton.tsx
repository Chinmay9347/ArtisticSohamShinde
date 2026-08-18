"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ShippingService } from "@/services/order/shipping.service";

interface Props {
  orderId: string;
}

export default function DeliveryButton({
  orderId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function deliver() {
    if (
      !confirm(
        "Mark this order as delivered?"
      )
    ) {
      return;
    }

    try {
      setLoading(true);

      await ShippingService.markDelivered(
        orderId
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={deliver}
      disabled={loading}
      className="rounded-xl bg-green-600 px-4 py-2 text-white"
    >
      {loading ? "Updating..." : "Delivered"}
    </button>
  );
}