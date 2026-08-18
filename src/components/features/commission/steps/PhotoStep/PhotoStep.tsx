"use client";

import { ChangeEvent, useEffect } from "react";

import { NavigationButtons } from "../../NavigationButtons";
import { ProgressBar } from "../../ProgressBar";
import { StepHeader } from "../../StepHeader";

import { photoStepStyles as styles } from "./PhotoStep.styles";
import type { PhotoStepProps } from "./PhotoStep.types";

import type { UploadedPhoto } from "@/types/commission";
import { toast } from "sonner";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

export function PhotoStep({
  commission,
}: PhotoStepProps) {
  const photos = commission.formData.photos;
  const hasRequiredPhoto = photos.length >= 1;

  useEffect(() => {
    return () => {
      photos.forEach((photo: UploadedPhoto) => {
        URL.revokeObjectURL(photo.preview);
      });
    };
  }, []);

  const handleUpload = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const files = event.target.files;

    if (!files) {
      return;
    }

    const uploadedPhotos: UploadedPhoto[] = [];

    Array.from(files).forEach((file) => {
      if (
        !ALLOWED_TYPES.includes(file.type)
      ) {
        toast.error(`${file.name} is not a supported image.`);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        alert(
          `${file.name} exceeds 10 MB.`
        );
        return;
      }

      uploadedPhotos.push({
        id:
          crypto.randomUUID?.() ??
          `${Date.now()}-${Math.random()}`,

        file,

        preview:
          URL.createObjectURL(file),

        fileName: file.name,

        size: file.size,
      });
    });

    if (!uploadedPhotos.length) {
      return;
    }

    commission.updateFormData({
      photos: [
        ...photos,
        ...uploadedPhotos,
      ],
    });

    event.target.value = "";
  };

  const removePhoto = (id: string) => {
    const photo = photos.find(
      (item: UploadedPhoto) => item.id === id
    );

    if (photo) {
      URL.revokeObjectURL(photo.preview);
    }

    commission.updateFormData({
      photos: photos.filter(
        (item: UploadedPhoto) => item.id !== id
      ),
    });
  };

  const formatSize = (
    bytes: number
  ) => {
    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  return (
    <section className={styles.container}>
      <ProgressBar
        commission={commission}
      />

      {/* <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title="Reference Photos"
        description="Upload clear reference photos to help create the best possible portrait. You can upload multiple images from different angles."
      /> */}
      <StepHeader
        currentStep={commission.currentStep + 1}
        totalSteps={commission.steps.length}
        title="Reference Photos"
        description="Upload at least 1 clear reference photo. You can upload multiple images from different angles for better portrait accuracy."
      />
      <div className={styles.uploadBox}>
        <label
          htmlFor="commission-photo-upload"
          className={styles.uploadButton}
        >
          Select Photos
        </label>

        <input
          id="commission-photo-upload"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className={styles.input}
          onChange={handleUpload}
        />

        <div className={styles.helper}>
          <p>
            Supported formats: <strong>JPG, PNG, WEBP</strong>
          </p>

          <p>
            Maximum file size: <strong>10 MB</strong> per image
          </p>

          <div className={styles.tipBox}>
            <h4 className={styles.tipTitle}>
              📸 Tips for the best portrait
            </h4>

            <ul className={styles.tipList}>
              <li>Use high-resolution photos.</li>
              <li>Ensure the face is clearly visible.</li>
              <li>Prefer natural lighting.</li>
              <li>Avoid screenshots or heavily edited images.</li>
              <li>
                Upload multiple reference photos for better
                accuracy.
              </li>
            </ul>
          </div>
        </div>
      </div>

      {!hasRequiredPhoto && (
        <p className="text-sm font-semibold text-red-500">
          At least 1 reference photo is required to continue.
        </p>
      )}

      {photos.length > 0 && (
        <div className={styles.grid}>
          {photos.map((photo: UploadedPhoto) => (
            <div
              key={photo.id}
              className={styles.card}
            >
              <img
                src={photo.preview}
                alt={photo.fileName}
                className={styles.image}
              />

              <div className={styles.content}>
                <p
                  className={
                    styles.fileName
                  }
                  title={photo.fileName}
                >
                  {photo.fileName}
                </p>

                <p
                  className={
                    styles.fileSize
                  }
                >
                  {formatSize(photo.size)}
                </p>

                <button
                  type="button"
                  className={
                    styles.removeButton
                  }
                  onClick={() =>
                    removePhoto(photo.id)
                  }
                >
                  Remove Photo
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      <NavigationButtons
        commission={commission}
        disabled={!hasRequiredPhoto}
      />
    </section>
  );
}