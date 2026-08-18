import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  deleteDoc,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import {
  mapReferralCampaignDocument,
  mapReferralDocument,
} from "./referral.mapper";

import type {
  ReferralCampaignFormData,
  ReferralStatus,
} from "@/types/referral";

const CAMPAIGN_COLLECTION =
  "referralCampaigns";

const REFERRAL_COLLECTION =
  "referrals";

export async function getReferralCampaigns() {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        CAMPAIGN_COLLECTION,
      ),
      orderBy(
        "createdAt",
        "desc",
      ),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      mapReferralCampaignDocument(
        document.id,
        document.data(),
      ),
  );
}

export async function getEnabledReferralCampaigns() {
  const snapshot = await getDocs(
    query(
      collection(db, CAMPAIGN_COLLECTION),
      where("enabled", "==", true),
    ),
  );

  return snapshot.docs.map(
    (document) =>
      mapReferralCampaignDocument(
        document.id,
        document.data(),
      ),
  );
}

export async function getReferralCampaign(
  id: string,
) {
  const snapshot = await getDoc(
    doc(
      db,
      CAMPAIGN_COLLECTION,
      id,
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapReferralCampaignDocument(
    snapshot.id,
    snapshot.data(),
  );
}

export async function createReferralCampaign(
  data: ReferralCampaignFormData,
) {
  return addDoc(
    collection(
      db,
      CAMPAIGN_COLLECTION,
    ),
    {
      ...data,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function updateReferralCampaign(
  id: string,
  data: Partial<ReferralCampaignFormData>,
) {
  return updateDoc(
    doc(
      db,
      CAMPAIGN_COLLECTION,
      id,
    ),
    {
      ...data,

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function createReferral(
  data: Omit<
    import("@/types/referral").ReferralDocument,
    | "id"
    | "createdAt"
    | "updatedAt"
  >,
) {
  return addDoc(
    collection(
      db,
      REFERRAL_COLLECTION,
    ),
    {
      ...data,

      createdAt:
        serverTimestamp(),

      updatedAt:
        serverTimestamp(),
    },
  );
}


export async function getReferrals() {
  const snapshot = await getDocs(
    query(
      collection(db, REFERRAL_COLLECTION),
      orderBy("createdAt", "desc"),
    ),
  );

  return snapshot.docs.map((document) =>
    mapReferralDocument(document.id, document.data()),
  );
}

export async function getReferralsForUser(userId: string) {
  const [referrerSnapshot, referredSnapshot] = await Promise.all([
    getDocs(query(collection(db, REFERRAL_COLLECTION), where("referrerUserId", "==", userId))),
    getDocs(query(collection(db, REFERRAL_COLLECTION), where("referredUserId", "==", userId))),
  ]);
  const unique = new Map<string, ReturnType<typeof mapReferralDocument>>();
  [...referrerSnapshot.docs, ...referredSnapshot.docs].forEach((document) => {
    unique.set(document.id, mapReferralDocument(document.id, document.data()));
  });
  return [...unique.values()].sort((a, b) => {
    const at = (a.createdAt as { toDate?: () => Date } | undefined)?.toDate?.()?.getTime() ?? 0;
    const bt = (b.createdAt as { toDate?: () => Date } | undefined)?.toDate?.()?.getTime() ?? 0;
    return bt - at;
  });
}

export async function getReferral(
  id: string,
) {
  const snapshot = await getDoc(
    doc(
      db,
      REFERRAL_COLLECTION,
      id,
    ),
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapReferralDocument(
    snapshot.id,
    snapshot.data(),
  );
}

export async function getReferralByCode(
  referralCode: string,
) {
  const snapshot = await getDocs(
    query(
      collection(
        db,
        REFERRAL_COLLECTION,
      ),
      where(
        "referralCode",
        "==",
        referralCode,
      ),
    ),
  );

  const document =
    snapshot.docs[0];

  if (!document) {
    return null;
  }

  return mapReferralDocument(
    document.id,
    document.data(),
  );
}

export async function updateReferralStatus(
  id: string,
  status: ReferralStatus,
  extra: Record<string, unknown> = {},
) {
  return updateDoc(
    doc(
      db,
      REFERRAL_COLLECTION,
      id,
    ),
    {
      status,

      ...extra,

      updatedAt:
        serverTimestamp(),
    },
  );
}

export async function deleteReferral(id: string) {
  return deleteDoc(doc(db, REFERRAL_COLLECTION, id));
}
