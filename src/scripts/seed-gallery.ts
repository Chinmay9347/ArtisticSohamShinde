import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { db } from "@/firebase/firestore";
import { galleryItems } from "@/data/gallery";

async function seedGallery() {
  try {
    const galleryRef = collection(db, "gallery");

    for (const item of galleryItems) {
      await addDoc(galleryRef, {
        title: item.title,
        slug: item.title
          .toLowerCase()
          .replace(/\s+/g, "-"),

        category: item.category,

        featured: item.featured,

        displayOrder: item.id,

        image: {
          url: item.image,
          publicId: "",
          width: 0,
          height: 0,
          format: "",
        },

        description: item.description ?? "",

        medium: item.medium ?? "",

        dimensions: item.dimensions ?? "",

        year: item.year ?? "",

        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      console.log(`✅ Seeded: ${item.title}`);
    }

    console.log("🎉 Gallery seeding completed.");
  } catch (error) {
    console.error(error);
  }
}

seedGallery();