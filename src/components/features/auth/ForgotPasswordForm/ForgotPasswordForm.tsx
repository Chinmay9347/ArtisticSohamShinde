"use client";

import Link from "next/link";
import { useState } from "react";

import { forgotPassword } from "@/services/auth/forgotPassword";

import { styles } from "./ForgotPasswordForm.styles";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setSuccess("");
    setError("");

    try {
      setLoading(true);

      await forgotPassword({
        email,
      });

      setSuccess(
        "Password reset email sent successfully. Please check your inbox and spam folder."
      );
    } catch (err: unknown) {
        const message =
            err instanceof Error
                ? err.message
                : "Unable to send reset email.";

        setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={styles.form}
    >
      {success && (
        <div className={styles.success}>
          {success}
        </div>
      )}

      {error && (
        <div className={styles.error}>
          {error}
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label}>
          Email Address
        </label>

        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          className={styles.input}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={styles.button}
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}
      </button>

      <div className={styles.footer}>
        Remember your password?{" "}
        <Link
          href="/login"
          className={styles.link}
        >
          Login
        </Link>
      </div>
    </form>
  );
}