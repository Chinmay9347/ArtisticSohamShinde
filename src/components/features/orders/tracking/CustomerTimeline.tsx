import TimelineList from "@/components/features/admin/orders/TimelineList";

interface TimelineEntry {
  title: string;
  description?: string;
  createdAt?: Date | string | null;
}

interface Props {
  timeline: TimelineEntry[];
}

export default function CustomerTimeline({
  timeline,
}: Props) {
  return (
    <div className="rounded-3xl border bg-white p-8 shadow-sm">
      <h2 className="mb-6 text-2xl font-semibold">
        Order Activity
      </h2>

      <TimelineList timeline={timeline} />
    </div>
  );
}