"use client";

import clsx from "clsx";
import { Bell } from "lucide-react";

import { NotificationBellProps } from "./NotificationBell.types";

export function NotificationBell({
  count = 0,
  onClick,
  className,
}: NotificationBellProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "relative rounded-full border border-transparent bg-white p-2 text-black transition hover:bg-white hover:text-black hover:shadow-sm",
        className
      )}
      aria-label="Notifications"
    >
      <Bell size={20} />

      {count > 0 && (
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
          {Math.min(count, 10)}
        </span>
      )}
    </button>
  );
}