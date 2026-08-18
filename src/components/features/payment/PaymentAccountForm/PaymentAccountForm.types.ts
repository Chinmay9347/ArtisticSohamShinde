import type { PaymentAccount } from "@/types/payment-account";
import { z } from "zod";
import { paymentAccountSchema } from "./PaymentAccountForm.schema";

export interface PaymentAccountFormProps {
  initialValues?: Partial<PaymentAccount>;

  loading?: boolean;

  submitLabel?: string;

  onSubmit: (
    values: PaymentAccountFormValues
  ) => Promise<void>;
}
export type PaymentAccountFormValues =
  z.output<typeof paymentAccountSchema>;

// import type { PaymentAccount } from "@/types/payment-account";

// export interface PaymentAccountFormProps {
//   initialValues?: Partial<PaymentAccount>;
//   onSubmit: (values: PaymentAccountFormValues) => Promise<void>;
//   loading?: boolean;
// }

// export interface PaymentAccountFormValues {
//   title: string;

//   type: "upi" | "bank";

//   accountHolder: string;

//   description: string;

//   enabled: boolean;

//   displayOrder: number;

//   upiId: string;

//   qrImage: string;

//   bankName: string;

//   accountNumber: string;

//   ifsc: string;

//   branch: string;
// }