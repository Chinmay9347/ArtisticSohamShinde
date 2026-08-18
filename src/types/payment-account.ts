export type PaymentAccountType =
  | "upi"
  | "bank";

export interface PaymentAccount {
  id: string;
  enabled: boolean;
  displayOrder: number;
  type: PaymentAccountType;
  title: string;
  description?: string;
  accountHolder: string;
  qrImage?: string;
  upiId?: string;
  bankName?: string;
  accountNumber?: string;
  ifsc?: string;
  branch?: string;
  createdAt?: string;
  updatedAt?: string;
  // createdAt?: Date;
  // updatedAt?: Date;
}