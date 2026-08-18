import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";

function asTime(value: unknown): number {
  if (value == null) return 0;
  const v = value as any;
  const date = v?.toDate?.();
  if (date instanceof Date) return date.getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  if (typeof value === "string") {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }
  if (typeof v?._seconds === "number") return v._seconds * 1000 + Math.floor(Number(v._nanoseconds ?? 0) / 1e6);
  if (typeof v?.seconds === "number") return Number(v.seconds) * 1000;
  return 0;
}

function audienceEligible(stats: { count: number; last: number }, audience: any) {
  const minOrders = audience?.minOrders == null ? null : Number(audience.minOrders);
  const maxOrders = audience?.maxOrders == null ? null : Number(audience.maxOrders);
  if (minOrders != null && stats.count < minOrders) return false;
  if (maxOrders != null && stats.count > maxOrders) return false;
  const daysSince = stats.last ? Math.floor((Date.now() - stats.last) / 86_400_000) : Infinity;
  const minDays = audience?.minDaysSinceLastOrder == null ? null : Number(audience.minDaysSinceLastOrder);
  const maxDays = audience?.maxDaysSinceLastOrder == null ? null : Number(audience.maxDaysSinceLastOrder);
  if (minDays != null && daysSince < minDays) return false;
  if (maxDays != null && daysSince > maxDays) return false;
  return true;
}

function applicable(offer: any, request: { packageId?: string; fulfillmentType?: string; premiumFrame?: boolean }) {
  const applicability = offer.applicability ?? {};
  const packageIds = Array.isArray(applicability.packageIds) ? applicability.packageIds : [];
  const fulfillmentTypes = Array.isArray(applicability.fulfillmentTypes) ? applicability.fulfillmentTypes : [];
  const frame = String(applicability.premiumFrame ?? "ANY");
  if (packageIds.length && !packageIds.includes(request.packageId)) return false;
  if (fulfillmentTypes.length && !fulfillmentTypes.includes(request.fulfillmentType)) return false;
  if (frame !== "ANY" && ((frame === "YES") !== Boolean(request.premiumFrame))) return false;
  return true;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      packageId?: string;
      fulfillmentType?: string;
      premiumFrame?: boolean;
    };

    let uid = "";
    const auth = request.headers.get("authorization") ?? "";
    if (auth.startsWith("Bearer ")) {
      try {
        uid = (await adminAuth.verifyIdToken(auth.slice(7), true)).uid;
      } catch {
        uid = "";
      }
    }

    const [offersSnap, ordersSnap] = await Promise.all([
      adminDb.collection("offers").get(),
      uid ? adminDb.collection("orders").where("customer.uid", "==", uid).get() : Promise.resolve(null),
    ]);

    const stats = { count: ordersSnap?.size ?? 0, last: 0 };
    const usedByCode = new Map<string, number>();

    for (const order of ordersSnap?.docs ?? []) {
      const data = order.data();
      stats.last = Math.max(stats.last, asTime(data.createdAt));
      const codes = Array.from(new Set([
        ...(Array.isArray(data.pricing?.offerCodes) ? data.pricing.offerCodes : []),
        ...(data.pricing?.offerCode ? [data.pricing.offerCode] : []),
      ].map((code: unknown) => String(code).trim().toUpperCase()).filter(Boolean)));
      for (const code of codes) usedByCode.set(code, (usedByCode.get(code) ?? 0) + 1);
    }

    const now = Date.now();
    const available = offersSnap.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((offer: any) => {
        if (offer.enabled !== true) return false;
        const start = asTime(offer.startAt);
        const end = asTime(offer.endAt);
        if (start && now < start) return false;
        if (end && now >= end) return false;
        if (offer.usageLimit != null && Number(offer.usageCount ?? 0) >= Number(offer.usageLimit)) return false;
        if (!applicable(offer, body)) return false;
        const audience = offer.audience;
        const hasAudience = audience && Object.values(audience).some((value) => value != null && value !== "");
        if (hasAudience && !uid) return false;
        if (hasAudience && !audienceEligible(stats, audience)) return false;
        if (uid && offer.perCustomerLimit != null) {
          const used = usedByCode.get(String(offer.code ?? "").trim().toUpperCase()) ?? 0;
          if (used >= Number(offer.perCustomerLimit)) return false;
        }
        return true;
      })
      .map((offer: any) => ({
        id: offer.id,
        name: String(offer.name ?? ""),
        code: String(offer.code ?? "").trim().toUpperCase(),
        description: String(offer.description ?? ""),
        discountType: offer.discountType === "FIXED" ? "FIXED" : "PERCENTAGE",
        discountValue: Number(offer.discountValue ?? 0),
        minimumOrderValue: offer.minimumOrderValue == null ? null : Number(offer.minimumOrderValue),
        maximumDiscount: offer.maximumDiscount == null ? null : Number(offer.maximumDiscount),
        stackingMode: offer.stackingMode === "STACKABLE" ? "STACKABLE" : "EXCLUSIVE",
        discountBase: offer.discountBase ?? "DISCOUNTED_ITEM_TOTAL",
        discountComponents: Array.isArray(offer.discountComponents) ? offer.discountComponents : ["PACKAGE", "SUBJECTS", "FRAMING"],
        freeDelivery: Boolean(offer.freeDelivery ?? false),
        freeDeliveryMinimumOrderValue: offer.freeDeliveryMinimumOrderValue == null ? null : Number(offer.freeDeliveryMinimumOrderValue),
        endAt: offer.endAt ?? null,
      }));

    available.sort((a, b) => {
      if (a.stackingMode !== b.stackingMode) return a.stackingMode === "STACKABLE" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json({ success: true, offers: available });
  } catch (error) {
    console.error("Available promotion lookup failed:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load available coupons." }, { status: 500 });
  }
}
