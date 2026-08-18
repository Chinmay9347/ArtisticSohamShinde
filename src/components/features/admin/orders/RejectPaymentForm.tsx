"use client";

import { useState } from "react";

interface RejectPaymentFormProps {
  onSubmit(reason: string): void;
}

export default function RejectPaymentForm({
  onSubmit,
}: RejectPaymentFormProps) {
  const [reason, setReason] = useState("");

  return (
    <div className="space-y-5">

      <textarea
        rows={4}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        placeholder="Reason for rejection..."
        className="w-full rounded-xl border border-zinc-300 p-3"
      />

      <button
        onClick={() => onSubmit(reason)}
        disabled={!reason.trim()}
        className="rounded-xl bg-red-600 px-5 py-3 text-white disabled:opacity-50"
      >
        Reject Payment
      </button>

    </div>
  );
}