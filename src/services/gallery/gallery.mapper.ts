import { GalleryDocument } from "./gallery.types";

export function mapGalleryDocument(
  id: string,
  data: Record<string, unknown>
): GalleryDocument {
  const rawImage = data.image as Record<string, unknown> | undefined;
  const image = rawImage
    ? ({
        id: String(rawImage.id ?? crypto.randomUUID()),
        assetId: String(rawImage.assetId ?? ""),
        publicId: String(rawImage.publicId ?? ""),
        secureUrl: String(rawImage.secureUrl ?? rawImage.url ?? ""),
        width: Number(rawImage.width ?? 0),
        height: Number(rawImage.height ?? 0),
        bytes: Number(rawImage.bytes ?? 0),
        format: String(rawImage.format ?? ""),
        originalFilename: String(rawImage.originalFilename ?? ""),
        alt: String(rawImage.alt ?? data.title ?? ""),
        displayOrder: Number(rawImage.displayOrder ?? 0),
        isPrimary: Boolean(rawImage.isPrimary ?? true),
      } as GalleryDocument["image"])
    : undefined;

  const images =
    (data.images as GalleryDocument["images"] | undefined) ??
    (image ? [image] : []);

  return {
    id,
    title: String(data.title ?? ""),
    slug: String(data.slug ?? ""),
    description: data.description as string | undefined,
    category: String(data.category ?? ""),
    categoryId: data.categoryId as string | undefined,
    featured: (data.featured as boolean) ?? false,
    visible: (data.visible as boolean) ?? true,
    availableForSale: (data.availableForSale as boolean) ?? true,
    status:(data.status as GalleryDocument["status"]) ?? "PUBLISHED",
    displayOrder:(data.displayOrder as number) ?? 0,
    tags:(data.tags as string[]) ?? [],
    searchKeywords:(data.searchKeywords as string[]) ?? [],

    image,
    images,
    medium: data.medium as string | undefined,
    dimensions:data.dimensions as string | undefined,
    year: data.year as string | undefined,

    createdBy:data.createdBy as string | undefined,
    updatedBy:data.updatedBy as string | undefined,
    createdAt:data.createdAt as GalleryDocument["createdAt"],
    updatedAt:data.updatedAt as GalleryDocument["updatedAt"],
    deletedAt:data.deletedAt as GalleryDocument["deletedAt"],
  };
}