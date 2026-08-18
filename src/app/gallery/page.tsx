"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { getGallery } from "@/services/gallery";
import {
  getCategories,
} from "@/services/category/category.service";

import type {
  GalleryDocument,
} from "@/services/gallery/gallery.types";

import { GalleryHero } from "@/components/features/gallery/GalleryHero";
import {
  GalleryFilters,
} from "@/components/features/gallery/GalleryFilters";
import {
  GalleryGrid,
} from "@/components/features/gallery/GalleryGrid";
import {
  GalleryCTA,
} from "@/components/features/gallery/GalleryCTA";

import {
  galleryFilters as defaultGalleryFilters,
} from "@/components/features/gallery/GalleryFilters/GalleryFilters.data";

export default function GalleryPage() {
  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("all");

  const [categories, setCategories] =
    useState<
      {
        id: string;
        label: string;
        value: string;
      }[]
    >([]);

  const [galleryItems, setGalleryItems] =
    useState<GalleryDocument[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadGallery() {
      try {
        /*
         * Gallery is required.
         *
         * Categories are optional because the
         * original gallery filters must continue
         * working even if Firestore categories
         * cannot be loaded.
         */
        const galleryData = await getGallery();

        let categoryData: Awaited<
          ReturnType<typeof getCategories>
        > = [];

        try {
          categoryData =
            await getCategories();
        } catch (error) {
          console.warn(
            "Gallery categories could not be loaded. Using default filters.",
            error,
          );
        }

        if (!mounted) {
          return;
        }

        /*
         * Only public gallery artwork.
         */
        const publishedGallery =
          galleryData.filter(
            (item) =>
              item.status ===
                "PUBLISHED" &&
              item.visible === true,
          );

        setGalleryItems(
          publishedGallery,
        );

        /*
         * Original filters that must always
         * remain available.
         *
         * All
         * Celebrity
         * Couple
         * Family
         * Friends
         * Pet
         * Custom
         */
        const defaultFilters =
          defaultGalleryFilters.map(
            (filter) => ({
              id: filter.id,
              label: filter.label,
              value: filter.value,
            }),
          );

        /*
         * Firestore categories can extend the
         * original filters.
         */
        const firestoreFilters =
          categoryData
            .filter(
              (category) =>
                category.visible,
            )
            .sort(
              (a, b) =>
                a.displayOrder -
                b.displayOrder,
            )
            .map((category) => ({
              id: category.id,
              label: category.name,
              value: category.id,
            }));

        /*
         * Merge default + Firestore filters.
         *
         * Original filter labels take priority.
         *
         * Example:
         *
         * Default:
         * Celebrity
         *
         * Firestore:
         * Celebrity
         *
         * Result:
         * Celebrity appears only once.
         */
        const mergedFilters = [
          ...defaultFilters,
          ...firestoreFilters.filter(
            (firestoreFilter) =>
              !defaultFilters.some(
                (defaultFilter) =>
                  defaultFilter.label
                    .trim()
                    .toLowerCase() ===
                  firestoreFilter.label
                    .trim()
                    .toLowerCase(),
              ),
          ),
        ];

        /*
         * Final safety deduplication.
         */
        const uniqueFilters =
          Array.from(
            new Map(
              mergedFilters.map(
                (filter) => [
                  filter.value
                    .trim()
                    .toLowerCase(),
                  filter,
                ],
              ),
            ).values(),
          );

        setCategories(
          uniqueFilters,
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  /*
   * Gallery filtering.
   *
   * Supports BOTH:
   *
   * 1. New documents:
   *    categoryId
   *
   * 2. Existing/legacy documents:
   *    category
   *
   * This is important because your data model
   * explicitly supports both fields.
   */
  const filteredItems = useMemo(() => {
    if (
      selectedCategory
        .trim()
        .toLowerCase() === "all"
    ) {
      return galleryItems;
    }

    const selected =
      selectedCategory
        .trim()
        .toLowerCase();

    return galleryItems.filter(
      (item) => {
        const categoryId =
          item.categoryId
            ?.trim()
            .toLowerCase();

        const category =
          item.category
            ?.trim()
            .toLowerCase();

        /*
         * New category reference.
         */
        if (
          categoryId === selected
        ) {
          return true;
        }

        /*
         * Existing category field.
         */
        if (
          category === selected
        ) {
          return true;
        }

        return false;
      },
    );
  }, [
    galleryItems,
    selectedCategory,
  ]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading gallery...
      </div>
    );
  }

  return (
    <>
      <GalleryHero />

      <GalleryFilters
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        categories={categories}
      />

      <GalleryGrid
        items={filteredItems}
      />

      <GalleryCTA />
    </>
  );
}

// "use client";

// import { useEffect, useMemo, useState } from "react";

// import { getGallery } from "@/services/gallery";
// import {
//   getCategories,
// } from "@/services/category/category.service";

// import type { GalleryDocument } from "@/services/gallery/gallery.types";

// import { GalleryHero } from "@/components/features/gallery/GalleryHero";
// import { GalleryFilters } from "@/components/features/gallery/GalleryFilters";
// import { GalleryGrid } from "@/components/features/gallery/GalleryGrid";
// import { GalleryCTA } from "@/components/features/gallery/GalleryCTA";

// import {
//   galleryFilters as defaultGalleryFilters,
// } from "@/components/features/gallery/GalleryFilters/GalleryFilters.data";

// export default function GalleryPage() {
//   const [selectedCategory, setSelectedCategory] =
//     useState("all");

//   const [categories, setCategories] =
//     useState<
//       {
//         id: string;
//         label: string;
//         value: string;
//       }[]
//     >([]);

//   const [galleryItems, setGalleryItems] =
//     useState<GalleryDocument[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   useEffect(() => {
//     let mounted = true;

//     async function loadGallery() {
//       try {
//         const galleryPromise = getGallery();

//         const categoryPromise =
//           getCategories().catch(() => []);

//         const [data, categoryData] =
//           await Promise.all([
//             galleryPromise,
//             categoryPromise,
//           ]);

//         if (!mounted) return;

//         setGalleryItems(
//           data.filter(
//             (item) =>
//               item.status === "PUBLISHED" &&
//               item.visible,
//           ),
//         );

//         /*
//          * Keep the original gallery buttons available.
//          *
//          * Firestore categories can be added later,
//          * but they must not replace the original
//          * Gallery filter buttons.
//          */
//         const firestoreCategories =
//           categoryData
//             .filter(
//               (category) => category.visible,
//             )
//             .sort(
//               (a, b) =>
//                 a.displayOrder -
//                 b.displayOrder,
//             )
//             .map((category) => ({
//               id: category.id,
//               label: category.name,
//               value: category.id,
//             }));

//         const originalCategories =
//           defaultGalleryFilters.filter(
//             (filter) =>
//               filter.value !== "all",
//           );

//         const merged = [
//           {
//             id: "all",
//             label: "All",
//             value: "all",
//           },
//           ...originalCategories,
//           ...firestoreCategories.filter(
//             (firestoreCategory) =>
//               !originalCategories.some(
//                 (originalCategory) =>
//                   originalCategory.label
//                     .toLowerCase() ===
//                   firestoreCategory.label
//                     .toLowerCase(),
//               ),
//           ),
//         ];

//         setCategories(merged);
//       } finally {
//         if (mounted) {
//           setLoading(false);
//         }
//       }
//     }

//     loadGallery();

//     return () => {
//       mounted = false;
//     };
//   }, []);

//   const filteredItems = useMemo(() => {
//     if (selectedCategory === "all") {
//       return galleryItems;
//     }

//     return galleryItems.filter((item) => {
//       /*
//        * Support both:
//        *
//        * categoryId = Firestore category ID
//        *
//        * and
//        *
//        * categoryId = original category value
//        */
//       return (
//         item.categoryId ===
//           selectedCategory ||
//         String(item.categoryId)
//           .toLowerCase() ===
//           selectedCategory.toLowerCase()
//       );
//     });
//   }, [
//     galleryItems,
//     selectedCategory,
//   ]);

//   if (loading) {
//     return (
//       <div className="py-20 text-center">
//         Loading gallery...
//       </div>
//     );
//   }

//   return (
//     <>
//       <GalleryHero />

//       <GalleryFilters
//         selected={selectedCategory}
//         onSelect={setSelectedCategory}
//         categories={categories}
//       />

//       <GalleryGrid items={filteredItems} />

//       <GalleryCTA />
//     </>
//   );
// }

//12/07/2026  0.0v
// "use client";

// import { useEffect, useState } from "react";

// import { getGallery } from "@/services/gallery";
// import { getCategories } from "@/services/category/category.service";
// import type { GalleryDocument } from "@/services/gallery/gallery.types";

// import { GalleryHero } from "@/components/features/gallery/GalleryHero";
// import { GalleryFilters } from "@/components/features/gallery/GalleryFilters";
// import { GalleryGrid } from "@/components/features/gallery/GalleryGrid";
// import { GalleryCTA } from "@/components/features/gallery/GalleryCTA";

// export default function GalleryPage() {
//   const [selectedCategory, setSelectedCategory] =
//     useState("all");

//   const [categories, setCategories] = useState<{ id: string; label: string; value: string }[]>([]);

//   const [galleryItems, setGalleryItems] =
//     useState<GalleryDocument[]>([]);

//   const [loading, setLoading] =
//     useState(true);

//   useEffect(() => {
//     async function loadGallery() {
//       try {
//         const [data, categoryData] = await Promise.all([
//           getGallery(),
//           getCategories(),
//         ]);
//         setGalleryItems(data.filter((item) => item.status === "PUBLISHED" && item.visible));
//         setCategories(
//           categoryData
//             .filter((category) => category.visible)
//             .sort((a, b) => a.displayOrder - b.displayOrder)
//             .map((category) => ({
//               id: category.id,
//               label: category.name,
//               value: category.id,
//             })),
//         );
//       } finally {
//         setLoading(false);
//       }
//     }

//     loadGallery();
//   }, []);

//   const filteredItems =
//     selectedCategory === "all"
//       ? galleryItems
//       : galleryItems.filter(
//           (item) =>
//             item.categoryId ===
//             selectedCategory
//         );
  
//   if (loading) {
//     return (
//       <div className="py-20 text-center">
//         Loading gallery...
//       </div>
//     );
//   }

//   return (
//     <>
//       <GalleryHero />

//       <GalleryFilters
//         selected={selectedCategory}
//         onSelect={setSelectedCategory}
//         categories={categories}
//       />

//       <GalleryGrid items={filteredItems} />

//       <GalleryCTA />
//     </>
//   );
// }

//12/07/2026  0.0v
// import { GalleryHero } from "@/components/features/gallery/GalleryHero";
// import { GalleryFilters } from "@/components/features/gallery/GalleryFilters";
// import { GalleryGrid } from "@/components/features/gallery/GalleryGrid";
// import { GalleryCTA } from "@/components/features/gallery/GalleryCTA";

// export default function GalleryPage() {
//   return (
//     <>
//       <GalleryHero />
//       <GalleryFilters />
//       <GalleryGrid />
//       <GalleryCTA />
//     </>
//   );
// }

// import { Container } from "@/components/ui/Container";
// import { Heading } from "@/components/ui/Heading";
// import { Section } from "@/components/ui/Section";
// import { Typography } from "@/components/ui/Typography";

// export default function GalleryPage() {
//   return (
//     <Section>
//       <Container>
//         <Heading level={1}>Gallery</Heading>

//         <Typography className="mt-6">
//           Our premium pencil portrait gallery will be available here.
//         </Typography>
//       </Container>
//     </Section>
//   );
// }