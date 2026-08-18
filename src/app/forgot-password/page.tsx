import ForgotPasswordForm from "@/components/features/auth/ForgotPasswordForm";
import { AuthLayout } from "@/components/layout/auth";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address to receive a password reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}