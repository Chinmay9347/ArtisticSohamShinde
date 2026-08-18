import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/server/firebase/admin";
import type { PaymentMethod } from "@/types/payment";

export const runtime = "nodejs";

function bearer(request: Request) {
  const value =
    request.headers.get("authorization");

  if (!value) return null;

  const match =
    value.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

const METHODS: PaymentMethod[] = [
  "UPI",
  "BANK_TRANSFER",
  "QR",
];

export async function POST(
  request: Request,
) {
  try {
    const token = bearer(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message: "Authentication required.",
        },
        { status: 401 },
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(token, true);

    const body =
      (await request.json()) as {
        orderId?: string;
        method?: PaymentMethod;
        transactionId?: string;
        receipt?: {
          fileName: string;
          publicId: string;
          url: string;
        };
      };

    if (
      !body.orderId ||
      !body.method ||
      !METHODS.includes(body.method) ||
      !body.transactionId?.trim() ||
      !body.receipt?.publicId ||
      !body.receipt?.url
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Complete payment verification details are required.",
        },
        { status: 400 },
      );
    }

    const orderRef =
      adminDb
        .collection("orders")
        .doc(body.orderId);

    const orderSnapshot =
      await orderRef.get();

    if (!orderSnapshot.exists) {
      return NextResponse.json(
        {
          success: false,
          message: "Order not found.",
        },
        { status: 404 },
      );
    }

    const order =
      orderSnapshot.data()!;

    if (
      order.customer?.uid !==
      decoded.uid
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You do not have access to this order.",
        },
        { status: 403 },
      );
    }

    const currentStatus =
      order.payment?.status;

    if (
      currentStatus === "VERIFIED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This payment has already been verified.",
        },
        { status: 409 },
      );
    }

    if (
      order.status === "COMPLETED" ||
      order.status === "CANCELLED"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Payment cannot be submitted for this order.",
        },
        { status: 409 },
      );
    }

    const batch =
      adminDb.batch();

    batch.update(
      orderRef,
      {
        payment: {
          method: body.method,
          status: "SUBMITTED",
          amount: Number(
            order.payment?.amount ?? 0,
          ),
          currency: "INR",
          transactionId:
            body.transactionId.trim(),
          receipt: {
            fileName:
              body.receipt.fileName,
            publicId:
              body.receipt.publicId,
            url:
              body.receipt.url,
            uploadedAt:
              Timestamp.now(),
          },
          submittedAt:
            FieldValue.serverTimestamp(),
        },
        status:
          "PAYMENT_SUBMITTED",
        updatedAt:
          FieldValue.serverTimestamp(),
        timeline:
          FieldValue.arrayUnion({
            title: "Payment Submitted",
            createdAt:
              Timestamp.now(),
          }),
      },
    );

    await batch.commit();

    return NextResponse.json({
      success: true,
      message:
        "Payment proof submitted successfully.",
    });
  } catch (error) {
    console.error(
      "Payment submission error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to submit payment.",
      },
      { status: 400 },
    );
  }
}
