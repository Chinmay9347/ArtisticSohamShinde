"use client";

import {
  useEffect,
  type ReactNode,
} from "react";

import {
  usePathname,
  useRouter,
} from "next/navigation";

import { useAuth } from "@/context/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";

import type { UserRole } from "@/types/user";

interface RoleGuardProps {
  allowedRoles: UserRole[];
  children: ReactNode;
}

export function RoleGuard({
  allowedRoles,
  children,
}: RoleGuardProps) {
  const router = useRouter();
  const pathname = usePathname();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    profile,
    loading: profileLoading,
    error: profileError,
  } = useUserProfile();

  /*
   * Authentication and profile loading must finish before
   * making an access decision.
   */
  useEffect(() => {
    if (authLoading || profileLoading) {
      return;
    }

    /*
     * No Firebase user after Auth has finished restoring.
     */
    if (!user) {
      router.replace(
        `/login?redirect=${encodeURIComponent(pathname)}`,
      );
      return;
    }

    /*
     * Email verification is an authentication requirement,
     * not a Firestore profile requirement.
     */
    if (!user.emailVerified) {
      router.replace("/verify-email");
      return;
    }

    /*
     * IMPORTANT:
     *
     * Never logout because profile loading failed.
     *
     * The user is authenticated, but we don't yet have
     * enough information to make an authorization decision.
     */
    if (profileError) {
      return;
    }

    /*
     * No profile document exists.
     *
     * This is an authorization problem, but it is NOT a
     * reason to call logoutUser().
     */
    if (!profile) {
      return;
    }

    /*
     * Profile exists and explicitly says the account is
     * inactive.
     */
    if (!profile.isActive) {
      router.replace("/login");
      return;
    }

    /*
     * Authenticated + active user, but wrong role.
     */
    if (
      !profile.role ||
      !allowedRoles.includes(profile.role)
    ) {
      if (profile.role === "ADMIN") {
        router.replace("/admin");
      } else if (profile.role === "ARTIST") {
        router.replace("/artist");
      } else {
        router.replace("/dashboard");
      }
    }
  }, [
    allowedRoles,
    authLoading,
    profileLoading,
    profileError,
    user,
    profile,
    pathname,
    router,
  ]);

  /*
   * Firebase Auth is restoring the session.
   */
  if (authLoading || profileLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="rounded-2xl border bg-white px-6 py-5 text-sm text-neutral-600 shadow-sm">
          Checking account access...
        </div>
      </div>
    );
  }

  /*
   * Authenticated user but profile request failed.
   *
   * Do NOT logout.
   */
  if (profileError) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-6">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <h2 className="text-lg font-semibold text-red-900">
            Unable to verify account access
          </h2>

          <p className="mt-2 text-sm text-red-700">
            Your login session is still active, but your
            account profile could not be loaded.
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  /*
   * Authenticated but no profile.
   */
  if (!user || !profile) {
    return null;
  }

  /*
   * Email verification redirect is handled above.
   */
  if (!user.emailVerified) {
    return null;
  }

  /*
   * Account explicitly inactive.
   */
  if (!profile.isActive) {
    return null;
  }

  /*
   * Wrong role.
   */
  if (
    !profile.role ||
    !allowedRoles.includes(profile.role)
  ) {
    return null;
  }

  return <>{children}</>;
}

// "use client";

// import {
//   useEffect,
//   type ReactNode,
// } from "react";

// import {
//   usePathname,
//   useRouter,
// } from "next/navigation";

// import { useAuth } from "@/context/AuthContext";
// import { useUserProfile } from "@/hooks/useUserProfile";

// import type { UserRole } from "@/types/user";

// interface RoleGuardProps {
//   allowedRoles: UserRole[];
//   children: ReactNode;
// }

// export function RoleGuard({
//   allowedRoles,
//   children,
// }: RoleGuardProps) {
//   const router = useRouter();
//   const pathname = usePathname();

//   const {
//     user,
//     loading: authLoading,
//   } = useAuth();

//   const {
//     profile,
//     loading: profileLoading,
//     error: profileError,
//   } = useUserProfile();

//   /*
//    * Authentication and profile loading must finish before
//    * making an access decision.
//    */
//   useEffect(() => {
//     if (authLoading || profileLoading) {
//       return;
//     }

//     /*
//      * No Firebase user after Auth has finished restoring.
//      */
//     if (!user) {
//       router.replace(
//         `/login?redirect=${encodeURIComponent(pathname)}`,
//       );
//       return;
//     }

//     /*
//      * Email verification is an authentication requirement,
//      * not a Firestore profile requirement.
//      */
//     if (!user.emailVerified) {
//       router.replace("/verify-email");
//       return;
//     }

//     /*
//      * IMPORTANT:
//      *
//      * Never logout because profile loading failed.
//      *
//      * The user is authenticated, but we don't yet have
//      * enough information to make an authorization decision.
//      */
//     if (profileError) {
//       return;
//     }

//     /*
//      * No profile document exists.
//      *
//      * This is an authorization problem, but it is NOT a
//      * reason to call logoutUser().
//      */
//     if (!profile) {
//       return;
//     }

//     /*
//      * Profile exists and explicitly says the account is
//      * inactive.
//      */
//     if (!profile.isActive) {
//       router.replace("/login");
//       return;
//     }

//     /*
//      * Authenticated + active user, but wrong role.
//      */
//     if (
//       !profile.role ||
//       !allowedRoles.includes(profile.role)
//     ) {
//       if (profile.role === "ADMIN") {
//         router.replace("/admin");
//       } else if (profile.role === "ARTIST") {
//         router.replace("/artist");
//       } else {
//         router.replace("/dashboard");
//       }
//     }
//   }, [
//     allowedRoles,
//     authLoading,
//     profileLoading,
//     profileError,
//     user,
//     profile,
//     pathname,
//     router,
//   ]);

//   /*
//    * Firebase Auth is restoring the session.
//    */
//   if (authLoading || profileLoading) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center">
//         <div className="rounded-2xl border bg-white px-6 py-5 text-sm text-neutral-600 shadow-sm">
//           Checking account access...
//         </div>
//       </div>
//     );
//   }

//   /*
//    * Authenticated user but profile request failed.
//    *
//    * Do NOT logout.
//    */
//   if (profileError) {
//     return (
//       <div className="flex min-h-[50vh] items-center justify-center px-6">
//         <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
//           <h2 className="text-lg font-semibold text-red-900">
//             Unable to verify account access
//           </h2>

//           <p className="mt-2 text-sm text-red-700">
//             Your login session is still active, but your
//             account profile could not be loaded.
//           </p>

//           <button
//             type="button"
//             onClick={() => window.location.reload()}
//             className="mt-5 rounded-xl bg-black px-5 py-3 text-sm font-medium text-white"
//           >
//             Try Again
//           </button>
//         </div>
//       </div>
//     );
//   }

//   /*
//    * Authenticated but no profile.
//    */
//   if (!user || !profile) {
//     return null;
//   }

//   /*
//    * Email verification redirect is handled above.
//    */
//   if (!user.emailVerified) {
//     return null;
//   }

//   /*
//    * Account explicitly inactive.
//    */
//   if (!profile.isActive) {
//     return null;
//   }

//   /*
//    * Wrong role.
//    */
//   if (
//     !profile.role ||
//     !allowedRoles.includes(profile.role)
//   ) {
//     return null;
//   }

//   return <>{children}</>;
// }