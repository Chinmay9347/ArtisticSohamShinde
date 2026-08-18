import { Button } from "@/components/ui/Button";

export function RecentOrders() {
  return (
    <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm">

      <h2 className="font-heading text-2xl font-semibold">
        Recent Orders
      </h2>

      <div className="mt-8 flex flex-col items-center justify-center py-12 text-center">

        <div className="text-6xl">
          📦
        </div>

        <h3 className="mt-6 text-2xl font-semibold">
          No Orders Yet
        </h3>

        <p className="mt-3 max-w-md text-zinc-500">
          Your commissioned artworks will appear here.
          Start your first portrait today.
        </p>

        <div className="mt-8">
          <Button>
            Start Commission
          </Button>
        </div>

      </div>

    </section>
  );
}

// import Link from "next/link";

// import { Button } from "@/components/ui/Button";

// interface Order {
//   id: string;
//   title: string;
//   status: string;
//   createdAt: string;
// }

// interface RecentOrdersProps {
//   orders?: Order[];
// }

// export function RecentOrders({
//   orders = [],
// }: RecentOrdersProps) {
//   if (orders.length === 0) {
//     return (
//       <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
//         <h2 className="mb-6 font-heading text-2xl font-semibold">
//           Recent Orders
//         </h2>

//         <div className="flex flex-col items-center py-10 text-center">

//           <div className="mb-5 text-6xl">
//             📦
//           </div>

//           <h3 className="text-xl font-semibold">
//             No Orders Yet
//           </h3>

//           <p className="mt-3 max-w-md text-zinc-500">
//             Your commissioned portraits will appear here once you
//             place your first order.
//           </p>

//           <Link
//             href="/commission"
//             className="mt-8"
//           >
//             <Button>
//               Commission Your First Portrait
//             </Button>
//           </Link>

//         </div>
//       </section>
//     );
//   }

//   return (
//     <section className="rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">

//       <h2 className="mb-6 font-heading text-2xl font-semibold">
//         Recent Orders
//       </h2>

//       <div className="space-y-4">
//         {orders.map((order) => (
//           <div
//             key={order.id}
//             className="flex items-center justify-between rounded-xl border border-zinc-200 p-4"
//           >
//             <div>
//               <p className="font-semibold">
//                 {order.title}
//               </p>

//               <p className="text-sm text-zinc-500">
//                 {order.createdAt}
//               </p>
//             </div>

//             <span className="rounded-full bg-[#C9A227]/10 px-4 py-2 text-sm font-medium text-[#C9A227]">
//               {order.status}
//             </span>
//           </div>
//         ))}
//       </div>

//     </section>
//   );
// }