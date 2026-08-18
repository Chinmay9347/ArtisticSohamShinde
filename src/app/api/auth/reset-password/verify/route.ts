import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { adminDb } from "@/server/firebase/admin";
export async function POST(request: Request) {
  try {
    const { token } = await request.json() as { token?: string };
    if (!token) return NextResponse.json({ valid:false, message:"Reset session is missing." }, { status:400 });
    const snap = await adminDb.collection("passwordResetSessions").doc(createHash("sha256").update(token).digest("hex")).get();
    if (!snap.exists) return NextResponse.json({ valid:false, message:"This reset link is invalid or expired." }, { status:400 });
    const data = snap.data()!;
    const expires = data.expiresAt?.toDate?.()?.getTime?.() ?? new Date(data.expiresAt).getTime();
    if (!expires || expires < Date.now()) { await snap.ref.delete(); return NextResponse.json({ valid:false, message:"This reset link is invalid or expired." }, { status:400 }); }
    return NextResponse.json({ valid:true, email:data.email });
  } catch (error) { return NextResponse.json({ valid:false, message:error instanceof Error?error.message:"Unable to verify reset link." }, { status:500 }); }
}
