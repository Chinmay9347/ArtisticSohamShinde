"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { OrderWorkflowService } from "@/services/order/order-workflow.service";
import type { Order } from "@/types/order";

export function ArtistStatusChangeButton({
  order,
}: {
  order: Order;
}) {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const next = OrderWorkflowService.getNextStatus(
    order.status,
  );

  if (!next) return null;

  const close = () => {
    if (saving) return;
    setStep(null);
    setConfirmed(false);
    setError("");
  };

  const submit = async () => {
    if (!confirmed) {
      setError("Please confirm the status change before continuing.");
      return;
    }

    try {
      setSaving(true);
      setError("");
      await OrderWorkflowService.advance(
        order.id,
        order.status,
      );
      close();
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to change artwork status.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setStep(1)}
        className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black"
      >
        Move to {next.replaceAll("_", " ")}
      </button>

      {step && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            {step === 1 ? (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7414]">
                  Step 1 of 2 · Review
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Change artwork status?
                </h2>

                <div className="mt-5 space-y-3 rounded-2xl bg-neutral-50 p-4 text-sm">
                  <Row label="Order" value={order.orderNumber} />
                  <Row
                    label="Current"
                    value={order.status.replaceAll("_", " ")}
                  />
                  <Row
                    label="New status"
                    value={next.replaceAll("_", " ")}
                  />
                  <Row
                    label="Customer"
                    value={order.customer.fullName}
                  />
                </div>

                <p className="mt-4 text-sm leading-6 text-neutral-600">
                  This changes the production status visible to the customer
                  and admin. Review the order carefully before continuing.
                </p>

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={close}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setStep(2);
                      setConfirmed(false);
                      setError("");
                    }}
                    className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white"
                  >
                    Continue
                  </button>
                </div>
              </>
            ) : (
              <>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7414]">
                  Step 2 of 2 · Final confirmation
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  Confirm status change
                </h2>

                <label className="mt-5 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                  <input
                    type="checkbox"
                    checked={confirmed}
                    onChange={(event) =>
                      setConfirmed(event.target.checked)
                    }
                    className="mt-1 h-4 w-4 shrink-0"
                  />
                  <span>
                    I confirm that I want to change{" "}
                    <strong>{order.orderNumber}</strong> from{" "}
                    <strong>
                      {order.status.replaceAll("_", " ")}
                    </strong>{" "}
                    to{" "}
                    <strong>
                      {next.replaceAll("_", " ")}
                    </strong>
                    .
                  </span>
                </label>

                {error && (
                  <p className="mt-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">
                    {error}
                  </p>
                )}

                <div className="mt-6 flex justify-end gap-3">
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() => {
                      setStep(1);
                      setConfirmed(false);
                      setError("");
                    }}
                    className="rounded-xl border px-4 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    disabled={saving || !confirmed}
                    onClick={() => void submit()}
                    className="rounded-xl bg-black px-5 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {saving ? "Updating..." : "Confirm Status Change"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-neutral-200 py-2 last:border-0">
      <span className="text-neutral-500">{label}</span>
      <span className="text-right font-semibold text-neutral-900">
        {value}
      </span>
    </div>
  );
}
