// "use client";

// import { useEffect, useMemo, useState } from "react";

// import { ArtworkToolbar } from "../ArtworkToolbar";
// import { ArtworkTable } from "../ArtworkTable";
// import { ArtworkForm } from "../ArtworkForm";

// import { getAllArtworks } from "@/services/gallery/gallery.service";
// import { getAllCategories } from "@/services/gallery/category.service";

// import type { Artwork } from "@/types/gallery/artwork";
// import type { ArtworkCategory } from "@/types/gallery/category";

// export default function ArtworkManager() {
//   const [artworks, setArtworks] = useState<Artwork[]>([]);
//   const [categories, setCategories] = useState<ArtworkCategory[]>([]);

//   const [loading, setLoading] = useState(true);

//   const [search, setSearch] = useState("");
//   const [category, setCategory] = useState("");
//   const [status, setStatus] = useState("");
//   const [featured, setFeatured] = useState("");
//   const [visible, setVisible] = useState("");
//   const [sort, setSort] = useState("displayOrder");

//   const [showForm, setShowForm] = useState(false);

//   async function loadData() {
//     setLoading(true);

//     try {
//       const [artworksData, categoriesData] = await Promise.all([
//         getAllArtworks(),
//         getAllCategories(),
//       ]);

//       setArtworks(artworksData);
//       setCategories(categoriesData);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     loadData();
//   }, []);

//   const toolbarCategories = useMemo(
//     () =>
//       categories.map((category) => ({
//         id: category.id,
//         name: category.name,
//       })),
//     [categories]
//   );

//   return (
//     <div className="space-y-6">
//       <ArtworkToolbar
//         search={search}
//         category={category}
//         status={status}
//         featured={featured}
//         visible={visible}
//         sort={sort}
//         categories={toolbarCategories}
//         onSearchChange={setSearch}
//         onCategoryChange={setCategory}
//         onStatusChange={setStatus}
//         onFeaturedChange={setFeatured}
//         onVisibleChange={setVisible}
//         onSortChange={setSort}
//         onResetFilters={() => {
//           setSearch("");
//           setCategory("");
//           setStatus("");
//           setFeatured("");
//           setVisible("");
//           setSort("displayOrder");
//         }}
//         onAddArtwork={() => setShowForm(true)}
//       />

//       {showForm && (
//         <ArtworkForm
//           onSuccess={() => {
//             setShowForm(false);
//             loadData();
//           }}
//           onCancel={() => setShowForm(false)}
//         />
//       )}

//       <ArtworkTable
//         artworks={artworks}
//         loading={loading}
//       />
//     </div>
//   );
// }

"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  archiveArtwork,
  getGallery,
  restoreArtwork,
} from "@/services/gallery";

import type { GalleryDocument } from "@/services/gallery";

import { ArtworkForm } from "../ArtworkForm";
import { ArtworkTable } from "../ArtworkTable";
import { ArtworkToolbar } from "../ArtworkToolbar";

import { artworkManagerStyles } from "./ArtworkManager.styles";
import { getCategories } from "@/services/category/category.service";
import type { CategoryDocument } from "@/services/category/category.types";

export function ArtworkManager() {
  const [artworks, setArtworks] = useState<
    GalleryDocument[]
  >([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState<
      "ALL" | "DRAFT" | "PUBLISHED" | "ARCHIVED"
    >("ALL");

  const [featuredFilter, setFeaturedFilter] =
    useState<
      "ALL" | "YES" | "NO"
    >("ALL");

  const [loading, setLoading] = useState(true);

  const [categories,setCategories]=useState<CategoryDocument[]>([]);

  const [error, setError] =
    useState<string | null>(null);

  const [selectedArtwork, setSelectedArtwork] =
    useState<GalleryDocument | null>(null);

  const [isCreateOpen, setCreateOpen] =
    useState(true);

  const [isEditOpen, setEditOpen] =
    useState(false);

  const loadArtworks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getGallery();

      setArtworks(
        [...data].sort(
          (a, b) =>
            a.displayOrder -
            b.displayOrder
        )
      );
    } catch (err) {
      console.error(err);

      setError("Failed to load artworks.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadArtworks();
    void getCategories().then(setCategories).catch(()=>setCategories([]));
  }, [loadArtworks]);

  async function handleArchive(
    artwork: GalleryDocument
  ) {
    try {
      await archiveArtwork(artwork.id);

      await loadArtworks();
    } catch (error) {
      console.error(error);

      alert("Failed to archive artwork.");
    }
  }

  async function handleRestore(
    artwork: GalleryDocument
  ) {
    try {
      await restoreArtwork(artwork.id);

      await loadArtworks();
    } catch (error) {
      console.error(error);

      alert("Failed to restore artwork.");
    }
  }

  function handleEdit(
    artwork: GalleryDocument
  ) {
    setSelectedArtwork(artwork);

    setEditOpen(true);
  }
  
  const filteredArtworks = useMemo(() => {
    return artworks.filter((artwork) => {
      const matchesSearch =
        artwork.title
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        artwork.slug
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        artwork.tags.some((tag) =>
          tag
            .toLowerCase()
            .includes(search.toLowerCase())
        );

      const matchesStatus =
        statusFilter === "ALL" ||
        artwork.status === statusFilter;

      const matchesFeatured =
        featuredFilter === "ALL" ||
        (featuredFilter === "YES"
          ? artwork.featured
          : !artwork.featured);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesFeatured
      );
    });
  }, [
    artworks,
    search,
    statusFilter,
    featuredFilter,
  ]);

  return (
    <section
      className={
        artworkManagerStyles.container
      }
    >
      <div
        className={
          artworkManagerStyles.header
        }
      >
        <div>
          {/* Artwork Management */}
          <h1
            className={
              artworkManagerStyles.title
            }
          >
            Artwork Management
          </h1>

          <p className="text-muted-foreground">
            Showing{" "}
            <strong>
              {filteredArtworks.length}
            </strong>{" "}
            of{" "}
            <strong>
              {artworks.length}
            </strong>{" "}
            artworks
          </p>
        </div>

        {/* Refresh */}
        <div
          className={
            artworkManagerStyles.actions
          }
        >
          <button
            className="rounded-md border px-4 py-2"
            onClick={loadArtworks}
          >
            Refresh
          </button>

          <button
            className="rounded-md bg-black px-4 py-2 text-white"
            onClick={() =>
              setCreateOpen(!isCreateOpen)
            }
          >
            {isCreateOpen
              ? "Hide Form"
              : "New Artwork"}
          </button>
        </div>
      </div>

      {error && (
        <div
          className={
            artworkManagerStyles.error
          }
        >
          {error}
        </div>
      )}

      {isCreateOpen && (
        <div
          className={
            artworkManagerStyles.content
          }
        >
          <ArtworkForm
            mode="create"
            onSuccess={async () => {
              await loadArtworks();
            }}
          />
        </div>
      )}

      {/* <div className="mb-6 flex flex-wrap gap-4 rounded-xl border bg-white p-4 shadow-sm">

        <input
          placeholder="Search artwork..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="min-w-[260px] rounded-md border px-3 py-2"
        />

        <select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(
              e.target.value as any
            )
          }
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">
            All Status
          </option>

          <option value="DRAFT">
            Draft
          </option>

          <option value="PUBLISHED">
            Published
          </option>

          <option value="ARCHIVED">
            Archived
          </option>
        </select>

        <select
          value={featuredFilter}
          onChange={(e) =>
            setFeaturedFilter(
              e.target.value as any
            )
          }
          className="rounded-md border px-3 py-2"
        >
          <option value="ALL">
            All Featured
          </option>

          <option value="YES">
            Featured
          </option>

          <option value="NO">
            Not Featured
          </option>
        </select>

        <button
          className="rounded-md border px-4 py-2"
          onClick={() => {
            setSearch("");
            setStatusFilter("ALL");
            setFeaturedFilter("ALL");
          }}
        >
          Reset
        </button>

      </div> */}
      {/* <ArtworkToolbar
        search={search}
        category=""
        status={statusFilter}
        featured={featuredFilter}
        visible=""
        sort="displayOrder"
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={() => {}}
        onStatusChange={(value) =>
          setStatusFilter(
            value as
              | "ALL"
              | "DRAFT"
              | "PUBLISHED"
              | "ARCHIVED"
          )
        }
        onFeaturedChange={(value) =>
          setFeaturedFilter(
            value as
              | "ALL"
              | "YES"
              | "NO"
          )
        }
        onVisibleChange={() => {}}
        onSortChange={() => {}}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("ALL");
          setFeaturedFilter("ALL");
        }}
        onAddArtwork={() =>
          setCreateOpen(true)}
      /> */}
      <ArtworkToolbar
        search={search}
        category=""
        status={statusFilter}
        featured={featuredFilter}
        visible=""
        sort="displayOrder"
        categories={categories}
        onSearchChange={setSearch}
        onCategoryChange={() => {}}
        onStatusChange={setStatusFilter}
        onFeaturedChange={setFeaturedFilter}
        onVisibleChange={() => {}}
        onSortChange={() => {}}
        onResetFilters={() => {
          setSearch("");
          setStatusFilter("ALL");
          setFeaturedFilter("ALL");
        }}
        onAddArtwork={() => setCreateOpen(true)}
      />

      <ArtworkTable
        artworks={filteredArtworks}
        loading={loading}
        onEdit={handleEdit}
        onArchive={handleArchive}
        onRestore={handleRestore}
        onRefresh={loadArtworks}
      />

      {isEditOpen &&
        selectedArtwork && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Edit Artwork
              </h2>

              <button
                onClick={() => {
                  setEditOpen(false);
                  setSelectedArtwork(null);
                }}
                className="rounded-md border px-4 py-2"
              >
                Close
              </button>
            </div>

            <ArtworkForm
              mode="edit"
              artwork={selectedArtwork}
              onCancel={() => {
                setEditOpen(false);
                setSelectedArtwork(null);
              }}
              onSuccess={async () => {
                setEditOpen(false);
                setSelectedArtwork(null);
                await loadArtworks();
              }}
            />
          </div>
      )}
    </section>
  );
}