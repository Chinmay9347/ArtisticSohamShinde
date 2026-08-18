"use client";

import Image from "next/image";
import clsx from "clsx";

import { AvatarProps } from "./Avatar.types";

const sizes = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
  lg: "h-12 w-12 text-lg",
  xl: "h-16 w-16 text-xl",
};

export function Avatar({
  name,
  imageUrl,
  size = "md",
  className,
}: AvatarProps) {
  const initials =
    name
      ?.trim()
      ?.split(" ")
      ?.filter(Boolean)
      ?.map((word) => word[0])
      ?.slice(0, 2)
      ?.join("")
      ?.toUpperCase() || "U";

  return (
    <div
      className={clsx(
        "relative flex items-center justify-center overflow-hidden rounded-full border border-zinc-200 bg-[#C9A227] font-semibold text-white shadow-sm select-none",
        sizes[size],
        className
      )}
      aria-label={name}
      title={name}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={name}
          fill
          sizes="64px"
          className="object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}

// "use client";

// import Image from "next/image";
// import clsx from "clsx";

// import { AvatarProps } from "./Avatar.types";

// const sizes = {
//   sm: "h-8 w-8 text-sm",

//   md: "h-10 w-10 text-base",

//   lg: "h-12 w-12 text-lg",

//   xl: "h-16 w-16 text-xl",
// };

// // export function Avatar({
// //   name,
// //   imageUrl,
// //   size = "md",
// //   className,
// // }
// export interface AvatarProps {
//   name: string;

//   imageUrl?: string;

//   size?: "sm" | "md" | "lg" | "xl";

//   className?: string;
// }: AvatarProps) {
//   const initials = name
//     .split(" ")
//     .map((word) => word[0])
//     .slice(0, 2)
//     .join("")
//     .toUpperCase();

//   return (
//     <div
//       className={clsx(
//         "relative overflow-hidden rounded-full bg-[#C9A227] text-white font-semibold flex items-center justify-center select-none",
//         sizes[size],
//         className
//       )}
//     >
//       {imageUrl ? (
//         <Image
//           src={imageUrl}
//           alt={name}
//           fill
//           className="object-cover"
//         />
//       ) : (
//         initials
//       )}
//     </div>
//   );
// }