"use client";

import type { ReactNode } from "react";

interface ConfirmationDialogProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onClose(): void;
}

export default function ConfirmationDialog({
  open,
  title,
  description,
  children,
  onClose,
}: ConfirmationDialogProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-6">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-xl">

        <h2 className="text-2xl font-semibold">
          {title}
        </h2>

        {description && (
          <p className="mt-3 text-zinc-600">
            {description}
          </p>
        )}

        <div className="mt-8">
          {children}
        </div>

        <button
          onClick={onClose}
          className="mt-6 text-sm text-zinc-500 hover:text-black"
        >
          Cancel
        </button>

      </div>

    </div>
  );
}