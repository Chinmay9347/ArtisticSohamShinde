export type PortraitSize = "A5" | "A4" | "A3" | "A2";

export type CommissionPackageId = "classic" | "premium" | "luxury" | "royal";

export interface CommissionPackage {
  id: CommissionPackageId;
  name: string;
  size: PortraitSize;
  dimensions: string;
  originalPrice: number;
  price: number;
  discount: number;
  delivery: string;
  badge?: string;
  popular?: boolean;
  features: string[];
}

// Canonical public/package mapping. Keep A5 → A4 → A3 → A2 in this order.
export const commissionPackages: Record<CommissionPackageId, CommissionPackage> = {
  classic: {
    id: "classic", name: "Classic", size: "A5", dimensions: "5.8 × 8.3 in",
    originalPrice: 2499, price: 899, discount: 64.03, delivery: "7–10 Days",
    features: ["Premium Pencil Portrait", "High Quality Paper", "Protective Packaging", "Certificate of Authenticity"],
  },
  premium: {
    id: "premium", name: "Premium", size: "A4", dimensions: "8.3 × 11.7 in",
    originalPrice: 3499, price: 1299, discount: 62.88, delivery: "7–12 Days",
    badge: "Most Popular", popular: true,
    features: ["Most Popular", "Premium Paper", "Fine Detail Finish", "Protective Packaging", "Certificate of Authenticity"],
  },
  luxury: {
    id: "luxury", name: "Luxury", size: "A3", dimensions: "11.7 × 16.5 in",
    originalPrice: 4499, price: 1699, discount: 62.24, delivery: "10–14 Days",
    features: ["Museum Quality Finish", "Maximum Detail", "Premium Packaging", "Certificate of Authenticity"],
  },
  royal: {
    id: "royal", name: "Royal", size: "A2", dimensions: "16.5 × 23.4 in",
    originalPrice: 6999, price: 2299, discount: 67.15, delivery: "14–21 Days",
    features: ["Gallery Grade Artwork", "Maximum Detail", "Premium Packaging", "Certificate of Authenticity"],
  },
};

export const commissionPackageList = Object.values(commissionPackages);

export function getCommissionPackage(id: string | null | undefined): CommissionPackage {
  if (!id) return commissionPackages.classic;
  const key = id.toLowerCase() as CommissionPackageId;
  return commissionPackages[key] ?? commissionPackages.classic;
}
