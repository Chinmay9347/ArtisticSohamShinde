"use client";

import { Plus, RotateCcw, Search } from "lucide-react";

import { Button } from "@/components/ui/Button";

import type { ArtworkToolbarProps } from "./ArtworkToolbar.types";

export default function ArtworkToolbar({
  search,
  category,
  status,
  featured,
  visible,
  sort,
  categories,
  onSearchChange,
  onCategoryChange,
  onStatusChange,
  onFeaturedChange,
  onVisibleChange,
  onSortChange,
  onResetFilters,
  onAddArtwork,
}: ArtworkToolbarProps) {
  return (
    <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4">

        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search artwork..."
            className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none transition focus:border-[#C9A227]"
          />
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">

          <select
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Categories</option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) =>
              onStatusChange(
                e.target.value as
                  | "ALL"
                  | "DRAFT"
                  | "PUBLISHED"
                  | "ARCHIVED"
              )
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="ALL">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          <select
            value={featured}
            onChange={(e) =>
              onFeaturedChange(
                e.target.value as
                  | "ALL"
                  | "YES"
                  | "NO"
              )
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="ALL">All Featured</option>
            <option value="YES">Featured</option>
            <option value="NO">Not Featured</option>
          </select>

          <select
            value={visible}
            onChange={(e) =>
              onVisibleChange(e.target.value)
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="">All Visibility</option>
            <option value="VISIBLE">Visible</option>
            <option value="HIDDEN">Hidden</option>
          </select>

          <select
            value={sort}
            onChange={(e) =>
              onSortChange(e.target.value)
            }
            className="rounded-lg border px-3 py-2"
          >
            <option value="displayOrder">
              Display Order
            </option>

            <option value="newest">
              Newest
            </option>

            <option value="oldest">
              Oldest
            </option>

            <option value="titleAsc">
              Title A–Z
            </option>

            <option value="titleDesc">
              Title Z–A
            </option>
          </select>

          <Button
            type="button"
            variant="outline"
            onClick={onResetFilters}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} />
            Reset
          </Button>

          <Button
            type="button"
            variant="secondary"
            onClick={onAddArtwork}
            className="flex items-center justify-center gap-2"
          >
            <Plus size={18} />
            New Artwork
          </Button>

        </div>
      </div>
    </div>
  );
}

// "use client";

// import { Search, Plus, RotateCcw } from "lucide-react";

// import type { ArtworkToolbarProps } from "./ArtworkToolbar.types";

// export default function ArtworkToolbar({
//   search,
//   category,
//   status,
//   featured,
//   visible,
//   sort,
//   categories,
//   onSearchChange,
//   onCategoryChange,
//   onStatusChange,
//   onFeaturedChange,
//   onVisibleChange,
//   onSortChange,
//   onResetFilters,
//   onAddArtwork,
// }: ArtworkToolbarProps) {
//   return (
//     <div className="mb-6 rounded-xl border bg-white p-5 shadow-sm">
//       <div className="flex flex-col gap-4">
//         <div className="relative">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
//           />

//           <input
//             value={search}
//             onChange={(e) => onSearchChange(e.target.value)}
//             placeholder="Search artwork..."
//             className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none transition focus:border-[#C9A227]"
//           />
//         </div>

//         <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-7">
//           <select
//             value={category}
//             onChange={(e) => onCategoryChange(e.target.value)}
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="">All Categories</option>

//             {categories.map((category) => (
//               <option key={category.id} value={category.id}>
//                 {category.name}
//               </option>
//             ))}
//           </select>

//           <select
//             value={status}
//             onChange={(e) => onStatusChange(e.target.value)}
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="">All Status</option>
//             <option value="PUBLISHED">Published</option>
//             <option value="DRAFT">Draft</option>
//             <option value="ARCHIVED">Archived</option>
//           </select>

//           <select
//             value={featured}
//             onChange={(e) => onFeaturedChange(e.target.value)}
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="">All</option>
//             <option value="true">Featured</option>
//             <option value="false">Not Featured</option>
//           </select>

//           <select
//             value={visible}
//             onChange={(e) => onVisibleChange(e.target.value)}
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="">All</option>
//             <option value="true">Visible</option>
//             <option value="false">Hidden</option>
//           </select>

//           <select
//             value={sort}
//             onChange={(e) => onSortChange(e.target.value)}
//             className="rounded-lg border px-3 py-2"
//           >
//             <option value="displayOrder">Display Order</option>
//             <option value="newest">Newest</option>
//             <option value="oldest">Oldest</option>
//             <option value="titleAsc">Title A–Z</option>
//             <option value="titleDesc">Title Z–A</option>
//           </select>

//           <button
//             type="button"
//             onClick={onResetFilters}
//             className="flex items-center justify-center gap-2 rounded-lg border px-4 py-2 hover:bg-gray-100"
//           >
//             <RotateCcw size={17} />
//             Reset
//           </button>

//           <button
//             type="button"
//             onClick={onAddArtwork}
//             className="flex items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-4 py-2 font-medium text-white hover:opacity-90"
//           >
//             <Plus size={18} />
//             New Artwork
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }