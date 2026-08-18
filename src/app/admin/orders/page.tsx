"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { OrderService } from "@/services/order";
import type { Order } from "@/types/order";
import { ORDER_STATUS } from "@/constants/order-status";
import AdminStatusBadge from "@/components/features/admin/orders/AdminStatusBadge";
import { TablePagination } from "@/components/shared/TablePagination";

const statuses = Object.values(ORDER_STATUS);

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [payment, setPayment] = useState("ALL");
  const [city, setCity] = useState("");
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  useEffect(() => {
    const unsubscribe = OrderService.subscribeAll(
      (nextOrders) => {
        setOrders(nextOrders);
        setLoading(false);
      },
      (error) => {
        console.error("Admin order subscription failed:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);
  useEffect(() => { setPage(1); }, [status, payment, city, search, from, to, pageSize]);

  const filtered = useMemo(() => orders.filter((order) => {
    const created = order.createdAt instanceof Date ? order.createdAt : null;
    const hay = `${order.orderNumber} ${order.customer.fullName} ${order.customer.email} ${order.shipping?.address?.city ?? ""}`.toLowerCase();
    const searchOk = !search || hay.includes(search.toLowerCase());
    const statusOk = status === "ALL" || order.status === status;
    const paymentOk = payment === "ALL" || order.payment?.status === payment;
    const cityOk = !city || (order.shipping?.address?.city ?? "").toLowerCase().includes(city.toLowerCase());
    const fromOk = !from || !created || created >= new Date(`${from}T00:00:00`);
    const toOk = !to || !created || created <= new Date(`${to}T23:59:59`);
    return searchOk && statusOk && paymentOk && cityOk && fromOk && toOk;
  }), [orders, status, payment, city, search, from, to]);

  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);
  const count = (s: string) => orders.filter((o) => o.status === s).length;
  const paymentPending = orders.filter((o) => o.payment?.status === "PENDING" || o.payment?.status === "SUBMITTED").length;
  const verified = orders.filter((o) => o.payment?.status === "VERIFIED").length;
  const completed = orders.filter((o) => o.status === ORDER_STATUS.COMPLETED).length;

  return <main className="mx-auto max-w-7xl space-y-8">
    <section><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Orders</h1><p className="mt-3 text-neutral-600">Filter and review orders without loading the full dataset into one table view.</p></section>
    <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
      <Card label="Total Orders" value={orders.length}/><Card label="Payment Pending" value={paymentPending}/><Card label="Verified Payments" value={verified}/><Card label="Completed Orders" value={completed}/>
      {["ARTWORK_QUEUE","DRAWING","QUALITY_CHECK","PACKAGED","SHIPPED","DELIVERED","CANCELLED"].map((s) => <Card key={s} label={s.replaceAll("_"," ")} value={count(s)}/>)}
    </section>
    <section className="rounded-3xl border bg-white p-5 shadow-sm"><div className="grid gap-3 md:grid-cols-3 lg:grid-cols-6">
      <input value={search} onChange={(e)=>setSearch(e.target.value)} placeholder="Order ID / customer" className="rounded-xl border px-3 py-2" aria-label="Search orders"/>
      <input value={city} onChange={(e)=>setCity(e.target.value)} placeholder="City" className="rounded-xl border px-3 py-2" aria-label="Filter by city"/>
      <select value={status} onChange={(e)=>setStatus(e.target.value)} className="rounded-xl border px-3 py-2"><option value="ALL">All order status</option>{statuses.map((s)=><option key={s} value={s}>{s.replaceAll("_"," ")}</option>)}</select>
      <select value={payment} onChange={(e)=>setPayment(e.target.value)} className="rounded-xl border px-3 py-2"><option value="ALL">All payment status</option>{["PENDING","SUBMITTED","VERIFIED","REJECTED"].map((s)=><option key={s}>{s}</option>)}</select>
      <input type="date" value={from} onChange={(e)=>setFrom(e.target.value)} className="rounded-xl border px-3 py-2" aria-label="From date"/><input type="date" value={to} onChange={(e)=>setTo(e.target.value)} className="rounded-xl border px-3 py-2" aria-label="To date"/>
    </div></section>
    <section className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="overflow-x-auto"><table className="w-full min-w-[1200px] whitespace-nowrap text-sm"><thead className="bg-zinc-100"><tr><th className="p-4 text-left">Sr. No.</th><th className="p-4 text-left">Order ID</th><th className="p-4 text-left">Date & Time</th><th className="p-4 text-left">Customer</th><th className="p-4 text-left">City</th><th className="p-4 text-left">Amount</th><th className="p-4 text-left">Payment</th><th className="p-4 text-left">Order Status</th><th className="p-4 text-left">Action</th></tr></thead><tbody>{loading ? <tr><td colSpan={9} className="p-8 text-center">Loading orders...</td></tr> : visible.length === 0 ? <tr><td colSpan={9} className="p-12 text-center text-neutral-500">No orders match the selected filters.</td></tr> : visible.map((order,index)=><tr key={order.id} className="border-t hover:bg-zinc-50"><td className="p-4">{(page-1)*pageSize+index+1}</td><td className="p-4 font-semibold">{order.orderNumber}</td><td className="p-4">{order.createdAt instanceof Date ? order.createdAt.toLocaleString("en-IN") : "—"}</td><td className="p-4">{order.customer.fullName}<div className="text-xs text-neutral-400">{order.customer.email}</div></td><td className="p-4">{order.shipping?.address?.city || "—"}</td><td className="p-4">₹{Number(order.payment?.amount ?? 0).toLocaleString("en-IN")}</td><td className="p-4"><AdminStatusBadge status={order.payment?.status ?? "NONE"}/></td><td className="p-4 whitespace-nowrap"><AdminStatusBadge status={order.status}/></td><td className="p-4 whitespace-nowrap"><Link href={`/admin/orders/${order.id}`} className="inline-block whitespace-nowrap rounded-xl bg-black px-4 py-2 text-white">{order.payment?.status === "SUBMITTED" ? "Verify Payment" : "View"}</Link></td></tr>)}</tbody></table></div><TablePagination page={page} totalItems={filtered.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
  </main>;
}
function Card({label,value}:{label:string;value:number}){return <div className="rounded-2xl border bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><p className="text-xs uppercase tracking-wide text-neutral-500">{label}</p><p className="mt-2 text-2xl font-bold">{value}</p></div>}
