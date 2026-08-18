import {
  archiveCategory as repositoryArchiveCategory,
  createCategory as repositoryCreateCategory,
  getCategories as repositoryGetCategories,
  getCategory as repositoryGetCategory,
  restoreCategory as repositoryRestoreCategory,
  updateCategory as repositoryUpdateCategory,
} from "./category.repository";

import type {
  CategoryFormData,
} from "./category.types";

export async function getCategories() {
  return repositoryGetCategories();
}

export async function getCategory(id: string) {
  return repositoryGetCategory(id);
}

export async function createCategory(
  data: CategoryFormData
) {
  return repositoryCreateCategory(data);
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
) {
  return repositoryUpdateCategory(id, data);
}

export async function archiveCategory(
  id: string
) {
  return repositoryArchiveCategory(id);
}

export async function restoreCategory(
  id: string
) {
  return repositoryRestoreCategory(id);
}