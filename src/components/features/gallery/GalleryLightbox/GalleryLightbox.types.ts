import { GalleryItem } from "@/types/gallery";

export interface GalleryLightboxProps {
  item: GalleryItem | null;
  items: GalleryItem[];
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}