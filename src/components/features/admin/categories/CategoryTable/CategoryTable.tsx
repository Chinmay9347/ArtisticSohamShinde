"use client";

import { categoryTableStyles } from "./CategoryTable.styles";
import type { CategoryTableProps } from "./CategoryTable.types";

export function CategoryTable({
  categories,
  onToggleVisibility,
}: CategoryTableProps) {
  return (
    <div className={categoryTableStyles.wrapper}>
      <table className={categoryTableStyles.table}>
        <thead className={categoryTableStyles.header}>
          <tr>
            <th className={categoryTableStyles.cell}>Name</th>
            <th className={categoryTableStyles.cell}>Slug</th>
            <th className={categoryTableStyles.cell}>Artworks</th>
            <th className={categoryTableStyles.cell}>Visible</th>
            <th className={categoryTableStyles.cell}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr
              key={category.id}
              className={categoryTableStyles.row}
            >
              <td className={categoryTableStyles.cell}>
                {category.name}
              </td>

              <td className={categoryTableStyles.cell}>
                {category.slug}
              </td>

              <td className={categoryTableStyles.cell}>
                {category.artworkCount}
              </td>

              <td className={categoryTableStyles.cell}>
                {category.visible ? "Yes" : "No"}
              </td>

              <td className={categoryTableStyles.cell}>
                <button
                  onClick={() =>
                    onToggleVisibility(
                      category.id,
                      category.visible
                    )
                  }
                  className={categoryTableStyles.button}
                >
                  {category.visible ? "Hide" : "Restore"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}