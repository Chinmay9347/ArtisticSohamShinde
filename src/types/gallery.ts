//12/07/2026 0.0v
export type GalleryCategory =
  | "Celebrity"
  | "Couple"
  | "Family"
  | "Friends"
  | "Pet"
  | "Custom";

export interface GalleryItem {
  id: number;
  title: string;
  image: string;
  category: GalleryCategory;

  featured: boolean;

  alt: string;

  description?: string;

  medium?: string;

  dimensions?: string;

  year?: string;
}

//12/07/2026 0.0v
// export interface GalleryItem {
//   id: number;
//   title: string;
//   image: string;
//   category: GalleryCategory;
//   featured: boolean;
// }

// export type GalleryCategory =
//   | "Celebrity"
//   | "Couple"
//   | "Family"
//   | "Friends"
//   | "Pet"
//   | "Custom";