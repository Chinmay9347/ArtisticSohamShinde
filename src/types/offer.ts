import type { CommissionPackageId } from "@/data/commissionPackages";

import type {
  PricingFulfillmentType,
} from "@/types/pricing";

export type OfferDiscountType =
  | "PERCENTAGE"
  | "FIXED";

export type OfferStackingMode =
  | "EXCLUSIVE"
  | "STACKABLE";

export type OfferDiscountBase =
  | "DISCOUNTED_ITEM_TOTAL"
  | "PACKAGE"
  | "SUBJECTS"
  | "FRAMING"
  | "SELECTED_COMPONENTS";

export type OfferDiscountComponent =
  | "PACKAGE"
  | "SUBJECTS"
  | "FRAMING";

export interface OfferApplicability {
  packageIds: CommissionPackageId[];

  fulfillmentTypes: PricingFulfillmentType[];

  premiumFrame: "ANY" | "YES" | "NO";
}

export interface OfferDocument {
  id: string;

  name: string;

  code: string;

  description: string;

  enabled: boolean;

  discountType: OfferDiscountType;

  discountValue: number;

  minimumOrderValue: number | null;

  maximumDiscount: number | null;

  usageLimit: number | null;

  usageCount: number;

  perCustomerLimit: number | null;

  stackingMode: OfferStackingMode;

  /** Which already-discounted price component the coupon can reduce. */
  discountBase: OfferDiscountBase;

  /** Used when discountBase is SELECTED_COMPONENTS. */
  discountComponents: OfferDiscountComponent[];

  /** If enabled, delivery is waived when the configured threshold is reached. */
  freeDelivery: boolean;

  freeDeliveryMinimumOrderValue: number | null;

  applicability: OfferApplicability;

  startAt: unknown;

  endAt: unknown;

  audience?: {
    minOrders?: number | null;
    maxOrders?: number | null;
    minDaysSinceLastOrder?: number | null;
    maxDaysSinceLastOrder?: number | null;
  };

  createdAt: unknown;

  updatedAt: unknown;
}

export type OfferFormData = Omit<
  OfferDocument,
  | "id"
  | "usageCount"
  | "createdAt"
  | "updatedAt"
>;