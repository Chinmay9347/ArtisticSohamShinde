import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import {
  mapPricingConfigDocument,
} from "./pricing.mapper";

import type {
  PricingConfigInput,
} from "@/types/pricing";

const COLLECTION =
  "pricingConfigs";

export async function getPricingConfigs() {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION),
      orderBy("packageName", "asc"),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      mapPricingConfigDocument(
        document.id,
        document.data(),
      ),
  );
}

export async function getPricingConfig(
  packageId: string,
) {
  const snapshot = await getDoc(
    doc(
      db,
      COLLECTION,
      packageId,
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapPricingConfigDocument(
    snapshot.id,
    snapshot.data(),
  );
}

export async function upsertPricingConfig(
  packageId: string,
  data: PricingConfigInput,
) {
  const reference = doc(
    db,
    COLLECTION,
    packageId,
  );

  const existing =
    await getDoc(reference);

  await setDoc(
    reference,
    {
      ...data,

      packageId,

      ...(existing.exists()
        ? {}
        : {
            createdAt:
              serverTimestamp(),
          }),

      updatedAt:
        serverTimestamp(),
    },
    {
      merge: true,
    },
  );
}