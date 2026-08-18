"use client";

import { useRef, useState } from "react";

import type { ReceiptUploadProps } from "./ReceiptUpload.types";

export function ReceiptUpload({
  selectedFile,
  uploading = false,
  onFileSelected,
}: ReceiptUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [dragging, setDragging] = useState(false);

  const selectFile = (file: File) => {
    onFileSelected(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);

        const file = e.dataTransfer.files?.[0];

        if (file) {
          selectFile(file);
        }
      }}
      className={`mt-8 rounded-2xl border-2 border-dashed p-8 transition ${
        dragging
          ? "border-yellow-500 bg-yellow-50"
          : "border-neutral-300"
      }`}
    >
      <input
        ref={inputRef}
        hidden
        type="file"
        accept="image/*,.pdf"
        onChange={(e) => {
          const file = e.target.files?.[0];

          if (file) {
            selectFile(file);
          }
        }}
      />

      {selectedFile ? (
        <div className="space-y-6">

          <div className="flex items-start justify-between">

            <div>

              <h3 className="text-lg font-semibold">
                Receipt Selected
              </h3>

              <p className="mt-2 font-medium">
                {selectedFile.name}
              </p>

              <p className="mt-1 text-sm text-neutral-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>

            </div>

            <div className="rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
              Ready
            </div>

          </div>

          {selectedFile.type.startsWith("image/") && (
            <img
              src={URL.createObjectURL(selectedFile)}
              alt="Receipt Preview"
              className="max-h-80 rounded-xl border object-contain"
            />
          )}

          {selectedFile.type === "application/pdf" && (
            <div className="rounded-xl border bg-neutral-50 p-6 text-center">
              📄 PDF Receipt Selected
            </div>
          )}

          <div className="flex gap-3">

            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="rounded-lg border px-5 py-2 transition hover:bg-neutral-100"
            >
              Change File
            </button>

            <button
              type="button"
              disabled={uploading}
              onClick={() => onFileSelected(null)}
              className="rounded-lg border border-red-300 px-5 py-2 text-red-600 transition hover:bg-red-50"
            >
              Remove
            </button>

          </div>

        </div>
      ) : (
        <div className="text-center">

          <div className="text-6xl">
            📤
          </div>

          <h3 className="mt-4 text-xl font-semibold">
            Upload Payment Receipt
          </h3>

          <p className="mt-2 text-neutral-500">
            Drag & drop your receipt here or choose a file.
          </p>

          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="mt-6 rounded-xl bg-black px-8 py-3 text-white transition hover:opacity-90"
          >
            Choose File
          </button>

          <p className="mt-4 text-sm text-neutral-400">
            Supported formats: JPG, PNG, WEBP, PDF
          </p>

        </div>
      )}
    </div>
  );
}


// "use client";

// import { useRef } from "react";

// import type { ReceiptUploadProps } from "./ReceiptUpload.types";

// export function ReceiptUpload({
//   selectedFile,
//   uploading = false,
//   onFileSelected,
// }: ReceiptUploadProps) {
//   const inputRef =
//     useRef<HTMLInputElement>(null);

//   return (
//     <div className="rounded-xl border border-dashed p-8">

//       <input
//         ref={inputRef}
//         hidden
//         type="file"
//         accept="image/*,.pdf"
//         onChange={(e) => {
//           const file =
//             e.target.files?.[0];

//           if (!file) return;

//           onFileSelected(file);
//         }}
//       />

//       {selectedFile ? (
//         <div className="space-y-4">

//           <div>

//             <h3 className="font-semibold">
//               Selected Receipt
//             </h3>

//             <p className="text-sm text-neutral-500">
//               {selectedFile.name}
//             </p>

//             <p className="text-xs text-neutral-400">
//               {(selectedFile.size / 1024).toFixed(
//                 2
//               )} KB
//             </p>

//           </div>

//           <button
//             type="button"
//             disabled={uploading}
//             onClick={() =>
//               inputRef.current?.click()
//             }
//             className="rounded-lg border px-4 py-2"
//           >
//             Change Receipt
//           </button>

//         </div>
//       ) : (
//         <button
//           type="button"
//           disabled={uploading}
//           onClick={() =>
//             inputRef.current?.click()
//           }
//           className="rounded-lg bg-black px-6 py-3 text-white"
//         >
//           Select Payment Receipt
//         </button>
//       )}

//     </div>
//   );
// }