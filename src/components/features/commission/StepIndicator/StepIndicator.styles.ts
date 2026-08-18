export const styles = {
  container:
    "w-full flex items-center justify-between gap-2 overflow-x-auto py-4",

  item:
    "flex flex-1 items-center",

  content:
    "flex flex-col items-center min-w-[90px] text-center",

  circle:
    "flex h-10 w-10 items-center justify-center rounded-full border-2 text-sm font-semibold transition-all duration-300",

  completedCircle:
    "border-black bg-black text-white",

  activeCircle:
    "border-black bg-white text-black shadow-md",

  upcomingCircle:
    "border-neutral-300 bg-white text-neutral-400",

  title:
    "mt-2 text-xs font-medium text-neutral-700",

  line:
    "mx-2 h-[2px] flex-1 transition-all duration-300",

  completedLine:
    "bg-black",

  upcomingLine:
    "bg-neutral-300",
};