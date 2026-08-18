"use client";

import { useEffect, useState } from "react";

import {
  initializeDefaultPricingConfigs,
} from "@/services/pricing";
import { PricingManager } from "@/components/features/admin/pricing/PricingManager";

import type { PricingConfigDocument } from "@/types/pricing";

export default function AdminPricingPage() {
  const [configs, setConfigs] =
    useState<PricingConfigDocument[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    void initializeDefaultPricingConfigs()
      .then((result) => {
        if (active) {
          setConfigs(result);
        }
      })
      .catch((loadError) => {
        console.error(
          "Failed to load pricing configurations:",
          loadError,
        );

        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load pricing configurations.",
          );
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border bg-white p-12 text-center">
          Loading pricing configurations...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-neutral-50 px-6 py-10">
        <div className="mx-auto max-w-6xl rounded-3xl border border-red-200 bg-red-50 p-8">
          <h1 className="text-2xl font-semibold text-red-900">
            Unable to load pricing
          </h1>
          <p className="mt-3 text-sm text-red-700">
            {error}
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <PricingManager
          initialConfigs={configs}
        />
      </div>
    </main>
  );
}
