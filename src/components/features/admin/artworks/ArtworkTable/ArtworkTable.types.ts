import type { GalleryDocument } from "@/services/gallery";

export interface ArtworkTableProps {
  artworks: GalleryDocument[];

  loading?: boolean;

  onEdit?(artwork: GalleryDocument): void;

  onArchive?(artwork: GalleryDocument): void;

  onRestore?(artwork: GalleryDocument): void;

  onRefresh?(): void;
}