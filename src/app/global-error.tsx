"use client";

import { cn } from "@/common/utils";
import { ThemeProvider } from "@/providers";
import { Button } from "@/ui";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body
        className={cn(
          "flex flex-col gap-4 w-full h-screen items-center justify-center",
          inter.className
        )}
      >
        <ThemeProvider>
          <h2 className="scroll-m-20 text-3xl text-red-600 font-semibold tracking-tight first:mt-0">
            Error
          </h2>
          <h4 className="scroll-m-20 text-xl font-semibold tracking-tight">
            An unexpected error ocurred{" "}
          </h4>
          <Button onClick={() => reset()}>Try again</Button>
        </ThemeProvider>
      </body>
    </html>
  );
}
