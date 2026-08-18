"use client";
import { useEffect, useState } from "react";
import type { Order } from "@/types/order";
import ShippingCard from "./ShippingCard";
import { TablePagination } from "@/components/shared/TablePagination";

export default function ShippingQueue({orders}:{orders:Order[]}){
  const [page,setPage]=useState(1); const [pageSize,setPageSize]=useState(10);
  useEffect(()=>setPage(1),[pageSize,orders.length]);
  const pages=Math.max(1,Math.ceil(orders.length/pageSize));
  const safePage=Math.min(page,pages);
  const items=orders.slice((safePage-1)*pageSize,safePage*pageSize);
  if(!orders.length)return <div className="rounded-3xl border bg-white p-10 text-center">No orders waiting for shipping.</div>;
  return <section className="space-y-4">{items.map(o=><ShippingCard key={o.id} order={o}/>)}<TablePagination page={safePage} totalItems={orders.length} pageSize={pageSize} onPageChange={setPage} onPageSizeChange={setPageSize}/></section>
}
