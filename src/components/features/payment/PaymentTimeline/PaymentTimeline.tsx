"use client";

import type { PaymentTimelineProps } from "./PaymentTimeline.types";

export function PaymentTimeline({
  timeline,
}: PaymentTimelineProps) {
  return (
    <div className="rounded-xl border p-6">
      <h2 className="text-xl font-semibold">
        Order Progress
      </h2>

      <div className="mt-6 space-y-4">
        {timeline.map((item, index) => (
          <div
            key={index}
            className="flex items-start gap-4"
          >
            <div className="mt-2 h-3 w-3 rounded-full bg-black" />

            <div>
              <p className="font-medium">
                {item.title}
              </p>

              <p className="text-sm text-neutral-500">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}