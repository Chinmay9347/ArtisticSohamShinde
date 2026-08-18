
"use client";

import { NavigationButtons } from "../../NavigationButtons";
import { ProgressBar } from "../../ProgressBar";
import { StepHeader } from "../../StepHeader";
import { getCommissionPackage } from "@/data/commissionPackages";
import { usePublicCommissionPricing } from "@/hooks/usePublicCommissionPricing";
import type { PackageStepProps } from "./PackageStep.types";
import { packageStepStyles as styles } from "./PackageStep.styles";

export function PackageStep({
  commission,
  fromGallery = false,
}: PackageStepProps) {
  const { packages, getPackage, loading, error } = usePublicCommissionPricing();
  const selected = getPackage(commission.formData.package);
  const packageList = packages.length > 0 ? packages : [getCommissionPackage(commission.formData.package)];

  return (
    <section className={styles.container}>
      <ProgressBar commission={commission} />

      <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title={fromGallery ? "Choose Package" : "Selected Package"}
        description={
          fromGallery
            ? "Choose the portrait size and package for this gallery artwork. The gallery reference image will remain attached to your order."
            : "Review your selected portrait package."
        }
      />

      {fromGallery ? (
        <div className="space-y-4">
          {loading && (
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5 text-sm text-neutral-300">
              Loading current package pricing...
            </div>
          )}
          {error && (
            <div className="rounded-2xl border border-red-300/30 bg-red-950/30 p-5 text-sm text-red-200">
              {error} Please refresh and try again.
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            {packageList.map((pkg) => {
            const isSelected = pkg.id === selected.id;

            return (
                <button
                key={pkg.id}
                type="button"
                onClick={() =>
                    commission.updateFormData({
                    package: pkg.id,
                    portrait: {
                        ...commission.formData.portrait,
                        size: pkg.size,
                    },
                    })
                }
                className={`rounded-2xl border p-5 text-left transition ${
                    isSelected
                    ? "border-[#C9A227] bg-[#C9A227] shadow-[0_0_0_2px_#C9A227]"
                    : "border-neutral-300 bg-[#e8e8e8] hover:border-[#C9A227]/70 hover:bg-[#dedede]"
                }`}
                >
                <span
                    className={`text-sm uppercase tracking-widest ${
                    isSelected ? "text-black/70" : "text-[#8f7414]"
                    }`}
                >
                    {pkg.size}
                </span>

                <h2
                    className={`mt-2 text-2xl font-semibold ${
                    isSelected ? "text-black" : "text-neutral-900"
                    }`}
                >
                    {pkg.name}
                </h2>

                <p
                    className={`mt-2 text-base ${
                    isSelected ? "text-black/75" : "text-neutral-700"
                    }`}
                >
                    {pkg.dimensions}
                </p>

                <div className="mt-4">
                  {pkg.originalPrice > pkg.price && (
                    <div className={`text-sm line-through ${isSelected ? "text-black/60" : "text-neutral-500"}`}>
                      ₹{pkg.originalPrice.toLocaleString("en-IN")}
                    </div>
                  )}
                  <p
                    className={`text-3xl font-bold ${
                    isSelected ? "text-black" : "text-neutral-950"
                    }`}
                  >
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </p>
                  {pkg.discount > 0 && (
                    <p className={`mt-1 text-sm font-semibold ${isSelected ? "text-black/70" : "text-green-700"}`}>
                      {Math.round(pkg.discount)}% OFF
                    </p>
                  )}
                </div>
                </button>
            );
            })}
          </div>
        </div>
        ) : (
        <div className={styles.card}>
          <span className={styles.packageBadge}>Package Selected</span>

          <h2 className={styles.packageTitle}>
            {selected.name} Package
          </h2>

          <p className={styles.description}>
            You selected the <strong>{selected.name}</strong> package.
            Continue with your customer details, portrait preferences,
            reference photos and instructions.
          </p>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>Package</div>
              <div className={styles.infoValue}>{selected.name}</div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>Portrait Size</div>
              <div className={styles.infoValue}>{selected.size}</div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>Base Price</div>
              <div className={styles.infoValue}>
                ₹{selected.price.toLocaleString("en-IN")}
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoTitle}>Delivery</div>
              <div className={styles.infoValue}>{selected.delivery}</div>
            </div>
          </div>
        </div>
      )}

      {commission.formData.galleryArtwork && (
        <div className="mt-6 rounded-2xl border bg-white p-5">
          <p className="text-sm uppercase tracking-widest text-[#8f7414]">
            Gallery reference locked to order
          </p>

          <div className="mt-3 flex items-center gap-4">
            <img
              src={commission.formData.galleryArtwork.imageUrl}
              alt={commission.formData.galleryArtwork.title}
              className="h-24 w-20 rounded-xl object-cover"
            />

            <div>
              <p className="text-base font-semibold">
                {commission.formData.galleryArtwork.title}
              </p>

              <p className="text-base text-neutral-500">
                This exact gallery image will be stored with the order.
              </p>
            </div>
          </div>
        </div>
      )}

      <NavigationButtons commission={commission} />
    </section>
  );
}