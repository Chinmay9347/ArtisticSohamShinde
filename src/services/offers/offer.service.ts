import {
  archiveOffer as repositoryArchiveOffer,
  createOffer as repositoryCreateOffer,
  getOffer as repositoryGetOffer,
  getOfferByCode as repositoryGetOfferByCode,
  getOffers as repositoryGetOffers,
  updateOffer as repositoryUpdateOffer,
  incrementOfferUsage as repositoryIncrementOfferUsage,
} from "./offer.repository";

import type {
  OfferFormData,
} from "@/types/offer";

export async function getOffers() {
  return repositoryGetOffers();
}

export async function getOfferByCode(code: string) { return repositoryGetOfferByCode(code); }

export async function getOffer(
  id: string,
) {
  return repositoryGetOffer(id);
}

export async function createOffer(
  data: OfferFormData,
) {
  return repositoryCreateOffer(data);
}

export async function updateOffer(
  id: string,
  data: Partial<OfferFormData>,
) {
  return repositoryUpdateOffer(
    id,
    data,
  );
}

export async function archiveOffer(
  id: string,
) {
  return repositoryArchiveOffer(id);
}
export async function incrementOfferUsage(id:string){return repositoryIncrementOfferUsage(id);}
