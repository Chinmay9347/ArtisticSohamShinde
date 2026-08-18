"use client";
import { useEffect,useMemo,useState,type FormEvent,type ReactNode } from "react";
import { archiveOffer, createOffer, getOffers, updateOffer } from "@/services/offers";
import type { OfferDocument,OfferFormData } from "@/types/offer";
import type { CommissionPackageId } from "@/data/commissionPackages";
import { getCouponUsageLogs,type CouponUsageLog } from "@/services/coupon-logs";
import { useAuth } from "@/context/AuthContext";
const packages:CommissionPackageId[]=["classic","premium","luxury","royal"];
const initialForm:OfferFormData={name:"",code:"",description:"",enabled:false,discountType:"PERCENTAGE",discountValue:10,minimumOrderValue:null,maximumDiscount:null,usageLimit:null,perCustomerLimit:null,stackingMode:"EXCLUSIVE",discountBase:"DISCOUNTED_ITEM_TOTAL",discountComponents:["PACKAGE","SUBJECTS","FRAMING"],freeDelivery:false,freeDeliveryMinimumOrderValue:null,applicability:{packageIds:[],fulfillmentTypes:[],premiumFrame:"ANY"},startAt:null,endAt:null,audience:{minOrders:null,maxOrders:null,minDaysSinceLastOrder:null,maxDaysSinceLastOrder:null}};
export default function AdminCouponsPage(){const {user}=useAuth();const [offers,setOffers]=useState<OfferDocument[]>([]);const [form,setForm]=useState<OfferFormData>(initialForm);const [loading,setLoading]=useState(true);const [saving,setSaving]=useState(false);const [message,setMessage]=useState("");const [usageLogs,setUsageLogs]=useState<CouponUsageLog[]>([]);const [editingId,setEditingId]=useState<string|null>(null);const [confirm,setConfirm]=useState<{type:"publish"|"email"|"disable";offer:OfferDocument}|null>(null);
 const load=async()=>{setLoading(true);try{const [o,l]=await Promise.all([getOffers(),getCouponUsageLogs().catch(()=>[])]);setOffers(o);setUsageLogs(l);}finally{setLoading(false)}};useEffect(()=>{void load()},[]);
 const set=<K extends keyof OfferFormData>(key:K,value:OfferFormData[K])=>setForm(c=>({...c,[key]:value}));
 const togglePackage=(id:CommissionPackageId)=>setForm(c=>({...c,applicability:{...c.applicability,packageIds:c.applicability.packageIds.includes(id)?c.applicability.packageIds.filter(x=>x!==id):[...c.applicability.packageIds,id]}}));
 const save=async(e:FormEvent)=>{e.preventDefault();setMessage("");if(!form.name.trim()||!form.code.trim())return setMessage("Coupon name and code are required.");if(form.discountType==="PERCENTAGE"&&(form.discountValue<0||form.discountValue>100))return setMessage("Percentage coupon must be between 0% and 100%.");try{setSaving(true);const payload={...form,enabled:false,code:form.code.trim().toUpperCase(),name:form.name.trim(),startAt:form.startAt?new Date(String(form.startAt)):null,endAt:form.endAt?new Date(String(form.endAt)):null};if(editingId){await updateOffer(editingId,payload);setMessage("Testing coupon updated. It remains unpublished until you publish it.");}else{await createOffer(payload);setMessage("Coupon created in TESTING state. Publish it when you are ready.");}setForm(initialForm);setEditingId(null);await load();}catch(error){setMessage(error instanceof Error?error.message:"Unable to save coupon.")}finally{setSaving(false)}};
 const editTestingCoupon=(offer:OfferDocument)=>{if(offer.enabled)return;setEditingId(offer.id);setForm({name:offer.name,code:offer.code,description:offer.description,enabled:false,discountType:offer.discountType,discountValue:offer.discountValue,minimumOrderValue:offer.minimumOrderValue,maximumDiscount:offer.maximumDiscount,usageLimit:offer.usageLimit,perCustomerLimit:offer.perCustomerLimit,stackingMode:offer.stackingMode,discountBase:offer.discountBase,discountComponents:offer.discountComponents,freeDelivery:offer.freeDelivery,freeDeliveryMinimumOrderValue:offer.freeDeliveryMinimumOrderValue,applicability:offer.applicability,startAt:offer.startAt,endAt:offer.endAt,audience:offer.audience??{minOrders:null,maxOrders:null,minDaysSinceLastOrder:null,maxDaysSinceLastOrder:null}});window.scrollTo({top:0,behavior:"smooth"});};
 const cancelEdit=()=>{setEditingId(null);setForm(initialForm);};

 const groupedUsageLogs = useMemo(() => {
   const groups = new Map<string, CouponUsageLog>();

   for (const log of usageLogs) {
     const key = String(log.orderId ?? log.id);
     const existing = groups.get(key);

     if (!existing) {
       groups.set(key, {
         ...log,
         couponCodes: Array.from(new Set([
           ...(log.couponCodes ?? []),
           ...(log.couponCode ? [log.couponCode] : []),
         ].map(code => String(code).trim().toUpperCase()).filter(Boolean))),
       });
       continue;
     }

     existing.couponCodes = Array.from(new Set([
       ...(existing.couponCodes ?? []),
       ...(log.couponCodes ?? []),
       ...(log.couponCode ? [log.couponCode] : []),
     ].map(code => String(code).trim().toUpperCase()).filter(Boolean)));

     existing.discountAmount =
       Number(existing.discountAmount ?? 0) +
       Number(log.discountAmount ?? 0);
   }

   return Array.from(groups.values());
 }, [usageLogs]);

 const confirmAction=async()=>{if(!confirm)return;const offer=confirm.offer;try{if(confirm.type==="publish"){if(!user)throw new Error("Admin session required.");const token=await user.getIdToken();const res=await fetch("/api/admin/promotions/publish",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({offerId:offer.id})});const result=await res.json();if(!res.ok)throw new Error(result.message??"Unable to publish promotion.");setMessage(`${offer.code} published. ${result.eligible} eligible customer notification(s) created.`);}else if(confirm.type==="disable"){await archiveOffer(offer.id);setMessage(`${offer.code} disabled.`);}else{if(!user)throw new Error("Admin session required.");const token=await user.getIdToken();const res=await fetch("/api/admin/promotions/send",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${token}`},body:JSON.stringify({offerId:offer.id})});const result=await res.json();if(!res.ok)throw new Error(result.message??"Unable to send promotion email.");setMessage(`Promotion email sent to ${result.sent} eligible customer(s).`);}await load();}catch(error){setMessage(error instanceof Error?error.message:"Action failed.")}finally{setConfirm(null)}};
 return <main className="mx-auto max-w-7xl space-y-8"><section><p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Administration</p><h1 className="mt-2 font-cinzel text-4xl">Coupons</h1><p className="mt-3 text-neutral-600">New coupons start in TESTING. Nothing is broadcast until you explicitly publish it.</p></section>
 <form onSubmit={save} className="rounded-3xl border bg-white p-8 shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">{editingId ? "Edit Testing Coupon" : "Create Coupon"}</h2>{editingId&&<button type="button" onClick={cancelEdit} className="rounded-xl border px-4 py-2 text-sm font-semibold">Cancel Edit</button>}</div><div className="mt-6 grid gap-5 md:grid-cols-2">
 {field("Name",<input value={form.name} onChange={e=>set("name",e.target.value)} className="input" placeholder="Rakhi Special"/>)}{field("Code",<input value={form.code} onChange={e=>set("code",e.target.value.toUpperCase())} className="input" placeholder="RAKHI10"/>)}{field("Description",<input value={form.description} onChange={e=>set("description",e.target.value)} className="input"/>)}{field("Discount Type",<select value={form.discountType} onChange={e=>set("discountType",e.target.value as OfferFormData["discountType"])} className="input"><option value="PERCENTAGE">Percentage</option><option value="FIXED">Fixed INR</option></select>)}{field("Stacking",<select value={form.stackingMode} onChange={e=>set("stackingMode",e.target.value as OfferFormData["stackingMode"])} className="input"><option value="EXCLUSIVE">Exclusive</option><option value="STACKABLE">Stackable</option></select>)}{field("Discount Value",<input type="number" min="0" max={form.discountType==="PERCENTAGE"?100:undefined} value={form.discountValue} onChange={e=>set("discountValue",Number(e.target.value))} className="input"/>)}{field("Discount Base",<select value={form.discountBase} onChange={e=>set("discountBase",e.target.value as OfferFormData["discountBase"])} className="input"><option value="DISCOUNTED_ITEM_TOTAL">Discounted item total</option><option value="PACKAGE">Package price only</option><option value="SUBJECTS">Additional subjects only</option><option value="FRAMING">Premium framing only</option><option value="SELECTED_COMPONENTS">Selected components</option></select>)}{form.discountBase==="SELECTED_COMPONENTS"&&field("Discountable Components",<div className="flex flex-wrap gap-3">{(["PACKAGE","SUBJECTS","FRAMING"] as const).map(component=><label key={component} className="rounded-xl border px-3 py-2 text-sm"><input type="checkbox" checked={form.discountComponents.includes(component)} onChange={()=>setForm(c=>({...c,discountComponents:c.discountComponents.includes(component)?c.discountComponents.filter(x=>x!==component):[...c.discountComponents,component]}))} className="mr-2"/>{component}</label>)}</div>)}{field("Minimum Eligible Amount",<input type="number" min="0" value={form.minimumOrderValue??""} onChange={e=>set("minimumOrderValue",e.target.value===""?null:Number(e.target.value))} className="input"/>)}{field("Maximum Discount",<input type="number" min="0" value={form.maximumDiscount??""} onChange={e=>set("maximumDiscount",e.target.value===""?null:Number(e.target.value))} className="input"/>)}{field("Free Delivery",<select value={form.freeDelivery?"YES":"NO"} onChange={e=>set("freeDelivery",e.target.value==="YES")} className="input"><option value="NO">No</option><option value="YES">Yes</option></select>)}{form.freeDelivery&&field("Free Delivery Minimum Order",<input type="number" min="0" value={form.freeDeliveryMinimumOrderValue??""} onChange={e=>set("freeDeliveryMinimumOrderValue",e.target.value===""?null:Number(e.target.value))} className="input"/>)}{field("Global Usage Limit",<input type="number" min="1" value={form.usageLimit??""} onChange={e=>set("usageLimit",e.target.value===""?null:Number(e.target.value))} className="input"/>)}{field("Per Customer Limit",<input type="number" min="1" value={form.perCustomerLimit??""} onChange={e=>set("perCustomerLimit",e.target.value===""?null:Number(e.target.value))} className="input"/>)}{field("Start At",<input type="datetime-local" value={typeof form.startAt==="string"?form.startAt:""} onChange={e=>set("startAt",e.target.value)} className="input"/>)}{field("End At",<input type="datetime-local" value={typeof form.endAt==="string"?form.endAt:""} onChange={e=>set("endAt",e.target.value)} className="input"/>)}{field("Minimum Orders",<input type="number" min="0" value={form.audience?.minOrders??""} onChange={e=>setForm(c=>({...c,audience:{...c.audience,minOrders:e.target.value===""?null:Number(e.target.value)}}))} className="input"/>)}{field("Maximum Orders",<input type="number" min="0" value={form.audience?.maxOrders??""} onChange={e=>setForm(c=>({...c,audience:{...c.audience,maxOrders:e.target.value===""?null:Number(e.target.value)}}))} className="input"/>)}{field("Min Days Since Last Order",<input type="number" min="0" value={form.audience?.minDaysSinceLastOrder??""} onChange={e=>setForm(c=>({...c,audience:{...c.audience,minDaysSinceLastOrder:e.target.value===""?null:Number(e.target.value)}}))} className="input"/>)}{field("Max Days Since Last Order",<input type="number" min="0" value={form.audience?.maxDaysSinceLastOrder??""} onChange={e=>setForm(c=>({...c,audience:{...c.audience,maxDaysSinceLastOrder:e.target.value===""?null:Number(e.target.value)}}))} className="input"/>)}
 </div><div className="mt-6"><p className="text-sm font-medium">Package restrictions</p><div className="mt-3 flex flex-wrap gap-3">{packages.map(id=><label key={id} className="rounded-xl border px-4 py-2 text-sm"><input type="checkbox" checked={form.applicability.packageIds.includes(id)} onChange={()=>togglePackage(id)} className="mr-2"/>{id.toUpperCase()}</label>)}</div></div><div className="mt-6"><p className="text-sm font-medium">Fulfillment restrictions</p><div className="mt-3 flex flex-wrap gap-3">{(["sketched","framed","digital"] as const).map(type=><label key={type} className="rounded-xl border px-4 py-2 text-sm"><input type="checkbox" checked={form.applicability.fulfillmentTypes.includes(type)} onChange={()=>setForm(c=>({...c,applicability:{...c.applicability,fulfillmentTypes:c.applicability.fulfillmentTypes.includes(type)?c.applicability.fulfillmentTypes.filter(x=>x!==type):[...c.applicability.fulfillmentTypes,type]}}))} className="mr-2"/>{type}</label>)}</div></div><button disabled={saving} className="mt-8 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black">{saving?(editingId?"Saving...":"Creating..."):(editingId?"Save Testing Coupon":"Create Coupon (Testing)")}</button>{message&&<p className="mt-4 text-sm text-neutral-600">{message}</p>}</form>
 <section className="overflow-hidden rounded-3xl border bg-white shadow-sm"><div className="border-b p-6"><h2 className="text-xl font-semibold">Existing Coupons</h2></div>{loading?<p className="p-6 text-neutral-500">Loading...</p>:<div className="divide-y">{offers.map(o=><div key={o.id} className="flex flex-col gap-4 p-6 md:flex-row md:items-center md:justify-between"><div><div className="flex flex-wrap items-center gap-3"><strong>{o.code}</strong><span className={`rounded-full px-3 py-1 text-xs ${o.enabled?"bg-green-100 text-green-700":"bg-amber-100 text-amber-700"}`}>{o.enabled?"Published":"Testing / Disabled"}</span></div><p className="mt-1 text-sm text-neutral-500">{o.name} · {o.discountValue}{o.discountType==="PERCENTAGE"?"%":" INR"} · Used {o.usageCount}{o.usageLimit==null?"":`/${o.usageLimit}`}</p></div><div className="flex flex-wrap gap-2">{!o.enabled&&<><button onClick={()=>editTestingCoupon(o)} className="rounded-xl border px-4 py-2 text-sm font-semibold">Edit</button><button onClick={()=>setConfirm({type:"publish",offer:o})} className="rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-semibold text-black">Publish</button></>}{o.enabled&&<><button onClick={()=>setConfirm({type:"email",offer:o})} className="rounded-xl bg-black px-4 py-2 text-sm font-semibold text-white">Email Customers</button><button onClick={()=>setConfirm({type:"disable",offer:o})} className="rounded-xl border px-4 py-2 text-sm">Disable</button></>}</div></div>)}</div>}</section>
 <section className="overflow-hidden rounded-3xl border bg-white shadow-sm">
  <div className="border-b p-6">
    <h2 className="text-xl font-semibold">Coupon Usage Logs</h2>
    <p className="mt-1 text-sm text-neutral-500">
      One row per order. Every coupon used in that order is shown together.
    </p>
  </div>
  {groupedUsageLogs.length===0 ? (
    <p className="p-6 text-neutral-500">No coupon usage logs are available yet.</p>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[920px] text-sm">
        <thead className="bg-neutral-50">
          <tr>
            <th className="whitespace-nowrap p-4 text-left font-semibold">Order</th>
            <th className="whitespace-nowrap p-4 text-left font-semibold">Customer</th>
            <th className="whitespace-nowrap p-4 text-left font-semibold">Coupons Used</th>
            <th className="whitespace-nowrap p-4 text-right font-semibold">Coupon Saving</th>
            <th className="whitespace-nowrap p-4 text-left font-semibold">Used At</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {groupedUsageLogs.map(log => {
            const codes = Array.from(new Set([
              ...(Array.isArray(log.couponCodes) ? log.couponCodes : []),
              ...(log.couponCode ? [log.couponCode] : []),
            ].map(code => String(code).trim().toUpperCase()).filter(Boolean)));

            const created = log.createdAt as any;
            const date = created?.toDate?.() ?? (created instanceof Date ? created : null);

            return (
              <tr key={log.id} className="align-top">
                <td className="p-4 font-semibold text-neutral-900">{log.orderId ?? "—"}</td>
                <td className="p-4 text-neutral-700">{log.customerId ?? "—"}</td>
                <td className="p-4">
                  <div className="flex max-w-[360px] flex-wrap gap-2">
                    {codes.length ? codes.map(code => (
                      <span key={code} className="rounded-lg bg-neutral-100 px-2.5 py-1 font-mono text-xs font-bold text-neutral-900">{code}</span>
                    )) : <span className="text-neutral-400">—</span>}
                  </div>
                </td>
                <td className="p-4 text-right font-semibold text-green-700">₹{Number(log.discountAmount ?? 0).toLocaleString("en-IN")}</td>
                <td className="p-4 whitespace-nowrap text-neutral-500">{date ? date.toLocaleString("en-IN") : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  )}
</section>
{confirm&&<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-5"><div className="w-full max-w-md rounded-3xl bg-white p-7 shadow-2xl"><h2 className="text-xl font-semibold">{confirm.type==="publish"?"Publish coupon?":confirm.type==="email"?"Email customers?":"Disable coupon?"}</h2><p className="mt-3 text-sm leading-6 text-neutral-600">{confirm.type==="publish"?`Publish ${confirm.offer.code}? It will become available to eligible customers and will appear in notifications until expiry.`:confirm.type==="email"?`Send ${confirm.offer.name} to eligible customers now? This action sends transactional promotion emails.`:`Disable ${confirm.offer.code}? Customers will no longer be able to use it.`}</p><div className="mt-6 flex justify-end gap-3"><button onClick={()=>setConfirm(null)} className="rounded-xl border px-4 py-2">Cancel</button><button onClick={()=>void confirmAction()} className="rounded-xl bg-black px-5 py-2 font-semibold text-white">Confirm</button></div></div></div>}
 </main>;}
function field(label:string,child:ReactNode){return <label className="block space-y-2"><span className="block text-sm font-medium text-neutral-700">{label}</span>{child}</label>}
