import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { ORDER_STATUS } from "@/constants/order-status";
import { OrderTimelineService } from "./order-timeline.service";

const COLLECTION = "orders";

export class PaymentService {
  static async approvePayment(orderId: string) {
    await updateDoc(
      doc(db, COLLECTION, orderId),
      {
        "payment.status": "VERIFIED",
        "payment.verifiedAt":
          serverTimestamp(),
        status:
          ORDER_STATUS.PAYMENT_VERIFIED,
        updatedAt:
          serverTimestamp(),
      },
    );

    await OrderTimelineService.add(
      orderId,
      {
        title: "Payment Verified",
      },
    );
  }

  static async rejectPayment(
    orderId: string,
    reason: string,
  ) {
    await updateDoc(
      doc(db, COLLECTION, orderId),
      {
        "payment.status": "REJECTED",
        "payment.rejectedReason":
          reason,
        status:
          ORDER_STATUS.PAYMENT_REJECTED,
        updatedAt:
          serverTimestamp(),
      },
    );

    await OrderTimelineService.add(
      orderId,
      {
        title: "Payment Rejected",
        description: reason,
      },
    );
  }
}
