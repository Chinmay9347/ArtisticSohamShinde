"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { PaymentAccountForm } from "@/components/features/payment/PaymentAccountForm";

import { PaymentAccountService } from "@/services/payment-account";

import type {
  PaymentAccountFormValues,
} from "@/components/features/payment/PaymentAccountForm/PaymentAccountForm.types";

export default function NewPaymentAccountPage() {

  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  async function handleSubmit(
    values: PaymentAccountFormValues
  ) {

    try {

      setLoading(true);

      await PaymentAccountService.create(values);

      router.push(
        "/dashboard/payment-accounts"
      );

      router.refresh();

    } finally {

      setLoading(false);

    }

  }

  return (

    <main className="mx-auto max-w-4xl">

      <h1 className="mb-8 text-3xl font-bold">
        Add Payment Account
      </h1>

      <PaymentAccountForm
        loading={loading}
        onSubmit={handleSubmit}
      />

    </main>

  );

}

// "use client";

// import { useRouter } from "next/navigation";

// import { PaymentAccountForm } from "@/components/features/payment/PaymentAccountForm";

// import { PaymentAccountService } from "@/services/payment-account";

// export default function NewPaymentAccountPage() {
//   const router = useRouter();

//   async function handleSubmit(values: any) {
//     await PaymentAccountService.create(values);

//     router.push("/dashboard/payment-accounts");
//   }

//   return (
//     <main className="mx-auto max-w-4xl space-y-8">

//       <div>

//         <h1 className="text-3xl font-bold">
//           Add Payment Account
//         </h1>

//         <p className="mt-2 text-neutral-500">
//           Create a new payment destination.
//         </p>

//       </div>

//       <PaymentAccountForm
//         onSubmit={handleSubmit}
//       />

//     </main>
//   );
// }

// export default function NewPaymentAccountPage() {
//   return (
//     <main>

//       <h1 className="text-3xl font-bold">
//         Add Payment Account
//       </h1>

//       <p className="mt-2 text-neutral-500">
//         Create a new payment destination.
//       </p>

//     </main>
//   );
// }