import { addDoc, collection, getDocs, orderBy, query, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firestore";

export interface CouponUsageLog {
  id: string;
  couponCode: string;
  couponCodes?: string[];
  customerId?: string;
  orderId?: string;
  discountAmount?: number;
  createdAt?: unknown;
}

export async function getCouponUsageLogs(): Promise<CouponUsageLog[]> {
  const snapshot = await getDocs(
    query(collection(db, "couponUsageLogs"), orderBy("createdAt", "desc")),
  );
  return snapshot.docs.map((item) => ({ id: item.id, ...item.data() })) as CouponUsageLog[];
}

export async function createCouponUsageLog(data: Omit<CouponUsageLog,"id">){return addDoc(collection(db,"couponUsageLogs"),{...data,createdAt:serverTimestamp()});}
