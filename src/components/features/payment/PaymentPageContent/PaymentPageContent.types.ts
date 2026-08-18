import type { Order } from "@/types/order";
import type { PaymentAccount } from "@/types/payment-account";

export interface PaymentPageContentProps {
  order: Order;
  paymentAccounts: PaymentAccount[];
}