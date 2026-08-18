import { NextResponse } from "next/server";
import crypto from "node:crypto";

import { adminAuth, adminDb } from "@/server/firebase/admin";

type UnknownRecord = Record<string, unknown>;

function toMillis(value: unknown): number | null {
  if (value == null) {
    return null;
  }

  // Firestore Timestamp
  if (
    typeof value === "object" &&
    value !== null &&
    "toDate" in value &&
    typeof (value as { toDate?: unknown }).toDate === "function"
  ) {
    const date = (
      value as {
        toDate: () => Date;
      }
    ).toDate();

    const time = date?.getTime?.();

    return Number.isFinite(time) ? time : null;
  }

  // JavaScript Date
  if (value instanceof Date) {
    const time = value.getTime();

    return Number.isFinite(time) ? time : null;
  }

  // Milliseconds / numeric timestamp
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  // ISO date string
  if (typeof value === "string") {
    const time = new Date(value).getTime();

    return Number.isFinite(time) ? time : null;
  }

  // Serialized Firestore Timestamp
  if (
    typeof value === "object" &&
    value !== null &&
    "seconds" in value
  ) {
    const seconds = Number(
      (value as { seconds?: unknown }).seconds,
    );

    if (Number.isFinite(seconds)) {
      return seconds * 1000;
    }
  }

  return null;
}

function isCampaignActive(
  campaign: UnknownRecord,
): boolean {
  if (campaign.enabled !== true) {
    return false;
  }

  const now = Date.now();

  const startAt = toMillis(campaign.startAt);
  const endAt = toMillis(campaign.endAt);

  // No start date = active immediately.
  if (startAt !== null && now < startAt) {
    return false;
  }

  // No end date = no expiry.
  if (endAt !== null && now > endAt) {
    return false;
  }

  return true;
}

function getFixedReward(
  reward: unknown,
): number {
  if (
    typeof reward !== "object" ||
    reward === null
  ) {
    return 0;
  }

  const item = reward as UnknownRecord;

  if (item.type !== "FIXED") {
    return 0;
  }

  const value = Number(item.value ?? 0);

  return Number.isFinite(value)
    ? Math.max(0, value)
    : 0;
}

function getPercentageReward(
  reward: unknown,
): number {
  if (
    typeof reward !== "object" ||
    reward === null
  ) {
    return 0;
  }

  const item = reward as UnknownRecord;

  if (item.type !== "PERCENTAGE") {
    return 0;
  }

  const value = Number(item.value ?? 0);

  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, value));
}

export async function POST(
  request: Request,
) {
  try {
    /*
     * --------------------------------------------------
     * AUTHENTICATION
     * --------------------------------------------------
     */

    const authorization =
      request.headers.get("authorization") ?? "";

    const token = authorization.startsWith(
      "Bearer ",
    )
      ? authorization.slice(7)
      : "";

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
      await adminAuth.verifyIdToken(
        token,
        true,
      );

    /*
     * --------------------------------------------------
     * FIND ACTIVE REFERRAL CAMPAIGN
     * --------------------------------------------------
     *
     * Admin creates campaigns in:
     *
     * referralCampaigns/{campaignId}
     *
     * and uses:
     *
     * enabled
     * startAt
     * endAt
     */

    const campaignSnapshot =
      await adminDb
        .collection("referralCampaigns")
        .where("enabled", "==", true)
        .get();

    const activeCampaignDoc =
      campaignSnapshot.docs.find(
        (document) =>
          isCampaignActive(
            document.data(),
          ),
      );

    /*
     * IMPORTANT:
     *
     * Do not tell the customer that the referral
     * program is inactive when there is no campaign.
     *
     * Return active=false only when there really
     * is no enabled/current campaign.
     */

    if (!activeCampaignDoc) {
      return NextResponse.json({
        success: true,
        active: false,
        referral: null,
        campaign: null,
      });
    }

    const campaign =
      activeCampaignDoc.data();

    /*
     * --------------------------------------------------
     * CAMPAIGN REWARD VALUES
     * --------------------------------------------------
     */

    const referredCustomerReward =
      campaign.referredCustomerReward;

    const referrerReward =
      campaign.referrerReward;

    /*
     * Fixed rewards can be stored immediately
     * on the referral document.
     *
     * Percentage customer discounts are calculated
     * later against the qualifying order amount.
     */

    const fixedReferrerReward =
      getFixedReward(referrerReward);

    const customerPercentage =
      getPercentageReward(
        referredCustomerReward,
      );

    const customerFixedReward =
      getFixedReward(
        referredCustomerReward,
      );

    /*
     * --------------------------------------------------
     * CHECK EXISTING REFERRAL FOR THIS USER/CAMPAIGN
     * --------------------------------------------------
     */

    const existingSnapshot =
      await adminDb
        .collection("referrals")
        .where(
          "referrerUserId",
          "==",
          decoded.uid,
        )
        .where(
          "campaignId",
          "==",
          activeCampaignDoc.id,
        )
        .limit(1)
        .get();

    if (!existingSnapshot.empty) {
      const existingDoc =
        existingSnapshot.docs[0];

      const existing =
        existingDoc.data();

      /*
       * Repair only an old PENDING referral
       * that was created with zero rewards.
       *
       * Never rewrite QUALIFIED/REWARDED historical
       * referral values.
       */

      if (
        existing.status === "PENDING"
      ) {
        const patch: UnknownRecord = {};

        /*
         * Fixed customer reward can safely be
         * stored immediately.
         */
        if (
          customerFixedReward > 0 &&
          Number(
            existing.referredCustomerDiscount ??
              0,
          ) === 0
        ) {
          patch.referredCustomerDiscount =
            customerFixedReward;
        }

        /*
         * Percentage reward is NOT converted to
         * rupees here because there is no order
         * amount yet.
         */
        if (
          fixedReferrerReward > 0 &&
          Number(
            existing.referrerReward ?? 0,
          ) === 0
        ) {
          patch.referrerReward =
            fixedReferrerReward;
        }

        if (
          Object.keys(patch).length > 0
        ) {
          patch.updatedAt = new Date();

          await existingDoc.ref.update(
            patch,
          );

          Object.assign(
            existing,
            patch,
          );
        }
      }

      return NextResponse.json({
        success: true,
        active: true,

        campaign: {
          id: activeCampaignDoc.id,
          ...campaign,
        },

        /*
         * Customer page expects referral here.
         */
        referral: {
          id: existingDoc.id,
          ...existing,
        },

        /*
         * Useful for the customer/order
         * calculation layer.
         */
        referralRewardConfig: {
          referredCustomerReward,
          referrerReward,
          customerPercentage,
          customerFixedReward,
          fixedReferrerReward,
          firstOrderOnly:
            campaign.firstOrderOnly !== false,
          stackWithOffers:
            campaign.stackWithOffers === true,
          rewardValidityDays:
            Number(
              campaign.rewardValidityDays ??
                90,
            ),
        },
      });
    }

    /*
     * --------------------------------------------------
     * CREATE NEW REFERRAL CODE
     * --------------------------------------------------
     */

    const prefix =
      String(
        campaign.codePrefix ?? "REF",
      )
        .replace(
          /[^A-Za-z0-9]/g,
          "",
        )
        .toUpperCase() || "REF";

    const code =
      `${prefix}-` +
      `${decoded.uid
        .slice(0, 6)
        .toUpperCase()}-` +
      `${crypto
        .randomBytes(2)
        .toString("hex")
        .toUpperCase()}`;

    /*
     * For a percentage customer reward,
     * keep the stored rupee discount at 0.
     *
     * The order pricing layer must calculate:
     *
     * subtotal × percentage / 100
     *
     * when the referral is actually used.
     */

    const referralData = {
      referralCode: code,

      campaignId:
        activeCampaignDoc.id,

      referrerUserId:
        decoded.uid,

      referredUserId: null,

      referredOrderId: null,

      status: "PENDING",

      /*
       * Fixed customer reward can be stored.
       * Percentage reward is calculated later.
       */
      referredCustomerDiscount:
        customerFixedReward,

      /*
       * Fixed referrer reward is known now.
       */
      referrerReward:
        fixedReferrerReward,

      qualifiedAt: null,

      rewardedAt: null,

      rewardExpiresAt: null,

      createdAt: new Date(),

      updatedAt: new Date(),
    };

    const referralDoc =
      await adminDb
        .collection("referrals")
        .add(referralData);

    /*
     * --------------------------------------------------
     * RESPONSE
     * --------------------------------------------------
     */

    return NextResponse.json({
      success: true,

      active: true,

      campaign: {
        id: activeCampaignDoc.id,
        ...campaign,
      },

      referral: {
        id: referralDoc.id,
        ...referralData,
      },

      referralRewardConfig: {
        referredCustomerReward,
        referrerReward,
        customerPercentage,
        customerFixedReward,
        fixedReferrerReward,
        firstOrderOnly:
          campaign.firstOrderOnly !== false,
        stackWithOffers:
          campaign.stackWithOffers === true,
        rewardValidityDays:
          Number(
            campaign.rewardValidityDays ??
              90,
          ),
      },
    });
  } catch (error) {
    console.error(
      "Ensure referral error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to create referral code.",
      },
      { status: 400 },
    );
  }
}

// import { NextResponse } from "next/server";
// import crypto from "node:crypto";
// import { adminAuth, adminDb } from "@/server/firebase/admin";

// function timestampToMillis(value: unknown): number | null {
//   if (!value) return null;

//   // Firestore Timestamp
//   if (
//     typeof value === "object" &&
//     value !== null &&
//     "toDate" in value &&
//     typeof (value as { toDate?: unknown }).toDate === "function"
//   ) {
//     const date = (value as { toDate: () => Date }).toDate();
//     const millis = date?.getTime?.();

//     return Number.isFinite(millis) ? millis : null;
//   }

//   // JavaScript Date
//   if (value instanceof Date) {
//     const millis = value.getTime();
//     return Number.isFinite(millis) ? millis : null;
//   }

//   // Numeric timestamp
//   if (typeof value === "number") {
//     return Number.isFinite(value) ? value : null;
//   }

//   // ISO/string date
//   if (typeof value === "string") {
//     const millis = new Date(value).getTime();

//     return Number.isFinite(millis) ? millis : null;
//   }

//   // Serialized Firestore timestamp:
//   // { seconds: ..., nanoseconds: ... }
//   if (
//     typeof value === "object" &&
//     value !== null &&
//     "seconds" in value
//   ) {
//     const seconds = Number(
//       (value as { seconds?: unknown }).seconds,
//     );

//     if (Number.isFinite(seconds)) {
//       return seconds * 1000;
//     }
//   }

//   return null;
// }

// function isCampaignCurrentlyActive(
//   campaign: FirebaseFirestore.DocumentData,
// ): boolean {
//   if (campaign.enabled !== true) {
//     return false;
//   }

//   const now = Date.now();

//   const startAt = timestampToMillis(campaign.startAt);
//   const endAt = timestampToMillis(campaign.endAt);

//   if (startAt !== null && now < startAt) {
//     return false;
//   }

//   if (endAt !== null && now > endAt) {
//     return false;
//   }

//   return true;
// }

// export async function POST(request: Request) {
//   try {
//     const authorization =
//       request.headers.get("authorization") ?? "";

//     const token = authorization.startsWith("Bearer ")
//       ? authorization.slice(7)
//       : "";

//     if (!token) {
//       return NextResponse.json(
//         {
//           success: false,
//           message: "Authentication required.",
//         },
//         { status: 401 },
//       );
//     }

//     const decoded = await adminAuth.verifyIdToken(token, true);

//     const campaignSnap = await adminDb
//       .collection("referralCampaigns")
//       .where("enabled", "==", true)
//       .limit(20)
//       .get();

//     const activeCampaignDoc = campaignSnap.docs.find(
//       (document) =>
//         isCampaignCurrentlyActive(document.data()),
//     );

//     if (!activeCampaignDoc) {
//       return NextResponse.json({
//         success: true,
//         active: false,
//         referral: null,
//       });
//     }

//     const campaign = activeCampaignDoc.data();

//     const existing = await adminDb
//       .collection("referrals")
//       .where(
//         "referrerUserId",
//         "==",
//         decoded.uid,
//       )
//       .where(
//         "campaignId",
//         "==",
//         activeCampaignDoc.id,
//       )
//       .limit(1)
//       .get();

//     if (!existing.empty) {
//       const document = existing.docs[0];

//       return NextResponse.json({
//         success: true,
//         active: true,
//         campaign: {
//           id: activeCampaignDoc.id,
//           ...campaign,
//         },
//         referral: {
//           id: document.id,
//           ...document.data(),
//         },
//       });
//     }

//     const prefix =
//       String(campaign.codePrefix ?? "REF")
//         .replace(/[^A-Za-z0-9]/g, "")
//         .toUpperCase() || "REF";

//     const code =
//       `${prefix}-` +
//       `${decoded.uid.slice(0, 6).toUpperCase()}-` +
//       `${crypto.randomBytes(2).toString("hex").toUpperCase()}`;

//     const referralData = {
//       referralCode: code,
//       campaignId: activeCampaignDoc.id,
//       referrerUserId: decoded.uid,
//       referredUserId: null,
//       referredOrderId: null,
//       status: "PENDING",

//       referredCustomerDiscount: 0,
//       referrerReward: 0,

//       qualifiedAt: null,
//       rewardedAt: null,
//       rewardExpiresAt: null,

//       createdAt: new Date(),
//       updatedAt: new Date(),
//     };

//     const referral = await adminDb
//       .collection("referrals")
//       .add(referralData);

//     return NextResponse.json({
//       success: true,
//       active: true,

//       campaign: {
//         id: activeCampaignDoc.id,
//         ...campaign,
//       },

//       referral: {
//         id: referral.id,
//         ...referralData,
//       },
//     });
//   } catch (error) {
//     console.error(
//       "Ensure referral error:",
//       error,
//     );

//     return NextResponse.json(
//       {
//         success: false,
//         message:
//           error instanceof Error
//             ? error.message
//             : "Unable to create referral code.",
//       },
//       { status: 400 },
//     );
//   }
// }

// import { NextResponse } from "next/server";
// import crypto from "node:crypto";
// import { adminAuth, adminDb } from "@/server/firebase/admin";

// export async function POST(request: Request){
//  try{
//   const h=request.headers.get("authorization")??""; const token=h.startsWith("Bearer ")?h.slice(7):"";
//   if(!token)return NextResponse.json({success:false,message:"Authentication required."},{status:401});
//   const decoded=await adminAuth.verifyIdToken(token,true);
//   const campaignSnap=await adminDb.collection("referralCampaigns").where("enabled","==",true).limit(10).get();
//   const now=Date.now();
//   const campaignDoc=campaignSnap.docs.find(d=>{const c=d.data();const start=c.startAt?.toDate?.()?.getTime?.() ?? 0;const end=c.endAt?.toDate?.()?.getTime?.() ?? 0;return (!start||now>=start)&&(!end||now<=end);});
//   if(!campaignDoc)return NextResponse.json({success:true,active:false});
//   const existing=await adminDb.collection("referrals").where("referrerUserId","==",decoded.uid).where("campaignId","==",campaignDoc.id).limit(1).get();
//   if(!existing.empty){const d=existing.docs[0];return NextResponse.json({success:true,active:true,referral:{id:d.id,...d.data()}});}
//   const prefix=String(campaignDoc.data().codePrefix??"REF").replace(/[^A-Za-z0-9]/g,"").toUpperCase()||"REF";
//   const code=`${prefix}-${decoded.uid.slice(0,6).toUpperCase()}-${crypto.randomBytes(2).toString("hex").toUpperCase()}`;
//   const ref=await adminDb.collection("referrals").add({referralCode:code,campaignId:campaignDoc.id,referrerUserId:decoded.uid,referredUserId:null,referredOrderId:null,status:"PENDING",referredCustomerDiscount:0,referrerReward:0,qualifiedAt:null,rewardedAt:null,rewardExpiresAt:null,createdAt:new Date(),updatedAt:new Date()});
//   return NextResponse.json({success:true,active:true,referral:{id:ref.id,referralCode:code,campaignId:campaignDoc.id,referrerUserId:decoded.uid,referredUserId:null,referredOrderId:null,status:"PENDING",referredCustomerDiscount:0,referrerReward:0}});
//  }catch(error){console.error("Ensure referral error:",error);return NextResponse.json({success:false,message:error instanceof Error?error.message:"Unable to create referral code."},{status:400});}
// }
