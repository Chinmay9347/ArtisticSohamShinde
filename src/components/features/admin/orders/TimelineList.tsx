import TimelineItem from "./TimelineItem";

interface TimelineEntry {
  title: string;
  description?: string;
  createdAt?: Date | string | null;
}

interface Props {
  timeline: TimelineEntry[];
}

export default function TimelineList({
  timeline,
}: Props) {
  if (timeline.length === 0) {
    return (
      <p className="text-sm text-zinc-500">
        No activity recorded yet.
      </p>
    );
  }

  return (
    <div>
      {timeline.map((item, index) => (
        <TimelineItem
          key={index}
          title={item.title}
          description={item.description}
          createdAt={item.createdAt}
        />
      ))}
    </div>
  );
}

// import TimelineItem from "./TimelineItem";

// interface TimelineEntry {
//   title: string;
//   description?: string;
//   createdAt?: string;
// }

// interface TimelineListProps {
//   timeline: TimelineEntry[];
// }

// export default function TimelineList({
//   timeline,
// }: TimelineListProps) {
//   return (
//     <div className="space-y-2">
//       {timeline.map((item, index) => (
//         <TimelineItem
//           key={index}
//           title={item.title}
//           description={item.description}
//           date={item.createdAt}
//         />
//       ))}
//     </div>
//   );
// }