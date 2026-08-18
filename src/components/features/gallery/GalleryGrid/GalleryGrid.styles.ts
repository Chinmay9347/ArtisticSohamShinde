export const galleryGridStyles = {
  grid:
    "grid gap-8 sm:grid-cols-2 lg:grid-cols-3",

  card:
    "group overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",

  imageWrapper:
    "relative aspect-[4/5] overflow-hidden",

  image:
    "object-cover transition-transform duration-500 group-hover:scale-105",

  content:
    "p-6",

  title:
    "font-heading text-2xl",

  category:
    "mt-2 text-sm uppercase tracking-[0.25em] text-[#C9A227]",
} as const;