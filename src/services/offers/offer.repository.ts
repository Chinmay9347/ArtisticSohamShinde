import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  where,
  query,
  serverTimestamp,
  updateDoc,
  increment,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import {
  mapOfferDocument,
} from "./offer.mapper";

import type {
  OfferFormData,
} from "@/types/offer";

const COLLECTION =
  "offers";

export async function getOffers() {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      mapOfferDocument(
        document.id,
        document.data(),
      ),
  );
}

export async function getOfferByCode(code: string) {
  const snapshot = await getDocs(query(collection(db, COLLECTION), where("code", "==", code.trim().toUpperCase())));
  const document = snapshot.docs[0];
  return document ? mapOfferDocument(document.id, document.data()) : null;
}

export async function getOffer(
  id: string,
) {
  const snapshot = await getDoc(
    doc(db, COLLECTION, id),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapOfferDocument(
    snapshot.id,
    snapshot.data(),
  );
}

export async function createOffer(
  data: OfferFormData,
) {
  return addDoc(
    collection(db, COLLECTION),
    {
      ...data,

      usageCount: 0,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function updateOffer(
  id: string,
  data: Partial<OfferFormData>,
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function archiveOffer(
  id: string,
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      enabled: false,

      updatedAt:
        serverTimestamp(),
    },
  );
}
export async function incrementOfferUsage(id: string){return updateDoc(doc(db,COLLECTION,id),{usageCount:increment(1),updatedAt:serverTimestamp()});}
