import { getCommissionPackage } from "@/data/commissionPackages";
import type { Order } from "@/types/order";

export interface OrderSavingsBreakdown {
  original: number;
  promotional: number;
  customerPriceBeforeOffers: number;
  coupon: number;
  referral: number;
  reward: number;
  paid: number;
  saved: number;
  legacy: boolean;
}

export function getOrderSavings(order: Order): OrderSavingsBreakdown {
  const pricing = order.pricing ?? {};
  const pkg = getCommissionPackage(order.portrait?.packageId);

  const coupon = Math.max(0, Number(pricing.couponDiscount ?? 0));
  const referral = Math.max(0, Number(pricing.referralDiscount ?? 0));
  const reward = Math.max(0, Number(pricing.rewardPointsUsed ?? 0));
  const paid = Math.max(
    0,
    Number(pricing.total ?? order.payment?.amount ?? 0),
  );

  const stored = pricing.savings;

  if (stored) {
    return {
      original: Math.max(
        0,
        Number(stored.originalPrice ?? pricing.original ?? paid),
      ),
      promotional: Math.max(
        0,
        Number(stored.promotionalDiscount ?? pricing.promotionalDiscount ?? 0),
      ),
      customerPriceBeforeOffers: Math.max(
        0,
        Number(
          stored.customerPriceBeforeOffers ??
            pricing.customerPriceBeforeOffers ??
            paid,
        ),
      ),
      coupon,
      referral,
      reward,
      paid,
      saved: Math.max(
        0,
        Number(stored.totalSaved ?? pricing.totalSaved ?? 0),
      ),
      legacy: false,
    };
  }

  const storedBase = Math.max(0, Number(pricing.basePrice ?? 0));
  const framing = Math.max(0, Number(pricing.framingPrice ?? 0));
  const subjects = Math.max(0, Number(pricing.subjectsPrice ?? 0));

  const originalPackagePrice = Math.max(
    0,
    Number(pkg.originalPrice ?? storedBase),
  );

  const original = originalPackagePrice + subjects + framing;

  const customerPriceBeforeOffers = Math.max(
    0,
    Number(
      pricing.customerPriceBeforeOffers ??
        pricing.original ??
        storedBase + framing + subjects,
    ),
  );

  const promotional = Math.max(
    0,
    original - customerPriceBeforeOffers,
  );

  const benefitDiscount = coupon + referral + reward;
  const saved = Math.max(
    0,
    Number(pricing.totalSaved ?? 0),
    promotional + benefitDiscount,
    Number(pricing.discount ?? 0) + promotional,
    original - paid,
  );

  return {
    original,
    promotional,
    customerPriceBeforeOffers,
    coupon,
    referral,
    reward,
    paid,
    saved,
    legacy: true,
  };
}

export function getTotalOrderSavings(orders: Order[]) {
  return orders.reduce(
    (sum, order) => sum + getOrderSavings(order).saved,
    0,
  );
}
