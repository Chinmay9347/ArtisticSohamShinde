"use client";
import Link from "next/link";
import { useState } from "react";
import type { Order } from "@/types/order";
import { ShippingService } from "@/services/order/shipping.service";
import DeliveryButton from "./DeliveryButton";

export default function ShippingCard({ order }: { order: Order }) {
  const [courier,setCourier]=useState(order.shipping?.courier ?? "");
  const [trackingNumber,setTrackingNumber]=useState(order.shipping?.trackingNumber ?? "");
  const [trackingUrl,setTrackingUrl]=useState(order.shipping?.trackingUrl ?? "");
  const [saving,setSaving]=useState(false); const [message,setMessage]=useState("");
  async function save(){ if(!courier.trim()||!trackingNumber.trim()){setMessage("Courier and tracking number are required.");return;} setSaving(true); setMessage(""); try{ await ShippingService.updateShipment(order.id,{courier:courier.trim(),trackingNumber:trackingNumber.trim(),trackingUrl:trackingUrl.trim()||undefined}); setMessage("Shipment updated."); }catch(e){setMessage(e instanceof Error?e.message:"Unable to update shipment.");}finally{setSaving(false);} }
  return <article className="rounded-3xl border bg-white p-6 shadow-sm">
    <div className="flex items-start justify-between"><div><p className="text-sm text-zinc-500">{order.orderNumber}</p><h2 className="mt-2 text-xl font-semibold">{order.customer.fullName}</h2><p className="mt-1 text-sm text-neutral-500">{order.shipping?.address?.city || "City not provided"}</p></div><span className="rounded-full bg-zinc-100 px-3 py-1 text-sm">{order.status.replaceAll("_"," ")}</span></div>
    <div className="mt-5 grid gap-3 md:grid-cols-3"><input value={courier} onChange={e=>setCourier(e.target.value)} placeholder="Courier service" className="rounded-xl border p-3"/><input value={trackingNumber} onChange={e=>setTrackingNumber(e.target.value)} placeholder="Tracking ID" className="rounded-xl border p-3"/><input value={trackingUrl} onChange={e=>setTrackingUrl(e.target.value)} placeholder="External tracking URL" className="rounded-xl border p-3"/></div>
    <div className="mt-4 flex flex-wrap gap-3"><button onClick={()=>void save()} disabled={saving} className="rounded-xl bg-[#C9A227] px-4 py-2 font-semibold text-black">{saving?"Saving...":"Save Shipment"}</button>{order.shipping?.trackingUrl && <a href={order.shipping.trackingUrl} target="_blank" rel="noreferrer" className="rounded-xl border px-4 py-2">Track on Courier Website ↗</a>}{order.status === "SHIPPED" && <DeliveryButton orderId={order.id}/>}<Link href={`/admin/orders/${order.id}`} className="rounded-xl bg-black px-4 py-2 text-white">View Order</Link></div>
    {message&&<p className="mt-3 text-sm text-neutral-600">{message}</p>}
  </article>;
}
