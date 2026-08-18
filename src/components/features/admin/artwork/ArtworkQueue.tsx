"use client";
import Link from "next/link";
import { useState } from "react";
import type { Order } from "@/types/order";
import AssignArtistDialog from "./AssignArtistDialog";
import { OrderService } from "@/services/order";
import { TablePagination } from "@/components/shared/TablePagination";

export default function ArtworkQueue({ orders }: { orders: Order[] }) {
  const [items, setItems] = useState(orders); const [page, setPage] = useState(1); const [pageSize, setPageSize] = useState(10);
  const visible = items.slice((page - 1) * pageSize, page * pageSize);
  async function toggle(order: Order) {
    const current = (order.artwork as (Order["artwork"] & { available?: boolean }) | undefined)?.available !== false;
    await OrderService.update(order.id, { artwork: { ...order.artwork, available: !current } } as Partial<Order>);
    setItems((old) => old.map((item) => item.id === order.id ? { ...item, artwork: { ...item.artwork, available: !current } } : item));
  }
  if (!items.length) return <div className="rounded-3xl border bg-white p-10 text-center shadow-sm">No orders are waiting for artwork.</div>;
  return <section className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1050px] text-sm"><thead className="bg-zinc-100"><tr><th className="p-4 text-left">Sr. No.</th><th className="p-4 text-left">Order</th><th className="p-4 text-left">Customer</th><th className="p-4 text-left">City</th><th className="p-4 text-left">Date</th><th className="p-4 text-left">Artist</th><th className="p-4 text-left">Available</th><th className="p-4 text-left">Action</th></tr></thead><tbody>{visible.map((order, index) => { const available = (order.artwork as (Order["artwork"] & { available?: boolean }) | undefined)?.available !== false; return <tr key={order.id} className="border-t hover:bg-zinc-50"><td className="p-4">{(page-1)*pageSize+index+1}</td><td className="p-4 font-semibold">{order.orderNumber}</td><td className="p-4">{order.customer.fullName}</td><td className="p-4">{order.shipping?.address?.city || "—"}</td><td className="p-4">{order.createdAt instanceof Date ? order.createdAt.toLocaleString("en-IN") : "—"}</td><td className="p-4">{order.artist?.name || <AssignArtistDialog orderId={order.id} />}</td><td className="p-4"><button onClick={() => void toggle(order)} className={`rounded-full px-3 py-1 text-xs font-semibold ${available ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{available ? "Available" : "Not available"}</button></td><td className="p-4"><Link href={`/admin/orders/${order.id}`} className="rounded-xl bg-black px-3 py-2 text-white">View</Link></td></tr>; })}</tbody></table></div><TablePagination page={page} totalItems={items.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>;
}
