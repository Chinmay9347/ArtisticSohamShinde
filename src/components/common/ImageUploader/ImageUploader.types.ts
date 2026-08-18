import type { UploadedImage } from "@/services/image";

export interface ImageUploaderProps {
  folder: string;

  value?: UploadedImage;

  disabled?: boolean;

  onChange(image: UploadedImage | null): void;
}