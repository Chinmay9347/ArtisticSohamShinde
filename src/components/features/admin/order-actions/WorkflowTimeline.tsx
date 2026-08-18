import {
  ORDER_STATUS,
  type OrderStatus,
} from "@/constants/order-status";

import WorkflowStep from "./WorkflowStep";

const FLOW: OrderStatus[] = [
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
  currentStatus: OrderStatus;
}

export default function WorkflowTimeline({
  currentStatus,
}: Props) {
  const activeIndex = FLOW.indexOf(currentStatus);

  return (
    <div className="space-y-5">

      {FLOW.map((status, index) => (

        <WorkflowStep
          key={status}
          title={status.replaceAll("_", " ")}
          active={index === activeIndex}
          completed={index < activeIndex}
        />

      ))}

    </div>
  );
}