import type { TimelineEvent } from "@/types/timeline";
import { ORDER_STATUS } from "@/constants/order-status";

export function createInitialTimeline(): TimelineEvent[] {
  return [
    {
      status: ORDER_STATUS.PAYMENT_PENDING,
      title: "Order Created",
      description: "Your order has been created successfully.",
      completed: true,
    },
    {
      status: ORDER_STATUS.PAYMENT_PENDING,
      title: "Awaiting Payment",
      description: "Waiting for payment submission.",
      completed: false,
    },
    {
      status: ORDER_STATUS.PAYMENT_VERIFIED,
      title: "Payment Verified",
      completed: false,
    },
    {
      status: ORDER_STATUS.ARTWORK_QUEUE,
      title: "Added to Drawing Queue",
      completed: false,
    },
    {
      status: ORDER_STATUS.DRAWING,
      title: "Drawing Started",
      completed: false,
    },
    {
      status: ORDER_STATUS.QUALITY_CHECK,
      title: "Quality Check",
      completed: false,
    },
    {
      status: ORDER_STATUS.COMPLETED,
      title: "Artwork Completed",
      completed: false,
    },
    {
      status: ORDER_STATUS.SHIPPED,
      title: "Shipped",
      completed: false,
    },
    {
      status: ORDER_STATUS.DELIVERED,
      title: "Delivered",
      completed: false,
    },
  ];
}