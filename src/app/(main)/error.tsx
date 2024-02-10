"use client";

import { Button } from "@/ui";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";

export default function Error() {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <h2 className="scroll-m-20 text-3xl text-red-600 font-semibold tracking-tight first:mt-0">
        Error
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Failed to load conversations
      </h4>
      <Button onClick={reset}>Try again</Button>
    </div>
  );
}
