export interface CategoryDocument {
  id: string;

  name: string;

  slug: string;

  description: string;

  displayOrder: number;

  visible: boolean;

  artworkCount: number;

  createdAt: unknown;

  updatedAt: unknown;

  deletedAt: unknown | null;
}

export interface CategoryFormData {
  name: string;

  slug: string;

  description: string;

  visible: boolean;
}