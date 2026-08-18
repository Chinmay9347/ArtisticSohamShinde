"use client";

import type { OrderSummaryProps } from "./OrderSummary.types";

export function OrderSummary({
  order,
}: OrderSummaryProps) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">
        Order Summary
      </h2>

      <div className="mt-6 space-y-4">
        <div className="flex justify-between">
          <span>Order Number</span>

          <strong>
            {order.orderNumber}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Package</span>

          <strong>
            {order.portrait.packageId}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Subjects</span>

          <strong>
            {order.portrait.subjects}
          </strong>
        </div>

        <div className="flex justify-between">
          <span>Total</span>

          <strong>
            ₹
            {order.payment.amount.toLocaleString(
              "en-IN"
            )}
          </strong>
        </div>
      </div>
    </div>
  );
}