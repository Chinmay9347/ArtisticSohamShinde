"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  commissionPackages,
  type CommissionPackage,
  type CommissionPackageId,
} from "@/data/commissionPackages";
import type { PricingConfigDocument } from "@/types/pricing";

interface PublicPricingResponse {
  success?: boolean;
  configs?: PricingConfigDocument[];
}

const SIZE_ORDER = ["A5", "A4", "A3", "A2"];

function toCommissionPackage(
  config: PricingConfigDocument,
): CommissionPackage | null {
  const packageId = config.packageId as CommissionPackageId;
  const fallback = commissionPackages[packageId];

  if (!fallback) return null;

  const price = Number(config.prices?.sketched ?? fallback.price);
  const originalPrice = Number(
    config.originalPrice ?? fallback.originalPrice ?? price,
  );
  const discount = Number(
    config.discountPercent ??
      (originalPrice > 0
        ? ((originalPrice - price) / originalPrice) * 100
        : 0),
  );

  return {
    ...fallback,
    id: packageId,
    name: config.packageName || fallback.name,
    size: (config.size || fallback.size) as CommissionPackage["size"],
    dimensions: config.dimensions || fallback.dimensions,
    originalPrice: Number.isFinite(originalPrice) ? originalPrice : price,
    price: Number.isFinite(price) ? price : fallback.price,
    discount: Number.isFinite(discount) ? discount : 0,
  };
}

export function usePublicCommissionPricing() {
  const [configs, setConfigs] = useState<PricingConfigDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/pricing/public", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Pricing request failed with status ${response.status}`);
        }

        const data = (await response.json()) as PublicPricingResponse;
        if (!data.success || !Array.isArray(data.configs)) {
          throw new Error("Invalid public pricing response.");
        }

        if (active) setConfigs(data.configs.filter((config) => config.enabled !== false));
      } catch (loadError) {
        console.error("Commission pricing load failed:", loadError);
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load current pricing.",
          );
          setConfigs([]);
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    void load();

    return () => {
      active = false;
    };
  }, []);

  const packages = useMemo(
    () =>
      configs
        .map(toCommissionPackage)
        .filter((pkg): pkg is CommissionPackage => Boolean(pkg))
        .sort(
          (a, b) => SIZE_ORDER.indexOf(a.size) - SIZE_ORDER.indexOf(b.size),
        ),
    [configs],
  );

  const getPackage = useCallback(
    (id: string | null | undefined) => {
      const normalized = id?.toLowerCase();
      return (
        packages.find((pkg) => pkg.id === normalized) ??
        commissionPackages[normalized as CommissionPackageId] ??
        commissionPackages.classic
      );
    },
    [packages],
  );

  return { packages, getPackage, loading, error };
}
