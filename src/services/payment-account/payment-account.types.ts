import type { PaymentAccount } from "@/types/payment-account";

export type CreatePaymentAccount =
  Omit<
    PaymentAccount,
    "id" | "createdAt" | "updatedAt"
  >;

export type UpdatePaymentAccount =
  Partial<CreatePaymentAccount>;