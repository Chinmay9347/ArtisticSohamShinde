"use client";

import clsx from "clsx";

import { SkeletonProps } from "./Skeleton.types";

export function Skeleton({
  className,
}: SkeletonProps) {
  return (
    <div
      className={clsx(
        "animate-pulse rounded-xl bg-gradient-to-r from-zinc-200 via-zinc-100 to-zinc-200",
        className
      )}
    />
  );
}