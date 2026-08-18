"use client";

import { useState } from "react";
import { toast } from "sonner";
import { createCategory } from "@/services/category/category.service";
import { generateSlug } from "@/lib/gallery";

import type { CategoryDialogProps } from "./CategoryDialog.types";

export function CategoryDialog({
  open,
  onClose,
  onCreated,
}: CategoryDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);

  if (!open) return null;

  // async function handleSave() {
  //   if (!name.trim()) return;

  //   setSaving(true);

  //   try {
  //     await createCategory({
  //       name,
  //       slug: generateSlug(name),
  //       description,
  //       visible: true,
  //     });

  //     await onCreated();

  //     onClose();

  //     setName("");
  //     setDescription("");
  //   } finally {
  //     setSaving(false);
  //   }
  // }
  async function handleSave() {
    if (!name.trim()) {
      toast.error("Category name is required.");
      return;
    }

    setSaving(true);

    try {
      await createCategory({
        name: name.trim(),
        slug: generateSlug(name),
        description: description.trim(),
        visible: true,
      });

      toast.success("Category created successfully.");

      setName("");
      setDescription("");

      await onCreated();

      onClose();
    } catch (error) {
      console.error(error);

      toast.error("Failed to create category.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-lg rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-6 text-xl font-semibold">
          Create Category
        </h2>

        <div className="space-y-4">
          <input
            disabled={saving}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Category name"
            className="w-full rounded-md border px-3 py-2"
          />

          <textarea
            disabled={saving}
            rows={4}
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Description"
            className="w-full rounded-md border px-3 py-2"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            disabled={saving}
            onClick={onClose}
            className="rounded-md border px-4 py-2"
          >
            Cancel
          </button>

          <button
            disabled={saving}
            onClick={handleSave}
            className="rounded-md bg-black px-4 py-2 text-white"
          >
            {saving ? "Saving..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}