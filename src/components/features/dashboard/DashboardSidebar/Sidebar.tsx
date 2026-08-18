"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";

import { useUserProfile } from "@/hooks/useUserProfile";
import { BRAND } from "@/constants/brand";
import { DASHBOARD_NAVIGATION } from "@/constants/dashboardNavigation";
import { ADMIN_NAVIGATION } from "@/constants/adminNavigation";
import { ARTIST_NAVIGATION } from "@/constants/artistNavigation";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({
  isOpen,
  onClose,
}: SidebarProps) {
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const sidebarRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const handler = (event: PointerEvent) => {
      const target = event.target as HTMLElement;
      if (!isOpen || sidebarRef.current?.contains(target) || target.closest("[data-dashboard-menu-toggle=\"true\"]")) return;
      onClose();
    };
    document.addEventListener("pointerdown", handler);
    return () => document.removeEventListener("pointerdown", handler);
  }, [isOpen, onClose]);

  const navigation =
    profile?.role === "ADMIN"
      ? ADMIN_NAVIGATION
      : profile?.role === "ARTIST"
        ? ARTIST_NAVIGATION
        : DASHBOARD_NAVIGATION;

  const roleTitle =
    profile?.role === "ADMIN"
      ? "Administration"
      : profile?.role === "ARTIST"
        ? "Artist Workspace"
        : BRAND.dashboardTitle;

  /*
   * Only ONE navigation item is allowed to be active.
   *
   * When routes overlap, the longest matching route wins.
   *
   * Example:
   *
   * /artist
   * /artist/artworks
   *
   * On /artist/artworks:
   * - /artist also matches as a prefix
   * - /artist/artworks is the longer match
   * - therefore only Artwork Manager becomes active
   */
  const activeHref =
    navigation
      .filter((item) => {
        if (item.href === "/") {
          return pathname === "/";
        }

        return (
          pathname === item.href ||
          pathname.startsWith(`${item.href}/`)
        );
      })
      .sort(
        (a, b) =>
          b.href.length - a.href.length,
      )[0]?.href ?? null;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 top-16 z-30 bg-black/40 lg:hidden"
        />
      )}

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-16 z-40 flex h-[calc(100vh-4rem)] w-72 flex-col border-r border-zinc-200 bg-white shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          isOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between border-b px-5 py-5">
          <div>
            <p className="font-heading text-xl font-bold text-[#C9A227]">
              {BRAND.shortName}
            </p>

            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-[#C9A227]">
              {roleTitle}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-zinc-500 transition hover:bg-zinc-100 lg:hidden"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav
          className="flex-1 overflow-y-auto p-4"
          aria-label={`${roleTitle} navigation`}
        >
          {navigation.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === activeHref;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={
                  active ? "page" : undefined
                }
                className={`mb-1.5 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? "bg-[#C9A227] text-black shadow-sm"
                    : "text-zinc-700 hover:bg-zinc-100 hover:text-black"
                }`}
              >
                <Icon size={19} />

                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar footer */}
        <div className="border-t bg-zinc-50 p-4">
          <p className="text-xs text-zinc-500">
            {BRAND.name}
          </p>

          <p className="mt-1 text-[11px] text-zinc-400">
            {BRAND.version}
          </p>
        </div>
      </aside>
    </>
  );
}