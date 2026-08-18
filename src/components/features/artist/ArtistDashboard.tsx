"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";

export function ArtistDashboard() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setOrders([]);
      setLoading(false);
      return;
    }

    const unsubscribe = OrderService.subscribeByArtist(
      user.uid,
      (nextOrders) => {
        setOrders(nextOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Artist order subscription failed:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  if (loading) return <div className="rounded-2xl border bg-white p-8">Loading assigned commissions...</div>;

  const active = orders.filter((order) => !["COMPLETED", "CANCELLED", "DELIVERED"].includes(order.status)).length;
  const completed = orders.filter((order) => order.status === "COMPLETED").length;

  return (
    <div className="space-y-8">
      <div className="grid gap-5 md:grid-cols-4">
        {[
          ["Assigned", orders.length],
          ["Active", active],
          ["Completed", completed],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-2xl border bg-white p-6 shadow-sm">
            <p className="text-sm text-neutral-500">{label}</p>
            <p className="mt-2 text-3xl font-bold">{value}</p>
          </div>
        ))}
        <Link href={orders[0]?`/invoices/${orders[0].id}`:"/artist/commissions"} className="rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><p className="text-sm text-neutral-500">Invoice</p><p className="mt-2 text-xl font-bold">{orders[0]?"Latest Invoice":"No invoices yet"}</p><p className="mt-1 text-xs text-neutral-500">{orders[0]?orders[0].orderNumber:"Open assigned commissions"}</p></Link>
      </div>

      <section className="rounded-2xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <div><h3 className="text-xl font-semibold">Assigned Commissions</h3><p className="mt-1 text-sm text-neutral-500">Assigned artwork and production management.</p></div><Link href="/artist/artworks" className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black">Manage Artwork</Link>
        </div>
        {orders.length === 0 ? (
          <p className="p-8 text-neutral-500">No commissions are currently assigned to you.</p>
        ) : (
          <div className="divide-y">
            {orders.map((order) => (
              <div key={order.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm text-neutral-500">{order.orderNumber}</p>
                  <h4 className="mt-1 text-lg font-semibold">{order.customer.fullName}</h4>
                  <p className="mt-1 text-sm text-neutral-500">{order.portrait.packageName} · {order.portrait.subjects} subject(s)</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={order.status} />
                  <div className="flex gap-2"><Link href={`/artist/orders/${order.id}`} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Open</Link><Link href={`/invoices/${order.id}`} className="rounded-xl border px-4 py-2 text-sm font-semibold">Invoice</Link></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function StatusBadge({status}:{status:string}){const map:Record<string,string>={DRAWING:"border-yellow-400 bg-yellow-50 text-yellow-800",QUALITY_CHECK:"border-yellow-400 bg-yellow-50 text-yellow-800",ARTWORK_QUEUE:"border-yellow-400 bg-yellow-50 text-yellow-800",PACKAGED:"border-sky-400 bg-sky-50 text-sky-800",SHIPPED:"border-blue-400 bg-blue-50 text-blue-800",DELIVERED:"border-green-400 bg-green-50 text-green-800",COMPLETED:"border-green-500 bg-green-50 text-green-800",CANCELLED:"border-red-400 bg-red-50 text-red-800"};return <span className={`whitespace-nowrap rounded-full border px-3 py-1 text-xs font-semibold ${map[status]??"border-neutral-300 bg-neutral-50 text-neutral-700"}`}>{status.replaceAll("_"," ")}</span>}
