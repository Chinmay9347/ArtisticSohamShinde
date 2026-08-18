import Link from "next/link";
import { Check } from "lucide-react";
import { pricingPlans } from "@/data/pricing";
import type { PricingCardProps } from "./PricingCard.types";
import { pricingCardStyles as styles } from "./PricingCard.styles";

export function PricingCard({ config }: PricingCardProps) {
  const plan = pricingPlans.find((item) => item.id === config.packageId);
  if (!plan || !config.enabled) return null;
  const originalPrice = Number(config.originalPrice ?? plan.originalPrice);
  const sellingPrice = Number(config.prices.sketched);
  const discount = Number(config.discountPercent ?? (originalPrice > 0 ? Math.round(((originalPrice-sellingPrice)/originalPrice)*100) : 0));
  const showDiscount = originalPrice > sellingPrice && discount > 0;
  return (
    <article className={styles.card}>
      {plan.recommended && <div className={styles.recommendedBadge}>Most Popular</div>}
      <h3 className={styles.title}>{plan.title}</h3>
      <p className={styles.size}>{config.size || plan.size} • {config.dimensions || plan.dimensions}</p>
      <div className="mt-6">
        {showDiscount && <p className="text-sm text-gray-500 line-through">₹{originalPrice.toLocaleString("en-IN")}</p>}
        {showDiscount && <div className="mt-2 inline-flex rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">{discount}% OFF</div>}
        <div className={styles.price}><span className={styles.currency}>₹</span>{sellingPrice.toLocaleString("en-IN")}</div>
      </div>
      <p className={styles.delivery}>Delivery: {plan.deliveryTime}</p>
      <hr className={styles.divider} />
      <ul className={styles.featureList}>{plan.features.map((feature) => <li key={feature} className={styles.featureItem}><Check size={18} color="#C9A227" />{feature}</li>)}</ul>
      <div className={styles.footer}><Link href={`/commission?package=${config.packageId}`} className={styles.button}>Order This Portrait</Link></div>
    </article>
  );
}
