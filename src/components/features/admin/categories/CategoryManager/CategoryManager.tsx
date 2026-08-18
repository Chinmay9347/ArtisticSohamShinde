"use client";

import {
  sortByNumber,
  sortByString,
  type SortDirection,
} from "@/lib/table";

import {
  archiveCategory,
  restoreCategory,
} from "@/services/category/category.service";

import { toast } from "sonner";
import { useState } from "react";
import { CategoryTable } from "../CategoryTable";
import { CategoryDialog } from "../CategoryDialog";
import { categoryManagerStyles } from "./CategoryManager.styles";
import type { CategoryManagerProps } from "./CategoryManager.types";


export function CategoryManager({
  categories,
  loading,
  onRefresh,
}: CategoryManagerProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "artworks">("name");
  const [direction, setDirection] = useState<SortDirection>("asc");
  async function handleVisibility(categoryId: string, visible: boolean) {
    try {
      if (visible) {
        await archiveCategory(categoryId);
        toast.success("Category hidden.");
      } else {
        await restoreCategory(categoryId);
        toast.success("Category restored.");
      }

      await onRefresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to update category.");
    }
  }
  const filteredCategories = categories.filter((category) => {
    const query = search.toLowerCase();

    return (
      category.name.toLowerCase().includes(query) ||
      category.slug.toLowerCase().includes(query)
    );
  });

  const sortedCategories =
    sortBy === "name"
      ? sortByString(
          filteredCategories,
          (category) => category.name,
          direction
        )
      : sortByNumber(
          filteredCategories,
          (category) => category.artworkCount,
          direction
        );

  return (
    <>
      <div className={categoryManagerStyles.container}>
        <div className={categoryManagerStyles.header}>
          <h2 className="text-2xl font-semibold">
            Categories
          </h2>

          <button
            onClick={() => setDialogOpen(true)}
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            Add Category
          </button>
        </div>
        <div className="my-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search categories..."
            className="w-full rounded-md border px-3 py-2"
          />
        </div>
        <div className="mb-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSortBy("name")}
            className="rounded border px-3 py-2"
          >
            Sort by Name
          </button>

          <button
            onClick={() => setSortBy("artworks")}
            className="rounded border px-3 py-2"
          >
            Sort by Artworks
          </button>

          <button
            onClick={() =>
              setDirection((previous) =>
                previous === "asc" ? "desc" : "asc"
              )
            }
            className="rounded border px-3 py-2"
          >
            {direction === "asc" ? "Ascending" : "Descending"}
          </button>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : categories.length === 0 ? (
          <div className={categoryManagerStyles.empty}>
            {search
              ? "No matching categories found."
              : "No categories found."}
          </div>
        ) : (
          <div className={categoryManagerStyles.table}>
            {/* <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Slug</th>
                  <th className="p-3 text-left">Artworks</th>
                  <th className="p-3 text-left">Visible</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {categories.map((category) => (
                  <tr
                    key={category.id}
                    className="border-b"
                  >
                    <td className="p-3">{category.name}</td>
                    <td className="p-3">{category.slug}</td>
                    <td className="p-3">{category.artworkCount}</td>
                    <td className="p-3">
                      {category.visible ? "Yes" : "No"}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          handleVisibility(category.id, category.visible)
                        }
                        className="rounded border px-3 py-1 text-sm"
                      >
                        {category.visible ? "Hide" : "Restore"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table> */}
            <CategoryTable
              categories={sortedCategories}
              onToggleVisibility={handleVisibility}
            />
          </div>
        )}
      </div>

      <CategoryDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={onRefresh}
      />
    </>
  );
}