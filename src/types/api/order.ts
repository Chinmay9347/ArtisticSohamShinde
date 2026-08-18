import type { CommissionPackageId } from "@/data/commissionPackages";
import type {
  FulfillmentType,
  PortraitSize,
} from "@/types/commission";

/* -------------------------------------------------------------------------- */
/*                               Reference Photo                              */
/* -------------------------------------------------------------------------- */

export interface UploadedReferencePhoto {
  fileName: string;
  publicId: string;
  url: string;
  width: number;
  height: number;
  size: number;
}

/* -------------------------------------------------------------------------- */
/*                               Create Order                                 */
/* -------------------------------------------------------------------------- */
export interface CreateOrderRequest {
  customer: {
    uid?: string;
    fullName: string;
    email: string;
    phone: string;
  };

  /**
  * Optional promotional offer selected
  * by the customer.
  *
  * The server will validate it.
  */
  offerCode?: string;
  offerCodes?: string[];

  /**
  * Optional referral code.
  *
  * The server will validate the referral
  * before applying any discount.
  */
  referralCode?: string;

  /** Referral reward coins to spend. 1 coin = ₹1. */
  rewardPointsUsed?: number;

  // portrait: {
  //   packageId: CommissionPackageId;
  //   subjects: number;
  //   orientation: "portrait" | "landscape";
  //   framed: boolean;
  // };
  // portrait: {
  //     packageId: CommissionPackageId;
  //     subjects: number;
  //     orientation: "PORTRAIT" | "LANDSCAPE";
  //     framing: boolean;
  //     background?: string;
  // };
  portrait: {
    packageId: CommissionPackageId;
    subjects: number;
    size: PortraitSize;
    orientation: "portrait" | "landscape" | "square";
    framing: boolean;
    background?: string;
  };

  fulfillment: {
    type: FulfillmentType;
  };

  delivery: {
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
    distanceKm?: number;
    deliveryCharge?: number;
    serviceLevel?: "STANDARD" | "EXPRESS";
  };

  instructions: {
    specialInstructions: string;
    giftMessage: string;
  };

  referencePhotos: UploadedReferencePhoto[];

  galleryArtwork?: { id: string; title: string; imageUrl: string; publicId?: string };

}



export type PricingCalculationRequest = Pick<
  CreateOrderRequest,
  "portrait" | "fulfillment" | "delivery" | "offerCode" | "offerCodes" | "referralCode"
> & {
  customerUid?: string;
  rewardPointsUsed?: number;
};

 /* -------------------------------------------------------------------------- */
/*                               Pricing Summary                              */
/* -------------------------------------------------------------------------- */

export interface OrderPricing {
  basePrice: number;

  framingPrice: number;

  subjectsPrice: number;

  subtotal: number;
  deliveryDistanceKm?: number;
  deliveryCharge?: number;
  deliveryServiceLevel?: "STANDARD" | "EXPRESS";
  deliveryProvider?: string | null;
  deliveryRuleId?: string | null;
  deliveryZone?: string;
  freeDelivery?: boolean;

  /** Original/list price before built-in promotional discount. */
  original?: number;

  /** Promotional/list-price saving before coupons/referrals/rewards. */
  promotionalDiscount?: number;

  /** Customer price after the package's built-in promotional discount. */
  customerPriceBeforeOffers?: number;

  discount: number;

  couponDiscount?: number;
  referralDiscount?: number;
  rewardPointsUsed?: number;

  /** Total amount saved across promotional + order-level benefits. */
  totalSaved?: number;

  total: number;

  currency: "INR";
}

/* -------------------------------------------------------------------------- */
/*                              Create Response                               */
/* -------------------------------------------------------------------------- */

export interface CreateOrderResponse {
  success: boolean;

  orderId: string;

  pricing: OrderPricing;

  paymentRequired: boolean;

  redirectUrl: string;
}

/* -------------------------------------------------------------------------- */
/*                                 API Error                                  */
/* -------------------------------------------------------------------------- */

export interface ApiErrorResponse {
  success: false;

  message: string;

  errors?: string[];
}