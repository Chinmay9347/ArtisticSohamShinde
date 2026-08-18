import { NextResponse } from "next/server";
import { FieldValue } from "firebase-admin/firestore";
import { adminAuth, adminDb } from "@/server/firebase/admin";
import { ORDER_STATUS } from "@/constants/order-status";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const header = request.headers.get("authorization") ?? "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";
    if (!token) return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
    const decoded = await adminAuth.verifyIdToken(token, true);
    const body = await request.json() as { orderId?: string; reason?: string };
    const orderId = String(body.orderId ?? "").trim();
    if (!orderId) return NextResponse.json({ success: false, message: "Order ID is required." }, { status: 400 });

    const orderRef = adminDb.collection("orders").doc(orderId);
    const userRef = adminDb.collection("users").doc(decoded.uid);

    const result = await adminDb.runTransaction(async (tx) => {
      const orderSnap = await tx.get(orderRef);
      const userSnap = await tx.get(userRef);
      if (!orderSnap.exists) throw new Error("Order not found.");
      if (!userSnap.exists) throw new Error("Customer account not found.");
      const order = orderSnap.data() ?? {};
      const user = userSnap.data() ?? {};
      if (String(order.customer?.uid ?? "") !== decoded.uid) throw new Error("You do not have permission to cancel this order.");
      const cancellable = [ORDER_STATUS.PAYMENT_PENDING, ORDER_STATUS.PAYMENT_SUBMITTED, ORDER_STATUS.PAYMENT_VERIFIED, ORDER_STATUS.ARTWORK_QUEUE];
      if (!cancellable.includes(order.status)) throw new Error("This order can no longer be cancelled.");
      if (order.status === ORDER_STATUS.CANCELLED) return { walletCredit: 0, alreadyCancelled: true };

      const paymentStatus = String(order.payment?.status ?? "PENDING");
      const paidAmount = paymentStatus === "VERIFIED" ? Math.max(0, Number(order.payment?.amount ?? order.pricing?.total ?? 0)) : 0;
      const currentWallet = Math.max(0, Number(user.referralRewardCoins ?? 0));
      const walletCredit = Math.round(paidAmount);

      tx.update(orderRef, {
        status: ORDER_STATUS.CANCELLED,
        cancellation: {
          cancelledAt: FieldValue.serverTimestamp(),
          cancelledBy: decoded.uid,
          reason: String(body.reason ?? "Customer requested cancellation"),
          walletCredit,
        },
        timeline: [
          ...(Array.isArray(order.timeline) ? order.timeline : []),
          { title: "Order Cancelled", description: walletCredit > 0 ? `Payment is non-refundable. ₹${walletCredit.toLocaleString("en-IN")} has been credited to the customer's reward wallet for a future order or transfer.` : "Order cancelled without wallet credit.", createdAt: new Date() },
        ],
        updatedAt: FieldValue.serverTimestamp(),
      });

      if (walletCredit > 0) {
        tx.update(userRef, {
          referralRewardCoins: FieldValue.increment(walletCredit),
          updatedAt: FieldValue.serverTimestamp(),
          lastCancellationCredit: { orderId, amount: walletCredit, createdAt: new Date() },
        });

        tx.set(adminDb.collection("rewardTransactions").doc(), {
          uid: decoded.uid,
          type: "CREDIT",
          source: "CANCELLATION",
          amount: walletCredit,
          balanceAfter: currentWallet + walletCredit,
          orderId,
          note: "Payment was non-refundable; verified payment credited to reward wallet for future use or transfer.",
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      return { walletCredit, alreadyCancelled: false };
    });

    return NextResponse.json({ success: true, ...result, message: result.walletCredit > 0 ? `Order cancelled. Payment is non-refundable; ₹${result.walletCredit.toLocaleString("en-IN")} was credited to your reward wallet.` : "Order cancelled. No payment wallet credit was created because the payment was not verified." });
  } catch (error) {
    return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Unable to cancel order." }, { status: 400 });
  }
}
