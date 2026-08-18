import type {
  PricingConfigDocument,
} from "@/types/pricing";

/**
 * Props for the Admin Pricing Manager.
 *
 * IMPORTANT:
 * This component works with the existing PricingConfigDocument
 * model instead of creating another pricing model.
 */
export interface PricingManagerProps {
  /**
   * Initial pricing configurations loaded by the admin page.
   */
  initialConfigs: PricingConfigDocument[];
}