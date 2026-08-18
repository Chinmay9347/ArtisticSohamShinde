import {
  addDoc,
  collection,
  getDocs,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import { galleryItems } from "@/data/gallery";

import { uploadImage } from "@/services/cloudinary";

import { CLOUDINARY_FOLDERS } from "@/constants/cloudinary";

import {
  GalleryImportCallbacks,
  GalleryImportProgress,
} from "./gallery-import.types";

const COLLECTION_NAME = "gallery";

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-");
}

async function fetchAsFile(
  imagePath: string,
  fileName: string
): Promise<File> {
  const response = await fetch(imagePath);

  if (!response.ok) {
    throw new Error(
      `Unable to fetch ${imagePath}`
    );
  }

  const blob = await response.blob();

  return new File(
    [blob],
    fileName,
    {
      type: blob.type,
    }
  );
}

async function artworkExists(
  slug: string
) {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("slug", "==", slug)
  );

  const snapshot =
    await getDocs(q);

  return !snapshot.empty;
}

export async function importGallery(
  callbacks?: GalleryImportCallbacks
) {
  const progress: GalleryImportProgress =
    {
      total: galleryItems.length,
      current: 0,
      uploaded: 0,
      skipped: 0,
      failed: 0,
    };

  callbacks?.onProgress?.(
    progress
  );

  for (const artwork of galleryItems) {
    progress.current++;

    try {
      const slug =
        slugify(artwork.title);

      const exists =
        await artworkExists(
          slug
        );

      if (exists) {
        progress.skipped++;

        callbacks?.onItemComplete?.({
          success: true,
          artwork,
          message:
            "Already imported",
        });

        callbacks?.onProgress?.(
          {
            ...progress,
          }
        );

        continue;
      }

      const file =
        await fetchAsFile(
          artwork.image,
          `${slug}.jpg`
        );

      const uploaded =
        await uploadImage(
          file,
          CLOUDINARY_FOLDERS.GALLERY
        );

      await addDoc(
        collection(
          db,
          COLLECTION_NAME
        ),
        {
          title:
            artwork.title,

          slug,

          category:
            artwork.category,

          description:
            artwork.description ??
            "",

          featured:
            artwork.featured,

          displayOrder:
            artwork.id,

          medium:
            artwork.medium ??
            "",

          dimensions:
            artwork.dimensions ??
            "",

          year:
            artwork.year ??
            "",

          images: [{
            id: crypto.randomUUID(),
            assetId: uploaded.assetId,
            publicId: uploaded.publicId,
            secureUrl: uploaded.secureUrl,
            width: uploaded.width,
            height: uploaded.height,
            bytes: uploaded.bytes,
            format: uploaded.format,
            originalFilename: uploaded.originalFilename,
            alt: artwork.alt,
            displayOrder: 0,
            isPrimary: true,
          }],
          image: {
            id: crypto.randomUUID(),
            assetId: uploaded.assetId,
            publicId: uploaded.publicId,
            secureUrl: uploaded.secureUrl,
            width: uploaded.width,
            height: uploaded.height,
            bytes: uploaded.bytes,
            format: uploaded.format,
            originalFilename: uploaded.originalFilename,
            alt: artwork.alt,
            displayOrder: 0,
            isPrimary: true,
          },

          createdAt:
            serverTimestamp(),

          updatedAt:
            serverTimestamp(),
        }
      );

      progress.uploaded++;

      callbacks?.onItemComplete?.({
        success: true,
        artwork,
        message:
          "Uploaded successfully",
      });
    } catch (error) {
      console.error(error);

      progress.failed++;

      callbacks?.onItemComplete?.({
        success: false,
        artwork,
        message:
          "Failed",
      });
    }

    callbacks?.onProgress?.({
      ...progress,
    });
  }

  return progress;
}