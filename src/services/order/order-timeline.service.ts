import {
  arrayUnion,
  doc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

const COLLECTION = "orders";

export interface TimelineEntry {
  title: string;
  description?: string;
  createdBy?: string;
  createdAt?: unknown;
}

export class OrderTimelineService {
  static async add(
    orderId: string,
    entry: TimelineEntry,
  ) {
    await updateDoc(
      doc(db, COLLECTION, orderId),
      {
        timeline: arrayUnion({
          ...entry,
          createdAt: Timestamp.now(),
        }),
      },
    );
  }
}

// import {
//   arrayUnion,
//   doc,
//   serverTimestamp,
//   updateDoc,
// } from "firebase/firestore";

// import { db } from "@/firebase/firestore";

// const COLLECTION = "orders";

// export interface TimelineEntry {
//   title: string;
//   description?: string;
//   createdBy?: string;
//   createdAt?: unknown;
// }

// export class OrderTimelineService {
//   static async add(
//     orderId: string,
//     entry: TimelineEntry
//   ) {
//     await updateDoc(doc(db, COLLECTION, orderId), {
//       timeline: arrayUnion({
//         ...entry,
//         createdAt: serverTimestamp(),
//       }),
//     });
//   }
// }