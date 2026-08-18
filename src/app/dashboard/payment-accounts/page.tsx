"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { PaymentAccountService } from "@/services/payment-account";
import { PaymentAccountTable } from "@/components/features/payment/PaymentAccountTable";

import type { PaymentAccount } from "@/types/payment-account";

export default function PaymentAccountsPage() {
  const [accounts, setAccounts] = useState<PaymentAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadAccounts() {
      try {
        setLoading(true);
        setError("");

        const data = await PaymentAccountService.getAll();

        if (mounted) {
          setAccounts(data);
        }
      } catch (error) {
        console.error(
          "Failed to load payment accounts:",
          error,
        );

        if (mounted) {
          setError(
            error instanceof Error
              ? error.message
              : "Unable to load payment accounts.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAccounts();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <main className="space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Payment Accounts
          </h1>

          <p className="mt-2 text-neutral-500">
            Manage all payment destinations.
          </p>
        </div>

        <Link
          href="/dashboard/payment-accounts/new"
          className="rounded-xl bg-black px-5 py-3 text-white transition hover:bg-neutral-800"
        >
          + Add Account
        </Link>
      </div>

      {loading && (
        <div className="rounded-2xl border bg-white p-12 text-center">
          <p className="text-neutral-500">
            Loading payment accounts...
          </p>
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
          <h2 className="font-semibold text-red-800">
            Unable to load payment accounts
          </h2>

          <p className="mt-2 text-sm text-red-700">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && (
        <PaymentAccountTable
          accounts={accounts}
        />
      )}
    </main>
  );
}

// import Link from "next/link";

// import { PaymentAccountService } from "@/services/payment-account";

// import { PaymentAccountTable } from "@/components/features/payment/PaymentAccountTable";

// export default async function PaymentAccountsPage() {

//   const accounts =
//     await PaymentAccountService.getAll();

//   return (
//     <main className="space-y-8">

//       <div className="flex items-center justify-between">

//         <div>

//           <h1 className="text-3xl font-bold">
//             Payment Accounts
//           </h1>

//           <p className="mt-2 text-neutral-500">
//             Manage all payment destinations.
//           </p>

//         </div>

//         <Link
//           href="/dashboard/payment-accounts/new"
//           className="rounded-xl bg-black px-5 py-3 text-white"
//         >
//           + Add Account
//         </Link>

//       </div>

//       <PaymentAccountTable
//         accounts={accounts}
//       />

//     </main>
//   );
// }


// import Link from "next/link";

// import { PaymentAccountService } from "@/services/payment-account";

// export default async function PaymentAccountsPage() {

//   const accounts =
//     await PaymentAccountService.getAll();

//   return (
//     <main className="space-y-8">

//       <div className="flex items-center justify-between">

//         <div>

//           <h1 className="text-3xl font-bold">
//             Payment Accounts
//           </h1>

//           <p className="mt-2 text-neutral-500">
//             Manage all payment destinations.
//           </p>

//         </div>

//         <Link
//           href="/dashboard/payment-accounts/new"
//           className="rounded-xl bg-black px-5 py-3 text-white"
//         >
//           + Add Account
//         </Link>

//       </div>

//       <div className="overflow-hidden rounded-2xl border bg-white">

//         <table className="w-full">

//           <thead>

//             <tr className="border-b bg-neutral-50 text-left">

//               <th className="px-6 py-4">
//                 Name
//               </th>

//               <th>
//                 Type
//               </th>

//               <th>
//                 Status
//               </th>

//               <th>
//                 Order
//               </th>

//               <th className="text-right pr-6">
//                 Actions
//               </th>

//             </tr>

//           </thead>

//           <tbody>

//             {accounts.length === 0 && (

//               <tr>

//                 <td
//                   colSpan={5}
//                   className="py-20 text-center text-neutral-500"
//                 >
//                   No payment accounts found.
//                 </td>

//               </tr>

//             )}

//             {accounts.map((account) => (

//               <tr
//                 key={account.id}
//                 className="border-b"
//               >

//                 <td className="px-6 py-5">

//                   <div className="font-medium">
//                     {account.title}
//                   </div>

//                   <div className="text-sm text-neutral-500">
//                     {account.accountHolder}
//                   </div>

//                 </td>

//                 <td>

//                   {account.type.toUpperCase()}

//                 </td>

//                 <td>

//                   {account.enabled
//                     ? "🟢 Enabled"
//                     : "🔴 Disabled"}

//                 </td>

//                 <td>

//                   {account.displayOrder}

//                 </td>

//                 <td className="pr-6 text-right">

//                   <Link
//                     href={`/dashboard/payment-accounts/${account.id}/edit`}
//                     className="mr-4 text-blue-600"
//                   >
//                     Edit
//                   </Link>

//                   <button className="text-red-600">
//                     Delete
//                   </button>

//                 </td>

//               </tr>

//             ))}

//           </tbody>

//         </table>

//       </div>

//     </main>
//   );
// }

// import Link from "next/link";

// export default function PaymentAccountsPage() {
//   return (
//     <main className="space-y-8">

//       <div className="flex items-center justify-between">

//         <div>
//           <h1 className="text-3xl font-bold">
//             Payment Accounts
//           </h1>

//           <p className="mt-2 text-neutral-500">
//             Manage UPI IDs, bank accounts and QR codes.
//           </p>
//         </div>

//         <Link
//           href="/dashboard/payment-accounts/new"
//           className="rounded-xl bg-black px-5 py-3 text-white"
//         >
//           + Add Account
//         </Link>

//       </div>

//       <div className="rounded-2xl border bg-white">

//         <div className="grid grid-cols-6 border-b bg-neutral-50 px-6 py-4 font-semibold">

//           <div>Name</div>
//           <div>Type</div>
//           <div>Status</div>
//           <div>Display Order</div>
//           <div>Default</div>
//           <div className="text-right">
//             Actions
//           </div>

//         </div>

//         <div className="flex h-72 items-center justify-center text-neutral-500">
//           No payment accounts found.
//         </div>

//       </div>

//     </main>
//   );
// }