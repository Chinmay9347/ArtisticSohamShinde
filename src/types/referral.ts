export type ReferralRewardType =
  | "PERCENTAGE"
  | "FIXED";

export type ReferralStatus =
  | "PENDING"
  | "QUALIFIED"
  | "REWARDED"
  | "CANCELLED";

export interface ReferralRewardConfig {
  type: ReferralRewardType;

  value: number;

  maximumDiscount?: number | null;

  minimumOrderValue?: number | null;
}

export interface ReferralCampaignDocument {
  id: string;

  name: string;

  codePrefix: string;

  enabled: boolean;

  referredCustomerReward: ReferralRewardConfig;

  referrerReward: ReferralRewardConfig;

  firstOrderOnly: boolean;

  stackWithOffers: boolean;

  startAt: unknown;

  endAt: unknown;
  rewardValidityDays: number;

  createdAt: unknown;

  updatedAt: unknown;
}

export type ReferralCampaignFormData =
  Omit<
    ReferralCampaignDocument,
    | "id"
    | "createdAt"
    | "updatedAt"
  >;

export interface ReferralDocument {
  id: string;

  referralCode: string;

  campaignId: string;

  referrerUserId: string;

  referredUserId: string | null;

  referredOrderId: string | null;

  status: ReferralStatus;

  referredCustomerDiscount: number;

  referrerReward: number;

  qualifiedAt: unknown | null;

  rewardedAt: unknown | null;
  rewardExpiresAt: unknown | null;

  createdAt: unknown;

  updatedAt: unknown;
}