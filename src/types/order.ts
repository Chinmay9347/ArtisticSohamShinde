import type { Timestamp } from "firebase/firestore";

import type { OrderStatus } from "@/constants/order-status";
import type { PaymentDetails } from "./payment";
import type { TimelineEvent } from "./timeline";

/* -------------------------------------------------------------------------- */
/*                                  Customer                                  */
/* -------------------------------------------------------------------------- */

export interface CustomerDetails {
  uid: string;

  fullName: string;

  email: string;

  phone: string;
}

/* -------------------------------------------------------------------------- */
/*                                  Portrait                                  */
/* -------------------------------------------------------------------------- */

export interface PortraitDetails {
  packageId: string;

  packageName: string;

  size: string;

  subjects: number;

  // orientation: "PORTRAIT" | "LANDSCAPE";
  orientation:
  | "PORTRAIT"
  | "LANDSCAPE"
  | "SQUARE";

  /**
   * Whether the customer selected the Premium Frame option.
   *
   * For fulfillment.type === "framed":
   * - false = basic frame
   * - true = premium frame
   *
   * For fulfillment.type === "sketched":
   * - false = unframed
   * - true = premium framed
   *
   * For fulfillment.type === "digital":
   * - must be false
   */
  framing: boolean;

  background: string;
}

/* -------------------------------------------------------------------------- */
/*                               Reference Photos                             */
/* -------------------------------------------------------------------------- */

export interface ReferencePhoto {
  fileName: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

// export interface ReferencePhoto {
//   id: string;
//   publicId: string;
//   url: string;
//   fileName: string;
//   uploadedAt: Timestamp;
// }

/* -------------------------------------------------------------------------- */
/*                                  Shipping                                  */
/* -------------------------------------------------------------------------- */

export interface ShippingAddress {
  fullName: string;

  phone: string;

  addressLine1: string;

  addressLine2?: string;

  city: string;

  state: string;

  postalCode: string;

  country: string;
}

export interface ShippingDetails {
  address?: ShippingAddress;

  courier?: string;

  trackingNumber?: string;

  trackingUrl?: string;

  shippedAt?: Timestamp;

  deliveredAt?: Timestamp;
}

/* -------------------------------------------------------------------------- */
/*                                   Artist                                   */
/* -------------------------------------------------------------------------- */

export interface ArtworkDetails {
  available?: boolean;
  draftUrl?: string;
  draftPublicId?: string;
  finalUrl?: string;
  finalPublicId?: string;
  uploadedBy?: string;
  updatedAt?: Date | null;
}

export interface ArtistDetails {
  assignedArtistId?: string;

  notes?: string;

  estimatedCompletionDate?: Timestamp;

  completedAt?: Timestamp;
}

/* -------------------------------------------------------------------------- */
/*                                    Order                                   */
/* -------------------------------------------------------------------------- */

export interface Order {
  id: string;

  orderNumber: string;

  customer: CustomerDetails;

  portrait: PortraitDetails;

  referencePhotos: ReferencePhoto[];

  galleryArtwork?: { id: string; title: string; imageUrl: string; publicId?: string };

  artwork?: ArtworkDetails;

  // instructions?: string;

  // payment: PaymentDetails;
  /**
   * Legacy flattened instructions kept for existing order screens.
   */
  instructions?: string;

  /**
   * Structured commission instructions for new orders.
   */
  instructionDetails?: {
    specialInstructions: string;
    giftMessage: string;
  };

  fulfillment?: {
    type: "digital" | "printed" | "sketched" | "framed";
  };

  pricing?: {
    /** Public/list price before the package's built-in promotional discount. */
    original?: number;
    /** Customer price after the package's built-in promotional discount, before coupon/referral/reward. */
    customerPriceBeforeOffers?: number;
    /** Built-in package promotion saving. */
    promotionalDiscount?: number;
    basePrice?: number;
    framingPrice?: number;
    subjectsPrice?: number;
    couponDiscount?: number;
    referralDiscount?: number;
    rewardPointsUsed?: number;
    deliveryDistanceKm?: number;
    deliveryCharge?: number;
    deliveryServiceLevel?: "STANDARD" | "EXPRESS";
    deliveryProvider?: string | null;
    deliveryRuleId?: string | null;
    deliveryZone?: string;
    freeDelivery?: boolean;
    /** Coupon + referral + reward savings only. */
    discount?: number;
    /** Promotional + coupon + referral + reward savings. */
    totalSaved?: number;
    total?: number;
    offerCode?: string;
    offerCodes?: string[];
    referralCode?: string;
    savings?: {
      originalPrice: number;
      promotionalDiscount: number;
      customerPriceBeforeOffers: number;
      couponDiscount: number;
      referralDiscount: number;
      rewardPointsUsed: number;
      totalSaved: number;
    };
  };

  payment: PaymentDetails;

  shipping: ShippingDetails;

  // artist: ArtistDetails;

  timeline: TimelineEvent[];

  status: OrderStatus;

  createdAt: Timestamp;

  updatedAt: Timestamp;

  cancellation?: {
    cancelledAt?: Timestamp | Date | null;
    cancelledBy?: string;
    reason?: string;
    walletCredit?: number;
  };
 
  artist?: {
    uid: string;
    name: string;
    assignedAt: Date | null;
  };

  production?: {
    startedAt?: Date | null;
    completedAt?: Date | null;
    estimatedCompletion?: Date | null;
  };
}