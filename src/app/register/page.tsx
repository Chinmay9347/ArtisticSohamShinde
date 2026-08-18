import { AuthLayout } from "@/components/layout/auth";
import { RegisterForm } from "@/components/features/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Create Your Account"
      subtitle="Create a customer account to save portraits, place commissions and track orders."
    >
      <RegisterForm />
    </AuthLayout>
  );
}
