"use client";

import Link from "next/link";
import { BRAND_LOGO_URL } from "@/constants/brand-assets";
import { usePathname } from "next/navigation";
import {
  Menu,
  LogOut,
  ExternalLink,
} from "lucide-react";
import { NotificationBell } from "@/components/shared/NotificationBell";
import { getUserNotifications, markNotificationRead, type AppNotification } from "@/services/notifications.service";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";

import { useUserProfile } from "@/hooks/useUserProfile";
import { useAuth } from "@/context/AuthContext";
import { logoutUser } from "@/services/auth/logout";
import { toast } from "sonner";
import { Avatar } from "@/components/shared";

interface DashboardNavbarProps {
  onMenuClick: () => void;
}

const titles: Record<string, string> = {
  "/admin": "Admin Dashboard",
  "/admin/orders": "Orders",
  "/admin/invoices": "Invoices",
  "/admin/pricing": "Pricing",
  "/admin/coupons": "Coupons",
  "/admin/referrals": "Referrals",
  "/admin/customers": "Users & Artists",
  "/admin/artworks": "Artwork Management",
  "/admin/artwork": "Artwork Queue",
  "/admin/gallery": "Gallery",
  "/admin/categories": "Categories",
  "/admin/shipping": "Shipping",
  "/admin/settings": "Business Settings",
  "/admin/ai": "AI & Promotion Studio",
  "/admin/profile": "Admin Profile",
  "/dashboard/payment-accounts":
    "Payment Accounts",
  "/admin/tools/gallery-import":
    "Gallery Import",

  "/artist": "Artist Workspace",
  "/artist/profile": "Artist Profile",
  "/artist/settings": "Artist Settings",

  "/dashboard": "Dashboard",
  "/orders": "My Orders",
  "/wishlist": "Wishlist",
  "/profile": "Profile",
  "/settings": "Settings",
  "/dashboard/referrals": "Referrals",
  "/invoices": "Invoice",
};

export function DashboardNavbar({
  onMenuClick,
}: DashboardNavbarProps) {
  const pathname = usePathname();
  const { profile } = useUserProfile();
  const { user } = useAuth();

  const [notifications, setNotifications] =
    useState<AppNotification[]>([]);

  const [open, setOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (target && notificationRef.current?.contains(target)) return;
      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  useEffect(() => {
    if (!profile?.uid || !user) return;

    const refresh = async () => {
      try {
        const token = await user.getIdToken();
        await fetch("/api/promotions/sync-user", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        // Notification cleanup must never block the dashboard.
      }

      getUserNotifications(profile.uid)
        .then(setNotifications)
        .catch(() => setNotifications([]));
    };

    void refresh();
    const timer = window.setInterval(() => void refresh(), 10_000);
    return () => window.clearInterval(timer);
  }, [profile?.uid, user]);

  const title =
    titles[pathname] ??
    (pathname.startsWith("/admin")
      ? "Administration"
      : pathname.startsWith("/artist")
        ? "Artist Workspace"
        : "Customer Dashboard");

  const mobileTitle =
    profile?.role === "ADMIN"
      ? "Admin"
      : profile?.role === "ARTIST"
        ? "Artist"
        : "Dashboard";

  const roleLabel =
    profile?.role === "ADMIN"
      ? "Administration"
      : profile?.role === "ARTIST"
        ? "Artist Workspace"
        : "Customer Account";

  const logout = async () => {
    try {
      await logoutUser();
      toast.success("Logged out successfully.");
      // Hard navigation guarantees the mobile navbar cannot remain mounted with stale auth state.
      window.location.assign("/");
    } catch {
      toast.error("Unable to logout.");
    }
  };

  const unreadTotal = notifications.filter((item) => !item.read).length;
  const unreadCount = Math.min(unreadTotal, 10);

  return (
    <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-800 bg-black text-white shadow-lg">
      <div className="flex h-full min-w-0 items-center justify-between px-3 sm:px-6">
        {/* LEFT */}
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          {/* Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="shrink-0 rounded-lg p-2 text-white/80 transition hover:bg-white/10 lg:hidden"
            aria-label="Open dashboard navigation"
            data-dashboard-menu-toggle="true"
          >
            <Menu size={22} />
          </button>

          {/* Desktop brand */}
          <Link
            href="/"
            className="hidden shrink-0 items-center gap-2 sm:flex"
          >
            <Image
              src={BRAND_LOGO_URL}
              alt="Artistic Soham Shinde"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              priority
            />

            <span className="text-center leading-tight">
              <span className="block font-cinzel text-sm font-semibold tracking-wide text-[#C9A227]">
                Artistic Soham
              </span>

              <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
                Shinde
              </span>
            </span>
          </Link>

          {/* Mobile logo only */}
          <Link
            href="/"
            className="flex shrink-0 sm:hidden"
            aria-label="Artistic Soham Shinde"
          >
            <Image
              src={BRAND_LOGO_URL}
              alt="Artistic Soham Shinde"
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
              priority
            />
          </Link>

          {/* Desktop divider */}
          <div className="hidden h-7 w-px bg-white/15 sm:block" />

          {/* Desktop title */}
          <div className="hidden min-w-0 sm:block">
            <p className="truncate text-sm font-semibold sm:text-base">
              {title}
            </p>

            <p className="text-[11px] text-white/50">
              {roleLabel}
            </p>
          </div>

          {/* Mobile short title */}
          <div className="min-w-0 sm:hidden">
            <p className="truncate text-sm font-semibold">
              {mobileTitle}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          {/* Public Site — desktop only */}
          <Link
            href="/"
            className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 transition hover:bg-white/10 sm:flex"
          >
            <ExternalLink size={15} />
            Public Site
          </Link>

          {/* Notification */}
          <div ref={notificationRef} className="relative">
            <NotificationBell
              count={unreadCount}
              onClick={() =>
                setOpen((value) => !value)
              }
              className="bg-white text-black hover:bg-white"
            />

            {open && (
              <div className="absolute right-0 top-12 z-[70] w-[min(20rem,calc(100vw-1.5rem))] rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-2xl">
                <div className="border-b px-3 pb-3 font-semibold"><div className="flex items-center justify-between gap-3"><span>Notifications</span>{unreadTotal > 10 && <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">10</span>}</div></div>

                {notifications.length ===
                0 ? (
                  <p className="p-4 text-sm text-zinc-500">
                    No notifications yet.
                  </p>
                ) : (
                  notifications
                    .slice(0, 10)
                    .map((item) => (
                      <Link
                        key={item.id}
                        href={
                          item.href || "#"
                        }
                        onClick={() => { void markNotificationRead(item.id).catch(()=>undefined); setOpen(false); }}
                        className="block rounded-xl p-3 hover:bg-zinc-50"
                      >
                        <p className="text-sm font-semibold">
                          {item.title}
                        </p>

                        <p className="mt-1 text-xs text-zinc-500">
                          {item.message}
                        </p>
                      </Link>
                    ))
                )}
              </div>
            )}
          </div>

          {/* Desktop profile */}
          {profile && (
            <Link
              href={
                profile.role === "ADMIN"
                  ? "/admin/profile"
                  : profile.role === "ARTIST"
                    ? "/artist/profile"
                    : "/profile"
              }
              className="hidden items-center gap-2 rounded-full border border-white/10 p-1 pr-3 transition hover:bg-white/10 sm:flex"
            >
              <Avatar
                name={
                  profile.name || "User"
                }
                imageUrl={profile.avatar}
                size="sm"
              />

              <span className="max-w-32 truncate text-xs text-white/80">
                {profile.name ||
                  "Account"}
              </span>
            </Link>
          )}

          {/* Logout — desktop only */}
          <button
            type="button"
            onClick={logout}
            className="rounded-lg p-2 text-white/75 transition hover:bg-white/10 hover:text-white"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut size={19} />
          </button>
        </div>
      </div>
    </header>
  );
}

// "use client";

// import Link from "next/link";
// import { usePathname } from "next/navigation";
// import { Menu, LogOut, ExternalLink } from "lucide-react";
// import { NotificationBell } from "@/components/shared/NotificationBell";
// import { getUserNotifications, type AppNotification } from "@/services/notifications.service";
// import { useEffect, useRef, useState } from "react";
// import Image from "next/image";

// import { useUserProfile } from "@/hooks/useUserProfile";
// import { useAuth } from "@/context/AuthContext";
// import { logoutUser } from "@/services/auth/logout";
// import { toast } from "sonner";
// import { Avatar } from "@/components/shared";

// interface DashboardNavbarProps {
//   onMenuClick: () => void;
// }

// const titles: Record<string, string> = {
//   "/admin": "Admin Dashboard",
//   "/admin/orders": "Orders",
//   "/admin/pricing": "Pricing",
//   "/admin/coupons": "Coupons",
//   "/admin/referrals": "Referrals",
//   "/admin/customers": "Users & Artists",
//   "/admin/artworks": "Artwork Management",
//   "/admin/artwork": "Artwork Queue",
//   "/admin/gallery": "Gallery",
//   "/admin/categories": "Categories",
//   "/admin/shipping": "Shipping",
//   "/admin/settings": "Business Settings",
//   "/admin/ai": "AI & Promotion Studio",
//   "/admin/profile": "Admin Profile",
//   "/dashboard/payment-accounts": "Payment Accounts",
//   "/admin/tools/gallery-import": "Gallery Import",
//   "/artist": "Artist Workspace",
//   "/artist/profile": "Artist Profile",
//   "/artist/settings": "Artist Settings",
//   "/dashboard": "Dashboard",
//   "/orders": "My Orders",
//   "/wishlist": "Wishlist",
//   "/profile": "Profile",
//   "/settings": "Settings",
//   "/dashboard/referrals": "Referrals",
//   "/invoices": "Invoice",
// };

// export function DashboardNavbar({ onMenuClick }: DashboardNavbarProps) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const { profile } = useUserProfile();
//   const { user } = useAuth();
//   const [notifications, setNotifications] = useState<AppNotification[]>([]);
//   const [open, setOpen] = useState(false);
//   useEffect(() => { if (profile?.uid) getUserNotifications(profile.uid).then(setNotifications).catch(() => setNotifications([])); }, [profile?.uid]);

//   const title = titles[pathname] ??
//     (pathname.startsWith("/admin") ? "Administration" :
//       pathname.startsWith("/artist") ? "Artist Workspace" : "Customer Dashboard");

//   const roleLabel =
//     profile?.role === "ADMIN" ? "Administration" :
//     profile?.role === "ARTIST" ? "Artist Workspace" :
//     "Customer Account";

//   const logout = async () => {
//     try {
//       await logoutUser();
//       toast.success("Logged out successfully.");
//       router.replace("/login");
//     } catch {
//       toast.error("Unable to logout.");
//     }
//   };

//   return (
//     <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-zinc-800 bg-black text-white shadow-lg">
//       <div className="flex h-full items-center justify-between px-4 sm:px-6">
//         <div className="flex min-w-0 items-center gap-3">
//           <button
//             type="button"
//             onClick={onMenuClick}
//             className="rounded-lg p-2 text-white/80 hover:bg-white/10 lg:hidden"
//             aria-label="Open dashboard navigation"
//           >
//             <Menu size={22} />
//           </button>

//           <Link href="/" className="hidden shrink-0 items-center gap-2 sm:flex">
//             <Image src={BRAND_LOGO_URL} alt="Artistic Soham Shinde" width={36} height={36} className="h-9 w-9 rounded-full object-cover" priority />
//             <span className="text-center leading-tight">
//               <span className="block font-cinzel text-sm font-semibold tracking-wide text-[#C9A227]">Artistic Soham</span>
//               <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-[#C9A227]">Shinde</span>
//             </span>
//           </Link>

//           <div className="hidden h-7 w-px bg-white/15 sm:block" />

//           <div className="min-w-0">
//             <p className="truncate text-sm font-semibold sm:text-base">{title}</p>
//             <p className="hidden text-[11px] text-white/50 sm:block">{roleLabel}</p>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3">
//           <Link
//             href="/"
//             className="hidden items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-xs text-white/80 hover:bg-white/10 sm:flex"
//           >
//             <ExternalLink size={15} />
//             Public Site
//           </Link>

//           <div className="relative">
//             <NotificationBell count={notifications.filter((item) => !item.read).length} onClick={() => setOpen((value) => !value)} className="bg-white text-black hover:bg-white" />
//             {open && <div className="absolute right-0 top-12 z-[70] w-80 rounded-2xl border border-zinc-200 bg-white p-3 text-zinc-900 shadow-2xl">
//               <div className="border-b px-3 pb-3 font-semibold">Notifications</div>
//               {notifications.length === 0 ? <p className="p-4 text-sm text-zinc-500">No notifications yet.</p> : notifications.slice(0,8).map((item) => <Link key={item.id} href={item.href || "#"} onClick={() => setOpen(false)} className="block rounded-xl p-3 hover:bg-zinc-50"><p className="text-sm font-semibold">{item.title}</p><p className="mt-1 text-xs text-zinc-500">{item.message}</p></Link>)}
//             </div>}
//           </div>

//           {profile && (
//             <Link href={profile.role === "ADMIN" ? "/admin/profile" : profile.role === "ARTIST" ? "/artist/profile" : "/profile"} className="hidden items-center gap-2 rounded-full border border-white/10 p-1 pr-3 hover:bg-white/10 sm:flex">
//               <Avatar name={profile.name || "User"} imageUrl={profile.avatar} size="sm" />
//               <span className="max-w-32 truncate text-xs text-white/80">{profile.name || "Account"}</span>
//             </Link>
//           )}

//           <button
//             type="button"
//             onClick={logout}
//             className="rounded-lg p-2 text-white/75 hover:bg-white/10 hover:text-white"
//             aria-label="Sign out"
//             title="Sign out"
//           >
//             <LogOut size={19} />
//           </button>
//         </div>
//       </div>
//     </header>
//   );
// }
