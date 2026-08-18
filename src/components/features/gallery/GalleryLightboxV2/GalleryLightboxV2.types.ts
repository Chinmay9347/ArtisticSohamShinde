import type { GalleryDocument } from "@/services/gallery/gallery.types";
import type { ReactZoomPanPinchRef } from "react-zoom-pan-pinch";

export interface GalleryLightboxProps {
  item: GalleryDocument | null;
  items: GalleryDocument[];
  isOpen: boolean;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}
export interface GalleryLightboxV2ViewerProps {
  image: string;
  alt: string;

  currentIndex: number;

  totalImages: number;

  onPrevious: () => void;

  onNext: () => void;

  transformRef: React.RefObject<ReactZoomPanPinchRef | null>;

  children?: React.ReactNode;
}
export interface GalleryLightboxV2ToolbarProps {
  zoom: number;

  onZoomChange: (value: number) => void;

  onReset: () => void;
}
export interface GalleryLightboxV2InfoProps {
  title: string;
  description?: string;
  category: string;
  medium?: string;
  dimensions?: string;
  year?: string | number;
}