"use client";

import { PropsWithChildren } from "react";
import { ThemeProvider } from "./Theme";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ActiveStatus from "@/components/ActiveStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export default function Providers({ children }: PropsWithChildren) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <ClerkProvider>{children}</ClerkProvider>
      </QueryClientProvider>
      <Toaster />
      <ActiveStatus />
    </ThemeProvider>
  );
}
