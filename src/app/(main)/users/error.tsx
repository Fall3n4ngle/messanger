"use client";

import { Button } from "@/ui";
import Link from "next/link";

export default function Error({ reset }: { reset: () => void }) {
  return (
    <div className="flex flex-col gap-4 w-full h-full items-center justify-center">
      <h2 className="scroll-m-20 text-3xl text-red-600 font-semibold tracking-tight first:mt-0">
        Error
      </h2>
      <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
        Failed to load users
      </h4>
      <Button onClick={reset}>Try again</Button>
      <Link href="/conversations">
        <Button variant="link">Back to conversations</Button>
      </Link>
    </div>
  );
}