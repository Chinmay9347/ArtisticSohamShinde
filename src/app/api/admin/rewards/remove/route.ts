import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/server/firebase/admin";

export async function POST(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token, true);
    const adminSnapshot = await adminDb.collection("users").doc(decoded.uid).get();
    if (adminSnapshot.data()?.role !== "ADMIN") return NextResponse.json({ success: false, message: "Admin access required." }, { status: 403 });

    const body = (await request.json()) as { uid?: string; amount?: number; note?: string };
    const uid = String(body.uid ?? "").trim();
    const amount = Math.floor(Number(body.amount ?? 0));
    const note = String(body.note ?? "").trim();

    if (!uid || amount <= 0) return NextResponse.json({ success: false, message: "User and positive reward amount are required." }, { status: 400 });
    if (uid === decoded.uid) return NextResponse.json({ success: false, message: "Admin reward removal cannot target the currently signed-in admin account." }, { status: 400 });

    const userRef = adminDb.collection("users").doc(uid);
    const userSnapshot = await userRef.get();
    if (!userSnapshot.exists) return NextResponse.json({ success: false, message: "User not found." }, { status: 404 });

    const currentBalance = Math.max(0, Number(userSnapshot.data()?.referralRewardCoins ?? 0));
    if (amount > currentBalance) return NextResponse.json({ success: false, message: `Cannot remove ${amount} coins. This account has only ${currentBalance} coin(s).`, balance: currentBalance }, { status: 400 });

    const newBalance = currentBalance - amount;
    const historyRef = adminDb.collection("rewardTransactions").doc();
    const batch = adminDb.batch();

    batch.update(userRef, {
      referralRewardCoins: FieldValue.increment(-amount),
      updatedAt: FieldValue.serverTimestamp(),
      lastAdminRewardRemoval: { amount, note, adminUid: decoded.uid, createdAt: FieldValue.serverTimestamp() },
    });

    batch.set(historyRef, {
      uid,
      type: "DEBIT",
      source: "ADMIN_REMOVE",
      amount,
      balanceAfter: newBalance,
      adminUid: decoded.uid,
      note: note || "Reward coins removed by admin.",
      createdAt: FieldValue.serverTimestamp(),
    });

    await batch.commit();
    return NextResponse.json({ success: true, balance: newBalance, removed: amount });
  } catch (error) {
    console.error("Admin reward removal error:", error);
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to remove reward coins." }, { status: 400 });
  }
}
