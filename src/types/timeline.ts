import type { Timestamp } from "firebase/firestore";

import type { OrderStatus } from "@/constants/order-status";

export interface TimelineEvent {
  status: OrderStatus;

  title: string;

  description?: string;

  completed: boolean;

  timestamp?: Timestamp;
}