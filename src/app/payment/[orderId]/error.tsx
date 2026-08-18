"use client";

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-semibold">
        Something went wrong
      </h1>

      <p className="text-muted-foreground">
        {error.message}
      </p>

      <button
        onClick={reset}
        className="rounded bg-black px-4 py-2 text-white"
      >
        Try Again
      </button>
    </div>
  );
}