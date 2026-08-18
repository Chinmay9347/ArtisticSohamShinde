import { adminDb } from "@/server/firebase/admin";
import { defaultPricingConfig } from "@/data/defaultPricingConfig";
import type { PricingConfigInput } from "@/types/pricing";

const SIZE_ORDER = ["A5", "A4", "A3", "A2"];

function normalizeConfig(config: PricingConfigInput & { id?: string }) {
  return {
    ...config,
    id: config.id ?? config.packageId,
    createdAt: (config as PricingConfigInput & { createdAt?: unknown }).createdAt ?? null,
    updatedAt: (config as PricingConfigInput & { updatedAt?: unknown }).updatedAt ?? null,
  };
}

function sortPricing(a: { size: string }, b: { size: string }) {
  return SIZE_ORDER.indexOf(String(a.size)) - SIZE_ORDER.indexOf(String(b.size));
}

export async function getPublicPricingConfigs() {
  try {
    const snapshot = await adminDb
      .collection("pricingConfigs")
      .where("enabled", "==", true)
      .get();

    const configs = snapshot.docs
      .map((doc) => normalizeConfig({ id: doc.id, ...doc.data() } as PricingConfigInput & { id: string }))
      .sort(sortPricing);

    if (configs.length > 0) return configs;
  } catch (error) {
    console.error("Public pricing read failed:", error);
  }

  return defaultPricingConfig
    .map((config) => normalizeConfig(config))
    .sort(sortPricing);
}

export async function getPublicPricingConfig(packageId: string) {
  const configs = await getPublicPricingConfigs();
  return configs.find((config) => config.packageId === packageId) ?? null;
}
