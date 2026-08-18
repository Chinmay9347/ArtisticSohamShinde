import { auth } from "@/firebase/auth";

export async function resendVerificationEmail() {
  const user = auth.currentUser;
  if (!user) throw new Error("No authenticated user.");

  const token = await user.getIdToken();
  const response = await fetch("/api/auth/send-verification", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message ?? "Unable to send verification email.");
}
