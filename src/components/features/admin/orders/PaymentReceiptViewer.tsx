interface PaymentReceiptViewerProps {
  receipt?: {
    url: string;
    fileName?: string;
    publicId?: string;
  };
}

export default function PaymentReceiptViewer({
  receipt,
}: PaymentReceiptViewerProps) {
  const receiptUrl =
    typeof receipt?.url === "string"
      ? receipt.url.trim()
      : "";

  if (!receiptUrl) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4">
        <p className="text-sm text-zinc-500">
          No receipt uploaded.
        </p>
      </div>
    );
  }

  const fileName =
    receipt?.fileName?.trim() ||
    "Payment Receipt";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-zinc-50 p-4">
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-zinc-900">
          {fileName}
        </p>

        <p className="mt-1 truncate text-xs text-zinc-500">
          Payment receipt uploaded
        </p>
      </div>

      <a
        href={receiptUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex shrink-0 items-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
      >
        View Receipt
      </a>
    </div>
  );
}

// interface PaymentReceiptViewerProps {
//   receipt?: {
//     url: string;
//     fileName?: string;
//     publicId?: string;
//   };
// }

// export default function PaymentReceiptViewer({
//   receipt,
// }: PaymentReceiptViewerProps) {
//   const receiptUrl =
//     typeof receipt?.url === "string"
//       ? receipt.url.trim()
//       : "";

//   if (!receiptUrl) {
//     return (
//       <div className="rounded-xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-4">
//         <p className="text-sm text-zinc-500">
//           No receipt uploaded.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-wrap items-center gap-3 rounded-2xl border bg-zinc-50 p-4">
//       <div className="min-w-0 flex-1">
//         <p className="text-sm font-semibold text-zinc-900">
//           {receipt.fileName ||
//             "Payment Receipt"}
//         </p>

//         <p className="mt-1 truncate text-xs text-zinc-500">
//           Payment receipt uploaded
//         </p>
//       </div>

//       <a
//         href={receiptUrl}
//         target="_blank"
//         rel="noopener noreferrer"
//         className="inline-flex shrink-0 items-center rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white transition hover:bg-zinc-800"
//       >
//         View Receipt
//       </a>
//     </div>
//   );
// }

// interface PaymentReceiptViewerProps {
//   receipt?: {
//     url: string;
//     fileName: string;
//   };
// }

// export default function PaymentReceiptViewer({
//   receipt,
// }: PaymentReceiptViewerProps) {
//   if (!receipt) {
//     return (
//       <p className="text-zinc-500">
//         No receipt uploaded.
//       </p>
//     );
//   }

//   return (
//     <a
//       href={receipt.url}
//       target="_blank"
//       rel="noopener noreferrer"
//       className="inline-flex rounded-xl border border-zinc-300 px-5 py-3 hover:bg-zinc-100"
//     >
//       View Receipt
//     </a>
//   );
// }