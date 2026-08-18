import { NextResponse } from "next/server";
import { randomBytes, createHash } from "node:crypto";
import { adminAuth, adminDb } from "@/server/firebase/admin";
import { sendResendEmail } from "@/server/email/resend";

function hash(value: string) { return createHash("sha256").update(value).digest("hex"); }
function escapeHtml(value: string) { return value.replace(/[&<>'"]/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]!)); }

export async function POST(request: Request) {
  try {
    const body = await request.json() as { email?: string };
    const email = body.email?.trim().toLowerCase();
    if (!email) return NextResponse.json({ success:false, message:"Email address is required." }, { status:400 });

    // Avoid exposing whether an account exists.
    let resetLink: string;
    try {
      const origin = process.env.APP_URL || new URL(request.url).origin;
      resetLink = await adminAuth.generatePasswordResetLink(email, { url: `${origin}/reset-password`, handleCodeInApp: true });
    } catch {
      return NextResponse.json({ success:true, message:"If an account exists, a password reset email has been sent." });
    }

    const url = new URL(resetLink);
    const oobCode = url.searchParams.get("oobCode");
    if (!oobCode) throw new Error("Unable to create secure password reset session.");

    const token = randomBytes(32).toString("hex");
    await adminDb.collection("passwordResetSessions").doc(hash(token)).set({
      email,
      oobCode,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 30 * 60 * 1000),
    });

    const origin = process.env.APP_URL || new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?token=${token}`;
    const safeEmail = escapeHtml(email);
    const logoUrl = process.env.APP_PUBLIC_LOGO_URL || process.env.NEXT_PUBLIC_BRAND_LOGO_URL || (process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL ? `${process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL.replace(/\/$/, "")}/brand/logo-main` : "");
    const html = `<!doctype html><html><body style="margin:0;background:#f7f7f5;font-family:Arial,sans-serif;color:#171717"><div style="max-width:620px;margin:32px auto;background:#fff;border:1px solid #e7e7e7;border-radius:24px;overflow:hidden"><div style="padding:28px;text-align:center;border-bottom:1px solid #eee"><img src="${logoUrl}" width="72" height="72" style="border-radius:50%;object-fit:cover" alt="Artistic Soham Shinde"><h1 style="font-family:Georgia,serif;margin:16px 0 4px">Artistic Soham Shinde</h1><p style="margin:0;color:#C9A227;font-weight:700;letter-spacing:2px">TURNING MEMORIES INTO TIMELESS ART</p></div><div style="padding:36px"><p>Hello,</p><p>We received a request to reset the password for <strong>${safeEmail}</strong>.</p><p>This secure button opens the Artistic Soham password reset page. Your Firebase reset code is kept server-side and is not placed in the visible URL.</p><p style="text-align:center;margin:32px 0"><a href="${resetUrl}" style="display:inline-block;background:#C9A227;color:#111;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700">Reset My Password</a></p><p style="font-size:13px;color:#666">This link expires in 30 minutes and can be used once. If you did not request this, you can safely ignore this email.</p></div><div style="padding:20px 36px;background:#111;color:#aaa;font-size:12px;text-align:center">Artistic Soham Shinde · Premium Pencil Portraits</div></div></body></html>`;
    await sendResendEmail({ to: email, subject: "Reset your Artistic Soham password", html });
    return NextResponse.json({ success:true, message:"If an account exists, a password reset email has been sent." });
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json({ success:false, message:error instanceof Error ? error.message : "Unable to send reset email." }, { status:500 });
  }
}
