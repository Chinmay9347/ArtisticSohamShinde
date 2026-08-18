import { NextResponse } from "next/server";
import { getPublicPricingConfigs } from "@/server/pricing/publicPricing";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const configs = await getPublicPricingConfigs();

    return NextResponse.json({
      success: true,
      source: "firestore-or-default",
      configs,
    });
  } catch (error) {
    console.error("Public pricing API error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to load public pricing.",
      },
      { status: 500 },
    );
  }
}
