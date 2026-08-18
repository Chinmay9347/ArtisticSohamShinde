import {
  createReferral as repositoryCreateReferral,
  createReferralCampaign as repositoryCreateReferralCampaign,
  getReferral as repositoryGetReferral,
  getReferrals as repositoryGetReferrals,
  getReferralByCode as repositoryGetReferralByCode,
  getReferralCampaign as repositoryGetReferralCampaign,
  getReferralCampaigns as repositoryGetReferralCampaigns,
  getEnabledReferralCampaigns as repositoryGetEnabledReferralCampaigns,
  getReferralsForUser as repositoryGetReferralsForUser,
  updateReferralCampaign as repositoryUpdateReferralCampaign,
  updateReferralStatus as repositoryUpdateReferralStatus,
  deleteReferral as repositoryDeleteReferral,
} from "./referral.repository";

import type {
  ReferralCampaignFormData,
  ReferralStatus,
} from "@/types/referral";

export async function getReferralCampaigns() {
  return repositoryGetReferralCampaigns();
}

export async function getEnabledReferralCampaigns() {
  return repositoryGetEnabledReferralCampaigns();
}

export async function getReferralCampaign(
  id: string,
) {
  return repositoryGetReferralCampaign(
    id,
  );
}

export async function createReferralCampaign(
  data: ReferralCampaignFormData,
) {
  return repositoryCreateReferralCampaign(
    data,
  );
}

export async function updateReferralCampaign(
  id: string,
  data: Partial<ReferralCampaignFormData>,
) {
  return repositoryUpdateReferralCampaign(
    id,
    data,
  );
}

export async function createReferral(
  data: Parameters<
    typeof repositoryCreateReferral
  >[0],
) {
  return repositoryCreateReferral(
    data,
  );
}

export async function getReferrals() {
  return repositoryGetReferrals();
}

export async function getReferralsForUser(userId: string) {
  return repositoryGetReferralsForUser(userId);
}

export async function getReferral(
  id: string,
) {
  return repositoryGetReferral(id);
}

export async function getReferralByCode(
  code: string,
) {
  return repositoryGetReferralByCode(
    code,
  );
}

export async function updateReferralStatus(
  id: string,
  status: ReferralStatus,
  extra?: Record<string, unknown>,
) {
  return repositoryUpdateReferralStatus(
    id,
    status,
    extra,
  );
}

export async function deleteReferral(id: string) {
  return repositoryDeleteReferral(id);
}
