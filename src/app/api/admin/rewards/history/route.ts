import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";

function asMillis(value: unknown) {
  const v = value as any;
  const date = v?.toDate?.();
  if (date instanceof Date) return date.getTime();
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
  if (typeof value === "string") return new Date(value).getTime() || 0;
  if (typeof v?._seconds === "number") return v._seconds * 1000;
  if (typeof v?.seconds === "number") return Number(v.seconds) * 1000;
  return 0;
}

export async function GET(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token, true);
    const adminSnapshot = await adminDb.collection("users").doc(decoded.uid).get();
    if (adminSnapshot.data()?.role !== "ADMIN") return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });

    const uid = String(new URL(request.url).searchParams.get("uid") ?? "").trim();
    if (!uid) return NextResponse.json({ success: false, message: "User UID is required." }, { status: 400 });

    const [userSnapshot, historySnapshot] = await Promise.all([
      adminDb.collection("users").doc(uid).get(),
      adminDb.collection("rewardTransactions").where("uid", "==", uid).get(),
    ]);

    if (!userSnapshot.exists) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    const userData = userSnapshot.data() ?? {};
    const transactions = historySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .sort((a: any, b: any) => asMillis(b.createdAt) - asMillis(a.createdAt))
      .slice(0, 500);

    return NextResponse.json({
      success: true,
      user: { uid, name: String(userData.name ?? ""), email: String(userData.email ?? ""), role: String(userData.role ?? "CUSTOMER"), wallet: Number(userData.referralRewardCoins ?? 0) },
      transactions,
    });
  } catch (error) {
    console.error("Admin reward history error:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to load reward history." }, { status: 400 });
  }
}
