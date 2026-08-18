"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { PaymentAccountForm } from "@/components/features/payment/PaymentAccountForm";

import { PaymentAccountService } from "@/services/payment-account";

import type { PaymentAccount } from "@/types/payment-account";

import type {
  PaymentAccountFormValues,
} from "@/components/features/payment/PaymentAccountForm/PaymentAccountForm.types";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPaymentAccountPage({
  params,
}: Props) {

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [account, setAccount] =
    useState<PaymentAccount | null>(null);

  useEffect(() => {

    async function load() {

      const { id } = await params;

      const result =
        await PaymentAccountService.get(id);

      setAccount(result);

      setLoading(false);

    }

    load();

  }, [params]);

  async function handleSubmit(
    values: PaymentAccountFormValues
  ) {

    if (!account) {
      return;
    }

    try {

      setSaving(true);

      await PaymentAccountService.update(
        account.id,
        values
      );

      router.push(
        "/dashboard/payment-accounts"
      );

      router.refresh();

    } finally {

      setSaving(false);

    }

  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!account) {
    return (
      <p>
        Payment account not found.
      </p>
    );
  }

  return (

    <main className="mx-auto max-w-4xl">

      <h1 className="mb-8 text-3xl font-bold">
        Edit Payment Account
      </h1>

      <PaymentAccountForm
        initialValues={account}
        loading={saving}
        submitLabel="Update Payment Account"
        onSubmit={handleSubmit}
      />

    </main>

  );

}