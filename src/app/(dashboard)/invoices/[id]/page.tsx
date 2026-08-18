"use client";
import { useEffect,useState } from "react";
import { useParams,useRouter } from "next/navigation";
import { OrderService } from "@/services/order";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import type { Order } from "@/types/order";
import { InvoicePrintTemplate } from "@/components/shared/InvoicePrintTemplate";
import { getSiteContent } from "@/services/site-content.service";

export default function InvoicePage(){
 const params=useParams<{id:string}>(); const router=useRouter(); const {user,loading}=useAuth(); const {profile}=useUserProfile();
 const [order,setOrder]=useState<Order|null>(null); const [loadingOrder,setLoadingOrder]=useState(true); const [error,setError]=useState<string|null>(null); const [twoUp,setTwoUp]=useState(false);
 const [business,setBusiness]=useState<{phone?:string;email?:string;location?:string}>({});
 useEffect(()=>{void getSiteContent<{phone?:string;email?:string;location?:string}>("contactDetails",{}).then((data)=>setBusiness({phone:data.phone,email:data.email,location:data.location})).catch(()=>undefined)},[]);
 useEffect(()=>{if(loading)return;if(!user){router.replace(`/login?redirect=${encodeURIComponent(`/invoices/${params.id}`)}`);return;}if(!params.id)return;const unsubscribe=OrderService.subscribe(params.id,(next)=>{if(!next){setError("Invoice order not found.");setOrder(null);}else if(profile?.role==="ADMIN"||(profile?.role==="ARTIST"&&next.artist?.uid===user.uid)||next.customer.uid===user.uid){setOrder(next);setError(null);}else{setError("You do not have access to this invoice.");setOrder(null);}setLoadingOrder(false)},(subscriptionError)=>{console.error("Invoice subscription failed:",subscriptionError);setError("Unable to load invoice.");setLoadingOrder(false)});return()=>unsubscribe();},[loading,user,params.id,profile?.role,router]);
 if(loading||loadingOrder)return <div className="rounded-2xl border bg-white p-8">Loading invoice...</div>;
 if(!order||error)return <div className="rounded-2xl border border-red-200 bg-red-50 p-8"><h1 className="text-xl font-semibold text-red-900">Unable to load invoice</h1><p className="mt-2 text-sm text-red-700">{error??"Invoice not found."}</p></div>;
 const printTwoUp=()=>{setTwoUp(true);setTimeout(()=>{const style=document.createElement("style");style.id="invoice-print-page-style";style.textContent="@page{size:A4 landscape;margin:8mm}.invoice-sheet{break-inside:avoid}";document.head.appendChild(style);window.print();setTimeout(()=>{document.getElementById("invoice-print-page-style")?.remove();setTwoUp(false)},500)},50)};
 return <main className="mx-auto max-w-5xl space-y-5"><div className="flex flex-wrap items-center justify-between gap-3 print:hidden"><button type="button" onClick={() => router.back()} className="rounded-xl border px-5 py-3 font-semibold">← Back</button><div className="flex flex-wrap justify-end gap-3"><button onClick={()=>window.print()} className="rounded-xl bg-black px-5 py-3 font-semibold text-white">Print / Save A5 PDF</button><button onClick={printTwoUp} className="rounded-xl border px-5 py-3 font-semibold">Print A4 · 2× A5</button></div></div><div className="rounded-3xl border bg-white p-8 shadow-sm print:border-0 print:p-0 print:shadow-none"><InvoicePrintTemplate order={order} twoUp={twoUp} business={business}/></div></main>;
}
