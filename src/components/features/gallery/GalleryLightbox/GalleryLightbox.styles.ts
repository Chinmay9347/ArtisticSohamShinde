export const galleryLightboxStyles = {
  overlay:
    "fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4",

  container:
    "relative mx-auto flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-black",
    // "relative mx-auto flex max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-xl bg-black",

  imageWrapper:
    "relative flex flex-1 w-full items-center justify-center overflow-hidden bg-black",
  //  "relative flex h-[70vh] items-center justify-center overflow-hidden bg-black",  
  //"relative flex h-[75vh] items-center justify-center overflow-hidden bg-black",
  //  "relative flex max-h-[75vh] items-center justify-center overflow-hidden bg-black",
  // imageWrapper:
  // "flex max-h-[75vh] items-center justify-center overflow-hidden bg-black",

    // imageWrapper:
  //   "relative flex items-center justify-center",

  // image:
  //   "h-auto max-h-[85vh] w-auto max-w-full object-contain",
  image:
    "block max-h-[75vh] max-w-full object-contain select-none",  
  // "h-auto max-h-[75vh] w-auto max-w-full object-contain",
    //"h-auto max-h-[75vh] w-auto max-w-full object-contain select-none",
    //"h-auto max-h-full max-h-full max-w-full object-contain select-none",
  closeButton:
    "absolute right-4 top-4 z-20 rounded-full bg-black/70 p-2 text-white transition hover:bg-black",

  info:
    "border-t border-white/10 bg-black px-6 py-5 text-white",

  title:
    "text-2xl font-semibold",

  description:
    "mt-2 text-sm text-gray-300",

  meta:
    "mt-4 flex flex-wrap gap-3 text-xs text-gray-400",

  navButton:
    "absolute top-1/2 z-20 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white backdrop-blur transition-all duration-300 hover:bg-black/80",

  leftButton:
    "left-4 md:left-6",

  rightButton:
    "right-4 md:right-6",
    // navButton:
  //   "absolute top-1/2 -translate-y-1/2 z-20 rounded-full bg-black/70 p-3 text-white transition hover:bg-black",

  // leftButton: "left-4",

  // rightButton: "right-4",
  // normalImage:
  //   "cursor-zoom-in transition-transform duration-300",

  // zoomedImage:
  //   "scale-200 cursor-zoom-out transition-transform duration-300",

  counter:
    "absolute bottom-20 left-1/2 z-20 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur",
  // "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm",
  // counter:
  // "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white backdrop-blur",
  // counter:
  //   "absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-sm font-medium text-white",
  zoomToolbar:
    "flex items-center gap-4 border-t border-white/10 bg-black px-6 py-4",
    // "flex items-center gap-4 border-t border-white/10 bg-zinc-950 px-6 py-4",

  zoomIcon:
    "text-gray-400",

  zoomSlider:
    "h-1 flex-1 cursor-pointer accent-[#C9A227]",

  zoomPercent:
    "w-14 text-right text-sm font-medium text-white",

  zoomMin:
    "text-xs text-gray-500",

  zoomMax:
    "text-xs text-gray-500",

};