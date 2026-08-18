import {
  collection,
  doc,
  getDoc,
  getDocsFromServer,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";

import { ProfileFormData } from "@/components/features/profile/ProfileForm";

import { db } from "@/firebase/firestore";
import type { UserRole } from "@/types/user";

export async function getUserProfile(
  uid: string
) {
  const ref = doc(db, "users", uid);

  const snapshot = await getDoc(ref);

  return snapshot.data();
}

export async function updateLoginInfo(
  uid: string,
  data: Record<string, unknown>
) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    ...data,

    updatedAt: serverTimestamp(),

    lastLogin: serverTimestamp(),
  });
}

export async function updateUserProfile(
  uid: string,
  data: ProfileFormData
) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    name: data.name,
    phone: data.phone,
    bio: data.bio,
    preferredContact: data.preferredContact,

    updatedAt: serverTimestamp(),
  });
}

export async function updateAvatar(
  uid: string,
  avatar: string
) {
  const ref = doc(db, "users", uid);

  await updateDoc(ref, {
    avatar,
    profileCompleted: true,
    updatedAt: serverTimestamp(),
  });
}
// export async function updateAvatar(
//   uid: string,
//   avatar: string
// ) {
//   const ref = doc(db, "users", uid);

//   await updateDoc(ref, {
//     avatar,
//     updatedAt: serverTimestamp(),
//   });
// }

export function calculateProfileCompletion(
  profile: Record<string, unknown>
) {
  const fields = [
    profile.name,
    profile.phone,
    profile.bio,
    profile.avatar,
    profile.preferredContact,
  ];

  const completed = fields.filter(Boolean).length;

  return Math.round(
    (completed / fields.length) * 100
  );
}

export async function getAllUsers() {
  const snapshot = await getDocsFromServer(
    collection(db, "users"),
  );

  return snapshot.docs.map((userDoc) => {
    const data = userDoc.data();

    return {
      uid: userDoc.id,
      ...data,
      referralRewardCoins: Number(data.referralRewardCoins ?? 0),
      referralRewardCoinsSpent: Number(
        data.referralRewardCoinsSpent ?? 0,
      ),
      referralRewardsEarned: Number(
        data.referralRewardsEarned ?? 0,
      ),
    };
  });
}

export async function updateUserRole(
  uid: string,
  role: UserRole,
) {
  await updateDoc(doc(db, "users", uid), {
    role,
    updatedAt: serverTimestamp(),
  });
}
