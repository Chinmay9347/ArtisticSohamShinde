import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/firestore";
import { OrderTimelineService } from "./order-timeline.service";

const COLLECTION = "orders";

export class ArtistService {
  static async assign(orderId: string, artistId: string, artistName: string) {
    await updateDoc(doc(db, COLLECTION, orderId), {
      artist: { uid: artistId, name: artistName, assignedAt: serverTimestamp() },
      updatedAt: serverTimestamp(),
    });
    await OrderTimelineService.add(orderId, { title: "Artist Assigned", description: artistName });
  }

  static async updateStatus(orderId: string, status: string) {
    await updateDoc(doc(db, COLLECTION, orderId), { status, updatedAt: serverTimestamp() });
    await OrderTimelineService.add(orderId, { title: "Order Status Updated", description: status.replaceAll("_", " ") });
  }
}
