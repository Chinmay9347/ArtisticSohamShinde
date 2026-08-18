"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";

export default function ArtistCommissionsPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { if (!user) return; OrderService.getByArtist(user.uid).then(setOrders).finally(() => setLoading(false)); }, [user]);
  return <main className="space-y-8"><section><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Artist Workspace</p><h1 className="mt-2 font-cinzel text-4xl font-bold">My Commissions</h1><p className="mt-3 text-neutral-600">Open assigned commissions to manage artwork and shipment details.</p></section><section className="rounded-3xl border bg-white shadow-sm"><div className="divide-y">{loading ? <p className="p-8 text-neutral-500">Loading commissions...</p> : orders.length === 0 ? <p className="p-8 text-neutral-500">No commissions are assigned to you.</p> : orders.map((order) => <div key={order.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"><div><p className="text-sm text-neutral-500">{order.orderNumber}</p><p className="mt-1 font-semibold">{order.customer.fullName}</p><p className="mt-1 text-sm text-neutral-500">{order.portrait.packageName} · {order.status.replaceAll("_", " ")}</p></div><Link href={`/artist/orders/${order.id}`} className="rounded-xl bg-black px-4 py-2 text-center text-sm font-semibold text-white">Manage</Link></div>)}</div></section></main>;
}
