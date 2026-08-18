import {
  ORDER_STATUS,
  type OrderStatus,
} from "@/constants/order-status";

const STEPS: OrderStatus[] = [
  ORDER_STATUS.PAYMENT_VERIFIED,
  ORDER_STATUS.ARTWORK_QUEUE,
  ORDER_STATUS.DRAWING,
  ORDER_STATUS.QUALITY_CHECK,
  ORDER_STATUS.PACKAGED,
  ORDER_STATUS.SHIPPED,
  ORDER_STATUS.DELIVERED,
  ORDER_STATUS.COMPLETED,
];

interface Props {
  status: OrderStatus;
}

export default function OrderProgress({
  status,
}: Props) {
  const current = STEPS.indexOf(status);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {STEPS.map((step, index) => (
        <div
          key={step}
          className={`rounded-2xl border p-4 text-center ${
            index <= current
              ? "border-[#C9A227] bg-[#C9A227]/10"
              : "border-zinc-200"
          }`}
        >
          {step.replaceAll("_", " ")}
        </div>
      ))}
    </div>
  );
}