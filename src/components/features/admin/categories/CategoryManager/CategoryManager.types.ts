import type { CategoryDocument } from "@/services/category/category.types";

export interface CategoryManagerProps {
  categories: CategoryDocument[];
  loading: boolean;
  onRefresh(): Promise<void>;
}