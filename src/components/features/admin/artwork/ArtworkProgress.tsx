import { ORDER_STATUS, type OrderStatus } from "@/constants/order-status";

const STEPS: OrderStatus[] = [
  ORDER_STATUS.ARTWORK_QUEUE,
  ORDER_STATUS.DRAWING,
  ORDER_STATUS.QUALITY_CHECK,
  ORDER_STATUS.PACKAGED,
];

interface Props {
  status: OrderStatus;
}

export default function ArtworkProgress({
  status,
}: Props) {
  const current = STEPS.indexOf(status);

  return (
    <div className="mt-6 flex gap-4">
      {STEPS.map((step, index) => (
        <div
          key={step}
          className={`flex-1 rounded-xl p-3 text-center text-sm ${
            index <= current
              ? "bg-[#C9A227] text-white"
              : "bg-zinc-100"
          }`}
        >
          {step.replaceAll("_", " ")}
        </div>
      ))}
    </div>
  );
}