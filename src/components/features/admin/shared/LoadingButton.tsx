"use client";

import type { ButtonHTMLAttributes } from "react";

interface LoadingButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export default function LoadingButton({
  loading = false,
  children,
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={loading || disabled}
      className={`rounded-xl bg-black px-5 py-3 font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}