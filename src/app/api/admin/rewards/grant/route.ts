import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/server/firebase/admin";

export async function POST(request: Request) {
  try {
    const h = request.headers.get("authorization") ?? "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : "";
    if (!token) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token, true);
    const adminSnapshot = await adminDb.collection("users").doc(decoded.uid).get();
    if (adminSnapshot.data()?.role !== "ADMIN") {
      return NextResponse.json({ message: "Admin access required." }, { status: 403 });
    }

    const body = await request.json() as { uid?: string; amount?: number; note?: string };
    const amount = Math.floor(Number(body.amount ?? 0));
    if (!body.uid || amount <= 0) {
      return NextResponse.json({ message: "User and positive amount required." }, { status: 400 });
    }

    const ref = adminDb.collection("users").doc(body.uid);
    const snap = await ref.get();
    if (!snap.exists) return NextResponse.json({ message: "User not found." }, { status: 404 });

    const oldBalance = Math.max(0, Number(snap.data()?.referralRewardCoins ?? 0));
    const balance = oldBalance + amount;
    const historyRef = adminDb.collection("rewardTransactions").doc();

    const batch = adminDb.batch();
    batch.update(ref, {
      referralRewardCoins: FieldValue.increment(amount),
      updatedAt: new Date(),
      lastAdminRewardGrant: {
        amount,
        note: String(body.note ?? ""),
        adminUid: decoded.uid,
        createdAt: new Date(),
      },
    });
    batch.set(historyRef, {
      uid: body.uid,
      type: "CREDIT",
      source: "ADMIN_GRANT",
      amount,
      balanceAfter: balance,
      adminUid: decoded.uid,
      note: String(body.note ?? ""),
      createdAt: new Date(),
    });

    await batch.commit();
    return NextResponse.json({ success: true, balance });
  } catch (e) {
    return NextResponse.json({
      success: false,
      message: e instanceof Error ? e.message : "Unable to grant rewards.",
    }, { status: 400 });
  }
}
