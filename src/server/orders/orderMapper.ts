import { getCommissionPackage } from "@/data/commissionPackages";
import { ORDER_STATUS } from "@/constants/order-status";
import { createInitialTimeline } from "@/lib/order/timeline";

import type { Order } from "@/types/order";
import type {
  CreateOrderRequest,
  OrderPricing,
} from "@/types/api/order";

export function orderMapper(
  request: CreateOrderRequest,
  pricing: OrderPricing,
): Partial<Order> {
  const pkg =
    getCommissionPackage(
      request.portrait.packageId
    );

  const isDigital =
    request.fulfillment.type ===
    "digital";

  const framing =
    !isDigital &&
    (
      request.fulfillment.type ===
        "framed" ||
      request.portrait.framing
    );

  return {
    customer: {
      uid:
        request.customer.uid ?? "",
      fullName:
        request.customer.fullName,
      email:
        request.customer.email,
      phone:
        request.customer.phone,
    },

    portrait: {
      packageId: pkg.id,
      packageName: pkg.name,
      size: request.portrait.size,

      subjects:
        request.portrait.subjects,

      orientation:
        request.portrait.orientation.toUpperCase() as
          | "PORTRAIT"
          | "LANDSCAPE"
          | "SQUARE",

      framing,

      background:
        request.portrait.background ??
        "",
    },

    fulfillment: {
      type:
        request.fulfillment.type,
    },

    instructionDetails: {
      specialInstructions:
        request.instructions
          .specialInstructions,

      giftMessage:
        request.instructions
          .giftMessage,
    },

    // Legacy flattened field.
    // Existing order screens continue to work.
    instructions: [
      request.instructions
        .specialInstructions,

      request.instructions
        .giftMessage,
    ]
      .filter(Boolean)
      .join("\n\n"),

    referencePhotos: request.referencePhotos,

    ...(request.galleryArtwork ? { galleryArtwork: request.galleryArtwork } : {}),

    pricing: {
      original: pricing.original ?? pricing.subtotal,
      customerPriceBeforeOffers:
        pricing.customerPriceBeforeOffers ?? pricing.subtotal,
      promotionalDiscount:
        pricing.promotionalDiscount ?? 0,
      basePrice: pricing.basePrice,
      framingPrice: pricing.framingPrice,
      subjectsPrice: pricing.subjectsPrice,
      couponDiscount: pricing.couponDiscount ?? 0,
      referralDiscount: pricing.referralDiscount ?? 0,
      rewardPointsUsed: pricing.rewardPointsUsed ?? 0,
      deliveryDistanceKm: pricing.deliveryDistanceKm ?? 0,
      deliveryCharge: pricing.deliveryCharge ?? 0,
      deliveryServiceLevel: pricing.deliveryServiceLevel ?? "STANDARD",
      deliveryProvider: pricing.deliveryProvider ?? null,
      deliveryRuleId: pricing.deliveryRuleId ?? null,
      deliveryZone: pricing.deliveryZone ?? "UNCONFIGURED",
      freeDelivery: pricing.freeDelivery ?? false,
      discount: pricing.discount,
      totalSaved:
        pricing.totalSaved ??
        Math.max(
          0,
          Number(pricing.promotionalDiscount ?? 0) +
            Number(pricing.discount ?? 0),
        ),
      total: pricing.total,
      savings: {
        originalPrice:
          pricing.original ?? pricing.subtotal,
        promotionalDiscount:
          pricing.promotionalDiscount ?? 0,
        customerPriceBeforeOffers:
          pricing.customerPriceBeforeOffers ?? pricing.subtotal,
        couponDiscount:
          pricing.couponDiscount ?? 0,
        referralDiscount:
          pricing.referralDiscount ?? 0,
        rewardPointsUsed:
          pricing.rewardPointsUsed ?? 0,
        totalSaved:
          pricing.totalSaved ??
          Math.max(
            0,
            Number(pricing.promotionalDiscount ?? 0) +
              Number(pricing.discount ?? 0),
          ),
      },
      ...(request.offerCode ? { offerCode: request.offerCode } : {}),
      ...(request.offerCodes?.length ? { offerCodes: request.offerCodes } : {}),
      ...(request.referralCode
        ? { referralCode: request.referralCode }
        : {}),
    },

    payment: {
      method: "UPI",
      status: "PENDING",
      amount: pricing.total,
      currency: "INR",
      transactionId: "",
    },

    shipping: isDigital
      ? {}
      : {
          address: {
            fullName:
              request.customer
                .fullName,

            phone:
              request.customer.phone,

            addressLine1:
              request.delivery
                .addressLine1,

            addressLine2:
              request.delivery
                .addressLine2 || "",

            city:
              request.delivery.city,

            state:
              request.delivery.state,

            postalCode:
              request.delivery.pincode,

            country:
              request.delivery.country,
          },
        },

    timeline:
      createInitialTimeline(),

    status:
      ORDER_STATUS.PAYMENT_PENDING,
  };
}

//02/08/2026
// import { getCommissionPackage } from "@/data/commissionPackages";
// import { ORDER_STATUS } from "@/constants/order-status";
// import { createInitialTimeline } from "@/lib/order/timeline";

// import type { Order } from "@/types/order";
// import type {
//   CreateOrderRequest,
//   OrderPricing,
// } from "@/types/api/order";

// export function orderMapper(
//   request: CreateOrderRequest,
//   pricing: OrderPricing,
// ): Partial<Order> {
//   const pkg = getCommissionPackage(
//     request.portrait.packageId,
//   );

//   return {
//     customer: {
//       uid: request.customer.uid ?? "",
//       fullName: request.customer.fullName,
//       email: request.customer.email,
//       phone: request.customer.phone,
//     },

//     portrait: {
//       packageId: pkg.id,
//       packageName: pkg.name,
//       size: request.portrait.size,
//       // dimensions: pkg.dimensions,
//       subjects: request.portrait.subjects,
//       orientation: request.portrait.orientation,
//       framing: request.portrait.framing,
//       background: request.portrait.background ?? "",
//     },

//     instructions: [
//       request.instructions.specialInstructions,
//       request.instructions.giftMessage,
//     ]
//       .filter(Boolean)
//       .join("\n\n"),

//     referencePhotos: request.referencePhotos,

//     payment: {
//       method: "UPI",
//       status: "PENDING",
//       amount: pricing.total,
//       currency: "INR",
//       transactionId: "",
//     },

//     shipping: {},

//     // Artist is intentionally omitted.
//     // It will be added later when an artist is assigned.

//     timeline: createInitialTimeline(),

//     status: ORDER_STATUS.PAYMENT_PENDING,
//   };
// }

// // 02/08/2026
// // import { getCommissionPackage } from "@/data/commissionPackages";
// // import { ORDER_STATUS } from "@/constants/order-status";
// // import { createInitialTimeline } from "@/lib/order/timeline";

// // import type { Order } from "@/types/order";
// // import type {
// //   CreateOrderRequest,
// //   OrderPricing,
// // } from "@/types/api/order";

// // export function orderMapper(
// //   request: CreateOrderRequest,
// //   pricing: OrderPricing,
// // ): Partial<Order> {
// //   const pkg = getCommissionPackage(request.portrait.packageId);

// //   return {
// //     customer: {
// //       uid: request.customer.uid ?? "",
// //       fullName: request.customer.fullName,
// //       email: request.customer.email,
// //       phone: request.customer.phone,
// //     },

// //     portrait: {
// //       packageId: pkg.id,
// //       packageName: pkg.name,
// //       size: request.portrait.size,
// //       // dimensions: pkg.dimensions,
// //       subjects: request.portrait.subjects,
// //       orientation: request.portrait.orientation,
// //       framing: request.portrait.framing,
// //       background: request.portrait.background ?? "",
// //     },

// //     instructions: [
// //     request.instructions.specialInstructions,
// //     request.instructions.giftMessage
// //     ].filter(Boolean).join("\n\n"),

// //     referencePhotos: request.referencePhotos,

// //     payment: {
// //       method: "UPI",
// //       status: "PENDING",
// //       amount: pricing.total,
// //       // currency: pricing.currency,
// //       // verified: false,
// //       currency: "INR",
// //       // receiptUrl: "",
// //       transactionId: "",
// //     },

// //     shipping: {},

// //     artist: undefined,

// //     timeline: createInitialTimeline(),

// //     status: ORDER_STATUS.PAYMENT_PENDING,
// //   };
// // }

// // import { randomUUID } from "crypto";

// // import { getCommissionPackage } from "@/data/commissionPackages";
// // import { ORDER_STATUS } from "@/constants/order-status";
// // import type { Order } from "@/types/order";
// // import type {
// //   CreateOrderRequest,
// //   OrderPricing,
// // } from "@/types/api/order";

// // // export interface OrderDocument {
// // //   id: string;

// // //   customer: CreateOrderRequest["customer"];

// // //   portrait: {
// // //     packageId: string;
// // //     packageName: string;
// // //     size: string;
// // //     dimensions: string;
// // //     subjects: number;
// // //     orientation: "portrait" | "landscape";
// // //     framed: boolean;
// // //   };

// // //   pricing: OrderPricing;

// // //   instructions: CreateOrderRequest["instructions"];

// // //   referencePhotos: CreateOrderRequest["referencePhotos"];

// // //   status: string;

// // //   payment: {
// // //     verified: boolean;
// // //     receiptUrl: string | null;
// // //     submittedAt: string | null;
// // //   };

// // //   createdAt: string;
// // //   updatedAt: string;
// // // }

// // export function orderMapper(
// //   request: CreateOrderRequest,
// //   // pricing: OrderPricing,
// // ): Partial<Order>
// // // OrderDocument 
// // {
// //   const pkg = getCommissionPackage(
// //     request.portrait.packageId,
// //   );

// //   const now = new Date().toISOString();

// //   return {
// //     id: randomUUID(),

// //     customer: request.customer,

// //     portrait: {
// //       packageId: pkg.id,
// //       packageName: pkg.name,
// //       size: request.portrait.size,
// //       dimensions: pkg.dimensions,
// //       subjects: request.portrait.subjects,
// //       orientation:request.portrait.orientation,      framing: request.portrait.framing,
// //     },

// //     // pricing,

// //     instructions: request.instructions,

// //     referencePhotos: request.referencePhotos,

// //     status: ORDER_STATUS.PAYMENT_PENDING,

// //     payment: {
// //       verified: false,
// //       receiptUrl: null,
// //       submittedAt: null,
// //     },

// //     createdAt: now,
// //     updatedAt: now,
// //   };
// // }