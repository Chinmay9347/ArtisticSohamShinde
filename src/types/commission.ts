// ============================================
// Commission Types
// Artistic Soham
// ============================================

export type CommissionPackageId =
  | "classic"
  | "premium"
  | "luxury"
  | "royal";

export interface CommissionStep {
  id: number;
  title: string;
  description: string;
}
export interface CommissionFAQItem {
  id: number;
  question: string;
  answer: string;
}
export interface PortraitOption {
  id: number;
  title: string;
  description: string;
  image?: string;
}
export type CommissionFormStep =
  | "package"
  | "customer"
  | "portrait"
  | "photos"
  | "instructions"
  | "review"
  | "success";
export interface CustomerDetails {
  fullName: string;
  email: string;
  phone: string;
}
export interface DeliveryDetails {
  addressLine1: string;
  addressLine2: string;

  city: string;
  state: string;
  pincode: string;

  country: string;
  distanceKm?: number;
  deliveryCharge?: number;
  serviceLevel?: "STANDARD" | "EXPRESS";
}

export type FulfillmentType =
  | "digital"
  | "printed" // kept for future use, currently disabled
  | "sketched"
  | "framed";

export interface FulfillmentDetails {
  type: FulfillmentType;
}
export type PortraitSize = "A5" | "A4" | "A3" | "A2";
export interface PortraitDetails {
  subjects: number;
  size: PortraitSize;
  orientation: "portrait" | "landscape" | "square";
  framing: boolean;
}
export interface UploadedPhoto {
  id: string;
  file?: File;
  preview: string;
  fileName: string;
  size: number;
}
export interface CommissionInstructions {
  specialInstructions: string;
  giftMessage: string;
}
export interface CommissionFormData {
  offerCode?: string;
  offerCodes?: string[];
  referralCode?: string;
  rewardPointsUsed?: number;
  galleryArtwork?: { id: string; title: string; imageUrl: string; publicId?: string };
  package: CommissionPackageId;

  customer: CustomerDetails;

  delivery: DeliveryDetails;

  fulfillment: FulfillmentDetails;

  portrait: PortraitDetails;

  photos: UploadedPhoto[];

  instructions: CommissionInstructions;
}
export interface CommissionStepItem {
  id: CommissionFormStep;
  title: string;
  description: string;
}
export interface CommissionContextType {
  currentStep: number;

  steps: CommissionStepItem[];

  formData: CommissionFormData;

  nextStep: () => void;

  previousStep: () => void;

  goToStep: (step: number) => void;

  updateFormData: (
    data: Partial<CommissionFormData>
  ) => void;

  resetForm: () => void;
}

// export type CommissionStep =
//   | 1
//   | 2
//   | 3
//   | 4
//   | 5
//   | 6
//   | 7;

// export type FrameType =
//   | "none"
//   | "black"
//   | "wooden"
//   | "premium";

// export type BackgroundPreference =
//   | "original"
//   | "remove"
//   | "custom";

// export interface CustomerDetails {
//   name: string;
//   email: string;
//   phone: string;
// }

// export interface PortraitDetails {
//   subjects: number;
//   frame: FrameType;
//   background: BackgroundPreference;
// }

// export interface CommissionData {
//   packageId: string;

//   customer: CustomerDetails;

//   portrait: PortraitDetails;

//   photos: string[];

//   instructions: string;

//   totalPrice: number;
// }

// export interface CommissionStep {
//   id: number;
//   title: string;
//   description: string;
// }

// export interface CommissionFAQItem {
//   id: number;
//   question: string;
//   answer: string;
// }

// export interface PortraitOption {
//   id: number;
//   title: string;
//   description: string;
//   image?: string;
// }

// export type PortraitSize =
//   | "A5"
//   | "A4"
//   | "A3"
//   | "A2"
//   | "A1";

// export type PortraitOrientation =
//   | "Portrait"
//   | "Landscape";

// export type BackgroundStyle =
//   | "Original"
//   | "White"
//   | "Custom";

// export interface CommissionImage {
//   url: string;
//   publicId: string;
// }

// export interface CommissionCustomer {
//   id: string;
//   name: string;
//   email: string;
// }

// export interface CommissionPricing {
//   subtotal: number;
//   discount: number;
//   shipping: number;
//   total: number;
// }

// export interface DeliveryDetails {
//   type: DeliveryType;

//   address?: string;

//   city?: string;

//   state?: string;

//   pincode?: string;
// }

// export interface CommissionDraft {
//   portraitSize: PortraitSize;

//   orientation: PortraitOrientation;

//   persons: number;

//   frame: boolean;

//   background: BackgroundStyle;

//   portraitStyle?: PortraitStyle;

//   instructions: string;

//   images: CommissionImage[];
// }

// export interface Commission {
//   id: string;

//   customer: CommissionCustomer;

//   portraitSize: PortraitSize;

//   orientation: PortraitOrientation;

//   persons: number;

//   frame: boolean;

//   background: BackgroundStyle;

//   instructions: string;

//   images: CommissionImage[];

//   pricing: CommissionPricing;

//   delivery: DeliveryDetails;

//   status: CommissionStatus;

//   createdAt: unknown;

//   updatedAt: unknown;
// }

// export type PortraitStyle =
//   | "Realistic"
//   | "Premium"
//   | "Hyper Realistic";

// export type DeliveryType =
//   | "Digital"
//   | "Printed"
//   | "Framed";

// export type CommissionStatus =
//   | "PENDING"
//   | "CONFIRMED"
//   | "DRAWING"
//   | "SHADING"
//   | "READY"
//   | "SHIPPED"
//   | "DELIVERED"
//   | "CANCELLED";

// export type CommissionStepKey =
//   | "DETAILS"
//   | "PHOTOS"
//   | "REVIEW"
//   | "CONFIRMATION"
//   | "SUCCESS";