import AdminCard from "../shared/AdminCard";
import TimelineList from "./TimelineList";

interface TimelineEntry {
  title: string;
  description?: string;
  createdAt?: Date | string | null;
}

interface Props {
  timeline: TimelineEntry[];
}

export default function AdminOrderTimeline({
  timeline,
}: Props) {
  return (
    <AdminCard>
      <h2 className="mb-8 text-2xl font-semibold">
        Activity Timeline
      </h2>

      <TimelineList timeline={timeline} />
    </AdminCard>
  );
}

// import AdminCard from "../shared/AdminCard";

// interface AdminOrderTimelineProps {
//   timeline: any[];
// }

// export default function AdminOrderTimeline({
//   timeline,
// }: AdminOrderTimelineProps) {
//   return (
//     <AdminCard>

//       <h2 className="text-2xl font-semibold">
//         Timeline
//       </h2>

//       {timeline.length === 0 ? (

//         <p className="mt-6 text-zinc-500">
//           No timeline available.
//         </p>

//       ) : (

//         <div className="mt-8 space-y-8">

//           {timeline.map((item, index) => (

//             <div
//               key={index}
//               className="flex gap-5"
//             >

//               <div className="flex flex-col items-center">

//                 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#C9A227] font-bold text-white">
//                   ✓
//                 </div>

//                 {index !== timeline.length - 1 && (
//                   <div className="mt-2 h-full w-px bg-zinc-300" />
//                 )}

//               </div>

//               <div>

//                 <h3 className="font-semibold">
//                   {item.title}
//                 </h3>

//                 {item.description && (
//                   <p className="mt-2 text-zinc-600">
//                     {item.description}
//                   </p>
//                 )}

//               </div>

//             </div>

//           ))}

//         </div>

//       )}

//     </AdminCard>
//   );
// }