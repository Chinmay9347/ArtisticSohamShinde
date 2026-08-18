import { cn } from "@/lib/utils";

import { GalleryFilter } from "./GalleryFilters.types";
import { galleryFiltersStyles } from "./GalleryFilters.styles";

interface Props {
  filter: GalleryFilter;
  selected: string;
  onSelect: (value: string) => void;
}

export function GalleryFiltersCard({
  filter,
  selected,
  onSelect,
}: Props) {
  const active = selected === filter.value;

  return (
    <button
      onClick={() => onSelect(filter.value)}
      className={cn(
        galleryFiltersStyles.button,
        active && galleryFiltersStyles.active
      )}
    >
      {filter.label}
    </button>
  );
}