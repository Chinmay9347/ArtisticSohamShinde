"use client";

import { useMemo, useState } from "react";

import Link from "next/link";

import { useRouter } from "next/navigation";

import { PaymentAccountService } from "@/services/payment-account";

import { PaymentAccountDeleteDialog } from "../PaymentAccountDeleteDialog";

import type {
  PaymentAccountTableProps,
} from "./PaymentAccountTable.types";

export function PaymentAccountTable({
  accounts,
}: PaymentAccountTableProps) {

  const router = useRouter();

  const [selectedId, setSelectedId] =
    useState<string | null>(null);

  const selectedAccount = useMemo(
    () =>
      accounts.find(
        (account) =>
          account.id === selectedId
      ),
    [accounts, selectedId]
  );

  async function handleDelete() {
    if (!selectedAccount) {
      return;
    }

    await PaymentAccountService.delete(
      selectedAccount.id
    );

    router.refresh();

    setSelectedId(null);
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-white">

        <table className="w-full">

          <thead>

            <tr className="border-b bg-neutral-50">

              <th className="px-6 py-4 text-left">
                Title
              </th>

              <th className="text-left">
                Type
              </th>

              <th className="text-left">
                Status
              </th>

              <th className="text-left">
                Order
              </th>

              <th className="pr-6 text-right">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {accounts.length === 0 && (

              <tr>

                <td
                  colSpan={5}
                  className="py-16 text-center text-neutral-500"
                >
                  No payment accounts found.
                </td>

              </tr>

            )}

            {accounts.map((account) => (

              <tr
                key={account.id}
                className="border-b last:border-0"
              >

                <td className="px-6 py-5">

                  <div className="font-medium">
                    {account.title}
                  </div>

                  <div className="text-sm text-neutral-500">
                    {account.accountHolder}
                  </div>

                </td>

                <td>

                  {account.type.toUpperCase()}

                </td>

                <td>

                  {account.enabled
                    ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                        Enabled
                      </span>
                    )
                    : (
                      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                        Disabled
                      </span>
                    )}

                </td>

                <td>

                  {account.displayOrder}

                </td>

                <td className="pr-6 text-right">

                  <Link
                    href={`/dashboard/payment-accounts/${account.id}/edit`}
                    className="mr-4 font-medium text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(account.id)
                    }
                    className="font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>

                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      <PaymentAccountDeleteDialog
        open={!!selectedAccount}
        accountTitle={
          selectedAccount?.title ?? ""
        }
        onClose={() =>
          setSelectedId(null)
        }
        onConfirm={handleDelete}
      />
    </>
  );
}