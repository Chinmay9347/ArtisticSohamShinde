import type { ImageAsset } from "@/types/image";

export type UploadedImage = ImageAsset;
export interface UploadImageOptions {
  file: File;
  folder: string;
}
