import AdminCard from "../shared/AdminCard";

import AdvanceOrderButton from "./AdvanceOrderButton";
import WorkflowTimeline from "./WorkflowTimeline";

import {
  ORDER_STATUS,
  type OrderStatus,
} from "@/constants/order-status";

interface Props {
  orderId: string;

  status: OrderStatus;
}

export default function OrderWorkflowCard({
  orderId,
  status,
}: Props) {
  const canAdvance =
    status !== ORDER_STATUS.COMPLETED &&
    status !== ORDER_STATUS.CANCELLED &&
    status !== ORDER_STATUS.PAYMENT_PENDING &&
    status !== ORDER_STATUS.PAYMENT_SUBMITTED &&
    status !== ORDER_STATUS.PAYMENT_REJECTED;

  return (
    <AdminCard>

      <h2 className="text-2xl font-semibold">
        Order Workflow
      </h2>

      <div className="mt-8">

        <WorkflowTimeline
          currentStatus={status}
        />

      </div>

      {canAdvance && (

        <div className="mt-8">

          <AdvanceOrderButton
            orderId={orderId}
            currentStatus={status}
          />

        </div>

      )}

    </AdminCard>
  );
}