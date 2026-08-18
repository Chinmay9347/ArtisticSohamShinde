import type { PricingConfigDocument } from "@/types/pricing";
import { commissionPackages } from "@/data/commissionPackages";

export function mapPricingConfigDocument(
  id: string,
  data: Record<string, unknown>,
): PricingConfigDocument {
  const prices =
    (data.prices as Record<string, unknown>) ??
    {};

  const subjectPrices =
    (data.subjectPrices as Record<string, unknown>) ??
    {};

  const packageId = data.packageId as PricingConfigDocument["packageId"];
  const fallback = commissionPackages[packageId];
  const discountedPrice = Number(prices.sketched ?? fallback?.price ?? 0);
  const originalPrice = Number(data.originalPrice ?? fallback?.originalPrice ?? discountedPrice);
  const calculatedDiscount = originalPrice > 0 ? Math.max(0, Math.round(((originalPrice - discountedPrice) / originalPrice) * 100)) : 0;

  return {
    id,

    packageId,

    packageName:
      (data.packageName as string) ?? "",

    size:
      (data.size as string) ?? "",

    dimensions:
      (data.dimensions as string) ?? "",

    prices: {
      sketched:
        Number(prices.sketched ?? 0),

      framed:
        Number(prices.framed ?? 0),

      digital:
        Number(prices.digital ?? 0),

      premiumFrame:
        Number(prices.premiumFrame ?? 0),
    },

    subjectPrices: {
      1: Number(subjectPrices[1] ?? 0),
      2: Number(subjectPrices[2] ?? 0),
      3: Number(subjectPrices[3] ?? 0),
      4: Number(subjectPrices[4] ?? 0),
    },

    originalPrice,

    discountPercent: Number(data.discountPercent ?? calculatedDiscount),

    enabled: (data.enabled as boolean) ?? true,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}