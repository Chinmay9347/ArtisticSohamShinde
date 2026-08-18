"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { TicketPercent } from "lucide-react";
import { getOffers } from "@/services/offers";
import type { OfferDocument } from "@/types/offer";

function toMillis(value: unknown) {
  if (value && typeof value === "object" && "toDate" in value && typeof (value as { toDate?: unknown }).toDate === "function") {
    return (value as { toDate: () => Date }).toDate().getTime();
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "string") {
    const parsed = Date.parse(value);
    return Number.isFinite(parsed) ? parsed : NaN;
  }
  return NaN;
}

export function ActiveOffers() {
  const [offers, setOffers] = useState<OfferDocument[]>([]);
  useEffect(() => {
    getOffers().then((items) => {
      const now = Date.now();
      setOffers(items.filter((offer) => {
        if (!offer.enabled) return false;
        const start = toMillis(offer.startAt);
        const end = toMillis(offer.endAt);
        return (!Number.isFinite(start) || start <= now) && (!Number.isFinite(end) || end >= now);
      }).slice(0, 3));
    }).catch(() => setOffers([]));
  }, []);
  if (!offers.length) return null;
  return (
    <section className="mx-auto w-full max-w-7xl px-6 py-10">
      <div className="rounded-[2rem] border border-[#C9A227]/30 bg-black p-7 text-white shadow-xl">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs uppercase tracking-[0.3em] text-[#C9A227]">Public Offers</p><h2 className="mt-2 font-cinzel text-3xl">Current promotions</h2><p className="mt-2 text-sm text-white/60">Use an active code while placing your commission.</p></div>
          <Link href="/pricing" className="rounded-xl border border-[#C9A227] px-4 py-2 text-sm font-semibold text-[#C9A227]">View Pricing</Link>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {offers.map((offer) => <div key={offer.id} className="rounded-2xl border border-white/10 bg-white/5 p-5"><TicketPercent className="text-[#C9A227]"/><h3 className="mt-4 font-semibold">{offer.name}</h3><p className="mt-1 text-sm text-white/60">{offer.description}</p><p className="mt-4 text-lg font-bold text-[#C9A227]">{offer.discountValue}{offer.discountType === "PERCENTAGE" ? "%" : " INR"} off</p><code className="mt-2 inline-block rounded-lg bg-white/10 px-3 py-1 text-sm">{offer.code}</code></div>)}
        </div>
      </div>
    </section>
  );
}
