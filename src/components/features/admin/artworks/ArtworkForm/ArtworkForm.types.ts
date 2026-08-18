import type {
  ArtworkStatus,
  GalleryDocument,
} from "@/services/gallery";

export interface ArtworkFormProps {
  mode?: "create" | "edit";

  artwork?: GalleryDocument;

  onSuccess?(): void;

  onCancel?(): void;
}

export interface ArtworkFormValues {
  title: string;

  description: string;

  categoryId: string;

  tags: string[];

  featured: boolean;

  visible: boolean;

  status: ArtworkStatus;
}