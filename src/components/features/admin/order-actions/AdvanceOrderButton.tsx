"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoadingButton from "../shared/LoadingButton";

import { OrderWorkflowService } from "@/services/order/order-workflow.service";

import type { OrderStatus } from "@/constants/order-status";

interface Props {
  orderId: string;
  currentStatus: OrderStatus;
}

export default function AdvanceOrderButton({
  orderId,
  currentStatus,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function advance() {
    const ok = confirm(
      "Move this order to the next stage?"
    );

    if (!ok) {
      return;
    }

    try {
      setLoading(true);

      await OrderWorkflowService.advance(
        orderId,
        currentStatus
      );

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={advance}
    >
      Advance Workflow
    </LoadingButton>
  );
}