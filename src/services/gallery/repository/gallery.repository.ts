import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";

import { db } from "@/firebase/firestore";

import type {
  CreateArtworkInput,
  UpdateArtworkInput,
} from "./gallery.repository.types";

import {
  mapGalleryDocument,
} from "../gallery.mapper";

const COLLECTION = "gallery";

export async function getGallery() {
  const snapshot = await getDocs(
    query(
      collection(db, COLLECTION),
      orderBy("displayOrder", "asc")
    )
  );

  return snapshot.docs.map((doc) =>
    mapGalleryDocument(doc.id, doc.data())
  );
}

export async function getArtwork(
  id: string
) {
  const snapshot = await getDoc(
    doc(db, COLLECTION, id)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapGalleryDocument(
    snapshot.id,
    snapshot.data()
  );
}

export async function createArtwork(
  data: CreateArtworkInput
) {
  const slug = data.title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");

  return addDoc(
    collection(db, COLLECTION),
    {
      ...data,

      slug,

      category: data.categoryId,

      searchKeywords: [
        data.title.toLowerCase(),
        ...data.tags.map((tag) => tag.toLowerCase()),
      ],
      availableForSale: true,

      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateArtwork(
  id: string,
  data: UpdateArtworkInput
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function archiveArtwork(
  id: string
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      status: "ARCHIVED",
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function restoreArtwork(
  id: string
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      status: "PUBLISHED",
      deletedAt: null,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function toggleFeatured(
  id: string,
  featured: boolean
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      featured,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateDisplayOrder(
  id: string,
  displayOrder: number
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      displayOrder,
      updatedAt: serverTimestamp(),
    }
  );
}