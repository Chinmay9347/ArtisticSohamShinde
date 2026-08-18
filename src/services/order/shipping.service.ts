import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { ORDER_STATUS } from "@/constants/order-status";
import { OrderTimelineService } from "./order-timeline.service";

const COLLECTION = "orders";
interface ShippingDetails { courier: string; trackingNumber: string; trackingUrl?: string; }

export class ShippingService {
  static async createShipment(orderId: string, shipping: ShippingDetails) {
    // Preserve the customer's existing shipping address while adding shipment data.
    await updateDoc(doc(db, COLLECTION, orderId), {
      "shipping.courier": shipping.courier,
      "shipping.trackingNumber": shipping.trackingNumber,
      "shipping.trackingUrl": shipping.trackingUrl ?? "",
      "shipping.dispatchedAt": serverTimestamp(),
      status: ORDER_STATUS.SHIPPED,
      updatedAt: serverTimestamp(),
    });
    await OrderTimelineService.add(orderId, { title: "Order Shipped", description: `${shipping.courier} • ${shipping.trackingNumber}` });
  }

  static async updateShipment(orderId: string, shipping: ShippingDetails) {
    // Never replace the complete shipping object; that previously removed the address.
    await updateDoc(doc(db, COLLECTION, orderId), {
      "shipping.courier": shipping.courier,
      "shipping.trackingNumber": shipping.trackingNumber,
      "shipping.trackingUrl": shipping.trackingUrl ?? "",
      updatedAt: serverTimestamp(),
    });
    await OrderTimelineService.add(orderId, { title: "Shipment Updated", description: `${shipping.courier} • ${shipping.trackingNumber}` });
  }

  static async markDelivered(orderId: string) {
    await updateDoc(doc(db, COLLECTION, orderId), { status: ORDER_STATUS.DELIVERED, "shipping.deliveredAt": serverTimestamp(), updatedAt: serverTimestamp() });
    await OrderTimelineService.add(orderId, { title: "Order Delivered" });
  }
}
