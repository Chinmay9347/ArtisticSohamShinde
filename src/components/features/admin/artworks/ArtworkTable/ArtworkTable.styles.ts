export const artworkTableStyles = {
  wrapper: "overflow-hidden rounded-xl border bg-white shadow-sm",

  table: "min-w-full",

  header:
    "bg-gray-100 text-left text-sm font-semibold uppercase",

  headCell: "px-4 py-3",

  row: "border-t hover:bg-gray-50",

  cell: "px-4 py-4 align-middle",

  image:
    "h-16 w-16 rounded-lg object-cover border",

  badge:
    "rounded-full border px-2 py-1 text-xs font-medium",

  actions:
    "flex items-center gap-2",

  button:
    "rounded-md border px-3 py-1 text-sm hover:bg-gray-100",

  empty:
    "py-12 text-center text-muted-foreground",
} as const;