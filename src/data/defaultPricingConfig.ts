import type {
  CommissionPackageId,
} from "@/data/commissionPackages";

import {
  commissionPackages,
} from "@/data/commissionPackages";

import type {
  PricingConfigInput,
} from "@/types/pricing";

const defaultPackageConfig = (
  packageId: CommissionPackageId,
): PricingConfigInput => {
  const pkg =
    commissionPackages[packageId];

  return {
    packageId: pkg.id,

    packageName: pkg.name,

    size: pkg.size,

    dimensions: pkg.dimensions,

    originalPrice: pkg.originalPrice,

    discountPercent: pkg.discount,

    prices: {
      sketched: pkg.price,

      framed: pkg.price + 500,

      digital: pkg.price,

      premiumFrame: 1000,
    },

    subjectPrices: {
      1: 0,
      2: 300,
      3: 600,
      4: 900,
    },

    enabled: true,
  };
};

export const defaultPricingConfig:
  PricingConfigInput[] = [
    defaultPackageConfig("classic"),

    defaultPackageConfig("premium"),

    defaultPackageConfig("luxury"),

    defaultPackageConfig("royal"),
  ];