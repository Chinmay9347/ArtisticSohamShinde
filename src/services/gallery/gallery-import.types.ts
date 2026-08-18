import type { GalleryItem } from "@/types/gallery";

export interface GalleryImportProgress {
  total: number;
  current: number;
  uploaded: number;
  skipped: number;
  failed: number;
}

export interface GalleryImportResult {
  success: boolean;
  artwork: GalleryItem;
  message: string;
}

export interface GalleryImportCallbacks {
  onProgress?: (
    progress: GalleryImportProgress
  ) => void;

  onItemComplete?: (
    result: GalleryImportResult
  ) => void;
}