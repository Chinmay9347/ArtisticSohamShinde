import AdminCard from "../shared/AdminCard";
import AdminStatusBadge from "./AdminStatusBadge";
import PaymentReceiptViewer from "./PaymentReceiptViewer";

import type { PaymentDetails } from "@/types/payment";

interface AdminPaymentCardProps {
  payment: PaymentDetails;
}

export default function AdminPaymentCard({
  payment,
}: AdminPaymentCardProps) {
  const transactionId =
    payment.transactionId?.trim() ||
    "";

  return (
    <AdminCard>
      <h2 className="text-2xl font-semibold">
        Payment Information
      </h2>

      <div className="mt-8 grid gap-6 md:grid-cols-2">
        {/* Payment Status */}
        <div>
          <p className="text-sm text-zinc-500">
            Status
          </p>

          <div className="mt-2">
            <AdminStatusBadge
              status={
                payment.status
              }
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <p className="text-sm text-zinc-500">
            Method
          </p>

          <p className="mt-1 font-medium">
            {payment.method || "—"}
          </p>
        </div>

        {/* Amount */}
        <div>
          <p className="text-sm text-zinc-500">
            Amount
          </p>

          <p className="mt-1 font-semibold">
            ₹
            {Number(
              payment.amount ?? 0,
            ).toLocaleString(
              "en-IN",
            )}
          </p>
        </div>

        {/* Transaction ID */}
        <div>
          <p className="text-sm text-zinc-500">
            Transaction ID
          </p>

          <div className="mt-1 rounded-xl border bg-zinc-50 px-4 py-3">
            {transactionId ? (
              <p
                className="break-all font-mono text-sm font-semibold text-zinc-900"
                title={transactionId}
              >
                {transactionId}
              </p>
            ) : (
              <p className="text-sm text-zinc-400">
                Not submitted
              </p>
            )}
          </div>
        </div>

        {/* Receipt */}
        <div className="md:col-span-2">
          <p className="mb-3 text-sm text-zinc-500">
            Payment Receipt
          </p>

          <PaymentReceiptViewer
            receipt={
              payment.receipt
            }
          />
        </div>
      </div>
    </AdminCard>
  );
}

// import AdminCard from "../shared/AdminCard";
// import AdminStatusBadge from "./AdminStatusBadge";
// import PaymentReceiptViewer from "./PaymentReceiptViewer";
// import type { PaymentDetails } from "@/types/payment";

// interface AdminPaymentCardProps {
//   payment: PaymentDetails;
// }

// export default function AdminPaymentCard({
//   payment,
// }: AdminPaymentCardProps) {
//   return (
//     <AdminCard>

//       <h2 className="text-2xl font-semibold">
//         Payment Information
//       </h2>

//       <div className="mt-8 grid gap-6 md:grid-cols-2">

//         <div>

//           <p className="text-sm text-zinc-500">
//             Status
//           </p>

//           <div className="mt-2">
//             <AdminStatusBadge status={payment.status} />
//           </div>

//         </div>

//         <div>

//           <p className="text-sm text-zinc-500">
//             Method
//           </p>

//           <p className="mt-1">
//             {payment.method}
//           </p>

//         </div>

//         <div>

//           <p className="text-sm text-zinc-500">
//             Amount
//           </p>

//           <p className="mt-1">
//             ₹{payment.amount.toLocaleString("en-IN")}
//           </p>

//         </div>

//         <div>

//           <p className="text-sm text-zinc-500">
//             Transaction ID
//           </p>

//           <p className="mt-1 break-all">
//             {payment.transactionId || "-"}
//           </p>

//         </div>

//         <div className="md:col-span-2">

//           <p className="mb-3 text-sm text-zinc-500">
//             Receipt
//           </p>

//           <PaymentReceiptViewer receipt={payment.receipt} />

//         </div>

//       </div>

//     </AdminCard>
//   );
// }