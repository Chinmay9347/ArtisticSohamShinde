"use client";

import Image from "next/image";
import { Camera } from "lucide-react";
import { useRef } from "react";

interface AvatarUploaderProps {
  image?: string;
  uploading?: boolean;
  onSelect: (file: File) => void;
}

export function AvatarUploader({
  image,
  uploading = false,
  onSelect,
}: AvatarUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col items-center">

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="group relative"
      >
        <div className="relative h-32 w-32 overflow-hidden rounded-full border-4 border-[#C9A227]/20 bg-zinc-100">

          {image ? (
            <Image
              src={image}
              alt="Profile"
              fill
              sizes="128px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-5xl">
              👤
            </div>
          )}

        </div>

        <div className="absolute bottom-1 right-1 rounded-full bg-[#C9A227] p-2 text-white shadow-lg transition group-hover:scale-110">
          <Camera size={18} />
        </div>

      </button>

      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            onSelect(file);
          }
        }}
      />

      {uploading && (
        <p className="mt-3 text-sm text-zinc-500">
          Uploading avatar...
        </p>
      )}
    </div>
  );
}

// "use client";

// import { useRef } from "react";

// import { Camera } from "lucide-react";

// interface AvatarUploaderProps {
//   image?: string;

//   onSelect: (file: File) => void;
// }

// export function AvatarUploader({
//   image,
//   onSelect,
// }: AvatarUploaderProps) {
//   const inputRef =
//     useRef<HTMLInputElement>(null);

//   return (
//     <div className="flex flex-col items-center">

//       <button
//         type="button"
//         onClick={() =>
//           inputRef.current?.click()
//         }
//         className="relative"
//       >
//         <img
//           src={
//             image ||
//           }
//           alt="Avatar"
//           className="h-28 w-28 rounded-full object-cover border"
//         />

//         <div className="absolute bottom-0 right-0 rounded-full bg-[#C9A227] p-2 text-white">
//           <Camera size={18} />
//         </div>
//       </button>

//       <input
//         hidden
//         ref={inputRef}
//         type="file"
//         accept="image/*"
//         onChange={(e) => {
//           const file =
//             e.target.files?.[0];

//           if (file) {
//             onSelect(file);
//           }
//         }}
//       />

//     </div>
//   );
// }