import { NextResponse } from "next/server";
import { adminAuth } from "@/server/firebase/admin";
import { sendResendEmail } from "@/server/email/resend";

function escapeHtml(value: string) {
  return value.replace(/[&<>'"]/g, (c) => ({"&":"&amp;","<":"&lt;",">":"&gt;","'":"&#39;",'"':"&quot;"}[c]!));
}

export async function POST(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token, true);
    const user = await adminAuth.getUser(decoded.uid);
    if (user.emailVerified) return NextResponse.json({ success: true, message: "Email is already verified." });
    if (!user.email) return NextResponse.json({ success: false, message: "No email address is associated with this account." }, { status: 400 });

    const origin = process.env.APP_URL || new URL(request.url).origin;
    const firebaseLink = await adminAuth.generateEmailVerificationLink(user.email, {
      url: `${origin}/verify-email`,
      handleCodeInApp: true,
    });
    const safeName = escapeHtml(user.displayName || "there");
    const logoUrl = process.env.APP_PUBLIC_LOGO_URL || process.env.NEXT_PUBLIC_BRAND_LOGO_URL || (process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL ? `${process.env.NEXT_PUBLIC_CLOUDINARY_ASSET_BASE_URL.replace(/\/$/, "")}/brand/logo-main` : "");

    const html = `<!doctype html><html><body style="margin:0;background:#f7f7f5;font-family:Arial,sans-serif;color:#171717"><div style="max-width:620px;margin:32px auto;background:#fff;border:1px solid #e7e7e7;border-radius:24px;overflow:hidden"><div style="padding:28px;text-align:center;border-bottom:1px solid #eee"><img src="${logoUrl}" width="72" height="72" style="border-radius:50%;object-fit:cover" alt="Artistic Soham Shinde"><h1 style="font-family:Georgia,serif;margin:16px 0 4px">Artistic Soham Shinde</h1><p style="margin:0;color:#C9A227;font-weight:700;letter-spacing:2px">TURNING MEMORIES INTO TIMELESS ART</p></div><div style="padding:36px"><p>Hello ${safeName},</p><p>Welcome to <strong>Artistic Soham Shinde</strong>. Please verify your email address to activate your customer account.</p><p style="text-align:center;margin:32px 0"><a href="${firebaseLink}" style="display:inline-block;background:#C9A227;color:#111;text-decoration:none;padding:14px 28px;border-radius:12px;font-weight:700">Verify My Email</a></p><p style="font-size:13px;color:#666">If you did not create this account, you can safely ignore this email.</p></div><div style="padding:20px 36px;background:#111;color:#aaa;font-size:12px;text-align:center">Artistic Soham Shinde · Premium Pencil Portraits</div></div></body></html>`;
    await sendResendEmail({ to: user.email, subject: "Verify your Artistic Soham email", html });
    return NextResponse.json({ success: true, message: "Verification email sent." });
  } catch (error) {
    console.error("Verification email API error:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to send verification email." }, { status: 500 });
  }
}
