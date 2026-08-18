import { z } from "zod";

export const paymentAccountSchema = z.object({
  title: z.string().min(3),

  type: z.enum([
    "upi",
    "bank",
  ]),

  accountHolder: z.string().min(2),

  description: z.string(),

  enabled: z.boolean(),

  displayOrder: z.coerce.number(),

  upiId: z.string(),

  qrImage: z.string(),

  bankName: z.string(),

  accountNumber: z.string(),

  ifsc: z.string(),

  branch: z.string(),
});