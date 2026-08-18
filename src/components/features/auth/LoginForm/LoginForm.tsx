"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

import { loginUser } from "@/services/auth/login";
import { logoutUser } from "@/services/auth/logout";
import { getUserProfile, updateLoginInfo } from "@/services/user";
import type { UserRole } from "@/types/user";

import { loginFormStyles as styles } from "./LoginForm.styles";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(8, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

function homeForRole(role: UserRole): string {
  switch (role) {
    case "ADMIN":
      return "/admin";
    case "ARTIST":
      return "/artist";
    default:
      return "/dashboard";
  }
}

function isAllowedRedirect(path: string, role: UserRole): boolean {
  if (!path.startsWith("/") || path.startsWith("//")) return false;
  if (path.startsWith("/admin")) return role === "ADMIN";
  if (path.startsWith("/artist")) return role === "ARTIST";
  if (path.startsWith("/dashboard/payment-accounts")) {
    return role === "ADMIN";
  }
  if (
    path.startsWith("/dashboard") ||
    path.startsWith("/orders") ||
    path.startsWith("/profile") ||
    path.startsWith("/settings") ||
    path.startsWith("/wishlist") ||
    path.startsWith("/payment") ||
    path.startsWith("/commission")
  ) {
    return role === "CUSTOMER";
  }
  return true;
}

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);

      const user = await loginUser(data);
      const profile = await getUserProfile(user.uid);
      const role = profile?.role as UserRole | undefined;

      if (!user.emailVerified) {
        toast.warning("Please verify your email before continuing.");
        router.replace("/verify-email");
        return;
      }

      if (!profile || !role) {
        await logoutUser();
        toast.error("Your account profile could not be loaded.");
        return;
      }

      if (!profile.isActive) {
        await logoutUser();
        toast.error("This account is currently inactive.");
        return;
      }

      const loginCount = (profile.loginCount ?? 0) + 1;
      const firstLogin = !profile.firstLoginCompleted;

      await updateLoginInfo(user.uid, {
        emailVerified: true,
        loginCount,
        firstLoginCompleted: true,
      });

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem("artistic-soham-welcome", firstLogin ? "first" : "back");
      }
      toast.success(
        firstLogin
          ? `🎉 Welcome to Artistic Soham Shinde, ${profile.name}!`
          : `👋 Welcome back, ${profile.name}!`,
      );

      const requestedRedirect = typeof window !== "undefined"
        ? new URLSearchParams(window.location.search).get("redirect")
        : null;
      const destination = requestedRedirect && isAllowedRedirect(requestedRedirect, role)
        ? requestedRedirect
        : homeForRole(role);

      router.replace(destination);
    } catch (error: unknown) {
      console.error(error);
      const firebaseError = error as { code?: string };

      switch (firebaseError.code) {
        case "auth/user-not-found":
          toast.error("User not found.");
          break;
        case "auth/wrong-password":
          toast.error("Incorrect password.");
          break;
        case "auth/invalid-credential":
          toast.error("Invalid email or password.");
          break;
        case "auth/too-many-requests":
          toast.error("Too many attempts. Try again later.");
          break;
        default:
          toast.error("Login failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Email Address</label>
        <input type="email" placeholder="john@example.com" className={styles.input} {...register("email")} />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <div className={styles.passwordHeader}>
          <label className={styles.label}>Password</label>
          <Link href="/forgot-password" className={styles.forgotPassword}>Forgot Password?</Link>
        </div>
        <div className={styles.passwordWrapper}>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter Password"
            className={styles.input}
            {...register("password")}
          />
          <button type="button" className={styles.eyeButton} onClick={() => setShowPassword((value) => !value)} aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        {errors.password && <span className={styles.error}>{errors.password.message}</span>}
      </div>

      <button type="submit" disabled={loading} className={styles.submitButton}>
        {loading ? "Signing In..." : "Sign In"}
      </button>

      <p className="pt-2 text-center text-sm text-neutral-600">
        New customer?
        {" "}
        <Link href="/register" className="font-semibold text-[#C9A227] hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
