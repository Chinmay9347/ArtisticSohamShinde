"use client";

export default function Error({
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="space-y-6 text-center">

      <h2 className="text-2xl font-bold">
        Unable to load payment accounts
      </h2>

      <button
        onClick={reset}
        className="rounded-xl bg-black px-6 py-3 text-white"
      >
        Try Again
      </button>

    </div>
  );
}