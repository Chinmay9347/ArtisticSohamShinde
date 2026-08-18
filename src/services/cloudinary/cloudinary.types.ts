export interface CloudinaryUploadResult {
  assetId: string;
  publicId: string;

  version: number;

  width: number;
  height: number;

  format: string;
  resourceType: string;

  bytes: number;

  secureUrl: string;

  originalFilename: string;

  folder?: string;
}