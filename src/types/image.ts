export interface ImageAsset {
  assetId: string;
  publicId: string;

  secureUrl: string;

  width: number;
  height: number;

  bytes: number;

  format: string;

  originalFilename: string;
}

export interface ImageGalleryItem extends ImageAsset {
  id: string;

  alt: string;

  displayOrder: number;

  isPrimary: boolean;
}