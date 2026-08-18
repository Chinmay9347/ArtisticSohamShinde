interface TimelineItemProps {
  title: string;
  description?: string;
  createdAt?: Date | string | null;
}

export default function TimelineItem({
  title,
  description,
  createdAt,
}: TimelineItemProps) {
  const date =
    createdAt instanceof Date
      ? createdAt.toLocaleString("en-IN")
      : createdAt ?? "";

  return (
    <div className="flex gap-5">
      <div className="flex flex-col items-center">
        <div className="h-4 w-4 rounded-full bg-[#C9A227]" />
        <div className="mt-1 h-full w-px bg-zinc-300" />
      </div>

      <div className="pb-8">
        <h4 className="font-semibold text-zinc-900">
          {title}
        </h4>

        {description && (
          <p className="mt-1 text-sm text-zinc-600">
            {description}
          </p>
        )}

        {date && (
          <p className="mt-2 text-xs text-zinc-500">
            {date}
          </p>
        )}
      </div>
    </div>
  );
}
// interface TimelineItemProps {
//   title: string;
//   date?: string;
//   description?: string;
// }

// export default function TimelineItem({
//   title,
//   date,
//   description,
// }: TimelineItemProps) {
//   return (
//     <div className="flex gap-4">
//       <div className="mt-2 h-3 w-3 rounded-full bg-[#C9A227]" />

//       <div className="flex-1 border-l border-zinc-200 pb-6 pl-6">
//         <h4 className="font-semibold">{title}</h4>

//         {description && (
//           <p className="mt-1 text-sm text-zinc-600">
//             {description}
//           </p>
//         )}

//         {date && (
//           <p className="mt-2 text-xs text-zinc-500">
//             {date}
//           </p>
//         )}
//       </div>
//     </div>
//   );
// }