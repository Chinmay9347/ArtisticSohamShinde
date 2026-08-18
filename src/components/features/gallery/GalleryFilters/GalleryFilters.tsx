"use client";

import { Container } from "@/components/ui/Container";
import { Section } from "@/components/ui/Section";
import { GalleryFiltersCard } from "./GalleryFiltersCard";
import type {
  GalleryFiltersProps,
} from "./GalleryFilters.types";
import { galleryFiltersStyles } from "./GalleryFilters.styles";

export function GalleryFilters({
  selected,
  onSelect,
  categories = [],
}: GalleryFiltersProps) {
  /*
   * Remove duplicate filters by value.
   *
   * This protects the Gallery from duplicate:
   * - all
   * - category IDs
   * - category values
   */
  const uniqueFilters = Array.from(
    new Map(
      categories.map((filter) => [
        filter.value.toLowerCase(),
        filter,
      ]),
    ).values(),
  );

  /*
   * Always guarantee an All button.
   */
  const hasAll = uniqueFilters.some(
    (filter) =>
      filter.value.toLowerCase() === "all",
  );

  const filters = hasAll
    ? uniqueFilters
    : [
        {
          id: "all",
          label: "All",
          value: "all",
        },
        ...uniqueFilters,
      ];

  return (
    <Section>
      <Container>
        <div
          className={
            galleryFiltersStyles.wrapper
          }
        >
          {filters.map((filter) => (
            <GalleryFiltersCard
              key={filter.value}
              filter={filter}
              selected={selected}
              onSelect={onSelect}
            />
          ))}
        </div>
      </Container>
    </Section>
  );
}

// "use client";

// import { Container } from "@/components/ui/Container";
// import { Section } from "@/components/ui/Section";
// import { GalleryFiltersCard } from "./GalleryFiltersCard";
// import type { GalleryFiltersProps } from "./GalleryFilters.types";
// import { galleryFiltersStyles } from "./GalleryFilters.styles";

// export function GalleryFilters({ selected, onSelect, categories = [] }: GalleryFiltersProps) {
//   const filters = [
//     { id: "all", label: "All", value: "all" },
//     ...categories,
//   ];

//   return (
//     <Section>
//       <Container>
//         <div className={galleryFiltersStyles.wrapper}>
//           {filters.map((filter) => (
//             <GalleryFiltersCard
//               key={filter.id}
//               filter={filter}
//               selected={selected}
//               onSelect={onSelect}
//             />
//           ))}
//         </div>
//       </Container>
//     </Section>
//   );
// }
