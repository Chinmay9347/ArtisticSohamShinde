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
  return 0;
}

export async function GET(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) {
      return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    }

    const decoded = await adminAuth.verifyIdToken(token, true);
    const snapshot = await adminDb
      .collection("rewardTransactions")
      .where("uid", "==", decoded.uid)
      .get();

    const rows = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .sort((a: any, b: any) => asMillis(b.createdAt) - asMillis(a.createdAt))
      .slice(0, 100);

    return NextResponse.json({ success: true, transactions: rows });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Unable to load reward history.",
      },
      { status: 400 },
    );
  }
}
