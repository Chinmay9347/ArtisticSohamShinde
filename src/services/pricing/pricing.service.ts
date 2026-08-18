import {
  getPricingConfig as repositoryGetPricingConfig,
  getPricingConfigs as repositoryGetPricingConfigs,
  upsertPricingConfig as repositoryUpsertPricingConfig,
} from "./pricing.repository";

import {
  defaultPricingConfig,
} from "@/data/defaultPricingConfig";

import type {
  PricingConfigInput,
} from "@/types/pricing";

export async function getPricingConfigs() {
  return repositoryGetPricingConfigs();
}

export async function getPricingConfig(
  packageId: string,
) {
  return repositoryGetPricingConfig(
    packageId,
  );
}

export async function upsertPricingConfig(
  packageId: string,
  data: PricingConfigInput,
) {
  return repositoryUpsertPricingConfig(
    packageId,
    data,
  );
}
/**
 * Initialize missing default pricing configurations.
 *
 * IMPORTANT:
 * - Never overwrites existing admin pricing.
 * - Only creates configurations that do not exist.
 * - Safe to call whenever the admin pricing page loads.
 */
export async function initializeDefaultPricingConfigs() {
  const existingConfigs =
    await repositoryGetPricingConfigs();

  const existingPackageIds =
    new Set(
      existingConfigs.map(
        (config) => config.packageId,
      ),
    );

  for (const config of defaultPricingConfig) {
    if (!existingPackageIds.has(config.packageId)) {
      await repositoryUpsertPricingConfig(config.packageId, config);
      continue;
    }

    // Safe migration for the 2.4.9 size correction and new marketing-price fields.
    const existing = existingConfigs.find((item) => item.packageId === config.packageId);
    if (existing) {
      // 2.4.9 canonical A4/A3 correction. Older records had Premium/Luxury swapped.
      const isKnownWrongA4A3 =
        (config.packageId === "premium" && (existing.size === "A3" || Number(existing.prices?.sketched) === 1699 || Number(existing.prices?.sketched) === 1350)) ||
        (config.packageId === "luxury" && (existing.size === "A4" || Number(existing.prices?.sketched) === 1299 || Number(existing.prices?.sketched) === 2250));

      const shouldMigrate =
        isKnownWrongA4A3 ||
        existing.size !== config.size ||
        existing.dimensions !== config.dimensions ||
        existing.originalPrice == null ||
        existing.discountPercent == null;

      if (shouldMigrate) {
        await repositoryUpsertPricingConfig(config.packageId, {
          packageId: config.packageId,
          packageName: config.packageName,
          prices: isKnownWrongA4A3 ? config.prices : existing.prices,
          subjectPrices: existing.subjectPrices ?? config.subjectPrices,
          enabled: existing.enabled,
          size: config.size,
          dimensions: config.dimensions,
          originalPrice: isKnownWrongA4A3 ? config.originalPrice : (existing.originalPrice ?? config.originalPrice),
          discountPercent: isKnownWrongA4A3 ? config.discountPercent : (existing.discountPercent ?? config.discountPercent),
        } as PricingConfigInput);
      }
    }
  }

  return repositoryGetPricingConfigs();
}