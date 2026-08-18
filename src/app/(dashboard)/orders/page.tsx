import { OrderList } from "@/components/features/orders/OrderList";

export default function OrdersPage() {
  return (
    <div className="space-y-8">

      <div>
        <h1 className="font-heading text-3xl font-bold">
          My Orders
        </h1>

        <p className="mt-2 text-zinc-600">
          Track your portrait commissions and payment progress.
        </p>
      </div>

      <OrderList />

    </div>
  );
}
// export default function OrdersPage() {
//   return (
//     <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">
//       <h1 className="font-heading text-3xl font-bold">
//         My Orders
//       </h1>

//       <p className="mt-3 text-zinc-600">
//         Order management is coming soon.
//       </p>
//     </div>
//   );
// }