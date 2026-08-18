import type { CategoryDocument } from "@/services/category/category.types";

export interface CategoryTableProps {
  categories: CategoryDocument[];
  onToggleVisibility(
    categoryId: string,
    visible: boolean
  ): Promise<void>;
}