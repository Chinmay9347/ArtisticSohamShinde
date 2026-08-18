"use client";

import type { Order } from "@/types/order";
import { BRAND } from "@/constants/brand";
import { BRAND_LOGO_URL } from "@/constants/brand-assets";

interface InvoiceBusinessDetails {
  phone?: string;
  email?: string;
  location?: string;
}

export function InvoicePrintTemplate({
  order,
  twoUp = false,
  business,
}: {
  order: Order;
  twoUp?: boolean;
  business?: InvoiceBusinessDetails;
}) {
  const amount = Number(order.payment?.amount ?? order.pricing?.total ?? 0);
  const subtotal = Number(order.pricing?.original ?? amount + Number(order.pricing?.discount ?? 0));
  const basePrice = Number(order.pricing?.basePrice ?? subtotal);
  const framingPrice = Number(order.pricing?.framingPrice ?? 0);
  const subjectsPrice = Number(order.pricing?.subjectsPrice ?? 0);
  const discount = Number(order.pricing?.discount ?? 0);
  const shipping = order.shipping?.address;
  const description = `${order.portrait.packageName} portrait · ${order.portrait.size} · ${order.portrait.subjects} subject(s) · ${order.fulfillment?.type ?? "sketched"}`;

  const copy = (
    <article className="invoice-sheet w-full max-w-[148mm] overflow-hidden bg-white p-6 text-black sm:p-8">
      <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-5">
        <div className="flex items-start gap-4">
          <img src={BRAND_LOGO_URL} alt={BRAND.name} className="h-16 w-16 rounded-full object-cover" />
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-[#8f7414]">{BRAND.name}</p>
            <h1 className="mt-1 text-3xl font-bold">INVOICE</h1>
            <p className="mt-2 text-xs text-neutral-500">{business?.location || "Pune, Maharashtra, India"}</p>
            <p className="text-xs text-neutral-500">{business?.phone || ""} {business?.email ? ` · ${business.email}` : ""}</p>
          </div>
        </div>
        <div className="text-right text-sm">
          <p className="font-semibold">INV-{order.orderNumber}</p>
          <p className="text-neutral-500">Order: {order.orderNumber}</p>
        </div>
      </header>

      <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
        <div className="min-w-0 rounded-xl border border-neutral-200 p-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500">Bill To</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Name</span><span className="min-w-0 max-w-[65%] break-words text-right font-semibold">{order.customer.fullName}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Email</span><span className="min-w-0 max-w-[65%] break-words text-right">{order.customer.email}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Phone</span><span className="min-w-0 max-w-[65%] break-words text-right">{order.customer.phone}</span></div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-neutral-200 p-4">
          <p className="text-[10px] uppercase tracking-widest text-neutral-500">Order Details</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Package</span><span className="min-w-0 max-w-[65%] break-words text-right font-semibold">{order.portrait.packageName}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Size</span><span className="min-w-0 max-w-[65%] break-words text-right">{order.portrait.size}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Subjects</span><span className="min-w-0 max-w-[65%] break-words text-right">{order.portrait.subjects}</span></div>
            {order.galleryArtwork && <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Gallery</span><span className="min-w-0 max-w-[65%] break-words text-right">{order.galleryArtwork.title}</span></div>}
          </div>
        </div>
      </div>

      <table className="mt-8 w-full table-fixed text-sm">
        <thead><tr className="border-y border-black"><th className="py-3 text-left">Description</th><th className="py-3 text-right">Amount</th></tr></thead>
        <tbody>
          {/* <tr className="border-b"><td className="w-3/4 break-words py-3 pr-4 align-top">{description}</td><td className="py-3 text-right">₹{original.toLocaleString("en-IN")}</td></tr> */}
          <tr className="border-b">
            <td className="w-3/4 break-words py-3 pr-4 align-top">{description}</td>
            <td className="py-3 text-right">
              ₹{basePrice.toLocaleString("en-IN")}
            </td>
          </tr>
          {Number(order.pricing?.framingPrice ?? 0) > 0 && <tr className="border-b"><td className="py-3">Premium frame</td><td className="py-3 text-right">₹{Number(order.pricing?.framingPrice).toLocaleString("en-IN")}</td></tr>}
          {Number(order.pricing?.subjectsPrice ?? 0) > 0 && <tr className="border-b"><td className="py-3">Subjects adjustment</td><td className="py-3 text-right">₹{Number(order.pricing?.subjectsPrice).toLocaleString("en-IN")}</td></tr>}
          {discount > 0 && <tr className="border-b"><td className="py-3">Coupon / referral / reward discount</td><td className="py-3 text-right">-₹{discount.toLocaleString("en-IN")}</td></tr>}
          <tr><td className="break-words py-4 pr-4 text-right font-bold">Total</td><td className="py-4 text-right text-xl font-bold">₹{amount.toLocaleString("en-IN")}</td></tr>
        </tbody>
      </table>

      <div className="mt-8 grid grid-cols-2 gap-6 text-xs">
        <div className="min-w-0 rounded-xl border border-neutral-200 p-4">
          <p className="font-semibold">Payment</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start justify-between gap-4"><span className="text-neutral-500">Status</span><span className="max-w-[65%] break-words text-right font-semibold">{order.payment?.status ?? "PENDING"}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="text-neutral-500">Method</span><span className="max-w-[65%] break-words text-right">{order.payment?.method ?? "UPI"}</span></div>
            <div className="flex items-start justify-between gap-4"><span className="text-neutral-500">Amount</span><span className="max-w-[65%] break-words text-right font-semibold">₹{amount.toLocaleString("en-IN")}</span></div>
          </div>
        </div>
        <div className="min-w-0 rounded-xl border border-neutral-200 p-4">
          <p className="font-semibold">Shipping</p>
          <div className="mt-3 space-y-2">
            <div className="flex items-start justify-between gap-4"><span className="shrink-0 text-neutral-500">Address</span><span className="max-w-[65%] break-words text-right">{shipping ? `${shipping.addressLine1}${shipping.addressLine2 ? `, ${shipping.addressLine2}` : ""}, ${shipping.city}, ${shipping.state} - ${shipping.postalCode}, ${shipping.country}` : "Digital / No shipping"}</span></div>
            {order.shipping?.courier && <div className="flex items-start justify-between gap-4"><span className="text-neutral-500">Courier</span><span className="max-w-[65%] break-words text-right">{order.shipping.courier}</span></div>}
            {order.shipping?.trackingNumber && <div className="flex items-start justify-between gap-4"><span className="text-neutral-500">Tracking</span><span className="max-w-[65%] break-all text-right">{order.shipping.trackingNumber}</span></div>}
          </div>
        </div>
      </div>

      {/* <footer className="mt-10 border-t pt-4 text-center text-[10px] text-neutral-500">Thank you for choosing {BRAND.name}. {BRAND.tagline}</footer> */}
    </article>
  );

  return twoUp ? <div className="invoice-a4-landscape grid grid-cols-2 gap-4">{copy}{copy}</div> : copy;
}
