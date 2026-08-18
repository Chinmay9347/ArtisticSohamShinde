"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  Bell,
  ChevronDown,
  Heart,
  LayoutDashboard,
  LogOut,
  Settings,
  ShoppingBag,
  BadgeIndianRupee,
  User as UserIcon,
  Palette,
  Shield,
} from "lucide-react";
import { User } from "firebase/auth";

import { UserMenuProps } from "./UserMenu.types";
import { Avatar } from "@/components/shared";
import { useUserProfile } from "@/hooks/useUserProfile";

export function UserMenu({ user, onLogout, notificationCount = 0 }: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const { profile } = useUserProfile();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handleClickOutside, true);
    const handleEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("keydown", handleEscape);
    return () => { document.removeEventListener("pointerdown", handleClickOutside, true); document.removeEventListener("keydown", handleEscape); };
  }, []);

  const role = profile?.role ?? "CUSTOMER";
  const dashboardHref = role === "ADMIN" ? "/admin" : role === "ARTIST" ? "/artist" : "/dashboard";
  const dashboardLabel = role === "ADMIN" ? "Admin Dashboard" : role === "ARTIST" ? "Artist Workspace" : "Dashboard";
  const DashboardIcon = role === "ADMIN" ? Shield : role === "ARTIST" ? Palette : LayoutDashboard;

  return (
    <div ref={menuRef} className="relative flex items-center gap-4">
      <button type="button" className="relative rounded-full p-2 transition hover:bg-zinc-100" aria-label="Notifications">
        <Bell size={20} />
        {notificationCount > 0 && <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">{notificationCount}</span>}
      </button>

      <button type="button" onClick={() => setOpen((value) => !value)} className="flex items-center gap-2 rounded-full border border-zinc-200 px-2 py-1 transition hover:border-[#C9A227]" aria-expanded={open}>
        <Avatar name={profile?.name ?? user.displayName ?? "User"} imageUrl={profile?.avatar} size="md" />
        <ChevronDown size={18} className={`transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-50 w-72 overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl">
          <div className="border-b p-5">
            <div className="flex items-center gap-4">
              <Avatar name={profile?.name ?? user.displayName ?? "User"} imageUrl={profile?.avatar} size="lg" />
              <div className="min-w-0">
                <p className="truncate font-semibold">{profile?.name ?? user.displayName ?? "User"}</p>
                <p className="truncate text-sm text-zinc-500">{profile?.email ?? user.email}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wider text-[#C9A227]">{role}</p>
              </div>
            </div>
          </div>

          <nav className="p-2">
            <MenuLink href={dashboardHref} icon={<DashboardIcon size={18} />} label={dashboardLabel} />
            {role === "CUSTOMER" && <>
              <MenuLink href="/orders" icon={<ShoppingBag size={18} />} label="My Orders" />
              <MenuLink href="/wishlist" icon={<Heart size={18} />} label="Wishlist" />
              <MenuLink href="/dashboard/savings" icon={<BadgeIndianRupee size={18} />} label="You Saved" />
            </>}
            {role === "ADMIN" ? (
              <MenuLink href="/admin/settings" icon={<Settings size={18} />} label="Admin Settings" />
            ) : role === "ARTIST" ? (
              <>
                <MenuLink href="/artist/profile" icon={<UserIcon size={18} />} label="Artist Profile" />
                <MenuLink href="/artist/settings" icon={<Settings size={18} />} label="Artist Settings" />
              </>
            ) : (
              <>
                <MenuLink href="/profile" icon={<UserIcon size={18} />} label="Profile" />
                <MenuLink href="/settings" icon={<Settings size={18} />} label="Settings" />
              </>
            )}
            <hr className="my-2" />
            <button type="button" onClick={onLogout} className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-red-600 transition hover:bg-red-50">
              <LogOut size={18} /> Logout
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}

function MenuLink({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return <Link href={href} className="flex items-center gap-3 rounded-lg px-3 py-3 transition hover:bg-zinc-100">{icon}{label}</Link>;
}
