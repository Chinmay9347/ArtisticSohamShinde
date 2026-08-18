"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { useAuth } from "@/context/AuthContext";
import { getUserProfile } from "@/services/user";

import type { UserProfile } from "@/types/user";

interface UseUserProfileResult {
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  refreshProfile: () => Promise<void>;
}

export function useUserProfile(): UseUserProfileResult {
  const { user, loading: authLoading } = useAuth();

  const [profile, setProfile] =
    useState<UserProfile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const refreshProfile =
    useCallback(async () => {
      /*
       * Firebase is still restoring the authentication
       * session. Do not treat this as signed out.
       */
      if (authLoading) {
        return;
      }

      /*
       * Firebase has finished restoring the session and
       * confirmed that there is no authenticated user.
       */
      if (!user) {
        setProfile(null);
        setError(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const data = await getUserProfile(user.uid);

        /*
         * No Firestore profile exists for this Firebase UID.
         * This is different from a Firestore permission error.
         */
        if (!data) {
          setProfile(null);
          setError("USER_PROFILE_NOT_FOUND");
          return;
        }

        setProfile({
          uid: user.uid,

          name: data.name ?? "",
          email: data.email ?? "",
          phone: data.phone ?? "",

          role: data.role as UserProfile["role"],

          avatar: data.avatar ?? "",
          bio: data.bio ?? "",

          emailVerified:
            data.emailVerified ?? false,

          firstLoginCompleted:
            data.firstLoginCompleted ?? false,

          profileCompleted:
            data.profileCompleted ?? false,

          onboardingCompleted:
            data.onboardingCompleted ?? false,

          isActive:
            data.isActive ?? false,

          totalOrders:
            data.totalOrders ?? 0,

          completedOrders:
            data.completedOrders ?? 0,

          cancelledOrders:
            data.cancelledOrders ?? 0,

          totalSaved:
            data.totalSaved ?? 0,

          loyaltyPoints:
            data.loyaltyPoints ?? 0,

          referralRewardCoins:
            Number(data.referralRewardCoins ?? 0),

          referralRewardCoinsSpent:
            data.referralRewardCoinsSpent ?? 0,

          referralRewardsEarned:
            data.referralRewardsEarned ?? 0,

          preferredContact:
            data.preferredContact ?? "EMAIL",

          notifications:
            data.notifications ?? {
              email: true,
              sms: false,
              whatsapp: true,
            },

          createdAt:
            data.createdAt ?? null,

          updatedAt:
            data.updatedAt ?? null,

          lastLogin:
            data.lastLogin ?? null,
        });

        setError(null);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error,
        );

        /*
         * CRITICAL:
         *
         * A Firestore error must NOT be converted into:
         *
         * profile = null + loading = false
         *
         * because RoleGuard could interpret that as an
         * inactive account and log the user out.
         */
        setError(
          error instanceof Error
            ? error.message
            : "Unable to load user profile.",
        );
      } finally {
        setLoading(false);
      }
    }, [user, authLoading]);

  useEffect(() => {
    void refreshProfile();
  }, [refreshProfile]);

  return {
    profile,
    loading: authLoading || loading,
    error,
    refreshProfile,
  };
}

// "use client";

// import { useCallback, useEffect, useState } from "react";

// import { useAuth } from "@/context/AuthContext";
// import { getUserProfile } from "@/services/user";

// import type { UserProfile } from "@/types/user";

// export function useUserProfile() {
//   const { user } = useAuth();

//   const [profile, setProfile] =
//     useState<UserProfile | null>(null);

//   const [loading, setLoading] =
//     useState(true);

//   const refreshProfile =
//     useCallback(async () => {
//       if (!user) {
//         setProfile(null);
//         setLoading(false);
//         return;
//       }

//       try {
//         const data = await getUserProfile(
//           user.uid
//         );

//         if (!data) {
//           setProfile(null);
//           return;
//         }

//         setProfile({
//           uid: user.uid,

//           name: data.name ?? "",
//           email: data.email ?? "",
//           phone: data.phone ?? "",

//           role: data.role as UserProfile["role"],

//           avatar: data?.avatar ?? "",

//           bio: data?.bio ?? "",

//           emailVerified:
//             data?.emailVerified ?? false,

//           firstLoginCompleted:
//             data?.firstLoginCompleted ?? false,

//           profileCompleted:
//             data?.profileCompleted ?? false,

//           onboardingCompleted:
//             data?.onboardingCompleted ?? false,

//           isActive:
//             data?.isActive ?? false,

//           totalOrders:
//             data?.totalOrders ?? 0,

//           completedOrders:
//             data?.completedOrders ?? 0,

//           cancelledOrders:
//             data?.cancelledOrders ?? 0,

//           totalSaved:
//             data?.totalSaved ?? 0,

//           loyaltyPoints:
//             data?.loyaltyPoints ?? 0,

//           preferredContact:
//             data?.preferredContact ?? "EMAIL",

//           notifications:
//             data?.notifications ?? {
//               email: true,
//               sms: false,
//               whatsapp: true,
//             },

//           createdAt:
//             data?.createdAt ?? null,

//           updatedAt:
//             data?.updatedAt ?? null,

//           lastLogin:
//             data?.lastLogin ?? null,
//         });
//       } finally {
//         setLoading(false);
//       }
//     }, [user]);

// useEffect(() => {
//   let mounted = true;

//   async function loadProfile() {
//     if (!mounted) return;

//     await refreshProfile();
//   }

//   loadProfile();

//   return () => {
//     mounted = false;
//   };
// }, [refreshProfile]);

//   return {
//     profile,
//     loading,
//     refreshProfile,
//   };
// }