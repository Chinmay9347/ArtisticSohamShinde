import { getCommissionPackage } from "@/data/commissionPackages";
import { defaultPricingConfig } from "@/data/defaultPricingConfig";
import { adminDb } from "@/server/firebase/admin";
import { calculateDeliveryQuote } from "@/server/delivery/deliveryPricing";
import type { PricingCalculationRequest, OrderPricing } from "@/types/api/order";
import type { OfferDocument } from "@/types/offer";

function asDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (value instanceof Date) return value;

  if (typeof value === "string") {
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? null : date;
  }

  return null;
}

function discountFor(
  type: "PERCENTAGE" | "FIXED",
  value: number,
  subtotal: number,
  maximumDiscount: number | null | undefined,
) {
  const raw =
    type === "PERCENTAGE"
      ? subtotal * (value / 100)
      : value;

  return Math.min(
    Math.max(raw, 0),
    maximumDiscount == null
      ? subtotal
      : Math.max(maximumDiscount, 0),
    subtotal,
  );
}

async function getOfferByCode(code: string) {
  const snapshot = await adminDb
    .collection("offers")
    .where("code", "==", code.trim().toUpperCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();
  const applicability =
    (data.applicability as Record<string, unknown> | undefined) ?? {};

  return {
    id: doc.id,
    code: String(data.code ?? ""),
    enabled: Boolean(data.enabled),
    discountType: data.discountType as "PERCENTAGE" | "FIXED",
    discountValue: Number(data.discountValue ?? 0),
    minimumOrderValue:
      data.minimumOrderValue == null
        ? null
        : Number(data.minimumOrderValue),
    maximumDiscount:
      data.maximumDiscount == null
        ? null
        : Number(data.maximumDiscount),
    usageLimit:
      data.usageLimit == null
        ? null
        : Number(data.usageLimit),
    usageCount: Number(data.usageCount ?? 0),
    perCustomerLimit:
      data.perCustomerLimit == null
        ? null
        : Number(data.perCustomerLimit),
    stackingMode: data.stackingMode === "STACKABLE" ? "STACKABLE" : "EXCLUSIVE",
    discountBase: data.discountBase === "PACKAGE" || data.discountBase === "SUBJECTS" || data.discountBase === "FRAMING" || data.discountBase === "SELECTED_COMPONENTS" ? data.discountBase : "DISCOUNTED_ITEM_TOTAL",
    discountComponents: Array.isArray(data.discountComponents) ? data.discountComponents : ["PACKAGE", "SUBJECTS", "FRAMING"],
    freeDelivery: Boolean(data.freeDelivery ?? false),
    freeDeliveryMinimumOrderValue: data.freeDeliveryMinimumOrderValue == null ? null : Number(data.freeDeliveryMinimumOrderValue),
    applicability: {
      packageIds: Array.isArray(applicability.packageIds)
        ? (applicability.packageIds as string[])
        : [],
      fulfillmentTypes: Array.isArray(applicability.fulfillmentTypes)
        ? (applicability.fulfillmentTypes as string[])
        : [],
      premiumFrame: String(applicability.premiumFrame ?? "ANY"),
    },
    startAt: data.startAt,
    endAt: data.endAt,
  };
}

async function getReferralByCode(code: string) {
  const snapshot = await adminDb
    .collection("referrals")
    .where("referralCode", "==", code.trim().toUpperCase())
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const doc = snapshot.docs[0];
  const data = doc.data();

  return {
    id: doc.id,
    referralCode: String(data.referralCode ?? ""),
    campaignId: String(data.campaignId ?? ""),
    referrerUserId: String(data.referrerUserId ?? ""),
    referredUserId: (data.referredUserId as string | null | undefined) ?? null,
    status: String(data.status ?? "PENDING"),
  };
}

async function getReferralCampaign(id: string) {
  const snapshot = await adminDb
    .collection("referralCampaigns")
    .doc(id)
    .get();

  if (!snapshot.exists) return null;

  const data = snapshot.data()!;

  return {
    id: snapshot.id,
    enabled: Boolean(data.enabled),
    referredCustomerReward:
      (data.referredCustomerReward as {
        type: "PERCENTAGE" | "FIXED";
        value: number;
        maximumDiscount?: number | null;
      }) ?? { type: "PERCENTAGE", value: 0 },
    stackWithOffers: Boolean(data.stackWithOffers),
    firstOrderOnly: Boolean(data.firstOrderOnly),
    startAt: data.startAt,
    endAt: data.endAt,
  };
}

export async function calculateOrderPrice(
  request: PricingCalculationRequest,
): Promise<OrderPricing> {
  const pkg = getCommissionPackage(request.portrait.packageId);

  if (!pkg) {
    throw new Error("Selected commission package is invalid.");
  }

  const pricingSnapshot = await adminDb
    .collection("pricingConfigs")
    .doc(request.portrait.packageId)
    .get();

  let pricingConfig = pricingSnapshot.exists
    ? pricingSnapshot.data()
    : defaultPricingConfig.find(
        (config) =>
          config.packageId ===
          request.portrait.packageId,
      );

  // Guard the live quote endpoint against legacy A4/A3-swapped Firestore records.
  const canonicalConfig = defaultPricingConfig.find((config) => config.packageId === request.portrait.packageId);
  if (pricingConfig && canonicalConfig && ((request.portrait.packageId === "premium" && String(pricingConfig.size) === "A3") || (request.portrait.packageId === "luxury" && String(pricingConfig.size) === "A4"))) {
    pricingConfig = { ...pricingConfig, ...canonicalConfig, subjectPrices: pricingConfig.subjectPrices ?? canonicalConfig.subjectPrices, enabled: pricingConfig.enabled ?? canonicalConfig.enabled };
  }

  if (!pricingConfig) {
    throw new Error(
      "Pricing configuration is unavailable for the selected package.",
    );
  }

  if (pricingConfig.enabled === false) {
    throw new Error(
      "The selected package is currently unavailable.",
    );
  }

  // const configuredSize =
  //   String(pricingConfig.size ?? pkg.size);

  // if (request.portrait.size !== configuredSize) {
  //   throw new Error(
  //     "Selected portrait size does not match the package.",
  //   );
  // }

  const configuredSize = String(pricingConfig.size ?? pkg.size);
  const allowedSizes = ["A5", "A4", "A3", "A2"];
  if (!allowedSizes.includes(request.portrait.size)) {
    throw new Error("Selected portrait size is invalid.");
  }
  if (!configuredSize) {
    throw new Error("Selected package does not have a valid portrait size.");
  }
  if (request.portrait.size !== configuredSize) {
    throw new Error(`The selected package is configured for ${configuredSize}.`);
  }

  const isDigital =
    request.fulfillment.type === "digital";

  const isFramed =
    request.fulfillment.type === "framed";

  const premium =
    !isDigital &&
    request.portrait.framing;

  const prices =
    (pricingConfig.prices as Record<string, unknown> | undefined) ??
    {};

  const subjectPrices =
    (pricingConfig.subjectPrices as Record<string, unknown> | undefined) ??
    {};

  const pricingType =
    request.fulfillment.type === "printed"
      ? "sketched"
      : request.fulfillment.type;

  let fulfillmentPrice =
    Number(
      prices[pricingType] ??
        pkg.price,
    );

  if (!Number.isFinite(fulfillmentPrice) || fulfillmentPrice < 0) {
    throw new Error(
      "Pricing configuration contains an invalid fulfillment price.",
    );
  }

  let framingPrice = 0;

  if (premium) {
    framingPrice =
      Number(prices.premiumFrame ?? 0);

    if (
      !Number.isFinite(framingPrice) ||
      framingPrice < 0
    ) {
      throw new Error(
        "Pricing configuration contains an invalid premium frame price.",
      );
    }

    fulfillmentPrice += framingPrice;
  }

  const subjectKey = String(
    Math.min(
      Math.max(request.portrait.subjects, 1),
      4,
    ),
  );

  const subjectsPrice =
    Number(
      subjectPrices[subjectKey] ?? 0,
    );

  if (
    !Number.isFinite(subjectsPrice) ||
    subjectsPrice < 0
  ) {
    throw new Error(
      "Pricing configuration contains an invalid subject price.",
    );
  }

  const subtotal =
    fulfillmentPrice + subjectsPrice;

  const deliveryQuote =
    request.fulfillment.type === "digital"
      ? { configured: false, serviceLevel: "STANDARD" as const, provider: null, ruleId: null, zone: "DIGITAL", deliveryCharge: 0, freeDelivery: true }
      : await calculateDeliveryQuote(
          request.delivery,
          {
            orderValue: subtotal,
            serviceLevel: request.delivery.serviceLevel ?? undefined,
          },
        );

  let deliveryCharge = Math.max(
    0,
    Number(deliveryQuote.deliveryCharge ?? 0),
  );

  let couponDiscount = 0;
  let referralDiscount = 0;
  let rewardPointsUsed = 0;

  const couponCodes = Array.from(new Set((request.offerCodes?.length ? request.offerCodes : (request.offerCode ? request.offerCode.split(",") : [])).map(code => code.trim().toUpperCase()).filter(Boolean)));
  const offers: OfferDocument[] = [];
  for(const code of couponCodes){
    const offer=await getOfferByCode(code);
    if(!offer || !offer.enabled) throw new Error(`Coupon ${code} is invalid or disabled.`);
    const now=Date.now(), start=asDate(offer.startAt)?.getTime(), end=asDate(offer.endAt)?.getTime();
    if(start&&now<start) throw new Error(`Coupon ${code} has not started yet.`);
    if(end&&now>=end) throw new Error(`Coupon ${code} has expired.`);
    if(offer.usageLimit!=null&&offer.usageCount>=offer.usageLimit) throw new Error(`Coupon ${code} has reached its usage limit.`);
    if(offer.applicability.packageIds.length>0&&!offer.applicability.packageIds.includes(request.portrait.packageId)) throw new Error(`Coupon ${code} does not apply to this package.`);
    if(offer.applicability.fulfillmentTypes.length>0&&!offer.applicability.fulfillmentTypes.includes(request.fulfillment.type)) throw new Error(`Coupon ${code} does not apply to this fulfillment method.`);
    if(offer.applicability.premiumFrame!=="ANY"&&((offer.applicability.premiumFrame==="YES")!==premium)) throw new Error(`Coupon ${code} does not apply to this framing option.`);
    offers.push(offer as OfferDocument);
  }
  if(offers.length>1 && offers.some(o=>o.stackingMode!=="STACKABLE")) throw new Error("One or more selected coupons are exclusive and cannot be stacked.");

  const componentTotals = {
    PACKAGE: Math.max(0, fulfillmentPrice - framingPrice),
    SUBJECTS: Math.max(0, subjectsPrice),
    FRAMING: Math.max(0, premium ? framingPrice : 0),
  };
  const componentRemaining = { ...componentTotals };

  const discountBaseFor = (offer: typeof offers[number]) => {
    if (offer.discountBase === "PACKAGE") return componentRemaining.PACKAGE;
    if (offer.discountBase === "SUBJECTS") return componentRemaining.SUBJECTS;
    if (offer.discountBase === "FRAMING") return componentRemaining.FRAMING;
    if (offer.discountBase === "SELECTED_COMPONENTS") {
      const components = Array.isArray(offer.discountComponents) ? offer.discountComponents : ["PACKAGE", "SUBJECTS", "FRAMING"];
      return components.reduce((sum, component) => sum + Number(componentRemaining[component as keyof typeof componentRemaining] ?? 0), 0);
    }
    return Object.values(componentRemaining).reduce((sum, value) => sum + value, 0);
  };

  const orderedOffers = [...offers].sort((a, b) => {
    const aDiscount = discountFor(a.discountType, a.discountValue, discountBaseFor(a), a.maximumDiscount);
    const bDiscount = discountFor(b.discountType, b.discountValue, discountBaseFor(b), b.maximumDiscount);
    if (bDiscount !== aDiscount) return bDiscount - aDiscount;
    return String(a.code ?? "").localeCompare(String(b.code ?? ""));
  });

  for (const offer of orderedOffers) {
    const eligibleBase = discountBaseFor(offer);
    if (offer.minimumOrderValue != null && eligibleBase < offer.minimumOrderValue) {
      throw new Error(`Minimum eligible amount for ${offer.code} is ₹${offer.minimumOrderValue}.`);
    }
    const applied = Math.min(eligibleBase, discountFor(offer.discountType, offer.discountValue, eligibleBase, offer.maximumDiscount));
    if (applied <= 0) continue;
    couponDiscount += applied;

    if (offer.discountBase === "PACKAGE") {
      componentRemaining.PACKAGE = Math.max(0, componentRemaining.PACKAGE - applied);
    } else if (offer.discountBase === "SUBJECTS") {
      componentRemaining.SUBJECTS = Math.max(0, componentRemaining.SUBJECTS - applied);
    } else if (offer.discountBase === "FRAMING") {
      componentRemaining.FRAMING = Math.max(0, componentRemaining.FRAMING - applied);
    } else {
      const selected = offer.discountBase === "SELECTED_COMPONENTS"
        ? (Array.isArray(offer.discountComponents) ? offer.discountComponents : ["PACKAGE", "SUBJECTS", "FRAMING"])
        : ["PACKAGE", "SUBJECTS", "FRAMING"];
      const base = selected.reduce((sum, component) => sum + Number(componentRemaining[component as keyof typeof componentRemaining] ?? 0), 0);
      if (base > 0) {
        for (const component of selected) {
          const key = component as keyof typeof componentRemaining;
          const share = Number(componentRemaining[key] ?? 0) / base;
          componentRemaining[key] = Math.max(0, componentRemaining[key] - applied * share);
        }
      }
    }
  }

  let effectiveReferralCode = request.referralCode?.trim().toUpperCase();
  if (!effectiveReferralCode && request.customerUid) {
    const claimed = await adminDb.collection("referrals").where("referredUserId", "==", request.customerUid).where("status", "==", "ACTIVE").limit(1).get();
    if (!claimed.empty) effectiveReferralCode = String(claimed.docs[0].data().referralCode ?? "");
  }

  if (effectiveReferralCode) {
    const referral = await getReferralByCode(effectiveReferralCode);

    if (!referral) {
      throw new Error("Referral code is invalid.");
    }

    if (referral.referrerUserId === request.customerUid) {
      throw new Error("You cannot use your own referral code.");
    }

    if (referral.referredUserId !== request.customerUid) {
      throw new Error("This referral code is not linked to this customer account.");
    }

    if (referral.status !== "ACTIVE") {
      throw new Error("This referral code is no longer available.");
    }

    const campaign = await getReferralCampaign(
      referral.campaignId,
    );

    if (!campaign?.enabled) {
      throw new Error("This referral campaign is inactive.");
    }

    const now = Date.now();
    const start = asDate(campaign.startAt)?.getTime();
    const end = asDate(campaign.endAt)?.getTime();

    if (start && now < start) {
      throw new Error("This referral campaign has not started yet.");
    }

    if (end && now > end) {
      throw new Error("This referral campaign has expired.");
    }

    if (
      campaign.firstOrderOnly &&
      request.customerUid
    ) {
      const customerOrders = await adminDb
        .collection("orders")
        .where(
          "customer.uid",
          "==",
          request.customerUid,
        )
        .limit(1)
        .get();

      if (!customerOrders.empty) {
        throw new Error(
          "This referral reward is available only on your first order.",
        );
      }
    }

    const reward = campaign.referredCustomerReward;

    const calculatedReferralDiscount = discountFor(
      reward.type,
      Number(reward.value ?? 0),
      subtotal,
      reward.maximumDiscount,
    );

    referralDiscount = campaign.stackWithOffers
      ? Math.min(subtotal - couponDiscount, calculatedReferralDiscount)
      : Math.max(0, calculatedReferralDiscount - couponDiscount);
  }

  const discountBeforeRewards = Math.min(
    subtotal,
    couponDiscount + referralDiscount,
  );

  const requestedRewardPoints = Math.max(
    0,
    Math.floor(Number(request.rewardPointsUsed ?? 0)),
  );

  if (requestedRewardPoints > 0) {
    if (!request.customerUid) {
      throw new Error("Please sign in to use referral reward coins.");
    }

    const customerSnapshot = await adminDb
      .collection("users")
      .doc(request.customerUid)
      .get();

    if (!customerSnapshot.exists) {
      throw new Error("Customer account profile was not found.");
    }

    const customerData = customerSnapshot.data() ?? {};
    const availableRewardCoins = Math.max(
      0,
      Number(customerData.referralRewardCoins ?? 0),
    );
    const maximumUsable = Math.max(
      0,
      Math.floor(subtotal - discountBeforeRewards),
    );

    if (requestedRewardPoints > availableRewardCoins) {
      throw new Error(`You have only ${availableRewardCoins} referral reward coin(s) available.`);
    }

    if (requestedRewardPoints > maximumUsable) {
      throw new Error(`Only ${maximumUsable} referral reward coin(s) can be used on this order.`);
    }

    rewardPointsUsed = requestedRewardPoints;
  }

  const discount = Math.min(
    subtotal,
    discountBeforeRewards + rewardPointsUsed,
  );

  const freeDeliveryOffer = orderedOffers.find(
    (offer) => offer.freeDelivery === true &&
      (offer.freeDeliveryMinimumOrderValue == null || subtotal >= offer.freeDeliveryMinimumOrderValue),
  );

  if (freeDeliveryOffer) {
    deliveryCharge = 0;
  }

  /*
   * Marketing/package pricing:
   *
   * `subtotal` is already the customer's discounted package price.
   * Coupons are therefore ALWAYS calculated on this discounted price,
   * never on the crossed-out/original price.
   *
   * `originalTotal` is retained separately so the order can show:
   * Original → Built-in package discount → Coupon/Referral/Rewards → Paid.
   */
  const configuredOriginalPackagePrice = Math.max(
    0,
    Number(
      pricingConfig.originalPrice ??
        pkg.originalPrice ??
        fulfillmentPrice,
    ),
  );

  const originalFulfillmentPrice =
    configuredOriginalPackagePrice +
    (premium ? framingPrice : 0);

  const originalTotal =
    originalFulfillmentPrice +
    subjectsPrice;

  const promotionalDiscount = Math.max(
    0,
    originalTotal - subtotal,
  );

  const totalSaved = Math.max(
    0,
    promotionalDiscount + discount,
  );

  return {
    basePrice: Math.max(0, fulfillmentPrice - framingPrice),
    framingPrice,
    subjectsPrice,
    subtotal,
    original: originalTotal,
    customerPriceBeforeOffers: subtotal,
    promotionalDiscount,
    discount,
    couponDiscount,
    referralDiscount,
    rewardPointsUsed,
    totalSaved,
    deliveryDistanceKm: 0,
    deliveryCharge,
    deliveryServiceLevel: deliveryQuote.serviceLevel,
    deliveryProvider: deliveryQuote.provider,
    deliveryRuleId: deliveryQuote.ruleId,
    deliveryZone: deliveryQuote.zone,
    freeDelivery: Boolean(deliveryQuote.freeDelivery) || Boolean(freeDeliveryOffer),
    total: Math.max(0, subtotal - discount) + deliveryCharge,
    currency: "INR",
  };
}
