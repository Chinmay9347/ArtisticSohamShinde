export interface GalleryFilter {
  id: string;
  label: string;
  value: string;
}

export interface GalleryFiltersProps {
  selected: string;
  onSelect: (value: string) => void;
  categories?: GalleryFilter[];
}
