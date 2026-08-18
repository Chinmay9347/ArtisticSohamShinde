import type { CategoryDocument } from "./category.types";

export function mapCategoryDocument(
  id: string,
  data: Record<string, unknown>
): CategoryDocument {
  return {
    id,

    name: (data.name as string) ?? "",

    slug: (data.slug as string) ?? "",

    description:
      (data.description as string) ?? "",

    displayOrder:
      (data.displayOrder as number) ?? 0,

    visible:
      (data.visible as boolean) ?? true,

    artworkCount:
      (data.artworkCount as number) ?? 0,

    createdAt: data.createdAt,

    updatedAt: data.updatedAt,

    deletedAt: data.deletedAt ?? null,
  };
}