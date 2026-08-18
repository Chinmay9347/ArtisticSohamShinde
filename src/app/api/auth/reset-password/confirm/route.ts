import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { adminDb } from "@/server/firebase/admin";
export async function POST(request: Request) {
  try {
    const { token, password } = await request.json() as { token?: string; password?: string };
    if (!token || !password || password.length < 8) return NextResponse.json({ success:false, message:"Use a password of at least 8 characters." }, { status:400 });
    const ref = adminDb.collection("passwordResetSessions").doc(createHash("sha256").update(token).digest("hex"));
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ success:false, message:"This reset link is invalid or expired." }, { status:400 });
    const data = snap.data()!;
    const expires = data.expiresAt?.toDate?.()?.getTime?.() ?? new Date(data.expiresAt).getTime();
    if (!expires || expires < Date.now()) { await ref.delete(); return NextResponse.json({ success:false, message:"This reset link is invalid or expired." }, { status:400 }); }
    const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
    if (!apiKey) throw new Error("Firebase Web API key is not configured.");
    const response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:resetPassword?key=${encodeURIComponent(apiKey)}`, { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({ oobCode:data.oobCode, newPassword:password }) });
    const result = await response.json() as { error?: { message?: string }; email?: string };
    if (!response.ok) {
      const code = result.error?.message ?? "PASSWORD_RESET_FAILED";
      throw new Error(code === "EXPIRED_OOB_CODE" || code === "INVALID_OOB_CODE" ? "This reset link is invalid or expired." : "Unable to reset password.");
    }
    await ref.delete();
    return NextResponse.json({ success:true, email:result.email ?? data.email });
  } catch (error) { console.error("Reset password confirmation error:", error); return NextResponse.json({ success:false, message:error instanceof Error?error.message:"Unable to reset password." }, { status:500 }); }
}
