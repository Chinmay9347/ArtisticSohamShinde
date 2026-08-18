"use client";

import {
  createArtwork,
  updateArtwork,
} from "@/services/gallery";

import type {
  ArtworkStatus,
  GalleryDocument,
} from "@/services/gallery";

import { artworkFormStyles } from "./ArtworkForm.styles";
import type {
  ArtworkFormProps,
  ArtworkFormValues,
} from "./ArtworkForm.types";

import { Controller, useForm } from "react-hook-form";
import { CategorySelect } from "@/components/features/admin/categories/CategorySelect";
import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";
import { useEffect, useState } from "react";
import { getCategories } from "@/services/category/category.service";
import type { CategoryDocument } from "@/services/category/category.types";
import { ImageUploader } from "@/components/common/ImageUploader";
import type { UploadedImage } from "@/services/image";

// const DEFAULT_VALUES: ArtworkFormValues = {
//   title: "",
//   description: "",
//   categoryId: "",
//   tags: [],
//   featured: false,
//   visible: true,
//   status: "DRAFT" as ArtworkStatus,
// };
const DEFAULT_VALUES: ArtworkFormValues = {
  title: "",
  description: "",
  categoryId: "",
  tags: [],
  featured: false,
  visible: true,
  status: "DRAFT" as ArtworkStatus,
};

export function ArtworkForm({
  mode = "create",
  artwork,
  onSuccess,
  onCancel,
}: ArtworkFormProps) {
  const {
    control,
    register,
    watch,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ArtworkFormValues>({
    defaultValues: {
      title: artwork?.title ?? "",
      description: artwork?.description ?? "",
      categoryId: artwork?.categoryId ?? "",
      tags: artwork?.tags ?? [],
      featured: artwork?.featured ?? false,
      visible: artwork?.visible ?? true,
      status: artwork?.status ?? "DRAFT",
    },
  });
  const [categories, setCategories] = useState<CategoryDocument[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [images, setImages] = useState<UploadedImage[]>([]);
  useEffect(() => {
    async function loadCategories() {
      try {
        const data = await getCategories();
        setCategories(data);
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);
  useEffect(() => {
    if (!artwork) return;

    reset({
      title: artwork.title,
      description: artwork.description ?? "",
      categoryId: artwork.categoryId ?? "",
      tags: artwork.tags,
      featured: artwork.featured,
      visible: artwork.visible,
      status: artwork.status,
    });

    setImages(
      artwork.images.map((image) => ({
        assetId: image.assetId,
        publicId: image.publicId,
        secureUrl: image.secureUrl,
        width: image.width,
        height: image.height,
        bytes: image.bytes,
        format: image.format,
        originalFilename: image.originalFilename,
      }))
    );
  }, [artwork, reset]);

  const onSubmit = async (
    values: ArtworkFormValues
  ) => {
    try {
      const payload = {
        title: values.title,
        description: values.description,
        categoryId: values.categoryId,
        tags: values.tags,
        featured: values.featured,
        visible: values.visible,
        status: values.status,
        displayOrder: artwork?.displayOrder ?? 0,
        images: images.map((image, index) => ({
          ...image,
          id:
            artwork?.images[index]?.id ??
            crypto.randomUUID(),
          alt: values.title,
          displayOrder: index,
          isPrimary: index === 0,
        })),
      };

      if (mode === "create") {
        await createArtwork(payload);

        alert("Artwork created successfully!");

        reset(DEFAULT_VALUES);

        setImages([]);
      } else {
        if (!artwork) return;

        await updateArtwork(
          artwork.id,
          payload
        );

        alert("Artwork updated successfully!");
      }

      onSuccess?.();
    } catch (error) {
      console.error(error);

      alert(
        mode === "create"
          ? "Failed to create artwork."
          : "Failed to update artwork."
      );
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={artworkFormStyles.container}
    >
      <h2 className="text-2xl font-semibold">
        {mode === "create"
          ? "Create Artwork"
          : "Edit Artwork"}
      </h2>
      <div className={artworkFormStyles.section}>
        <label className="font-medium">
          Title
        </label>

        <input
          {...register("title", {
            required: "Title is required",
          })}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Portrait of Shivaji Maharaj"
        />

        {errors.title && (
          <p className="text-sm text-red-500">
            {errors.title.message}
          </p>
        )}
      </div>

      <div className={artworkFormStyles.section}>
        <label className="font-medium">
          Description
        </label>

        <textarea
          {...register("description")}
          rows={5}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Artwork description..."
        />
      </div>
      <div className={artworkFormStyles.section}>
        <label className="font-medium">
          Artwork Images
        </label>

        <ImageUploader
          folder={CLOUDINARY_FOLDERS.GALLERY}
          value={images[0]}
          onChange={(image) => {
            if (image) {
              setImages([image]);
            } else {
              setImages([]);
            }
          }}
        />

        {images.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {images.length} image uploaded
          </p>
        )}
      </div>

      <div className={artworkFormStyles.row}>
        <div>
          <label className="font-medium">
            Category
          </label>

          <Controller
            name="categoryId"
            control={control}
            render={({ field }) => (
              // <CategorySelect
              //   value={field.value}
              //   onChange={field.onChange}
              //   options={[
              //     {
              //       id: "portraits",
              //       name: "Portraits",
              //     },
              //     {
              //       id: "family",
              //       name: "Family Portraits",
              //     },
              //     {
              //       id: "pets",
              //       name: "Pet Portraits",
              //     },
              //   ]}
              // />
              <CategorySelect
                value={field.value}
                loading={loadingCategories}
                onChange={field.onChange}
                options={categories.map((category) => ({
                  id: category.id,
                  name: category.name,
                }))}
              />
            )}
          />
        </div>

        <div>
          <label className="font-medium">
            Status
          </label>

          <select
            {...register("status")}
            className="w-full rounded-md border px-3 py-2"
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">
              Published
            </option>
            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </div>
      </div>

      <div className="flex gap-6">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("featured")}
          />

          Featured
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("visible")}
          />

          Visible
        </label>
      </div>

      <div className={artworkFormStyles.actions}>
        {mode === "edit" && (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border px-6 py-2"
          >
            Cancel
          </button>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-black px-6 py-2 text-white disabled:opacity-50"
        >
          {mode === "create"
            ? "Create Artwork"
            : "Save Changes"}
        </button>
      </div>
    </form>
  );
}