"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";

import { useForm } from "react-hook-form";

import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";

import { Eye, EyeOff } from "lucide-react";

import { toast } from "sonner";

import { registerUser } from "@/services/auth/register";

import { registerFormStyles as styles } from "./RegisterForm.styles";

const registerSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must contain at least 3 characters"),

    email: z
      .string()
      .email("Please enter a valid email address"),

    phone: z
      .string()
      .min(10, "Enter a valid phone number"),

    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "One uppercase letter required")
      .regex(/[a-z]/, "One lowercase letter required")
      .regex(/[0-9]/, "One number required")
      .regex(/[^A-Za-z0-9]/, "One special character required"),

    confirmPassword: z.string(),

    terms: z.boolean().refine((value) => value === true, {
      message: "You must accept the Terms & Conditions",
    }),

    referralCode: z.string().optional(),

    privacyConsent: z.boolean().refine((value) => value === true, {
      message: "Please choose your privacy preference to create the account.",
    }),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type RegisterFormData = z.infer<
  typeof registerSchema
>;

export default function RegisterForm() {
  const router = useRouter();
  const referralCode = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("ref") ?? "" : "";

  const [loading, setLoading] =
    useState(false);

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),

    defaultValues: {
      terms: false,
      privacyConsent: true,
      referralCode,
    },
  });

  const onSubmit = async (
    data: RegisterFormData
  ) => {
    try {
      setLoading(true);

      await registerUser({
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
        privacyConsent: data.privacyConsent,
        referralCode: data.referralCode?.trim() || referralCode,
      });

      toast.success(
        "Account created successfully. Please verify your email."
      );

      router.push("/verify-email");
    } catch (error: unknown) {
      console.error(error);
      const firebaseError =
        error as {
            code?: string;
        };

      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          toast.error(
            "Email is already registered."
          );
          break;

        case "auth/invalid-email":
          toast.error("Invalid email.");
          break;

        case "auth/weak-password":
          toast.error("Weak password.");
          break;

        default:
          toast.error(
            "Registration failed."
          );
      }
    } finally {
      setLoading(false);
    }
  };
    return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={styles.form}
    >
      {/* Full Name */}

      <div className={styles.field}>
        <label className={styles.label}>
          Full Name
        </label>

        <input
          type="text"
          placeholder="John Doe"
          className={styles.input}
          {...register("name")}
        />

        {errors.name && (
          <span className={styles.error}>
            {errors.name.message}
          </span>
        )}
      </div>

      {/* Email */}

      <div className={styles.field}>
        <label className={styles.label}>
          Email Address
        </label>

        <input
          type="email"
          placeholder="john@example.com"
          className={styles.input}
          {...register("email")}
        />

        {errors.email && (
          <span className={styles.error}>
            {errors.email.message}
          </span>
        )}
      </div>

      {/* Phone */}

      <div className={styles.field}>
        <label className={styles.label}>
          Phone Number
        </label>

        <input
          type="tel"
          placeholder="+91 9876543210"
          className={styles.input}
          {...register("phone")}
        />

        {errors.phone && (
          <span className={styles.error}>
            {errors.phone.message}
          </span>
        )}
      </div>

      {/* Referral Code */}

      <div className={styles.field}>
        <label className={styles.label}>Referral Code <span className="text-neutral-400">(Optional)</span></label>
        <input type="text" placeholder="Enter referral code if you were invited" className={styles.input} {...register("referralCode")} />
        {referralCode && <p className="text-xs text-neutral-500">Referral code from your invite link is already filled in.</p>}
      </div>

      {/* Password */}

      <div className={styles.field}>
        <label className={styles.label}>
          Password
        </label>

        <div className={styles.passwordWrapper}>
          <input
            type={
              showPassword
                ? "text"
                : "password"
            }
            placeholder="Create Password"
            className={styles.input}
            {...register("password")}
          />

          <button
            type="button"
            onClick={() =>
              setShowPassword(
                !showPassword
              )
            }
            className={styles.eyeButton}
          >
            {showPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.password && (
          <span className={styles.error}>
            {errors.password.message}
          </span>
        )}
      </div>

      {/* Confirm Password */}

      <div className={styles.field}>
        <label className={styles.label}>
          Confirm Password
        </label>

        <div className={styles.passwordWrapper}>
          <input
            type={
              showConfirmPassword
                ? "text"
                : "password"
            }
            placeholder="Confirm Password"
            className={styles.input}
            {...register(
              "confirmPassword"
            )}
          />

          <button
            type="button"
            onClick={() =>
              setShowConfirmPassword(
                !showConfirmPassword
              )
            }
            className={styles.eyeButton}
          >
            {showConfirmPassword ? (
              <EyeOff size={18} />
            ) : (
              <Eye size={18} />
            )}
          </button>
        </div>

        {errors.confirmPassword && (
          <span className={styles.error}>
            {
              errors.confirmPassword
                .message
            }
          </span>
        )}
      </div>

      {/* Terms */}

      <div className={styles.checkboxRow}>
        <input
          id="terms"
          type="checkbox"
          {...register("terms")}
        />

        <label htmlFor="terms">
          I agree to the Terms &
          Conditions and Privacy
          Policy.
        </label>
      </div>

      {errors.terms && (
        <span className={styles.error}>
          {errors.terms.message}
        </span>
      )}

      <div className={styles.checkboxRow}>
        <input id="privacyConsent" type="checkbox" {...register("privacyConsent")} />
        <label htmlFor="privacyConsent">
          I allow my basic profile information to be used for account and order communication.
        </label>
      </div>
      {errors.privacyConsent && <span className={styles.error}>{errors.privacyConsent.message}</span>}

      {(referralCode) && <div className="rounded-xl border border-[#C9A227]/30 bg-[#C9A227]/5 p-3 text-sm text-neutral-700">Referral code <strong>{referralCode.toUpperCase()}</strong> will be linked to this account after registration.</div>}

      {/* Submit */}

      <button
        type="submit"
        disabled={loading}
        className={styles.submitButton}
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>
    </form>
  );
}