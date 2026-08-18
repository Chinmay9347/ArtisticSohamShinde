import type { Timestamp } from "firebase/firestore";

export type PaymentMethod =
  | "UPI"
  | "BANK_TRANSFER"
  | "QR";

export type PaymentStatus =
  | "PENDING"
  | "SUBMITTED"
  | "VERIFIED"
  | "REJECTED";

export interface PaymentReceipt {
  fileName: string;
  publicId: string;
  url: string;
  uploadedAt: unknown;
}

export interface PaymentDetails {
  method: PaymentMethod;
  status: PaymentStatus;
  amount: number;
  currency: "INR";

  /*
   * Canonical transaction ID used by the current system.
   *
   * The order mapper normalizes legacy transaction fields
   * into this property.
   */
  transactionId: string;

  receipt?: PaymentReceipt;

  submittedAt?: Timestamp | Date | null;

  verifiedAt?: Timestamp | Date | null;

  rejectedAt?: Timestamp | Date | null;

  rejectedReason?: string;
}

// import type { Timestamp } from "firebase/firestore";

// export type PaymentMethod =
//   | "UPI"
//   | "BANK_TRANSFER"
//   | "QR";

// export type PaymentStatus =
//   | "PENDING"
//   | "SUBMITTED"
//   | "VERIFIED"
//   | "REJECTED";

// export interface PaymentReceipt {
//   fileName: string;
//   publicId: string;
//   url: string;
//   uploadedAt: unknown;
// }

// export interface PaymentDetails {
//   method: PaymentMethod;
//   status: PaymentStatus;
//   amount: number;
//   currency: "INR";
//   transactionId: string;
//   receipt?: PaymentReceipt;
//   submittedAt?: Timestamp;
//   verifiedAt?: Timestamp;
//   rejectedReason?: string;
// }