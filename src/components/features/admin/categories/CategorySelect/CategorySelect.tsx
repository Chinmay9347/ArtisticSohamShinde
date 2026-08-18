"use client";

import type { CategorySelectProps } from "./CategorySelect.types";

export function CategorySelect({
  value,
  options,
  loading = false,
  disabled = false,
  onChange,
}: CategorySelectProps) {
  return (
    <select
      value={value}
      disabled={loading || disabled}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border px-3 py-2"
    >
      <option value="">
        {loading ? "Loading categories..." : "Select a category"}
      </option>

      {options.map((category) => (
        <option
          key={category.id}
          value={category.id}
        >
          {category.name}
        </option>
      ))}
    </select>
  );
}