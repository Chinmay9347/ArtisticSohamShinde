import { AuthLayout } from "@/components/layout/auth";
import { LoginForm } from "@/components/features/auth/LoginForm";

export default function LoginPage() {
  return (
    <AuthLayout title="Welcome to Artistic Soham Shinde" subtitle="Sign in to access your Artistic Soham account.">
      <LoginForm />
    </AuthLayout>
  );
}
