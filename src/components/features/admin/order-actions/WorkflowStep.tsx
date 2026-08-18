interface Props {
  title: string;

  active: boolean;

  completed: boolean;
}

export default function WorkflowStep({
  title,
  active,
  completed,
}: Props) {
  return (
    <div className="flex items-center gap-4">

      <div
        className={[
          "flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold",

          completed
            ? "bg-green-600 text-white"
            : active
            ? "bg-[#C9A227] text-white"
            : "bg-zinc-200",
        ].join(" ")}
      >
        {completed ? "✓" : ""}
      </div>

      <span
        className={
          active
            ? "font-semibold"
            : "text-zinc-500"
        }
      >
        {title}
      </span>

    </div>
  );
}