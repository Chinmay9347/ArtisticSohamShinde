"use client";
import { useEffect, useState } from "react";
import ArtworkQueue from "@/components/features/admin/artwork/ArtworkQueue";
import { OrderService } from "@/services/order";
import { ArtistService } from "@/services/order/artist.service";
import { getAllUsers } from "@/services/user";
import type { Order } from "@/types/order";

export default function ArtworkPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => {
    const [queue, users] = await Promise.all([OrderService.getArtworkQueue(), getAllUsers()]);
    const artists = (users as Array<{uid:string;name?:string;email?:string;role?:string;isActive?:boolean}>).filter((u) => u.role === "ARTIST" && u.isActive !== false);
    if (artists.length === 1) {
      const only = artists[0];
      await Promise.all(queue.filter((o) => !o.artist?.uid).map((o) => ArtistService.assign(o.id, only.uid, only.name || only.email || only.uid)));
      const refreshed = await OrderService.getArtworkQueue(); setOrders(refreshed);
    } else setOrders(queue);
    setLoading(false);
  })().catch(() => setLoading(false)); }, []);
  return <main className="mx-auto max-w-7xl space-y-8"><div><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Artwork Queue</h1><p className="mt-3 text-neutral-600">Short operational view of artwork assignments and availability.</p></div>{loading ? <div className="rounded-2xl border bg-white p-8">Loading artwork queue...</div> : <ArtworkQueue orders={orders} />}</main>;
}
