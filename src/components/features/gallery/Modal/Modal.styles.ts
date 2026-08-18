export const modalStyles = {
  overlay:
    "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-6",

  container:
  "relative max-h-[95vh] w-full max-w-6xl overflow-hidden rounded-xl",

    // container:
  //   "relative w-full max-w-6xl rounded-3xl bg-white shadow-2xl",

  closeButton:
    "absolute right-4 top-4 rounded-full bg-white/90 p-2 transition hover:bg-[#C9A227] hover:text-white",
} as const;