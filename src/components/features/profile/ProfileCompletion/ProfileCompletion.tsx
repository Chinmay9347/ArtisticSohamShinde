interface ProfileCompletionProps {
  percentage: number;
}

export function ProfileCompletion({
  percentage,
}: ProfileCompletionProps) {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">

      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-semibold">
          Profile Completion
        </h3>

        <span className="font-bold text-[#C9A227]">
          {percentage}%
        </span>
      </div>

      <div className="h-3 overflow-hidden rounded-full bg-zinc-200">

        <div
          className="h-full rounded-full bg-[#C9A227] transition-all duration-500"
          style={{
            width: `${percentage}%`,
          }}
        />

      </div>

    </div>
  );
}