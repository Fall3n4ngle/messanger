"use client";

import { Button } from "@/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4">
      <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight text-red-600 first:mt-0">
        Error
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Failed to load conversations
      </h4>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
