"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import ConfirmationDialog from "../shared/ConfirmationDialog";
import RejectPaymentForm from "./RejectPaymentForm";

import { PaymentService } from "@/services/order";

interface RejectPaymentDialogProps {
  orderId: string;
}

export default function RejectPaymentDialog({
  orderId,
}: RejectPaymentDialogProps) {
  const [open, setOpen] = useState(false);

  const router = useRouter();

  async function reject(reason: string) {
    await PaymentService.rejectPayment(orderId, reason);

    setOpen(false);

    router.refresh();
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-xl bg-red-600 px-5 py-3 font-medium text-white"
      >
        Reject Payment
      </button>

      <ConfirmationDialog
        open={open}
        title="Reject Payment"
        description="Provide a reason for rejecting this payment."
        onClose={() => setOpen(false)}
      >
        <RejectPaymentForm onSubmit={reject} />
      </ConfirmationDialog>
    </>
  );
}