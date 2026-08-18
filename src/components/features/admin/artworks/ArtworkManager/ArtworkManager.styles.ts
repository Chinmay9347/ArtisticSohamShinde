export const artworkManagerStyles = {
  container: "space-y-8",

  header:
    "flex items-center justify-between",

  title:
    "text-3xl font-bold tracking-tight",

  actions:
    "flex items-center gap-3",

  toolbar:
    "rounded-xl border bg-white p-4 shadow-sm",

  content:
    "rounded-xl border bg-white shadow-sm",

  loading:
    "flex justify-center py-20",

  error:
    "rounded-lg border border-red-300 bg-red-50 p-4 text-red-600",
} as const;