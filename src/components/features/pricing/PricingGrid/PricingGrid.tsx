"use client";

import { useEffect, useState } from "react";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { PricingCard } from "../PricingCard";
import { pricingGridStyles as styles } from "./PricingGrid.styles";

type PublicPricingConfig = {
  id?: string;
  packageId: string;
  packageName?: string;
  size?: string;
  dimensions?: string;
  originalPrice?: number;
  discountPercent?: number;
  enabled?: boolean;
  prices?: Record<string, unknown>;
  [key: string]: unknown;
};

const SIZE_ORDER = ["A5", "A4", "A3", "A2"];

function sortPricing(
  a: PublicPricingConfig,
  b: PublicPricingConfig,
) {
  return (
    SIZE_ORDER.indexOf(String(a.size)) -
    SIZE_ORDER.indexOf(String(b.size))
  );
}

export function PricingGrid() {
  const [configs, setConfigs] = useState<
    PublicPricingConfig[]
  >([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadPricing() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "/api/pricing/public",
          {
            method: "GET",
            cache: "no-store",
          },
        );

        if (!response.ok) {
          throw new Error(
            `Pricing request failed with status ${response.status}`,
          );
        }

        const data = await response.json();

        if (
          !data?.success ||
          !Array.isArray(data?.configs)
        ) {
          throw new Error(
            "Invalid public pricing response.",
          );
        }

        if (!active) {
          return;
        }

        const normalized =
          data.configs
            .filter(
              (config: PublicPricingConfig) =>
                config.enabled !== false,
            )
            .sort(sortPricing);

        setConfigs(normalized);
      } catch (loadError) {
        console.error(
          "Failed to load public pricing configurations:",
          loadError,
        );

        if (active) {
          setError(
            "Pricing is temporarily unavailable. Please try again shortly.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void loadPricing();

    return () => {
      active = false;
    };
  }, []);

  const enabledConfigs =
    configs.filter(
      (config) => config.enabled !== false,
    );

  return (
    <Section className={styles.section}>
      <Container className={styles.container}>
        <div className={styles.grid}>
          {loading && (
            <div className="col-span-full rounded-2xl border bg-white p-10 text-center text-neutral-500">
              Loading pricing...
            </div>
          )}

          {!loading && error && (
            <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            enabledConfigs.map((config) => (
              <PricingCard
                key={
                  config.packageId ??
                  config.id
                }
                config={config as any}
              />
            ))}

          {!loading &&
            !error &&
            enabledConfigs.length === 0 && (
              <div className="col-span-full rounded-2xl border bg-white p-10 text-center text-neutral-500">
                Pricing packages are currently
                being updated.
              </div>
            )}
        </div>
      </Container>
    </Section>
  );
}

// "use client";

// import { useEffect, useState } from "react";

// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";
// import { getPricingConfigs } from "@/services/pricing";
// import { defaultPricingConfig } from "@/data/defaultPricingConfig";
// import { PricingCard } from "../PricingCard";
// import { pricingGridStyles as styles } from "./PricingGrid.styles";

// export function PricingGrid() {
//   const [configs, setConfigs] = useState<
//     Awaited<ReturnType<typeof getPricingConfigs>>
//   >([]);
//   const [loading, setLoading] =
//     useState(true);
//   const [error, setError] =
//     useState<string | null>(null);

//   useEffect(() => {
//     let active = true;

//     void getPricingConfigs()
//       .then((result) => {
//         if (!active) return;

//         if (result.length > 0) {
//           const canonical = defaultPricingConfig.map((config) => ({ ...config, id: config.packageId, createdAt: null, updatedAt: null }));
//           const normalized = result.map((config) => {
//             const fallback = canonical.find((item) => item.packageId === config.packageId);
//             const knownWrongSwap = (config.packageId === "premium" && config.size === "A3") || (config.packageId === "luxury" && config.size === "A4");
//             return knownWrongSwap && fallback ? { ...config, packageName: fallback.packageName, size: fallback.size, dimensions: fallback.dimensions, originalPrice: fallback.originalPrice, discountPercent: fallback.discountPercent, prices: fallback.prices } : config;
//           });
//           setConfigs(normalized.sort((a, b) => ["A5", "A4", "A3", "A2"].indexOf(String(a.size)) - ["A5", "A4", "A3", "A2"].indexOf(String(b.size))));
//           return;
//         }

//         setConfigs(
//           defaultPricingConfig.map(
//             (config) => ({
//               ...config,
//               id: config.packageId,
//               createdAt: null,
//               updatedAt: null,
//             }),
//           ).sort((a, b) => ["A5", "A4", "A3", "A2"].indexOf(String(a.size)) - ["A5", "A4", "A3", "A2"].indexOf(String(b.size))),
//         );
//       })
//       .catch((loadError) => {
//         console.error(
//           "Failed to load public pricing configurations:",
//           loadError,
//         );

//         if (active) {
//           setError(
//             "Pricing is temporarily unavailable. Please try again shortly.",
//           );
//         }
//       })
//       .finally(() => {
//         if (active) setLoading(false);
//       });

//     return () => {
//       active = false;
//     };
//   }, []);

//   return (
//     <Section className={styles.section}>
//       <Container className={styles.container}>
//         <div className={styles.grid}>
//         {loading && (
//           <div className="col-span-full rounded-2xl border bg-white p-10 text-center text-neutral-500">
//             Loading pricing...
//           </div>
//         )}

//         {!loading && error && (
//           <div className="col-span-full rounded-2xl border border-red-200 bg-red-50 p-8 text-center text-red-700">
//             {error}
//           </div>
//         )}

//         {!loading &&
//           !error &&
//           configs
//             .filter((config) => config.enabled)
//             .map((config) => (
//               <PricingCard
//                 key={config.packageId}
//                 config={config}
//               />
//             ))}

//         {!loading &&
//           !error &&
//           configs.filter((config) => config.enabled).length === 0 && (
//             <div className="col-span-full rounded-2xl border bg-white p-10 text-center text-neutral-500">
//               Pricing packages are currently being updated.
//             </div>
//           )}
//         </div>
//       </Container>
//     </Section>
//   );
// }
