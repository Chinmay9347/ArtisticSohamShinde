import type { GalleryDocument } from "@/services/gallery";

export interface ArtworkManagerState {
  artworks: GalleryDocument[];

  filteredArtworks: GalleryDocument[];

  loading: boolean;

  error: string | null;

  selectedArtwork: GalleryDocument | null;

  isCreateOpen: boolean;

  isEditOpen: boolean;

  search: string;

  statusFilter: "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED";

  featuredFilter: "ALL" | "YES" | "NO";
}