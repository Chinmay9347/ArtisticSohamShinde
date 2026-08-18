"use client";

import { useUserProfile } from "@/hooks/useUserProfile";
//import { useAuth } from "@/context/AuthContext";
import { usePathname } from "next/navigation";

import { Avatar, NotificationBell } from "@/components/shared";

import { TopbarProps } from "./Topbar.types";

import { Menu } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders": "My Orders",
  "/wishlist": "Wishlist",
  "/profile": "Profile",
  "/settings": "Settings",
};

export function Topbar({
  title,onMenuClick,
}: TopbarProps) {
  const pathname = usePathname();

  const { profile } = useUserProfile();
  //const { user } = useAuth();

  const pageTitle =
    title ??
    TITLES[pathname] ??
    "Dashboard";

  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-zinc-200 bg-white px-8">
      <button
        onClick={onMenuClick}
        className="mr-4 rounded-lg p-2 hover:bg-zinc-100 lg:hidden"
      >
        <Menu size={24} />
      </button>
      <div>
        <h1 className="font-heading text-3xl font-semibold">
          {pageTitle}
        </h1>

        <p className="text-sm text-zinc-500">
          Welcome to Artistic Soham Shinde,
          {" "}
          {profile?.name ?? "Customer"}
          {/* Welcome to Artistic Soham Shinde,
          {" "}
          {user?.displayName} */}
        </p>
      </div>

      <div className="flex items-center gap-5">

        <NotificationBell count={0} />

        {profile && (
          <Avatar
            name={profile.name}
            imageUrl={profile.avatar}
            size="md"
          />
        )}
        {/* {user && (
          <Avatar
            name={user.displayName ?? "User"}
            size="md"
          />
        )} */}

      </div>

    </header>
  );
}