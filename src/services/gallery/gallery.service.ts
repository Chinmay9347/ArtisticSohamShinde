import {
  getGallery as repositoryGetGallery,
  getArtwork as repositoryGetArtwork,
  createArtwork as repositoryCreateArtwork,
  updateArtwork as repositoryUpdateArtwork,
  archiveArtwork as repositoryArchiveArtwork,
  restoreArtwork as repositoryRestoreArtwork,
  toggleFeatured as repositoryToggleFeatured,
  updateDisplayOrder as repositoryUpdateDisplayOrder,
} from "./repository";

import type {
  CreateArtworkInput,
  UpdateArtworkInput,
} from "./repository";

export async function toggleArtworkFeatured(
  artworkId: string,
  featured: boolean
) {
  return repositoryToggleFeatured(artworkId, featured);
}

export async function toggleArtworkAvailability(artworkId: string, availableForSale: boolean) { return updateArtwork(artworkId, { availableForSale }); }

export async function toggleArtworkVisible(
  artworkId: string,
  visible: boolean
) {
  return updateArtwork(artworkId, {
    visible,
  });
}

export async function getGallery() {
  return repositoryGetGallery();
}

export async function getArtwork(id: string) {
  return repositoryGetArtwork(id);
}

export async function createArtwork(
  data: CreateArtworkInput
) {
  return repositoryCreateArtwork(data);
}

export async function updateArtwork(
  id: string,
  data: UpdateArtworkInput
) {
  return repositoryUpdateArtwork(id, data);
}

export async function archiveArtwork(id: string) {
  return repositoryArchiveArtwork(id);
}

export async function restoreArtwork(id: string) {
  return repositoryRestoreArtwork(id);
}

export async function toggleFeatured(
  id: string,
  featured: boolean
) {
  return repositoryToggleFeatured(id, featured);
}

export async function updateDisplayOrder(
  id: string,
  order: number
) {
  return repositoryUpdateDisplayOrder(id, order);
}