import type {
  ArtworkStatus,
  GalleryDocument,
} from "../gallery.types";
import type { ImageGalleryItem } from "@/types/image";

// export interface CreateArtworkInput {
//   title: string;
//   description?: string;

//   categoryId: string;

//   featured: boolean;
//   visible: boolean;
//   status: ArtworkStatus;

//   displayOrder: number;

//   tags: string[];

//   images: ImageGalleryItem[];
// }
export interface CreateArtworkInput {
  title: string;
  description?: string;

  categoryId: string;

  featured: boolean;
  visible: boolean;
  availableForSale?: boolean;
  status: ArtworkStatus;

  displayOrder: number;

  tags: string[];

  images: ImageGalleryItem[];
}

export type UpdateArtworkInput =
  Partial<CreateArtworkInput>;