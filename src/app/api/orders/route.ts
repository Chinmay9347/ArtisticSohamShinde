import { NextResponse } from "next/server";

import { adminAuth } from "@/server/firebase/admin";
import { createOrder } from "@/server/orders/createOrder";

import type { CreateOrderRequest } from "@/types/api/order";

export const runtime = "nodejs";

function getBearerToken(request: Request): string | null {
  const value = request.headers.get("authorization");

  if (!value) return null;

  const match = value.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

export async function POST(request: Request) {
  try {
    const token = getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please sign in before creating an order.",
        },
        { status: 401 },
      );
    }

    const decodedToken =
      await adminAuth.verifyIdToken(token, true);

    const body =
      (await request.json()) as CreateOrderRequest;

    if (!body?.customer) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid order request.",
        },
        { status: 400 },
      );
    }

    const result = await createOrder(
      body,
      decodedToken.uid,
    );

    return NextResponse.json(result);
  } catch (error) {
    console.error(
      "Create Order Error:",
      error,
    );

    const code =
      error &&
      typeof error === "object" &&
      "code" in error
        ? String(
            (error as { code?: unknown }).code,
          )
        : "";

    const status =
      code.includes("auth/")
        ? 401
        : 400;

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create order.",
      },
      { status },
    );
  }
}
