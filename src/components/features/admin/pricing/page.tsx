import { getPricingConfigs } from "@/services/pricing";

import { PricingManager } from "@/components/features/admin/pricing/PricingManager";

/**
 * Admin Pricing Management Page
 *
 * URL:
 * http://localhost:3000/admin/pricing
 *
 * PHASE A1:
 * - Load existing pricing configurations.
 * - Pass them to PricingManager.
 *
 * Firestore write/save will be connected in the next step.
 */
export default async function AdminPricingPage() {
  const pricingConfigs =
    await getPricingConfigs();

  return (
    <main className="min-h-screen bg-neutral-50 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <PricingManager
          initialConfigs={
            pricingConfigs
          }
        />
      </div>
    </main>
  );
}