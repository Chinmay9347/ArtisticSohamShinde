export interface ArtworkToolbarProps {
  search: string;

  category: string;

  status:
    | "ALL"
    | "DRAFT"
    | "PUBLISHED"
    | "ARCHIVED";

  featured:
    | "ALL"
    | "YES"
    | "NO";

  visible: string;

  sort: string;

  categories: {
    id: string;
    name: string;
  }[];

  onSearchChange: (value: string) => void;

  onCategoryChange: (value: string) => void;

  onStatusChange: (
    value:
      | "ALL"
      | "DRAFT"
      | "PUBLISHED"
      | "ARCHIVED"
  ) => void;

  onFeaturedChange: (
    value:
      | "ALL"
      | "YES"
      | "NO"
  ) => void;

  onVisibleChange: (
    value: string
  ) => void;

  onSortChange: (
    value: string
  ) => void;

  onResetFilters: () => void;

  onAddArtwork: () => void;
}
// export interface ArtworkToolbarProps {
//   search: string;
//   category: string;
//   status: string;
//   featured: string;
//   visible: string;
//   sort: string;

//   categories: {
//     id: string;
//     name: string;
//   }[];

//   onSearchChange: (value: string) => void;
//   onCategoryChange: (value: string) => void;
//   onStatusChange: (value: string) => void;
//   onFeaturedChange: (value: string) => void;
//   onVisibleChange: (value: string) => void;
//   onSortChange: (value: string) => void;

//   onResetFilters: () => void;
//   onAddArtwork: () => void;
// }