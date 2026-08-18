import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/server/firebase/admin";

type TransferType = "C2C" | "ARTIST2C";

export async function POST(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return NextResponse.json({ message: "Authentication required." }, { status: 401 });

    const decoded = await adminAuth.verifyIdToken(token, true);
    const body = await request.json() as { recipient?: string; amount?: number; type?: TransferType };
    const amount = Math.floor(Number(body.amount ?? 0));
    const type: TransferType = body.type === "ARTIST2C" ? "ARTIST2C" : "C2C";
    if (amount <= 0) return NextResponse.json({ message: "Amount must be greater than zero." }, { status: 400 });

    const senderRef = adminDb.collection("users").doc(decoded.uid);
    const senderSnapshot = await senderRef.get();
    if (!senderSnapshot.exists) return NextResponse.json({ message: "Sender account not found." }, { status: 404 });
    const senderData = senderSnapshot.data() ?? {};

    if (type === "C2C" && senderData.role !== "CUSTOMER") {
      return NextResponse.json({ message: "Transfer to Friend transfer is only available to customer accounts." }, { status: 403 });
    }
    if (type === "ARTIST2C" && senderData.role !== "ARTIST") {
      return NextResponse.json({ message: "Artist → Customer transfer is only available to artist accounts." }, { status: 403 });
    }

    const email = String(body.recipient ?? "").trim().toLowerCase();
    if (!email) return NextResponse.json({ message: "Recipient email is required." }, { status: 400 });
    const recipientQuery = await adminDb.collection("users").where("email", "==", email).limit(1).get();
    if (recipientQuery.empty) return NextResponse.json({ message: "Recipient account not found." }, { status: 404 });

    const recipientRef = recipientQuery.docs[0].ref;
    if (recipientRef.id === senderRef.id) return NextResponse.json({ message: "You cannot transfer rewards to yourself." }, { status: 400 });
    const recipientData = recipientQuery.docs[0].data() ?? {};
    if (recipientData.role !== "CUSTOMER") return NextResponse.json({ message: "Rewards can only be transferred to a customer account." }, { status: 400 });

    const transferId = `${decoded.uid}_${recipientRef.id}_${Date.now()}`;
    await adminDb.runTransaction(async (tx) => {
      const sender = await tx.get(senderRef);
      const recipient = await tx.get(recipientRef);
      const senderBalance = Math.max(0, Number(sender.data()?.referralRewardCoins ?? 0));
      if (senderBalance < amount) throw new Error(`Insufficient wallet balance. Available: ${senderBalance}.`);
      const recipientBalance = Math.max(0, Number(recipient.data()?.referralRewardCoins ?? 0));
      const senderAfter = senderBalance - amount;
      const recipientAfter = recipientBalance + amount;

      tx.update(senderRef, {
        referralRewardCoins: senderAfter,
        referralRewardCoinsSpent: Number(sender.data()?.referralRewardCoinsSpent ?? 0) + amount,
        updatedAt: new Date(),
      });
      tx.update(recipientRef, {
        referralRewardCoins: recipientAfter,
        updatedAt: new Date(),
        lastRewardTransfer: { type, amount, fromUid: decoded.uid, createdAt: new Date() },
      });

      tx.set(adminDb.collection("rewardTransactions").doc(`${transferId}_out`), {
        uid: decoded.uid,
        type: "DEBIT",
        source: "TRANSFER_OUT",
        transferType: type,
        amount,
        balanceAfter: senderAfter,
        toUid: recipientRef.id,
        createdAt: new Date(),
      });
      tx.set(adminDb.collection("rewardTransactions").doc(`${transferId}_in`), {
        uid: recipientRef.id,
        type: "CREDIT",
        source: "TRANSFER_IN",
        transferType: type,
        amount,
        balanceAfter: recipientAfter,
        fromUid: decoded.uid,
        createdAt: new Date(),
      });
    });

    return NextResponse.json({ success: true, amount, type });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to transfer rewards." }, { status: 400 });
  }
}
