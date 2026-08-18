import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  read?: boolean;
  createdAt?: unknown;
  updatedAt?: unknown;
  href?: string;
  offerId?: string | null;
  endAt?: unknown;
}

function time(value: unknown) {
  if (value == null) return 0;

  const v = value as any;

  const d = v?.toDate?.();
  if (d instanceof Date) return d.getTime();

  if (value instanceof Date) return value.getTime();

  if (typeof value === "number") {
    return value < 1e12 ? value * 1000 : value;
  }

  if (typeof value === "string") {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  if (typeof v?._seconds === "number") {
    return (
      v._seconds * 1000 +
      Math.floor(Number(v._nanoseconds ?? 0) / 1e6)
    );
  }

  if (typeof v?.seconds === "number") {
    return Number(v.seconds) * 1000;
  }

  return 0;
}

const MAX_NOTIFICATIONS = 10;

export async function getUserNotifications(uid: string) {
  const snap = await getDocs(
    query(
      collection(db, "notifications"),
      where("userId", "==", uid),
    ),
  );

  const now = Date.now();

  const staleOfferNotifications = snap.docs.filter((notificationDoc) => {
    const notification = notificationDoc.data() as AppNotification;

    // Only offer/coupon notifications need offer-expiry cleanup here.
    if (!notification.offerId) return false;

    const end = time(notification.endAt);

    return end > 0 && end <= now;
  });

  // IMPORTANT:
  // Previously expired notifications were only filtered from the UI.
  // Now they are actually deleted from Firestore as well.
  if (staleOfferNotifications.length > 0) {
    await Promise.all(
      staleOfferNotifications.map((notificationDoc) =>
        deleteDoc(
          doc(db, "notifications", notificationDoc.id),
        ),
      ),
    );
  }

  return snap.docs
    .filter(
      (notificationDoc) =>
        !staleOfferNotifications.some(
          (stale) => stale.id === notificationDoc.id,
        ),
    )
    .map(
      (d) =>
        ({
          id: d.id,
          ...d.data(),
        }) as AppNotification,
    )
    .filter((notification) => {
      const end = time(notification.endAt);

      // Never return an expired notification to the UI.
      return !(end > 0 && end <= now);
    })
    .sort(
      (a, b) =>
        time(b.createdAt) - time(a.createdAt),
    )
    .slice(0, MAX_NOTIFICATIONS);
}

export async function markNotificationRead(id: string) {
  await updateDoc(
    doc(db, "notifications", id),
    {
      read: true,
    },
  );
}

export async function markAllNotificationsRead(uid: string) {
  const items = await getUserNotifications(uid);

  await Promise.all(
    items
      .filter((notification) => !notification.read)
      .map((notification) =>
        markNotificationRead(notification.id),
      ),
  );
}

// import {
//   collection,
//   doc,
//   getDocs,
//   query,
//   updateDoc,
//   where,
// } from "firebase/firestore";
// import { db } from "@/firebase/firestore";

// export interface AppNotification {
//   id: string;
//   title: string;
//   message: string;
//   read?: boolean;
//   createdAt?: unknown;
//   href?: string;
//   offerId?: string | null;
//   endAt?: unknown;
// }

// function time(value: unknown) {
//   if (value == null) return 0;
//   const v = value as any;
//   const d = v?.toDate?.();
//   if (d instanceof Date) return d.getTime();
//   if (value instanceof Date) return value.getTime();
//   if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
//   if (typeof value === "string") {
//     const t = new Date(value).getTime();
//     return Number.isFinite(t) ? t : 0;
//   }
//   if (typeof v?._seconds === "number") {
//     return v._seconds * 1000 + Math.floor(Number(v._nanoseconds ?? 0) / 1e6);
//   }
//   if (typeof v?.seconds === "number") return Number(v.seconds) * 1000;
//   return 0;
// }

// export async function getUserNotifications(uid: string) {
//   const snap = await getDocs(
//     query(collection(db, "notifications"), where("userId", "==", uid)),
//   );
//   const now = Date.now();

//   return snap.docs
//     .map((d) => ({ id: d.id, ...d.data() } as AppNotification))
//     .filter((n) => {
//       const end = time(n.endAt);
//       return !(end > 0 && end <= now);
//     })
//     .sort((a, b) => time(b.createdAt) - time(a.createdAt))
//     .slice(0, 10);
// }

// export async function markNotificationRead(id: string) {
//   await updateDoc(doc(db, "notifications", id), { read: true });
// }

// export async function markAllNotificationsRead(uid: string) {
//   const items = await getUserNotifications(uid);
//   await Promise.all(
//     items.filter((n) => !n.read).map((n) => markNotificationRead(n.id)),
//   );
// }
