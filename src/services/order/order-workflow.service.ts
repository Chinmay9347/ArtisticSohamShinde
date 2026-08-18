import { doc, serverTimestamp, updateDoc } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { ORDER_STATUS, type OrderStatus } from "@/constants/order-status";
import { OrderTimelineService } from "./order-timeline.service";

const COLLECTION = "orders";

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  [ORDER_STATUS.PAYMENT_VERIFIED]: ORDER_STATUS.ARTWORK_QUEUE,

  [ORDER_STATUS.ARTWORK_QUEUE]: ORDER_STATUS.DRAWING,

  [ORDER_STATUS.DRAWING]: ORDER_STATUS.QUALITY_CHECK,

  [ORDER_STATUS.QUALITY_CHECK]: ORDER_STATUS.PACKAGED,

  [ORDER_STATUS.PACKAGED]: ORDER_STATUS.SHIPPED,

  [ORDER_STATUS.SHIPPED]: ORDER_STATUS.DELIVERED,

  [ORDER_STATUS.DELIVERED]: ORDER_STATUS.COMPLETED,
};

export class OrderWorkflowService {
  static getNextStatus(current: OrderStatus) {
    return NEXT_STATUS[current] ?? null;
  }

  static async advance(
    orderId: string,
    current: OrderStatus
  ) {
    const next = this.getNextStatus(current);

    if (!next) {
      return;
    }

    await updateDoc(doc(db, COLLECTION, orderId), {
      status: next,
      updatedAt: serverTimestamp(),
    });
    await OrderTimelineService.add(orderId, {
      title: `Status changed to ${next.replaceAll("_", " ")}`,
    });
  }
}