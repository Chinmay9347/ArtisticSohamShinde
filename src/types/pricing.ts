import type { CommissionPackageId } from "@/data/commissionPackages";

export interface PricingPlan {
  id: string;
  title: string;
  size: string;
  dimensions: string;
  originalPrice: number;
  discount: number;
  subjectsIncluded: number;
  additionalSubjectPrice: number;
  frameIncluded: boolean;
  deliveryTime: string;
  medium: string;
  recommended: boolean;
  features: string[];
}
export interface PricingAddon {
  id: number;
  title: string;
  description: string;
  price: number;
}
export type PricingFulfillmentType =
  | "sketched"
  | "framed"
  | "digital";

export type SubjectPriceMap = Record<
  1 | 2 | 3 | 4,
  number
>;
export interface PricingPackageConfig {
  packageId: CommissionPackageId;
  packageName: string;
  size: string;
  dimensions: string;
  prices: {
    sketched: number;
    framed: number;
    digital: number;
    premiumFrame: number;
  };
  subjectPrices: SubjectPriceMap;
  /** Marketing price controls for the main sketched price. */
  originalPrice?: number;
  discountPercent?: number;
  enabled: boolean;
}
export interface PricingConfigDocument
  extends PricingPackageConfig {
  id: string;
  createdAt: unknown;
  updatedAt: unknown;
}

export type PricingConfigInput =
  PricingPackageConfig;

// import type { CommissionPackageId } from "@/data/commissionPackages";

// export interface PricingPlan {
//   id: CommissionPackageId;
//   title: string;
//   size: string;
//   dimensions: string;

//   originalPrice: number;
//   discount: number;

//   subjectsIncluded: number;
//   additionalSubjectPrice: number;

//   frameIncluded: boolean;

//   deliveryTime: string;

//   medium: string;

//   recommended?: boolean;

//   features: string[];
// }

// export interface PricingAddon {
//   id: number;

//   title: string;

//   description: string;

//   price: number;
// }