import { uploadImage } from "@/services/cloudinary";

import type {
  UploadImageOptions,
  UploadedImage,
} from "./image.types";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export async function uploadArtworkImage(
  options: UploadImageOptions
): Promise<UploadedImage> {
  const { file, folder } = options;

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed."
    );
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(
      "Image size must be less than 10 MB."
    );
  }

  const uploaded = await uploadImage(file, folder);

  return {
    assetId: uploaded.assetId,
    publicId: uploaded.publicId,

    secureUrl: uploaded.secureUrl,

    width: uploaded.width,
    height: uploaded.height,

    bytes: uploaded.bytes,

    format: uploaded.format,

    originalFilename: uploaded.originalFilename,
  };
}