import type {
  ReferralCampaignDocument,
  ReferralDocument,
} from "@/types/referral";

export function mapReferralCampaignDocument(
  id: string,
  data: Record<string, unknown>,
): ReferralCampaignDocument {
  return {
    id,

    name:
      (data.name as string) ?? "",

    codePrefix:
      (data.codePrefix as string) ?? "",

    enabled:
      (data.enabled as boolean) ?? false,

    referredCustomerReward:
      (data.referredCustomerReward as ReferralCampaignDocument["referredCustomerReward"]) ?? {
        type: "PERCENTAGE",
        value: 0,
      },

    referrerReward:
      (data.referrerReward as ReferralCampaignDocument["referrerReward"]) ?? {
        type: "FIXED",
        value: 0,
      },

    firstOrderOnly:
      (data.firstOrderOnly as boolean) ?? true,

    stackWithOffers:
      (data.stackWithOffers as boolean) ?? false,

    startAt:
      data.startAt,

    endAt:
      data.endAt,

    rewardValidityDays:
      Number(data.rewardValidityDays ?? 90),

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}

export function mapReferralDocument(
  id: string,
  data: Record<string, unknown>,
): ReferralDocument {
  return {
    id,

    referralCode:
      (data.referralCode as string) ?? "",

    campaignId:
      (data.campaignId as string) ?? "",

    referrerUserId:
      (data.referrerUserId as string) ?? "",

    referredUserId:
      (data.referredUserId as string | null) ??
      null,

    referredOrderId:
      (data.referredOrderId as string | null) ??
      null,

    status:
      (data.status as ReferralDocument["status"]) ??
      "PENDING",

    referredCustomerDiscount:
      Number(
        data.referredCustomerDiscount ?? 0,
      ),

    referrerReward:
      Number(
        data.referrerReward ?? 0,
      ),

    qualifiedAt:
      data.qualifiedAt ?? null,

    rewardedAt:
      data.rewardedAt ?? null,

    rewardExpiresAt:
      data.rewardExpiresAt ?? null,

    createdAt:
      data.createdAt,

    updatedAt:
      data.updatedAt,
  };
}