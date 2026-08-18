"use client";

import { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { toast } from "sonner";

import { signOut, reload, } from "firebase/auth";

import { auth } from "@/firebase/auth";

import { resendVerificationEmail } from "@/services/auth/sendVerification";

import { AuthLayout } from "@/components/layout/auth";

import {
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { useAuth } from "@/context/AuthContext";

export default function VerifyEmailPage() {
  const router = useRouter();
  const { refreshUser } = useAuth();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      await refreshUser();
      const user = auth.currentUser;

      if (!user) return;
      if (user.emailVerified) {
        await updateDoc(
          doc(db, "users", user.uid),
          {
            emailVerified: true,

          // The first-login counter is updated by LoginForm after the first successful sign-in.
          lastLogin: new Date(),
          }
        );

        toast.success("Email verified successfully!");
        if (typeof window !== "undefined") window.sessionStorage.setItem("artistic-soham-welcome", "first");
        clearInterval(interval);
        router.replace("/");
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [refreshUser, router]);

  async function resend() {
    try {
      setLoading(true);

      await resendVerificationEmail();

      toast.success(
        "Verification email sent."
      );
    } catch {
      toast.error(
        "Unable to send verification email."
      );
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    await signOut(auth);

    router.replace("/");
  }

  return (
    <AuthLayout
      title="Verify Your Email"
      subtitle="Please verify your email address before continuing."
    >
      <div className="space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8">

        <p className="text-sm leading-7 text-white/70">
          We have sent a verification email to
          your registered email address.

          Please click the verification link in your email.

          This page will automatically continue once your email has been verified.
        </p>

        <button
          onClick={resend}
          disabled={loading}
          className="w-full rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black"
        >
          {loading
            ? "Sending..."
            : "Resend Verification Email"}
        </button>

        <button
          onClick={logout}
          className="w-full rounded-xl border border-white/10 px-5 py-3 text-white"
        >
          Logout
        </button>

      </div>
    </AuthLayout>
  );
}