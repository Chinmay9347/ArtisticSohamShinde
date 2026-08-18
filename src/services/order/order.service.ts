import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  onSnapshot,
  type Unsubscribe,
} from "firebase/firestore";
import { mapOrder } from "./order.mapper";
import { db } from "@/firebase/firestore";
import type { Order } from "@/types/order";
import {
  ORDER_STATUS,
  ACTIVE_ORDER_STATUSES,
} from "@/constants/order-status";

const COLLECTION = "orders";

export class OrderService {


  static async get(orderId: string) {
    const snapshot = await getDoc(
      doc(db, COLLECTION, orderId)
    );

    if (!snapshot.exists()) {
      return null;
    }

    return mapOrder(snapshot);
  }

  static async getAll() {
    const snapshot = await getDocs(
      collection(db, COLLECTION)
    );

    return snapshot.docs.map(mapOrder);
  }

  static async getArtworkQueue() {
    const q = query(
      collection(db, COLLECTION),
      where("status", "==", ORDER_STATUS.ARTWORK_QUEUE),
      orderBy("createdAt", "asc")
    );

    const snapshot = await getDocs(q);

    return snapshot.docs.map(mapOrder);
  }

  static async getByArtist(artistId: string) {
    const primary = await getDocs(query(collection(db, COLLECTION), where("artist.uid", "==", artistId)));
    const legacy = await getDocs(query(collection(db, COLLECTION), where("artistId", "==", artistId))).catch(() => null);
    const unique = new Map(primary.docs.map((doc) => [doc.id, mapOrder(doc)]));
    legacy?.docs.forEach((doc) => unique.set(doc.id, mapOrder(doc)));
    return Array.from(unique.values()).sort((a, b) => (b.createdAt?.toMillis?.() ?? 0) - (a.createdAt?.toMillis?.() ?? 0));
  }

  static async getByUser(userId: string) {
    const q = query(
      collection(db, COLLECTION),
      where("customer.uid", "==", userId),
    );

    const snapshot = await getDocs(q);

    return snapshot.docs
      .map(mapOrder)
      .sort((a, b) => {
        const aTime = a.createdAt?.toMillis?.() ?? 0;
        const bTime = b.createdAt?.toMillis?.() ?? 0;
        return bTime - aTime;
      });
  }

  static async getByCustomerIdentity(
    userId: string,
    email?: string,
    phone?: string,
  ) {
    const results = new Map<string, Order>();
    const queries = [query(collection(db, COLLECTION), where("customer.uid", "==", userId))];
    if (email?.trim()) queries.push(query(collection(db, COLLECTION), where("customer.email", "==", email.trim().toLowerCase())));
    if (phone?.trim()) queries.push(query(collection(db, COLLECTION), where("customer.phone", "==", phone.trim())));
    const snapshots = await Promise.all(queries.map((q) => getDocs(q)));
    for (const snapshot of snapshots) for (const item of snapshot.docs) results.set(item.id, mapOrder(item));
    return Array.from(results.values()).sort((a, b) => { const at = a.createdAt instanceof Date ? a.createdAt.getTime() : a.createdAt?.toMillis?.() ?? 0; const bt = b.createdAt instanceof Date ? b.createdAt.getTime() : b.createdAt?.toMillis?.() ?? 0; return bt - at; });
  }

  static async getLatestActiveOrder(userId: string) {
    const orders = await this.getByUser(userId);

    return (
      orders.find((order) =>
        ACTIVE_ORDER_STATUSES.includes(order.status)
      ) ?? null
    );
  }

  static async update(
    orderId: string,
    data: Partial<Order>
  ) {
    await updateDoc(doc(db, COLLECTION, orderId), {
      ...data,

      updatedAt: serverTimestamp(),
    });
  }

  static async updateShipping(
    orderId: string,
    shipping: Order["shipping"],
  ) {
    await updateDoc(doc(db, COLLECTION, orderId), {
      shipping,
      updatedAt: serverTimestamp(),
    });
  }

  static async updateStatus(
    orderId: string,
    status: Order["status"]
  ) {
    await updateDoc(doc(db, COLLECTION, orderId), {
      status,

      updatedAt: serverTimestamp(),
    });
  }


  static subscribe(
    orderId: string,
    onOrder: (order: Order | null) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return onSnapshot(
      doc(db, COLLECTION, orderId),
      (snapshot) => {
        if (!snapshot.exists()) {
          onOrder(null);
          return;
        }

        onOrder(mapOrder(snapshot));
      },
      (error) => {
        onError?.(error);
      },
    );
  }

  static subscribeAll(
    onOrders: (orders: Order[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    return onSnapshot(
      collection(db, COLLECTION),
      (snapshot) => {
        onOrders(
          snapshot.docs
            .map(mapOrder)
            .sort((a, b) => {
              // const at =
              //   a.createdAt?.getTime?.() ?? 0;
              // const bt =
              //   b.createdAt?.getTime?.() ?? 0;
              const at =
                a.createdAt?.toMillis?.() ?? 0;

              const bt =
                b.createdAt?.toMillis?.() ?? 0;

              return bt - at;
            }),
        );
      },
      (error) => {
        onError?.(error);
      },
    );
  }

  static subscribeByArtist(
    artistId: string,
    onOrders: (orders: Order[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    let active = true;
    const refresh = async () => {
      try {
        const orders = await OrderService.getByArtist(artistId);
        if (active) onOrders(orders);
      } catch (error) {
        if (active) onError?.(error instanceof Error ? error : new Error("Unable to load assigned artwork."));
      }
    };
    void refresh();
    const timer = window.setInterval(() => void refresh(), 15000);
    return () => { active = false; window.clearInterval(timer); };
  }

  static subscribeByUser(
    userId: string,
    onOrders: (orders: Order[]) => void,
    onError?: (error: Error) => void,
  ): Unsubscribe {
    const q = query(
      collection(db, COLLECTION),
      where("customer.uid", "==", userId),
    );

    return onSnapshot(
      q,
      (snapshot) => {
        onOrders(
          snapshot.docs
            .map(mapOrder)
            .sort((a, b) => {
              // const at =
              //   a.createdAt?.getTime?.() ?? 0;
              // const bt =
              //   b.createdAt?.getTime?.() ?? 0;
              const at =
                a.createdAt?.toMillis?.() ?? 0;

              const bt =
                b.createdAt?.toMillis?.() ?? 0;

              return bt - at;
            }),
        );
      },
      (error) => {
        onError?.(error);
      },
    );
  }

  static async delete(orderId: string) {
    await deleteDoc(doc(db, COLLECTION, orderId));
  }
}