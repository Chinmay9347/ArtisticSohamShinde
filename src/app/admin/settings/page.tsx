import Link from "next/link";
import { BadgePercent, CreditCard, FolderTree, Image, Package, Settings2, Tag, Users, Wrench, Truck, Gift, MessageSquare, Info, User } from "lucide-react";
const tools = [
  ["Admin Profile", "/admin/profile", "Edit your admin name, phone, bio and profile photo.", User],
  ["Contact Content & Messages", "/admin/contact", "Review customer messages and contact submissions.", MessageSquare],
  ["About Content", "/admin/about", "Edit public About page information.", Info],
  ["Pricing", "/admin/pricing", "Manage package, portrait and addon pricing.", BadgePercent],
  ["Coupons", "/admin/coupons", "Create offers and review coupon usage logs.", Tag],
  ["Referrals", "/admin/referrals", "Manage referral campaigns, codes and rewards.", Gift],
  ["Users & Artists", "/admin/customers", "Create/manage role assignments for business accounts.", Users],
  ["Categories", "/admin/categories", "Manage gallery categories stored in Firestore.", FolderTree],
  ["Gallery Import", "/admin/tools/gallery-import", "Upload local gallery images to Cloudinary and create Firestore records.", Wrench],
  ["Payment Accounts", "/dashboard/payment-accounts", "Manage company UPI and bank receiving accounts.", CreditCard],
  ["Gallery", "/admin/gallery", "Create, edit, publish and archive public artwork.", Image],
  ["Shipping", "/admin/shipping", "Review shipping-related administration.", Truck],
  ["Courier Pricing", "/admin/shipping/pricing", "Save and compare Standard/Express courier rates by PIN, city and state.", Truck],
  ["Orders", "/admin/orders", "Review orders and verify customer payments.", Package],
] as const;
const futureTools = ["Email / WhatsApp automation", "Audit logs", "Reports and analytics", "Backup and retention"];
export default function AdminSettingsPage() { return <main className="mx-auto max-w-7xl space-y-8"><section><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Business Settings</h1><p className="mt-3 max-w-3xl text-neutral-600">Business-management tools and your administrator profile are grouped here.</p></section><section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{tools.map(([title,href,description,Icon])=><Link key={href} href={href} className="group rounded-3xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="flex items-start justify-between gap-4"><div className="rounded-2xl bg-[#C9A227]/10 p-3 text-[#C9A227]"><Icon size={22}/></div><span className="text-xs font-semibold uppercase tracking-wider text-neutral-400 group-hover:text-black">Open</span></div><h2 className="mt-5 text-xl font-semibold">{title}</h2><p className="mt-2 text-sm leading-6 text-neutral-500">{description}</p></Link>)}</section><section className="rounded-3xl border bg-white p-7 shadow-sm"><div className="flex items-center gap-3"><Settings2 className="text-[#C9A227]"/><div><h2 className="text-xl font-semibold">Future Settings</h2><p className="text-sm text-neutral-500">These remain intentionally disabled until the production automation phase.</p></div></div><div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">{futureTools.map(item=><div key={item} className="rounded-2xl border border-dashed bg-neutral-50 p-4 opacity-60"><p className="font-medium">{item}</p><span className="mt-2 inline-block rounded-full bg-neutral-200 px-3 py-1 text-xs text-neutral-600">Future</span></div>)}</div></section></main>; }
