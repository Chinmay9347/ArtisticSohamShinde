"use client";

import { useEffect, useMemo, useState } from "react";
import { useCommissionSubmit } from "../../hooks";
import { NavigationButtons } from "../../NavigationButtons";
import { ProgressBar } from "../../ProgressBar";
import { StepHeader } from "../../StepHeader";
import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { getCommissionPackage } from "@/data/commissionPackages";
import { usePublicCommissionPricing } from "@/hooks/usePublicCommissionPricing";
import { reviewStepStyles as styles } from "./ReviewStep.styles";
import type { ReviewStepProps } from "./ReviewStep.types";

interface PricingQuote {
  basePrice: number;
  framingPrice: number;
  subjectsPrice: number;
  subtotal: number;
  discount: number;
  couponDiscount?: number;
  referralDiscount?: number;
  rewardPointsUsed?: number;
  deliveryDistanceKm?: number;
  deliveryCharge?: number;
  deliveryServiceLevel?: "STANDARD" | "EXPRESS";
  deliveryProvider?: string | null;
  total: number;
}

interface AvailableCoupon {
  id: string;
  name: string;
  code: string;
  description: string;
  discountType: "PERCENTAGE" | "FIXED";
  discountValue: number;
  minimumOrderValue: number | null;
  maximumDiscount: number | null;
  stackingMode: "STACKABLE" | "EXCLUSIVE";
  discountBase: "DISCOUNTED_ITEM_TOTAL" | "PACKAGE" | "SUBJECTS" | "FRAMING" | "SELECTED_COMPONENTS";
  discountComponents: string[];
  freeDelivery: boolean;
  freeDeliveryMinimumOrderValue: number | null;
  endAt: unknown;
}


export function ReviewStep({ commission }: ReviewStepProps) {
  const {
    package: packageType,
    customer,
    fulfillment,
    delivery,
    portrait,
    photos,
    instructions,
    galleryArtwork,
  } = commission.formData;

  const { user } = useAuth();
  const { profile } = useUserProfile();
  const [offerCode,setOfferCode]=useState((commission.formData.offerCodes??(commission.formData.offerCode?[commission.formData.offerCode]:[])).join(", "));
  const [rewardPoints, setRewardPoints] = useState(
    Math.max(0, Math.floor(Number(commission.formData.rewardPointsUsed ?? 0))),
  );
  const [pricing, setPricing] = useState<PricingQuote | null>(null);
  const [pricingError, setPricingError] = useState("");
  const [applying, setApplying] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState<AvailableCoupon[]>([]);
  const [couponLoadError, setCouponLoadError] = useState("");

  const { getPackage: getLivePackage } = usePublicCommissionPricing();
  const selectedPackage = getLivePackage(packageType);
  const availableRewardCoins = Math.max(
    0,
    Math.floor(Number(profile?.referralRewardCoins ?? 0)),
  );

  const { submitOrder, isSubmitting } = useCommissionSubmit({
    formData: commission.formData,
  });

  const loadAvailableCoupons = async () => {
    try {
      setCouponLoadError("");
      const headers: { Authorization?: string } = {};
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;

      const response = await fetch("/api/promotions/available", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          packageId: packageType,
          fulfillmentType: fulfillment.type,
          premiumFrame: Boolean(portrait.framing),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message ?? "Unable to load available coupons.");
      setAvailableCoupons(Array.isArray(data.offers) ? data.offers : []);
    } catch (error) {
      console.error("Available coupons load failed:", error);
      setAvailableCoupons([]);
      setCouponLoadError(error instanceof Error ? error.message : "Unable to load available coupons.");
    }
  };

  const selectedCouponCodes = useMemo(
    () => offerCode.split(",").map((code) => code.trim().toUpperCase()).filter(Boolean),
    [offerCode],
  );

  const toggleCoupon = (coupon: AvailableCoupon) => {
    const current = new Set(selectedCouponCodes);
    if (current.has(coupon.code)) {
      current.delete(coupon.code);
    } else if (coupon.stackingMode === "STACKABLE") {
      const hasExclusive = selectedCouponCodes.some((code) =>
        availableCoupons.some((item) => item.code === code && item.stackingMode === "EXCLUSIVE"),
      );
      if (hasExclusive) {
        current.clear();
      }
      current.add(coupon.code);
    } else {
      current.clear();
      current.add(coupon.code);
    }

    setOfferCode(Array.from(current).join(", "));
  };

  const calculate = async (code = offerCode, coins = rewardPoints) => {
    setApplying(true);
    setPricingError("");
    try {
      const headers: { Authorization?: string } = {};
      if (user) headers.Authorization = `Bearer ${await user.getIdToken()}`;

      const res = await fetch("/api/pricing/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...headers },
        body: JSON.stringify({
          portrait: {
            packageId: packageType,
            subjects: portrait.subjects,
            size: portrait.size,
            orientation: portrait.orientation,
            framing: portrait.framing,
          },
          fulfillment,
          delivery,
          offerCode: code.split(",")[0]?.trim().toUpperCase() || undefined,
          offerCodes: code.split(",").map(item=>item.trim().toUpperCase()).filter(Boolean),
          rewardPointsUsed: Math.max(0, Math.floor(Number(coins) || 0)),
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Unable to calculate price.");

      setPricing(data.pricing);
      commission.updateFormData({
        offerCode: code.split(",")[0]?.trim().toUpperCase(),
        offerCodes: code.split(",").map(item=>item.trim().toUpperCase()).filter(Boolean),
        rewardPointsUsed: Math.max(0, Math.floor(Number(coins) || 0)),
      });
    } catch (error) {
      setPricingError(error instanceof Error ? error.message : "Unable to calculate price.");
      setPricing(null);
    } finally {
      setApplying(false);
    }
  };

  useEffect(() => {
    void loadAvailableCoupons();
    // Coupon availability depends on the current package/fulfillment/frame and user.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageType, portrait.framing, fulfillment.type, user?.uid]);

  useEffect(() => {
    void calculate(offerCode, rewardPoints);
    // Quote is intentionally recalculated when any price-affecting selection changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packageType, portrait.subjects, portrait.size, portrait.framing, fulfillment.type, user?.uid]);

  const original = pricing?.subtotal ?? 0;
  const discount = pricing?.discount ?? 0;
  const total = pricing?.total ?? 0;
  const couponDiscount = pricing?.couponDiscount ?? 0;
  const referralDiscount = pricing?.referralDiscount ?? 0;
  const rewardDiscount = pricing?.rewardPointsUsed ?? 0;
  const deliveryDistanceKm = pricing?.deliveryDistanceKm ?? 0;
  const deliveryCharge = pricing?.deliveryCharge ?? 0;
  const deliveryServiceLevel = pricing?.deliveryServiceLevel ?? "STANDARD";
  const deliveryProvider = pricing?.deliveryProvider ?? null;

  const galleryReference = useMemo(
    () => galleryArtwork ? [{ id: `gallery-${galleryArtwork.id}`, imageUrl: galleryArtwork.imageUrl, title: galleryArtwork.title }] : [],
    [galleryArtwork],
  );

  return (
    <section className={styles.container}>
      <ProgressBar commission={commission} />
      <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title="Review Your Order"
        description="Please verify every detail and the final customer-facing price before submitting your commission."
      />

      <div className={styles.grid}>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Customer Details</h3>
          <Row l="Full Name" v={customer.fullName || "-"} />
          <Row l="Email" v={customer.email || "-"} />
          <Row l="Phone" v={customer.phone || "-"} />
        </div>
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Portrait Details</h3>
          <Row l="Package" v={selectedPackage.name} />
          <Row l="Subjects" v={String(portrait.subjects)} />
          <Row l="Size" v={selectedPackage.size} />
          <Row l="Orientation" v={portrait.orientation} />
          <Row l="Premium Frame" v={portrait.framing ? "Yes" : "No"} />
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Delivery</h3>
        <Row l="Type" v={fulfillment.type} />
        {fulfillment.type !== "digital" && (
          <>
            <Row l="City" v={delivery.city || "-"} />
            <Row l="State" v={delivery.state || "-"} />
            <Row l="PIN Code" v={delivery.pincode || "-"} />
            <Row l="Address" v={delivery.addressLine1 || "-"} />
            <Row l="Country" v={delivery.country || "-"} />
          </>
        )}
      </div>

      {galleryArtwork && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Gallery Reference</h3>
          <div className="flex items-center gap-4">
            <img src={galleryArtwork.imageUrl} alt={galleryArtwork.title} className="h-28 w-24 rounded-xl object-cover" />
            <div>
              <p className="font-semibold">{galleryArtwork.title}</p>
              <p className="text-sm text-neutral-500">This exact gallery artwork remains attached to the order.</p>
            </div>
          </div>
        </div>
      )}

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Reference Photos</h3>
        {galleryReference.length > 0 && (
          <div className="mb-4 rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#8f7414]">Locked gallery reference</p>
            <div className="mt-3 flex items-center gap-4">
              <img src={galleryReference[0].imageUrl} alt={galleryReference[0].title} className="h-24 w-20 rounded-xl object-cover" />
              <p className="font-semibold">{galleryReference[0].title}</p>
            </div>
          </div>
        )}
        {photos.length > 0 ? (
          <div className={styles.photos}>
            {photos.map((photo) => (
              <div key={photo.id} className={styles.photo}>
                <img src={photo.preview} alt={photo.fileName} className={styles.image} />
              </div>
            ))}
          </div>
        ) : !galleryArtwork ? (
          <p className={styles.label}>No photos uploaded.</p>
        ) : (
          <p className="text-sm text-neutral-500">The gallery artwork above is the locked reference for this order.</p>
        )}
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Special Instructions</h3>
        <div className={styles.instructions}>
          <strong>Instructions</strong>
          <p className="mt-2 text-neutral-700">{instructions.specialInstructions || "No special instructions provided."}</p>
          <div className="my-4 border-t border-neutral-700" />
          <strong>Gift Message</strong>
          <p className="mt-2 text-neutral-700">{instructions.giftMessage || "No gift message."}</p>
        </div>
      </div>

      <div className={`${styles.section} min-w-0 overflow-hidden`}>
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h3 className={styles.sectionTitle}>Coupons & Referral Rewards</h3>
            <p className="mb-4 text-sm text-neutral-500">
              All coupons shown below are currently available for this order. Stackable coupons can be combined with other stackable coupons; exclusive coupons must be used alone.
            </p>
          </div>
          <button
            type="button"
            onClick={() => void loadAvailableCoupons()}
            disabled={applying}
            className="shrink-0 rounded-xl border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:border-[#C9A227] hover:bg-[#C9A227]/10 disabled:opacity-50"
          >
            Refresh coupons
          </button>
        </div>

        {couponLoadError && (
          <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{couponLoadError}</p>
        )}

        {availableCoupons.length > 0 ? (
          <div className="grid min-w-0 gap-4 md:grid-cols-2">
            {availableCoupons.map((coupon) => {
              const selected = selectedCouponCodes.includes(coupon.code);
              const discountLabel = coupon.discountType === "PERCENTAGE"
                ? `${coupon.discountValue}% OFF`
                : `₹${coupon.discountValue.toLocaleString("en-IN")} OFF`;
              return (
                <button
                  key={coupon.id}
                  type="button"
                  onClick={() => toggleCoupon(coupon)}
                  className={`min-w-0 max-w-full overflow-hidden text-left rounded-2xl border p-4 transition ${selected ? "border-[#C9A227] bg-[#C9A227]/10 ring-2 ring-[#C9A227]/20" : "border-neutral-200 bg-white hover:border-[#C9A227]"}`}
                >
                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="break-words font-semibold text-neutral-900">{coupon.name}</p>
                      <p className="mt-1 text-2xl font-bold text-[#8f7414]">{discountLabel}</p>
                    </div>
                    <span className={`w-fit max-w-full rounded-full px-3 py-1 text-xs font-bold ${coupon.stackingMode === "STACKABLE" ? "bg-green-100 text-green-800" : "bg-neutral-900 text-white"}`}>
                      {coupon.stackingMode === "STACKABLE" ? "STACKABLE" : "NOT STACKABLE"}
                    </span>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-lg bg-neutral-100 px-3 py-1 font-mono text-sm font-bold text-neutral-900">{coupon.code}</span>
                    {selected && <span className="rounded-full bg-[#C9A227] px-3 py-1 text-xs font-bold text-black">Selected</span>}
                  </div>
                  {coupon.description && <p className="mt-3 text-sm text-neutral-500">{coupon.description}</p>}
                  {coupon.minimumOrderValue != null && <p className="mt-2 text-xs text-neutral-500">Minimum eligible amount: ₹{coupon.minimumOrderValue.toLocaleString("en-IN")}</p>}<div className="mt-3 flex flex-wrap gap-2 text-[11px] font-semibold">{coupon.discountBase === "DISCOUNTED_ITEM_TOTAL" ? <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">Discount on discounted item price</span> : <span className="rounded-full bg-neutral-100 px-2 py-1 text-neutral-700">Discount on {coupon.discountBase === "SELECTED_COMPONENTS" ? coupon.discountComponents.join(", ").toLowerCase() : coupon.discountBase.toLowerCase()}</span>}{coupon.freeDelivery && <span className="rounded-full bg-green-100 px-2 py-1 text-green-800">Free delivery{coupon.freeDeliveryMinimumOrderValue != null ? ` above ₹${coupon.freeDeliveryMinimumOrderValue.toLocaleString("en-IN")}` : ""}</span>}</div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 p-5 text-sm text-neutral-500">
            No coupons are currently available for this package, fulfillment type, frame selection, and account.
          </div>
        )}

        <div className="mt-6 grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(260px,320px)]">
          <div className="min-w-0 overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-50 p-5">
            <label className="text-sm font-semibold text-neutral-900">Coupon code(s)</label>
            <p className="mt-1 text-xs text-neutral-500">You can also enter codes manually. Multiple codes are allowed only when all selected coupons are stackable.</p>
            <div className="mt-3 flex min-w-0 flex-col gap-3 sm:flex-row">
              <input
                value={offerCode}
                onChange={(e) => setOfferCode(e.target.value.toUpperCase())}
                placeholder="Coupon code(s), comma separated"
                className="min-w-0 w-full flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 text-neutral-900 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
              />
              <button type="button" disabled={applying} onClick={() => void calculate(offerCode, rewardPoints)} className="w-full shrink-0 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-[#C9A227] hover:text-black disabled:opacity-40 sm:w-auto">
                {applying ? "Applying..." : "Apply"}
              </button>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden rounded-2xl border border-[#C9A227]/40 bg-[#C9A227]/10 p-5">
            <label className="text-base font-semibold text-neutral-900">Referral reward coins</label>
            <p className="mt-1 text-sm text-neutral-600">1 coin = ₹1 · Available: <span className="font-bold text-[#8f7414]">{availableRewardCoins}</span></p>
            <input
              type="number"
              min={0}
              max={availableRewardCoins}
              step={1}
              value={rewardPoints}
              onChange={(e) => setRewardPoints(Math.max(0, Math.min(availableRewardCoins, Math.floor(Number(e.target.value) || 0))))}
              onBlur={() => void calculate(offerCode, rewardPoints)}
              className="mt-3 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            />
            {availableRewardCoins === 0 && <p className="mt-2 text-xs text-neutral-500">No reward coins are currently available.</p>}
          </div>
        </div>

        {pricingError && <p className="mt-3 text-sm font-medium text-red-600">{pricingError}</p>}
      </div>

      <div className="rounded-2xl border-2 border-[#C9A227] bg-[#C9A227]/10 p-6 text-neutral-900 shadow-sm">
        <h3 className="text-lg font-bold text-[#8f7414]">Customer-Facing Price</h3>
        {discount > 0 && <p className="mt-2 text-sm text-neutral-500 line-through">₹{original.toLocaleString("en-IN")}</p>}
        <p className="mt-2 text-4xl font-bold text-[#8f7414]">₹{total.toLocaleString("en-IN")}</p>
        <div className="mt-5 space-y-2 text-sm">
          <PriceRow label="Package / fulfillment" value={pricing?.basePrice ?? 0} />
          <PriceRow label="Premium frame" value={pricing?.framingPrice ?? 0} />
          <PriceRow label="Subjects adjustment" value={pricing?.subjectsPrice ?? 0} />
          {couponDiscount > 0 && <PriceRow label="Coupon discount" value={-couponDiscount} negative />}
          {referralDiscount > 0 && <PriceRow label="Referral discount" value={-referralDiscount} negative />}
          {rewardDiscount > 0 && <PriceRow label="Referral reward coins" value={-rewardDiscount} negative />}
          {deliveryDistanceKm > 0 && <PriceRow label="Delivery distance" value={deliveryDistanceKm} suffix=" km" />}
          {deliveryCharge > 0 ? <PriceRow label={`${deliveryProvider ? `${deliveryProvider} ` : ""}${deliveryServiceLevel.toLowerCase()} delivery`} value={deliveryCharge} /> : <PriceRow label="Delivery" value={0} suffix=" Free" />}
        </div>
        {discount > 0 && <p className="mt-4 text-sm font-semibold text-green-700">You save ₹{discount.toLocaleString("en-IN")}</p>}
        <p className={styles.totalDescription}>Coupons and referral rewards apply to the customer-facing subtotal. Distance-based delivery is added after discounts. Reward coins are deducted from your referral reward wallet only when the order is created successfully.</p>
      </div>

      <NavigationButtons commission={commission} submitLabel={isSubmitting ? "Creating Order..." : "Continue to Payment"} onSubmit={() => void submitOrder()} />
    </section>
  );
}

function Row({ l, v }: { l: string; v: string }) {
  return <div className="flex items-start justify-between gap-6 border-b border-neutral-100 py-3"><span className="shrink-0 text-sm font-medium text-neutral-500">{l}</span><span className="ml-auto w-full max-w-[55%] break-words text-right font-semibold text-neutral-900">{v}</span></div>;
}

function PriceRow({ label, value, negative = false, suffix = "" }: { label: string; value: number; negative?: boolean; suffix?: string }) {
  return <div className="flex items-center justify-between gap-4"><span className="text-neutral-500">{label}</span><span className={negative ? "font-semibold text-green-700" : "font-semibold text-neutral-900"}>{value < 0 ? "-" : ""}{suffix ? `${Math.abs(value).toLocaleString("en-IN")}${suffix}` : `₹${Math.abs(value).toLocaleString("en-IN")}`}</span></div>;
}
