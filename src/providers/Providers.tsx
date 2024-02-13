"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./Theme";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider>
      <ClerkProvider>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  );
}
