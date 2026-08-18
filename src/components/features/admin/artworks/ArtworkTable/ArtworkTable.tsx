"use client";

import Image from "next/image";

import { artworkTableStyles } from "./ArtworkTable.styles";
import type { ArtworkTableProps } from "./ArtworkTable.types";

export function ArtworkTable({
  artworks,
  loading,
  onEdit,
  onArchive,
  onRestore,
}: ArtworkTableProps) {
  if (loading) {
    return (
      <div className={artworkTableStyles.empty}>
        Loading artworks...
      </div>
    );
  }

  if (artworks.length === 0) {
    return (
      <div className={artworkTableStyles.empty}>
        No artworks found.
      </div>
    );
  }

  return (
    <div className={artworkTableStyles.wrapper}>
      <table className={artworkTableStyles.table}>
        <thead className={artworkTableStyles.header}>
          <tr>
            <th className={artworkTableStyles.headCell}>
              Image
            </th>

            <th className={artworkTableStyles.headCell}>
              Title
            </th>

            <th className={artworkTableStyles.headCell}>
              Category
            </th>

            <th className={artworkTableStyles.headCell}>
              Status
            </th>

            <th className={artworkTableStyles.headCell}>
              Featured
            </th>

            <th className={artworkTableStyles.headCell}>
              Visible
            </th>

            <th className={artworkTableStyles.headCell}>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {artworks.map((artwork) => {
            const image =
              artwork.images[0] ??
              artwork.image;

            return (
              <tr
                key={artwork.id}
                className={artworkTableStyles.row}
              >
                <td className={artworkTableStyles.cell}>
                  {image ? (
                    <Image
                      src={image.secureUrl}
                      alt={image.alt}
                      width={72}
                      height={72}
                      className="h-[72px] w-[72px] rounded-lg border object-cover"
                    />
                  ) : (
                    "-"
                  )}
                </td>

                <td className={artworkTableStyles.cell}>
                  <div className="font-medium">
                    {artwork.title}
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {artwork.slug}
                  </div>
                </td>

                <td className={artworkTableStyles.cell}>
                  {artwork.categoryId ??
                    artwork.category}
                </td>

                <td className={artworkTableStyles.cell}>
                  <span
                    className={
                      artworkTableStyles.badge
                    }
                  >
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        artwork.status === "PUBLISHED"
                          ? "bg-green-100 text-green-700"
                          : artwork.status === "ARCHIVED"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {artwork.status}
                    </span>
                  </span>
                </td>

                <td className={artworkTableStyles.cell}>
                  {artwork.featured ? (
                    <span className="rounded bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800">
                      Featured
                    </span>
                  ) : (
                    "-"
                  )}
                </td>

                <td className={artworkTableStyles.cell}>
                  {artwork.visible ? (
                    <span className="rounded bg-green-100 px-2 py-1 text-xs font-semibold text-green-700">
                      Visible
                    </span>
                  ) : (
                    <span className="rounded bg-gray-200 px-2 py-1 text-xs">
                      Hidden
                    </span>
                  )}
                </td>

                <td className={artworkTableStyles.cell}>
                  <div
                    className={
                      artworkTableStyles.actions
                    }
                  >
                    <button
                      className={
                        artworkTableStyles.button
                      }
                      onClick={() =>
                        onEdit?.(artwork)
                      }
                    >
                      Edit
                    </button>

                    {artwork.status ===
                    "ARCHIVED" ? (
                      <button
                        className={
                          artworkTableStyles.button
                        }
                        onClick={() =>
                          onRestore?.(
                            artwork
                          )
                        }
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        className={
                          artworkTableStyles.button
                        }
                        onClick={() =>
                          onArchive?.(
                            artwork
                          )
                        }
                      >
                        Archive
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}