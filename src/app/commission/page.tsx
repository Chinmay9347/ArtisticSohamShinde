//18/07/2026
import Link from "next/link";
import { notFound } from "next/navigation";

import { getCommissionPackage } from "@/data/commissionPackages";
import { getPublicPricingConfig } from "@/server/pricing/publicPricing";
import { CommissionWizardGuard } from "@/components/features/commission/CommissionWizardGuard";
import Image from "next/image";

interface CommissionPageProps {
  searchParams: Promise<{
    package?: string;
    artwork?: string;
    resume?: string;
  }>;
}

export default async function CommissionPage({
  searchParams,
}: CommissionPageProps) {
  const params = await searchParams;

  const packageId = params.package ?? "classic";
  const fromGallery = Boolean(params.artwork);

  const fallbackPackage = getCommissionPackage(packageId);
  const livePricing = await getPublicPricingConfig(packageId);

  const selectedPackage = livePricing
    ? {
        ...fallbackPackage,
        name: livePricing.packageName || fallbackPackage.name,
        size: (livePricing.size || fallbackPackage.size) as typeof fallbackPackage.size,
        dimensions: livePricing.dimensions || fallbackPackage.dimensions,
        originalPrice: Number(livePricing.originalPrice ?? fallbackPackage.originalPrice),
        price: Number(livePricing.prices?.sketched ?? fallbackPackage.price),
        discount: Number(livePricing.discountPercent ?? fallbackPackage.discount),
      }
    : fallbackPackage;

  if (!selectedPackage) {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-6 py-16">
      {/* Heading */}

      <section className="space-y-3 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-[#C9A227]">
          Commission Order
        </p>

        <h1 className="font-cinzel text-5xl font-bold">
          Complete Your Order
        </h1>

        <p className="mx-auto max-w-2xl text-gray-500">
          {fromGallery ? "You started from a gallery portrait. Keep the exact gallery reference while choosing any available package and size." : "You selected a portrait package from our pricing page. The package remains selected while you customize the remaining options."}
        </p>
      </section>

      {!fromGallery && (
        <section className="mx-auto w-full max-w-3xl rounded-3xl border border-[#C9A227]/40 bg-black p-10 text-white shadow-2xl">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-[#C9A227]">Selected Package</p>
              <h2 className="mt-3 font-cinzel text-4xl">{selectedPackage.name}</h2>
              <p className="mt-2 text-lg text-gray-300">{selectedPackage.size} • {selectedPackage.dimensions}</p>
              <p className="mt-6 text-sm uppercase tracking-[0.2em] text-gray-400">Customer-facing base price</p>
              {selectedPackage.originalPrice > selectedPackage.price && (
                <p className="mt-2 text-sm text-gray-400 line-through">₹{selectedPackage.originalPrice.toLocaleString("en-IN")}</p>
              )}
              <h3 className="mt-1 text-5xl font-bold text-[#C9A227]">₹{selectedPackage.price.toLocaleString("en-IN")}</h3>
              <p className="mt-3 text-gray-400">Delivery : {selectedPackage.delivery}</p>
            </div>
            <div className="rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-5 py-3 text-sm font-semibold text-[#C9A227]">Selected Package</div>
          </div>
          <div className="my-8 h-px bg-white/10" />
          <h3 className="mb-4 text-lg font-semibold">Package Includes</h3>
          <ul className="grid gap-3 md:grid-cols-2">
            {selectedPackage.features.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-gray-300"><span className="text-[#C9A227]">✓</span>{feature}</li>
            ))}
          </ul>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <Link href="/pricing" className="rounded-full border border-[#C9A227] px-8 py-4 text-center font-semibold text-[#C9A227] transition hover:bg-[#C9A227] hover:text-black">← Back to Pricing</Link>
          </div>
        </section>
      )}

        <section className="mt-12">
          <CommissionWizardGuard selectedPackage={selectedPackage} fromGallery={fromGallery} artworkId={params.artwork} freshStart={!params.resume && Boolean(params.package || params.artwork)} />
        </section>
        {/* <section className="mt-12">
          <CommissionWizardGuard selectedPackage={selectedPackage} fromGallery={fromGallery} artworkId={params.artwork} freshStart={!params.resume && Boolean(params.package || params.artwork)} />
        </section> */}

    </main>
  );
}