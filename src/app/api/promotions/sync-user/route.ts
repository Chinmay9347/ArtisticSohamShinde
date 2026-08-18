import { NextResponse } from "next/server";

import { adminAuth, adminDb } from "@/server/firebase/admin";

function asTime(value: unknown) {
  if (value == null) return 0;

  const v = value as any;

  const date = v?.toDate?.();
  if (date instanceof Date) return date.getTime();

  if (value instanceof Date) return value.getTime();

  if (typeof value === "number") {
    return value < 1e12 ? value * 1000 : value;
  }

  if (typeof value === "string") {
    const t = new Date(value).getTime();
    return Number.isFinite(t) ? t : 0;
  }

  if (typeof v?._seconds === "number") {
    return (
      v._seconds * 1000 +
      Math.floor(Number(v._nanoseconds ?? 0) / 1e6)
    );
  }

  if (typeof v?.seconds === "number") {
    return Number(v.seconds) * 1000;
  }

  return 0;
}

function isActiveNow(offer: any) {
  if (offer.enabled !== true) return false;

  const now = Date.now();

  const start = asTime(offer.startAt);
  const end = asTime(offer.endAt);

  // Start is inclusive.
  // End is EXCLUSIVE.
  //
  // This means that when endAt === now, the offer is already expired.
  if (start && now < start) return false;
  if (end && now >= end) return false;

  return true;
}

function eligible(
  user: any,
  stats: {
    count: number;
    last: number;
  },
  audience: any,
) {
  if (user.isActive === false) return false;

  const minOrders =
    audience?.minOrders == null
      ? null
      : Number(audience.minOrders);

  const maxOrders =
    audience?.maxOrders == null
      ? null
      : Number(audience.maxOrders);

  if (
    minOrders != null &&
    stats.count < minOrders
  ) {
    return false;
  }

  if (
    maxOrders != null &&
    stats.count > maxOrders
  ) {
    return false;
  }

  const daysSince = stats.last
    ? Math.floor(
        (Date.now() - stats.last) /
          86_400_000,
      )
    : Infinity;

  const minDays =
    audience?.minDaysSinceLastOrder == null
      ? null
      : Number(
          audience.minDaysSinceLastOrder,
        );

  const maxDays =
    audience?.maxDaysSinceLastOrder == null
      ? null
      : Number(
          audience.maxDaysSinceLastOrder,
        );

  if (
    minDays != null &&
    daysSince < minDays
  ) {
    return false;
  }

  if (
    maxDays != null &&
    daysSince > maxDays
  ) {
    return false;
  }

  return true;
}

export async function POST(request: Request) {
  try {
    const header =
      request.headers.get("authorization") ?? "";

    const token = header.startsWith("Bearer ")
      ? header.slice(7)
      : "";

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Authentication required.",
        },
        {
          status: 401,
        },
      );
    }

    const decoded =
      await adminAuth.verifyIdToken(
        token,
        true,
      );

    const userRef = adminDb
      .collection("users")
      .doc(decoded.uid);

    const userSnap =
      await userRef.get();

    const user = {
      uid: decoded.uid,
      ...(userSnap.data() ?? {}),
    };

    const [
      offersSnap,
      ordersSnap,
      notificationsSnap,
    ] = await Promise.all([
      adminDb
        .collection("offers")
        .get(),

      adminDb
        .collection("orders")
        .where(
          "customer.uid",
          "==",
          decoded.uid,
        )
        .get(),

      adminDb
        .collection("notifications")
        .where(
          "userId",
          "==",
          decoded.uid,
        )
        .get(),
    ]);

    const stats = {
      count: ordersSnap.size,
      last: 0,
    };

    for (const order of ordersSnap.docs) {
      stats.last = Math.max(
        stats.last,
        asTime(
          order.data().createdAt,
        ),
      );
    }

    const eligibleOfferIds =
      new Set<string>();

    const activeOffers =
      new Map<string, any>();

    for (const offerDoc of offersSnap.docs) {
      const offer = offerDoc.data();

      // Disabled / expired / not-yet-active
      // offers never become eligible.
      if (!isActiveNow(offer)) {
        continue;
      }

      // Customer is no longer eligible.
      if (
        !eligible(
          user,
          stats,
          offer.audience,
        )
      ) {
        continue;
      }

      eligibleOfferIds.add(
        offerDoc.id,
      );

      activeOffers.set(
        offerDoc.id,
        offer,
      );
    }

    const batch = adminDb.batch();

    const existingNotifications =
      new Map(
        notificationsSnap.docs.map(
          (notificationDoc) => [
            notificationDoc.id,
            notificationDoc,
          ],
        ),
      );

    let created = 0;
    let removed = 0;

    /*
     * REMOVE STALE OFFER NOTIFICATIONS
     *
     * An offer notification is removed if:
     *
     * 1. The offer was disabled.
     * 2. The offer expired.
     * 3. The offer does not exist anymore.
     * 4. The customer is no longer eligible.
     */
    for (const notificationDoc of notificationsSnap.docs) {
      const notification = notificationDoc.data();

      const offerId = String(
        notification.offerId ?? "",
      ).trim();

      const title = String(
        notification.title ?? "",
      ).toLowerCase();

      const message = String(
        notification.message ?? "",
      ).toLowerCase();

      /*
      * LEGACY PROMOTION CLEANUP
      *
      * Older offer/coupon notifications were created without offerId.
      * They cannot be matched to the current offer system, so remove
      * them when they clearly belong to an old promotion.
      *
      * This prevents old notifications such as:
      * "Launch Offer is live"
      * "Launch Offer is available"
      * "Rakhi Special is available"
      * from remaining permanently.
      */
      if (!offerId) {
        // const looksLikePromotion =
        //   title.includes("offer") ||
        //   title.includes("coupon") ||
        //   title.includes("discount") ||
        //   title.includes("promotion") ||
        //   message.includes("use code") ||
        //   message.includes("coupon") ||
        //   message.includes("discount");
        const looksLikePromotion =
          title.includes("offer") ||
          title.includes("coupon") ||
          title.includes("promotion") ||
          title.includes("special") ||
          message.includes("use code") ||
          message.includes("coupon code") ||
          message.includes("discount code");

        if (looksLikePromotion) {
          batch.delete(notificationDoc.ref);
          removed += 1;
        }

        continue;
      }

      const notificationEnd = asTime(
        notification.endAt,
      );

      const notificationExpired =
        notificationEnd > 0 &&
        Date.now() >= notificationEnd;

      const offerIsEligible =
        eligibleOfferIds.has(offerId);

      if (
        notificationExpired ||
        !offerIsEligible
      ) {
        batch.delete(notificationDoc.ref);
        removed += 1;
      }
    }

    /*
     * CREATE / UPDATE ONLY CURRENTLY
     * ACTIVE + ELIGIBLE OFFERS
     */
    for (const [
      offerId,
      offer,
    ] of activeOffers) {
      const notificationRef =
        adminDb
          .collection("notifications")
          .doc(
            `${decoded.uid}_${offerId}`,
          );

      const existing =
        existingNotifications.get(
          notificationRef.id,
        );

      const notificationData: Record<
        string,
        unknown
      > = {
        userId: decoded.uid,

        title: `${
          offer.name ??
          "New offer"
        } is available`,

        message:
          `Use code ${
            offer.code ?? ""
          } for ${Number(
            offer.discountValue ?? 0,
          )}${
            offer.discountType ===
            "PERCENTAGE"
              ? "%"
              : " INR"
          } off.`,

        href: "/commission",

        offerId,

        endAt:
          offer.endAt ?? null,

        updatedAt: new Date(),
      };

      if (!existing) {
        notificationData.read =
          false;

        notificationData.createdAt =
          new Date();
      }

      batch.set(
        notificationRef,
        notificationData,
        {
          merge: true,
        },
      );

      created += 1;
    }

    await batch.commit();

    return NextResponse.json({
      success: true,
      created,
      removed,
      activeOfferCount:
        eligibleOfferIds.size,
      eligibleOfferIds:
        Array.from(
          eligibleOfferIds,
        ),
    });
  } catch (error) {
    console.error(
      "Promotion sync error:",
      error,
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Unable to sync promotions.",
      },
      {
        status: 400,
      },
    );
  }
}

// import { NextResponse } from "next/server";
// import { adminAuth, adminDb } from "@/server/firebase/admin";

// function asTime(value: unknown) {
//   if (value == null) return 0;
//   const v = value as any;
//   const date = v?.toDate?.();
//   if (date instanceof Date) return date.getTime();
//   if (value instanceof Date) return value.getTime();
//   if (typeof value === "number") return value < 1e12 ? value * 1000 : value;
//   if (typeof value === "string") {
//     const t = new Date(value).getTime();
//     return Number.isFinite(t) ? t : 0;
//   }
//   if (typeof v?._seconds === "number") return v._seconds * 1000;
//   if (typeof v?.seconds === "number") return Number(v.seconds) * 1000;
//   return 0;
// }

// function isActiveNow(offer: any) {
//   if (offer.enabled !== true) return false;
//   const now = Date.now();
//   const start = asTime(offer.startAt);
//   const end = asTime(offer.endAt);
//   return (!start || now >= start) && (!end || now <= end);
// }

// function eligible(user: any, stats: { count: number; last: number }, audience: any) {
//   if (user.isActive === false) return false;

//   const minOrders = audience?.minOrders == null ? null : Number(audience.minOrders);
//   const maxOrders = audience?.maxOrders == null ? null : Number(audience.maxOrders);
//   if (minOrders != null && stats.count < minOrders) return false;
//   if (maxOrders != null && stats.count > maxOrders) return false;

//   const daysSince = stats.last
//     ? Math.floor((Date.now() - stats.last) / 86_400_000)
//     : Infinity;
//   const minDays = audience?.minDaysSinceLastOrder == null ? null : Number(audience.minDaysSinceLastOrder);
//   const maxDays = audience?.maxDaysSinceLastOrder == null ? null : Number(audience.maxDaysSinceLastOrder);
//   if (minDays != null && daysSince < minDays) return false;
//   if (maxDays != null && daysSince > maxDays) return false;

//   return true;
// }

// export async function POST(request: Request) {
//   try {
//     const header = request.headers.get("authorization") ?? "";
//     const token = header.startsWith("Bearer ") ? header.slice(7) : "";
//     if (!token) {
//       return NextResponse.json({ success: false, message: "Authentication required." }, { status: 401 });
//     }

//     const decoded = await adminAuth.verifyIdToken(token, true);
//     const userRef = adminDb.collection("users").doc(decoded.uid);
//     const userSnap = await userRef.get();
//     const user = { uid: decoded.uid, ...(userSnap.data() ?? {}) };

//     const [offersSnap, ordersSnap, notificationsSnap] = await Promise.all([
//       adminDb.collection("offers").get(),
//       adminDb.collection("orders").where("customer.uid", "==", decoded.uid).get(),
//       adminDb.collection("notifications").where("userId", "==", decoded.uid).get(),
//     ]);

//     const stats = { count: ordersSnap.size, last: 0 };
//     for (const order of ordersSnap.docs) {
//       stats.last = Math.max(stats.last, asTime(order.data().createdAt));
//     }

//     const eligibleOfferIds = new Set<string>();
//     const activeOffers = new Map<string, any>();

//     for (const offerDoc of offersSnap.docs) {
//       const offer = offerDoc.data();
//       if (!isActiveNow(offer)) continue;
//       if (!eligible(user, stats, offer.audience)) continue;
//       eligibleOfferIds.add(offerDoc.id);
//       activeOffers.set(offerDoc.id, offer);
//     }

//     const batch = adminDb.batch();
//     const existingNotifications = new Map(
//       notificationsSnap.docs.map((doc) => [doc.id, doc]),
//     );
//     let created = 0;
//     let removed = 0;

//     for (const notificationDoc of notificationsSnap.docs) {
//       const notification = notificationDoc.data();
//       const offerId = String(notification.offerId ?? "").trim();
//       if (!offerId) continue;

//       // Remove offer notifications when the offer is expired, disabled,
//       // missing, or no longer eligible for this specific customer.
//       if (!eligibleOfferIds.has(offerId)) {
//         batch.delete(notificationDoc.ref);
//         removed += 1;
//       }
//     }

//     for (const [offerId, offer] of activeOffers) {
//       const notificationRef = adminDb.collection("notifications").doc(`${decoded.uid}_${offerId}`);
//       const existing = existingNotifications.get(notificationRef.id);
//       const notificationData: Record<string, unknown> = {
//         userId: decoded.uid,
//         title: `${offer.name ?? "New offer"} is available`,
//         message: `Use code ${offer.code ?? ""} for ${Number(offer.discountValue ?? 0)}${offer.discountType === "PERCENTAGE" ? "%" : " INR"} off.`,
//         href: "/commission",
//         offerId,
//         endAt: offer.endAt ?? null,
//         updatedAt: new Date(),
//       };
//       if (!existing) {
//         notificationData.read = false;
//         notificationData.createdAt = new Date();
//       }
//       batch.set(notificationRef, notificationData, { merge: true });
//       created += 1;
//     }

//     await batch.commit();

//     return NextResponse.json({
//       success: true,
//       created,
//       removed,
//       activeOfferCount: eligibleOfferIds.size,
//       eligibleOfferIds: Array.from(eligibleOfferIds),
//     });
//   } catch (error) {
//     console.error("Promotion sync error:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: error instanceof Error ? error.message : "Unable to sync promotions.",
//       },
//       { status: 400 },
//     );
//   }
// }
