import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/providers";
import { NextSSRPlugin } from "@uploadthing/react/next-ssr-plugin";
import { extractRouterConfig } from "uploadthing/server";
import { ourFileRouter } from "@/app/api/uploadthing/core";

import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <NextSSRPlugin routerConfig={extractRouterConfig(ourFileRouter)} />
        <Providers>
          <div className="flex h-screen">{children}</div>
        </Providers>
      </body>
    </html>
  );
}

export const metadata: Metadata = {
  title: "Messenger",
  description: "A group messaging app",
};
