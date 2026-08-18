import {
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

import {
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";

import { auth } from "@/firebase/auth";
import { db } from "@/firebase/firestore";

interface RegisterUserData {
  name: string;
  email: string;
  phone: string;
  password: string;
  privacyConsent: boolean;
  referralCode?: string;
}

export async function registerUser({
  name,
  email,
  phone,
  password,
  privacyConsent,
  referralCode,
}: RegisterUserData) {
  const credential =
    await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

  const user = credential.user;

  await updateProfile(user, {
    displayName: name,
  });

  try { const idToken=await user.getIdToken(); await fetch("/api/auth/send-verification",{method:"POST",headers:{Authorization:`Bearer ${idToken}`}}); } catch(error) { console.warn("Branded verification email could not be sent immediately:",error); }

  await setDoc(doc(db, "users", user.uid), {
    // Identity
    uid: user.uid,
    name,
    email,
    phone,

    // Role
    role: "CUSTOMER",

    // Profile
    avatar: "",
    bio: "",

    // Account
    emailVerified: false,
    firstLoginCompleted: false,
    profileCompleted: false,
    onboardingCompleted: false,
    isActive: true,

    // Statistics
    totalOrders: 0,
    completedOrders: 0,
    cancelledOrders: 0,
    totalSpent: 0,
    loyaltyPoints: 0,
    referralRewardCoins: 0,
    referralRewardCoinsSpent: 0,
    referralRewardsEarned: 0,

    // Preferences
    preferredContact: "EMAIL",
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
    },
    privacy: { profileVisible: privacyConsent },

    // Timestamps
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastLogin: serverTimestamp(),
  });

  if (referralCode?.trim()) {
    try {
      const idToken = await user.getIdToken();
      await fetch("/api/referrals/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
        body: JSON.stringify({ referralCode: referralCode.trim() }),
      });
    } catch (error) {
      console.error("Referral claim failed during registration:", error);
    }
  }


  // Give every newly registered customer a referral code when a campaign is active.
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/referrals/ensure", { method:"POST", headers:{ Authorization:`Bearer ${idToken}` } });
  } catch (error) { console.warn("Referral code setup skipped:", error); }

  // New customers receive all currently published, non-expired offers.
  try {
    const idToken = await user.getIdToken();
    await fetch("/api/promotions/sync-user", { method:"POST", headers:{ Authorization:`Bearer ${idToken}` } });
  } catch (error) { console.warn("Offer notification setup skipped:", error); }

  return user;
}