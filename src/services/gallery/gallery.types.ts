import type { Timestamp } from "firebase/firestore";
import type { ImageGalleryItem } from "@/types/image";

export type ArtworkStatus =
  | "DRAFT"
  | "PUBLISHED"
  | "ARCHIVED";
export interface GalleryDocument {
  id: string;
  title: string;
  slug: string;
  description?: string;
  /**
   * Temporary.
   * Will be replaced by categoryId after Category Management is completed.
   */
  category: string;
  /**
   * Future category reference.
   */
  categoryId?: string;
  featured: boolean;
  visible: boolean;
  status: ArtworkStatus;
  availableForSale?: boolean;
  displayOrder: number;
  tags: string[];
  searchKeywords: string[];
  /**
   * Legacy field.
   * Existing gallery keeps working while we migrate.
   */
  image?: ImageGalleryItem;
  /**
   * New preferred field.
   */
  images: ImageGalleryItem[];
  medium?: string;
  dimensions?: string;
  year?: string;
  createdBy?: string;
  updatedBy?: string;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
  deletedAt?: Timestamp;
}