import { FieldValue, Timestamp } from "firebase-admin/firestore";

import { calculateOrderPrice } from "../pricing/calculateOrderPrice";
import { validateCommission } from "../validation/validateCommission";
import { orderMapper } from "./orderMapper";

import { adminDb } from "@/server/firebase/admin";

import type {
  CreateOrderRequest,
  CreateOrderResponse,
} from "@/types/api/order";

import {
  ORDER_STATUS,
} from "@/constants/order-status";

function generateOrderNumber(): string {
  const date = new Date();
  const stamp = [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("");

  const suffix = Math.random()
    .toString(36)
    .slice(2, 8)
    .toUpperCase();

  return `AS-${stamp}-${suffix}`;
}

function rewardDataExpiry(days: unknown) {
  const value = Number(days ?? 90);
  return Timestamp.fromDate(new Date(Date.now() + (Number.isFinite(value) && value > 0 ? value : 90) * 24 * 60 * 60 * 1000));
}

export async function createOrder(
  request: CreateOrderRequest,
  authenticatedUid: string,
): Promise<CreateOrderResponse> {
  const userSnapshot = await adminDb
    .collection("users")
    .doc(authenticatedUid)
    .get();

  if (!userSnapshot.exists) {
    throw new Error("Customer account profile was not found.");
  }

  const userData = userSnapshot.data()!;

  if (userData.role !== "CUSTOMER") {
    throw new Error(
      "Only customer accounts can create commission orders.",
    );
  }

  if (userData.isActive === false) {
    throw new Error("This customer account is inactive.");
  }

  let claimedReferralCode = request.referralCode?.trim().toUpperCase();
  if (!claimedReferralCode) {
    const claimedReferral = await adminDb.collection("referrals").where("referredUserId", "==", authenticatedUid).where("status", "==", "ACTIVE").limit(1).get();
    if (!claimedReferral.empty) claimedReferralCode = String(claimedReferral.docs[0].data().referralCode ?? "");
  }

  const normalizedRequest: CreateOrderRequest = {
    ...request,
    offerCode:
      request.offerCode?.trim().toUpperCase() || undefined,
    offerCodes: request.offerCodes?.map(code => code.trim().toUpperCase()).filter(Boolean),
    referralCode: claimedReferralCode || undefined,
    rewardPointsUsed: Math.max(0, Math.floor(Number(request.rewardPointsUsed ?? 0))),
    customer: {
      ...request.customer,
      uid: authenticatedUid,
      email:
        userData.email ??
        request.customer.email,
    },
  };

  const validation =
    validateCommission(normalizedRequest);

  if (!validation.valid) {
    throw new Error(
      validation.errors.join("\n"),
    );
  }

  const pricing =
    await calculateOrderPrice({
      ...normalizedRequest,
      customerUid: authenticatedUid,
    });

  const rewardPointsUsed = Math.max(0, Math.floor(Number(pricing.rewardPointsUsed ?? 0)));
  if (rewardPointsUsed > 0) {
    const availableRewardCoins = Math.max(
      0,
      Number(userData.referralRewardCoins ?? 0),
    );
    if (rewardPointsUsed > availableRewardCoins) {
      throw new Error("Your referral reward coin balance changed. Please recalculate the order and try again.");
    }
  }

  const order = orderMapper(
    normalizedRequest,
    pricing,
  );

  const orderRef =
    adminDb.collection("orders").doc();

  const orderId = orderRef.id;
  const orderNumber = generateOrderNumber();

  const orderDocument = {
    ...order,

    orderNumber,

    status:
      order.status ??
      ORDER_STATUS.PAYMENT_PENDING,

    createdAt:
      FieldValue.serverTimestamp(),

    updatedAt:
      FieldValue.serverTimestamp(),

    timeline: [
      {
        title: "Order Created",
        createdAt: Timestamp.now(),
      },
    ],
  };

  const batch = adminDb.batch();

  batch.set(
    orderRef,
    orderDocument,
  );

  const rewardHistoryCollection =
    adminDb.collection("rewardTransactions");

  const appliedOfferCodes = Array.from(new Set([
    ...(normalizedRequest.offerCodes ?? []),
    ...(normalizedRequest.offerCode ? [normalizedRequest.offerCode] : []),
  ].map((code) => code.trim().toUpperCase()).filter(Boolean)));

  for (const code of appliedOfferCodes) {
    const offerSnapshot = await adminDb
      .collection("offers")
      .where("code", "==", code)
      .limit(1)
      .get();
    if (!offerSnapshot.empty) {
      batch.update(offerSnapshot.docs[0].ref, {
        usageCount: FieldValue.increment(1),
        updatedAt: FieldValue.serverTimestamp(),
      });
    }
  }

  /*
   * Keep one coupon-usage row per order. The row contains every coupon
   * applied to that order, so Admin can audit the complete stack without
   * getting duplicate rows for the same order.
   */
  if (appliedOfferCodes.length > 0) {
    batch.set(
      adminDb
        .collection("couponUsageLogs")
        .doc(orderId),
      {
        orderId,
        customerId: authenticatedUid,
        couponCodes: appliedOfferCodes,
        couponCode: appliedOfferCodes[0] ?? "",
        discountAmount: Number(pricing.couponDiscount ?? 0),
        createdAt: FieldValue.serverTimestamp(),
      },
      { merge: true },
    );
  }

  if (normalizedRequest.referralCode) {
    const referralSnapshot =
      await adminDb
        .collection("referrals")
        .where(
          "referralCode",
          "==",
          normalizedRequest.referralCode,
        )
        .limit(1)
        .get();

    if (!referralSnapshot.empty) {
      const referralRef =
        referralSnapshot.docs[0].ref;

      const referralData = referralSnapshot.docs[0].data();
      const campaignSnapshot = await adminDb.collection("referralCampaigns").doc(String(referralData.campaignId ?? "")).get();
      const campaign = campaignSnapshot.exists ? campaignSnapshot.data()! : null;
      const reward = campaign?.referrerReward as { type?: "PERCENTAGE" | "FIXED"; value?: number; maximumDiscount?: number | null } | undefined;
      const rewardRaw = reward?.type === "PERCENTAGE" ? pricing.subtotal * (Number(reward.value ?? 0) / 100) : Number(reward?.value ?? 0);
      const referrerReward = Math.max(0, Math.min(rewardRaw, reward?.maximumDiscount == null ? pricing.subtotal : Math.max(0, Number(reward.maximumDiscount))));
      const referrerUserId = String(referralData.referrerUserId ?? "");
      const rewardAmount = Math.round(referrerReward);

      if (referrerUserId && referrerUserId !== authenticatedUid && rewardAmount > 0) {
        const referrerRef = adminDb.collection("users").doc(referrerUserId);
        const referrerSnapshot = await referrerRef.get();
        const currentReferrerBalance = Math.max(
          0,
          Number(referrerSnapshot.data()?.referralRewardCoins ?? 0),
        );
        const rewardHistoryRef = rewardHistoryCollection.doc();

        batch.update(referrerRef, {
          referralRewardCoins: FieldValue.increment(rewardAmount),
          updatedAt: FieldValue.serverTimestamp(),
        });

        batch.set(rewardHistoryRef, {
          uid: referrerUserId,
          type: "CREDIT",
          source: "REFERRAL",
          amount: rewardAmount,
          balanceAfter: currentReferrerBalance + rewardAmount,
          referralId: referralRef.id,
          orderId,
          referredUserId: authenticatedUid,
          note: "Referral reward credited after qualifying order.",
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      batch.update(
        referralRef,
        {
          status: "QUALIFIED",
          referredUserId: authenticatedUid,
          referredOrderId: orderId,
          qualifiedAt: FieldValue.serverTimestamp(),
          referredCustomerDiscount: pricing.discount,
          referrerReward,
          rewardExpiresAt: rewardDataExpiry(campaign?.rewardValidityDays),
          updatedAt: FieldValue.serverTimestamp(),
        },
      );
    }
  }

  batch.update(
    userSnapshot.ref,
    {
      totalOrders:
        FieldValue.increment(1),
      ...(rewardPointsUsed > 0
        ? {
            referralRewardCoins:
              FieldValue.increment(-rewardPointsUsed),
            referralRewardCoinsSpent:
              FieldValue.increment(rewardPointsUsed),
          }
        : {}),
      updatedAt:
        FieldValue.serverTimestamp(),
    },
  );

  if (rewardPointsUsed > 0) {
    const currentBalance = Math.max(
      0,
      Number(userData.referralRewardCoins ?? 0),
    );

    batch.set(
      rewardHistoryCollection.doc(),
      {
        uid: authenticatedUid,
        type: "DEBIT",
        source: "ORDER",
        amount: rewardPointsUsed,
        balanceAfter: Math.max(
          0,
          currentBalance - rewardPointsUsed,
        ),
        orderId,
        note: "Reward coins used on order.",
        createdAt: FieldValue.serverTimestamp(),
      },
    );
  }

  await batch.commit();

  return {
    success: true,
    orderId,
    pricing,
    paymentRequired: true,
    redirectUrl:
      `/payment/${orderId}`,
  };
}
