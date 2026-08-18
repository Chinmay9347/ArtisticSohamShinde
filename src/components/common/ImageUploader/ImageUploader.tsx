"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useEffect } from "react";
import { uploadArtworkImage } from "@/services/image";

import type { UploadedImage } from "@/services/image";

import { imageUploaderStyles } from "./ImageUploader.styles";
import type { ImageUploaderProps } from "./ImageUploader.types";

export function ImageUploader({
  folder,
  value,
  disabled = false,
  onChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    value?.secureUrl ?? null
    );
  useEffect(() => {
    setPreviewUrl(value?.secureUrl ?? null);
  }, [value]);

//   async function handleFile(file: File) {
//     setError("");
//     setUploading(true);

//     try {
//       const uploaded = await uploadArtworkImage({
//         file,
//         folder,
//       });

//       onChange(uploaded);
//     } catch (error) {
//       setError(
//         error instanceof Error
//           ? error.message
//           : "Upload failed."
//       );
//     } finally {
//       setUploading(false);
//     }
//   }
  async function handleFile(file: File) {
    setError("");

    const localPreview = URL.createObjectURL(file);

    setPreviewUrl(localPreview);

    setUploading(true);

    try {
        const uploaded = await uploadArtworkImage({
        file,
        folder,
        });

        onChange(uploaded);

        URL.revokeObjectURL(localPreview);
    } catch (error) {
        URL.revokeObjectURL(localPreview);

        setPreviewUrl(value?.secureUrl ?? null);

        setError(
        error instanceof Error
            ? error.message
            : "Upload failed."
        );
    } finally {
        setUploading(false);
    }
  }
  function handleDragOver(
    event: React.DragEvent<HTMLDivElement>
    ) {
    event.preventDefault();
    setDragActive(true);
    }

    function handleDragLeave(
    event: React.DragEvent<HTMLDivElement>
    ) {
    event.preventDefault();
    setDragActive(false);
    }

    function handleDrop(
    event: React.DragEvent<HTMLDivElement>
    ) {
    event.preventDefault();

    setDragActive(false);

    const file = event.dataTransfer.files?.[0];

    if (file) {
        void handleFile(file);
    }
    }

  return (
    <div
      className={`${imageUploaderStyles.container} ${
        dragActive
          ? imageUploaderStyles.dragActive
          : ""
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {value ? (
        <div className="space-y-4">
          <div className="relative mx-auto h-80 w-full max-w-md">
            <Image
                src={previewUrl ?? value!.secureUrl}
                alt={value?.originalFilename ?? "Preview"}
                fill
                className="rounded-lg object-contain"
            />
          </div>

          <button
            type="button"
            onClick={() => {
                setPreviewUrl(null);
                onChange(null);
                }}
            className={imageUploaderStyles.remove}
          >
            Remove Image
          </button>
        </div>
      ) : (
        <div className={imageUploaderStyles.placeholder}>
          <button
            type="button"
            disabled={disabled || uploading}
            className={imageUploaderStyles.button}
            onClick={() => inputRef.current?.click()}
          >
            {uploading
                ? "Uploading..."
                : "Choose Image or Drop Here"}
          </button>
        </div>
      )}

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*"
        disabled={uploading || disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];

          if (file) {
            void handleFile(file);
          }
        }}
      />

      {error && (
        <p className={imageUploaderStyles.error}>
          {error}
        </p>
      )}
    </div>
  );
}