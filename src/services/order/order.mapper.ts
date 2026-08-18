import type {
  DocumentData,
  DocumentSnapshot,
  QueryDocumentSnapshot,
} from "firebase/firestore";

import type { Order } from "@/types/order";

function toDate(value: unknown): Date | null {
  if (
    value &&
    typeof value === "object" &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    return (value as { toDate: () => Date }).toDate();
  }

  if (value instanceof Date) {
    return value;
  }

  if (typeof value === "string") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  if (typeof value === "number") {
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  return null;
}

function firstNonEmptyString(
  ...values: unknown[]
): string {
  for (const value of values) {
    if (
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function normalizePayment(
  rawPayment: unknown,
) {
  if (
    !rawPayment ||
    typeof rawPayment !== "object"
  ) {
    return rawPayment;
  }

  const payment =
    rawPayment as Record<string, unknown>;

  /*
   * Current:
   *   payment.transactionId
   *
   * Legacy:
   *   payment.transactionID
   *   payment.txnId
   *   payment.utr
   *   payment.upiTransactionId
   */
  const transactionId =
    firstNonEmptyString(
      payment.transactionId,
      payment.transactionID,
      payment.txnId,
      payment.utr,
      payment.upiTransactionId,
    );

  /*
   * Current:
   *   payment.receipt = {
   *     fileName,
   *     publicId,
   *     url,
   *     uploadedAt
   *   }
   *
   * Legacy:
   *   payment.receiptUrl
   *   payment.receiptURL
   */
  let receipt:
    | {
        fileName: string;
        publicId: string;
        url: string;
        uploadedAt: Date | null;
      }
    | undefined;

  const rawReceipt =
    payment.receipt;

  if (
    rawReceipt &&
    typeof rawReceipt === "object"
  ) {
    const receiptObject =
      rawReceipt as Record<
        string,
        unknown
      >;

    const url =
      firstNonEmptyString(
        receiptObject.url,
        receiptObject.secure_url,
        receiptObject.secureUrl,
      );

    if (url) {
      receipt = {
        fileName:
          firstNonEmptyString(
            receiptObject.fileName,
            receiptObject.filename,
            payment.receiptFileName,
          ) ||
          "Payment Receipt",

        publicId:
          firstNonEmptyString(
            receiptObject.publicId,
            receiptObject.public_id,
            payment.receiptPublicId,
          ),

        url,

        uploadedAt:
          toDate(
            receiptObject.uploadedAt,
          ) ??
          toDate(
            payment.receiptUploadedAt,
          ),
      };
    }
  } else if (
    typeof rawReceipt === "string" &&
    rawReceipt.trim()
  ) {
    receipt = {
      fileName:
        firstNonEmptyString(
          payment.receiptFileName,
        ) ||
        "Payment Receipt",

      publicId:
        firstNonEmptyString(
          payment.receiptPublicId,
        ),

      url: rawReceipt.trim(),

      uploadedAt:
        toDate(
          payment.receiptUploadedAt,
        ),
    };
  }

  /*
   * Legacy flat receipt URL.
   */
  if (!receipt) {
    const legacyReceiptUrl =
      firstNonEmptyString(
        payment.receiptUrl,
        payment.receiptURL,
      );

    if (legacyReceiptUrl) {
      receipt = {
        fileName:
          firstNonEmptyString(
            payment.receiptFileName,
          ) ||
          "Payment Receipt",

        publicId:
          firstNonEmptyString(
            payment.receiptPublicId,
          ),

        url: legacyReceiptUrl,

        uploadedAt:
          toDate(
            payment.receiptUploadedAt,
          ),
      };
    }
  }

  return {
    ...payment,

    transactionId,

    receipt,

    submittedAt:
      toDate(
        payment.submittedAt,
      ),

    verifiedAt:
      toDate(
        payment.verifiedAt,
      ),

    rejectedAt:
      toDate(
        payment.rejectedAt,
      ),
  };
}

export function createEmptyOrder(): Partial<Order> {
  return {
    referencePhotos: [],
    timeline: [],
  };
}

export function mapOrder(
  snapshot:
    | DocumentSnapshot<DocumentData>
    | QueryDocumentSnapshot<DocumentData>,
): Order {
  const data = snapshot.data();

  if (!data) {
    throw new Error(
      "Order document does not exist.",
    );
  }

  const timeline =
    Array.isArray(data.timeline)
      ? data.timeline.map(
          (
            entry: Record<
              string,
              unknown
            >,
          ) => ({
            ...entry,
            createdAt:
              toDate(
                entry.createdAt,
              ),
          }),
        )
      : [];

  const payment =
    normalizePayment(
      data.payment,
    );

  return {
    id: snapshot.id,

    ...data,

    /*
     * Normalized payment must come after
     * ...data so Firestore's raw payment object
     * cannot overwrite it.
     */
    payment,

    timeline,

    createdAt:
      toDate(data.createdAt),

    updatedAt:
      toDate(data.updatedAt),

    deletedAt:
      toDate(data.deletedAt),
  } as unknown as Order;
}

// import type {
//   DocumentData,
//   DocumentSnapshot,
//   QueryDocumentSnapshot,
// } from "firebase/firestore";

// import type { Order } from "@/types/order";

// function toDate(value: unknown): Date | null {
//   if (
//     value &&
//     typeof value === "object" &&
//     "toDate" in value &&
//     typeof (value as { toDate?: unknown }).toDate === "function"
//   ) {
//     return (
//       value as {
//         toDate: () => Date;
//       }
//     }
//   ).toDate();
//   }

//   if (value instanceof Date) {
//     return value;
//   }

//   if (typeof value === "string") {
//     const date = new Date(value);

//     if (!Number.isNaN(date.getTime())) {
//       return date;
//     }
//   }

//   if (typeof value === "number") {
//     const date = new Date(value);

//     if (!Number.isNaN(date.getTime())) {
//       return date;
//     }
//   }

//   return null;
// }

// function firstNonEmptyString(
//   ...values: unknown[]
// ): string {
//   for (const value of values) {
//     if (
//       typeof value === "string" &&
//       value.trim()
//     ) {
//       return value.trim();
//     }
//   }

//   return "";
// }

// function normalizePayment(
//   rawPayment: unknown,
// ) {
//   if (
//     !rawPayment ||
//     typeof rawPayment !== "object"
//   ) {
//     return rawPayment;
//   }

//   const payment =
//     rawPayment as Record<string, unknown>;

//   /*
//    * --------------------------------------------------------------------------
//    * TRANSACTION ID NORMALIZATION
//    *
//    * New orders:
//    *   payment.transactionId
//    *
//    * Older/legacy orders may have:
//    *   payment.transactionID
//    *   payment.txnId
//    *   payment.utr
//    *   payment.upiTransactionId
//    * --------------------------------------------------------------------------
//    */
//   const transactionId =
//     firstNonEmptyString(
//       payment.transactionId,
//       payment.transactionID,
//       payment.txnId,
//       payment.utr,
//       payment.upiTransactionId,
//     );

//   /*
//    * --------------------------------------------------------------------------
//    * RECEIPT NORMALIZATION
//    *
//    * Current structure:
//    *
//    * payment.receipt = {
//    *   fileName,
//    *   publicId,
//    *   url,
//    *   uploadedAt
//    * }
//    *
//    * Legacy structures can contain:
//    *
//    * payment.receiptUrl
//    * payment.receiptURL
//    * payment.receiptFileName
//    * payment.receiptPublicId
//    * --------------------------------------------------------------------------
//    */

//   let receipt:
//     | {
//         fileName: string;
//         publicId: string;
//         url: string;
//         uploadedAt: Date | null;
//       }
//     | undefined;

//   const rawReceipt =
//     payment.receipt;

//   if (
//     rawReceipt &&
//     typeof rawReceipt === "object"
//   ) {
//     const receiptObject =
//       rawReceipt as Record<
//         string,
//         unknown
//       >;

//     const url =
//       firstNonEmptyString(
//         receiptObject.url,
//         receiptObject.secure_url,
//         receiptObject.secureUrl,
//       );

//     if (url) {
//       receipt = {
//         fileName:
//           firstNonEmptyString(
//             receiptObject.fileName,
//             receiptObject.filename,
//             payment.receiptFileName,
//           ) ||
//           "Payment Receipt",

//         publicId:
//           firstNonEmptyString(
//             receiptObject.publicId,
//             receiptObject.public_id,
//             payment.receiptPublicId,
//           ),

//         url,

//         uploadedAt:
//           toDate(
//             receiptObject.uploadedAt,
//           ) ??
//           toDate(
//             payment.receiptUploadedAt,
//           ),
//       };
//     }
//   } else if (
//     typeof rawReceipt === "string" &&
//     rawReceipt.trim()
//   ) {
//     receipt = {
//       fileName:
//         firstNonEmptyString(
//           payment.receiptFileName,
//         ) ||
//         "Payment Receipt",

//       publicId:
//         firstNonEmptyString(
//           payment.receiptPublicId,
//         ),

//       url: rawReceipt.trim(),

//       uploadedAt:
//         toDate(
//           payment.receiptUploadedAt,
//         ),
//     };
//   }

//   /*
//    * Legacy flat receipt URL support.
//    */
//   if (!receipt) {
//     const legacyReceiptUrl =
//       firstNonEmptyString(
//         payment.receiptUrl,
//         payment.receiptURL,
//       );

//     if (legacyReceiptUrl) {
//       receipt = {
//         fileName:
//           firstNonEmptyString(
//             payment.receiptFileName,
//           ) ||
//           "Payment Receipt",

//         publicId:
//           firstNonEmptyString(
//             payment.receiptPublicId,
//           ),

//         url: legacyReceiptUrl,

//         uploadedAt:
//           toDate(
//             payment.receiptUploadedAt,
//           ),
//       };
//     }
//   }

//   return {
//     ...payment,

//     /*
//      * Always expose the normalized transaction ID.
//      */
//     transactionId,

//     /*
//      * Always expose the normalized receipt.
//      */
//     receipt,

//     submittedAt:
//       toDate(
//         payment.submittedAt,
//       ),

//     verifiedAt:
//       toDate(
//         payment.verifiedAt,
//       ),

//     rejectedAt:
//       toDate(
//         payment.rejectedAt,
//       ),
//   };
// }

// export function createEmptyOrder(): Partial<Order> {
//   return {
//     referencePhotos: [],
//     timeline: [],
//   };
// }

// export function mapOrder(
//   snapshot:
//     | DocumentSnapshot<DocumentData>
//     | QueryDocumentSnapshot<DocumentData>,
// ): Order {
//   const data = snapshot.data();

//   if (!data) {
//     throw new Error(
//       "Order document does not exist.",
//     );
//   }

//   const timeline =
//     Array.isArray(data.timeline)
//       ? data.timeline.map(
//           (
//             entry: Record<
//               string,
//               unknown
//             >,
//           ) => ({
//             ...entry,
//             createdAt:
//               toDate(
//                 entry.createdAt,
//               ),
//           }),
//         )
//       : [];

//   const payment =
//     normalizePayment(
//       data.payment,
//     );

//   return {
//     id: snapshot.id,

//     ...data,

//     /*
//      * IMPORTANT:
//      * payment is assigned AFTER ...data so the
//      * normalized payment object cannot be overwritten
//      * by the original Firestore value.
//      */
//     payment,

//     timeline,

//     createdAt:
//       toDate(data.createdAt),

//     updatedAt:
//       toDate(data.updatedAt),

//     deletedAt:
//       toDate(data.deletedAt),
//   } as unknown as Order;
// }

// import type {
//   DocumentData,
//   DocumentSnapshot,
//   QueryDocumentSnapshot,
// } from "firebase/firestore";

// import type { Order } from "@/types/order";

// function toDate(value: unknown): Date | null {
//   if (
//     value &&
//     typeof value === "object" &&
//     "toDate" in value &&
//     typeof value.toDate === "function"
//   ) {
//     return value.toDate();
//   }

//   if (value instanceof Date) {
//     return value;
//   }

//   return null;
// }

// export function createEmptyOrder(): Partial<Order> {
//   return {
//     referencePhotos: [],
//     timeline: [],
//   };
// }

// export function mapOrder(
//   snapshot:
//     | DocumentSnapshot<DocumentData>
//     | QueryDocumentSnapshot<DocumentData>,
// ): Order {
//   const data = snapshot.data();

//   if (!data) {
//     throw new Error("Order document does not exist.");
//   }

//   const timeline = Array.isArray(data.timeline)
//     ? data.timeline.map((entry: Record<string, unknown>) => ({
//         ...entry,
//         createdAt: toDate(entry.createdAt),
//       }))
//     : [];

//   const payment = data.payment
//     ? {
//         ...data.payment,

//         submittedAt: toDate(
//           data.payment.submittedAt,
//         ),

//         verifiedAt: toDate(
//           data.payment.verifiedAt,
//         ),

//         receipt: data.payment.receipt
//           ? {
//               ...data.payment.receipt,

//               uploadedAt: toDate(
//                 data.payment.receipt.uploadedAt,
//               ),
//             }
//           : undefined,
//       }
//     : data.payment;

//   return {
//     id: snapshot.id,

//     ...data,

//     payment,

//     timeline,

//     createdAt: toDate(data.createdAt),

//     updatedAt: toDate(data.updatedAt),

//     deletedAt: toDate(data.deletedAt),
//   } as unknown as Order;
// }

//09/08/2026
// import type {
//   DocumentSnapshot,
//   QueryDocumentSnapshot,
//   DocumentData,
// } from "firebase/firestore";

// import type { Order } from "@/types/order";

// export function createEmptyOrder(): Partial<Order> {
//   return {
//     referencePhotos: [],
//     timeline: [],
//   };
// }

// export function mapOrder(
//   snapshot:
//     | DocumentSnapshot<DocumentData>
//     | QueryDocumentSnapshot<DocumentData>,
// ): Order {
//   const data = snapshot.data();

//   if (!data) {
//     throw new Error("Order document does not exist.");
//   }

//   const timeline = Array.isArray(data.timeline)
//     ? data.timeline.map((entry: any) => ({
//         ...entry,
//         createdAt:
//           entry.createdAt?.toDate?.() ??
//           entry.createdAt ??
//           null,
//       }))
//     : [];

//   return {
//     id: snapshot.id,

//     ...data,

//     timeline,

//     createdAt:
//       data.createdAt?.toDate?.() ?? null,

//     updatedAt:
//       data.updatedAt?.toDate?.() ?? null,
//   } as Order;
// }

//02/08/2026
// import type {
//   DocumentSnapshot,
//   QueryDocumentSnapshot,
//   DocumentData,
// } from "firebase/firestore";

// import type { Order } from "@/types/order";

// export function createEmptyOrder(): Partial<Order> {
//   return {
//     referencePhotos: [],
//     timeline: [],
//   };
// }

// export function mapOrder(
//   snapshot:
//     | DocumentSnapshot<DocumentData>
//     | QueryDocumentSnapshot<DocumentData>
// ): Order {
//   const data = snapshot.data();

//   if (!data) {
//     throw new Error("Order document does not exist.");
//   }

//   return {
//     id: snapshot.id,

//     ...data,

//     createdAt:
//       data.createdAt?.toDate?.() ?? null,

//     updatedAt:
//       data.updatedAt?.toDate?.() ?? null,
//   } as Order;
// }