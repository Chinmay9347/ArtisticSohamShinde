"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import LoadingButton from "../shared/LoadingButton";
import { PaymentService } from "@/services/order";

interface ApprovePaymentButtonProps {
  orderId: string;
}

export default function ApprovePaymentButton({
  orderId,
}: ApprovePaymentButtonProps) {
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  async function approve() {
    if (!confirm("Approve this payment?")) {
      return;
    }

    try {
      setLoading(true);

      await PaymentService.approvePayment(orderId);

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <LoadingButton
      loading={loading}
      onClick={approve}
      className="bg-green-600 hover:bg-green-700"
    >
      Approve Payment
    </LoadingButton>
  );
}