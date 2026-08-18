"use client";

import { useEffect, useState } from "react";

import { CategoryManager } from "@/components/features/admin/categories/CategoryManager";

import {
  getCategories,
} from "@/services/category/category.service";

import type {
  CategoryDocument,
} from "@/services/category/category.types";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadCategories() {
    setLoading(true);

    try {
      const data = await getCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <CategoryManager
      categories={categories}
      loading={loading}
      onRefresh={loadCategories}
    />
  );
}