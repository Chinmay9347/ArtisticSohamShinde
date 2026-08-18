export interface ForgotPasswordData { email: string; }
export async function forgotPassword({ email }: ForgotPasswordData): Promise<void> {
  const response = await fetch("/api/auth/forgot-password", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ email:email.trim() }) });
  const result = await response.json() as { success?:boolean; message?:string };
  if (!response.ok || result.success === false) throw new Error(result.message ?? "Unable to send password reset email.");
}
