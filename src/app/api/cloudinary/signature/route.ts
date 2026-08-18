import { createHash } from "node:crypto";
import { NextResponse } from "next/server";

import { adminAuth } from "@/server/firebase/admin";

export const runtime = "nodejs";

function getBearerToken(request: Request) {
  const header =
    request.headers.get("authorization");

  if (!header) return null;

  const match =
    header.match(/^Bearer\s+(.+)$/i);

  return match?.[1] ?? null;
}

export async function POST(
  request: Request,
) {
  try {
    const token =
      getBearerToken(request);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        { status: 401 },
      );
    }

    await adminAuth.verifyIdToken(token, true);

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME;

    const apiKey =
      process.env.CLOUDINARY_API_KEY;

    const apiSecret =
      process.env.CLOUDINARY_API_SECRET;

    if (
      !cloudName ||
      !apiKey ||
      !apiSecret
    ) {
      throw new Error(
        "Cloudinary server credentials are not configured.",
      );
    }

    const body =
      (await request.json()) as {
        folder?: string;
      };

    const folder =
      body.folder?.trim();

    if (
      !folder ||
      !/^artistic-soham\/[a-zA-Z0-9/_-]+$/.test(
        folder,
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid Cloudinary upload folder.",
        },
        { status: 400 },
      );
    }

    const timestamp =
      Math.floor(Date.now() / 1000);

    const signatureBase =
      `folder=${folder}&timestamp=${timestamp}${apiSecret}`;

    const signature =
      createHash("sha1")
        .update(signatureBase)
        .digest("hex");

    return NextResponse.json({
      success: true,
      cloudName,
      apiKey,
      timestamp,
      signature,
    });
  } catch (error) {
    console.error(
      "Cloudinary signature error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create upload signature.",
      },
      { status: 500 },
    );
  }
}
