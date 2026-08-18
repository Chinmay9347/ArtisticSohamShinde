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
import { galleryItems } from "@/data/gallery";

import { mapCategoryDocument } from "./category.mapper";
import type { CategoryFormData } from "./category.types";

const COLLECTION = "categories";

export async function getCategories() {
  let snapshot;
  try { snapshot = await getDocs(query(collection(db, COLLECTION), orderBy("displayOrder", "asc"))); } catch { snapshot = await getDocs(collection(db, COLLECTION)); }

  const mapped = snapshot.docs.map((document) =>
    mapCategoryDocument(document.id, document.data())
  );
  if (mapped.length > 0) return mapped;
  const legacyNames = Array.from(new Set(galleryItems.map((item) => item.category).filter(Boolean)));
  return legacyNames.map((name, index) => ({ id: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), name, slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), description: "Legacy category available for existing artwork.", displayOrder: index, visible: true, artworkCount: galleryItems.filter((item) => item.category === name).length, createdAt: null, updatedAt: null, deletedAt: null }));
}

export async function getCategory(id: string) {
  const snapshot = await getDoc(
    doc(db, COLLECTION, id)
  );

  if (!snapshot.exists()) {
    return null;
  }

  return mapCategoryDocument(
    snapshot.id,
    snapshot.data()
  );
}

export async function createCategory(
  data: CategoryFormData
) {
  return addDoc(
    collection(db, COLLECTION),
    {
      ...data,
      artworkCount: 0,
      displayOrder: 0,
      deletedAt: null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function updateCategory(
  id: string,
  data: Partial<CategoryFormData>
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      ...data,
      updatedAt: serverTimestamp(),
    }
  );
}

export async function archiveCategory(
  id: string
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      visible: false,
      deletedAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    }
  );
}

export async function restoreCategory(
  id: string
) {
  return updateDoc(
    doc(db, COLLECTION, id),
    {
      visible: true,
      deletedAt: null,
      updatedAt: serverTimestamp(),
    }
  );
}