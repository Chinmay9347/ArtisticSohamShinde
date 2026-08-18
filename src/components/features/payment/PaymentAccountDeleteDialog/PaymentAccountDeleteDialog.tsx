"use client";

import { useState } from "react";

import type {
  PaymentAccountDeleteDialogProps,
} from "./PaymentAccountDeleteDialog.types";

export function PaymentAccountDeleteDialog({
  open,
  accountTitle,
  loading = false,
  onClose,
  onConfirm,
}: PaymentAccountDeleteDialogProps) {

  const [submitting, setSubmitting] =
    useState(false);

  if (!open) {
    return null;
  }

  async function handleDelete() {
    try {
      setSubmitting(true);

      await onConfirm();

      onClose();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">

        <div className="text-center">

          <div className="text-5xl">
            ⚠️
          </div>

          <h2 className="mt-4 text-2xl font-bold">
            Delete Payment Account?
          </h2>

          <p className="mt-3 text-neutral-500">
            You are about to permanently delete
          </p>

          <p className="mt-2 font-semibold">
            {accountTitle}
          </p>

          <p className="mt-4 text-sm text-red-600">
            This action cannot be undone.
          </p>

        </div>

        <div className="mt-8 flex justify-end gap-3">

          <button
            type="button"
            disabled={submitting || loading}
            onClick={onClose}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={submitting || loading}
            onClick={handleDelete}
            className="rounded-lg bg-red-600 px-5 py-2 text-white"
          >
            {submitting
              ? "Deleting..."
              : "Delete"}
          </button>

        </div>

      </div>

    </div>
  );
}