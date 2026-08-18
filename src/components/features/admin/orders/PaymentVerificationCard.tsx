import AdminCard from "../shared/AdminCard";

import ApprovePaymentButton from "./ApprovePaymentButton";
import RejectPaymentButton from "./RejectPaymentButton";

interface PaymentVerificationCardProps {
  orderId: string;
  paymentStatus: string;
}

export default function PaymentVerificationCard({
  orderId,
  paymentStatus,
}: PaymentVerificationCardProps) {
  const finished =
    paymentStatus === "VERIFIED" ||
    paymentStatus === "REJECTED";

  return (
    <AdminCard>

      <h2 className="text-2xl font-semibold">
        Payment Verification
      </h2>

      <p className="mt-2 text-zinc-500">
        Review the uploaded receipt before verifying.
      </p>

      {finished ? (
        <p className="mt-8 font-semibold text-green-600">
          Payment already {paymentStatus.toLowerCase()}.
        </p>
      ) : (
        <div className="mt-8 flex flex-wrap gap-4">

          <ApprovePaymentButton orderId={orderId} />

          <RejectPaymentButton orderId={orderId} />

        </div>
      )}

    </AdminCard>
  );
}